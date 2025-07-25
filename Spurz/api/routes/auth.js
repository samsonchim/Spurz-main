const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const validator = require('validator');
const { supabase } = require('../config/supabase');
const { sendVerificationEmail, sendWelcomeEmail } = require('../services/emailService');

const router = express.Router();

// Helper function to generate verification token
const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Helper function to generate JWT
const generateJWT = (userId) => {
  return jwt.sign(
    { userId, timestamp: Date.now() },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

// Signup endpoint
router.post('/signup', async (req, res) => {
  try {
    const { email, password, fullName, phone } = req.body;

    // Validation
    if (!email || !password || !fullName) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, and full name are required'
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id, email, is_verified')
      .eq('email', email.toLowerCase())
      .single();

    if (existingUser && !checkError) {
      if (existingUser.is_verified) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email already exists'
        });
      } else {
        // User exists but not verified, resend verification email
        const verificationToken = generateVerificationToken();
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        const { error: updateError } = await supabase
          .from('users')
          .update({
            verification_token: verificationToken,
            verification_expires: expiresAt.toISOString()
          })
          .eq('email', email.toLowerCase());

        if (updateError) {
          throw updateError;
        }

        const emailResult = await sendVerificationEmail(email, fullName, verificationToken);
        
        if (emailResult.success) {
          return res.json({
            success: true,
            message: 'Verification email resent successfully',
            data: {
              email: email,
              userId: existingUser.id,
              needsVerification: true
            }
          });
        } else {
          return res.status(500).json({
            success: false,
            message: 'Failed to send verification email. Please try again.'
          });
        }
      }
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Generate verification token
    const verificationToken = generateVerificationToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({
        email: email.toLowerCase(),
        password_hash: hashedPassword,
        full_name: fullName,
        phone: phone,
        is_verified: false,
        verification_token: verificationToken,
        verification_expires: expiresAt.toISOString()
      })
      .select('id, email, full_name, phone, user_type, created_at')
      .single();

    if (insertError) {
      throw insertError;
    }

    // Create user profile
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert({ user_id: newUser.id });

    if (profileError) {
      console.error('Failed to create user profile:', profileError);
      // Continue anyway, profile can be created later
    }

    // Send verification email
    const emailResult = await sendVerificationEmail(email, fullName, verificationToken);
    
    if (!emailResult.success) {
      console.error('Failed to send verification email:', emailResult.error);
      // Don't fail the signup, just log the error
    }

    res.status(201).json({
      success: true,
      message: 'Account created successfully! Please check your email to verify your account.',
      data: {
        userId: newUser.id,
        email: newUser.email,
        fullName: newUser.full_name,
        needsVerification: true,
        emailSent: emailResult.success
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.'
    });
  }
});

// Email verification endpoint
router.get('/verify-email', async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Verification token is required'
      });
    }

    // Find user with this token
    const { data: userData, error: findError } = await supabase
      .from('users')
      .select('id, email, full_name, is_verified, verification_expires')
      .eq('verification_token', token)
      .single();

    if (findError || !userData) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification token'
      });
    }

    // Check if already verified
    if (userData.is_verified) {
      return res.redirect(`${process.env.FRONTEND_URL}/(tabs)?verified=already`);
    }

    // Check if token expired
    if (new Date() > new Date(userData.verification_expires)) {
      return res.status(400).json({
        success: false,
        message: 'Verification token has expired. Please request a new one.'
      });
    }

    // Verify the user
    const { error: updateError } = await supabase
      .from('users')
      .update({
        is_verified: true,
        verification_token: null,
        verification_expires: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', userData.id);

    if (updateError) {
      throw updateError;
    }

    // Send welcome email
    await sendWelcomeEmail(userData.email, userData.full_name);

    // Generate JWT token for auto-login
    const jwtToken = generateJWT(userData.id);

    // Redirect to app with success
    res.redirect(`${process.env.FRONTEND_URL}/(tabs)?verified=success&token=${jwtToken}`);

  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during verification'
    });
  }
});

// Resend verification email
router.post('/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Find user
    const { data: userData, error: findError } = await supabase
      .from('users')
      .select('id, email, full_name, is_verified')
      .eq('email', email.toLowerCase())
      .single();

    if (findError || !userData) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email'
      });
    }

    if (userData.is_verified) {
      return res.status(400).json({
        success: false,
        message: 'Account is already verified'
      });
    }

    // Generate new verification token
    const verificationToken = generateVerificationToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const { error: updateError } = await supabase
      .from('users')
      .update({
        verification_token: verificationToken,
        verification_expires: expiresAt.toISOString()
      })
      .eq('id', userData.id);

    if (updateError) {
      throw updateError;
    }

    // Send verification email
    const emailResult = await sendVerificationEmail(userData.email, userData.full_name, verificationToken);
    
    if (emailResult.success) {
      res.json({
        success: true,
        message: 'Verification email sent successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send verification email. Please try again.'
      });
    }

  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user
    const { data: userData, error: findError } = await supabase
      .from('users')
      .select('id, email, password_hash, full_name, user_type, is_verified, is_active')
      .eq('email', email.toLowerCase())
      .single();

    if (findError || !userData) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if account is active
    if (!userData.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      });
    }

    // Check if email is verified
    if (!userData.is_verified) {
      return res.status(401).json({
        success: false,
        message: 'Please verify your email before logging in',
        needsVerification: true
      });
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, userData.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT
    const token = generateJWT(userData.id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: userData.id,
          email: userData.email,
          fullName: userData.full_name,
          userType: userData.user_type
        }
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
