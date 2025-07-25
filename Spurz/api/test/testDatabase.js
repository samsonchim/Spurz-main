const { supabase } = require('../config/supabase');
const bcrypt = require('bcryptjs');

async function testDatabase() {
  console.log('🔍 Testing Supabase connection...');
  
  try {
    // Test 1: Check if we can connect to Supabase
    const { data, error } = await supabase
      .from('users')
      .select('count(*)')
      .limit(1);
    
    if (error) {
      console.error('❌ Database connection failed:', error.message);
      return;
    }
    
    console.log('✅ Database connection successful');
    
    // Test 2: Test user insertion (signup simulation)
    const testEmail = `test_${Date.now()}@example.com`;
    const testPassword = 'testpassword123';
    const hashedPassword = await bcrypt.hash(testPassword, 12);
    
    console.log(`📝 Testing user signup with email: ${testEmail}`);
    
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({
        email: testEmail,
        password_hash: hashedPassword,
        full_name: 'Test User',
        phone: '+1234567890',
        is_verified: false,
        verification_token: 'test_token_' + Date.now(),
        verification_expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      })
      .select('id, email, full_name, created_at')
      .single();
    
    if (insertError) {
      console.error('❌ User insertion failed:', insertError.message);
      return;
    }
    
    console.log('✅ User created successfully:', newUser);
    
    // Test 3: Test user profile creation
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        user_id: newUser.id,
        bio: 'Test user bio',
        location: 'Test City'
      });
    
    if (profileError) {
      console.error('❌ Profile creation failed:', profileError.message);
    } else {
      console.log('✅ User profile created successfully');
    }
    
    // Test 4: Test user lookup by email (login simulation)
    const { data: foundUser, error: findError } = await supabase
      .from('users')
      .select('id, email, password_hash, full_name, is_verified')
      .eq('email', testEmail)
      .single();
    
    if (findError) {
      console.error('❌ User lookup failed:', findError.message);
    } else {
      console.log('✅ User lookup successful:', {
        id: foundUser.id,
        email: foundUser.email,
        full_name: foundUser.full_name,
        is_verified: foundUser.is_verified
      });
      
      // Test password verification
      const passwordMatch = await bcrypt.compare(testPassword, foundUser.password_hash);
      console.log('✅ Password verification:', passwordMatch ? 'PASS' : 'FAIL');
    }
    
    // Clean up: Delete test user
    const { error: deleteError } = await supabase
      .from('users')
      .delete()
      .eq('email', testEmail);
    
    if (deleteError) {
      console.error('❌ Cleanup failed:', deleteError.message);
    } else {
      console.log('✅ Test user cleaned up');
    }
    
    console.log('\n🎉 All database tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
if (require.main === module) {
  testDatabase();
}

module.exports = { testDatabase };
