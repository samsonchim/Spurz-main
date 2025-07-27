# Beautiful Toast System - Usage Guide

## Overview
This beautiful pop-up info message overlay system works across the entire app and provides a much better user experience than the default `Alert` dialogs.

## Features
- ✨ Beautiful animated toasts with smooth transitions
- 🎨 Four different types: Success, Error, Info, Warning
- 📍 Three positions: Top, Center, Bottom
- ⏱️ Customizable duration
- 🎯 Easy-to-use hooks and context
- 📱 Responsive design that works on all screen sizes
- 🎭 Professional styling with shadows and proper spacing

## Installation
The toast system is already integrated into the app via the `ToastProvider` in `app/_layout.tsx`.

## Basic Usage

### Import the hook
```typescript
import { useToast } from '@/components/ToastProvider';
```

### Use in your component
```typescript
export default function YourComponent() {
  const toast = useToast();

  const handleSuccess = () => {
    toast.showSuccess('Operation completed successfully!', 'Success');
  };

  const handleError = () => {
    toast.showError('Something went wrong. Please try again.', 'Error');
  };

  const handleInfo = () => {
    toast.showInfo('Here\'s some helpful information.', 'Info');
  };

  const handleWarning = () => {
    toast.showWarning('Please be careful with this action.', 'Warning');
  };

  // Advanced usage with custom settings
  const handleCustom = () => {
    toast.showToast(
      'Custom message here',
      'info',                    // type: 'success' | 'error' | 'info' | 'warning'
      'Custom Title',            // optional title
      5000,                      // duration in milliseconds
      'center'                   // position: 'top' | 'center' | 'bottom'
    );
  };

  return (
    <View>
      <TouchableOpacity onPress={handleSuccess}>
        <Text>Show Success Toast</Text>
      </TouchableOpacity>
    </View>
  );
}
```

## API Reference

### useToast Hook Methods

#### `showSuccess(message, title?)`
Shows a green success toast
- `message`: The main message text
- `title` (optional): Toast title

#### `showError(message, title?)`
Shows a red error toast
- `message`: The main message text
- `title` (optional): Toast title

#### `showInfo(message, title?)`
Shows a blue info toast
- `message`: The main message text
- `title` (optional): Toast title

#### `showWarning(message, title?)`
Shows an orange warning toast
- `message`: The main message text
- `title` (optional): Toast title

#### `showToast(message, type, title, duration, position)`
Full customization method
- `message`: The main message text
- `type`: 'success' | 'error' | 'info' | 'warning'
- `title` (optional): Toast title
- `duration` (optional): Duration in milliseconds (default: 3000)
- `position` (optional): 'top' | 'center' | 'bottom' (default: 'top')

#### `hideAllToasts()`
Immediately hide all visible toasts

## Toast Types & Colors

### Success (Green)
- Background: `#4CAF50`
- Icon: `checkmark-circle`
- Use for: Successful operations, confirmations

### Error (Red)
- Background: `#F44336`
- Icon: `alert-circle`
- Use for: Errors, failures, validation issues

### Info (Blue)
- Background: `#2196F3`
- Icon: `information-circle`
- Use for: General information, tips, notifications

### Warning (Orange)
- Background: `#FF9800`
- Icon: `warning`
- Use for: Warnings, cautions, important notices

## Examples in the App

### 1. Login Screen
```typescript
// Validation error
toast.showError('Please enter your email address', 'Validation Error');

// Success
toast.showSuccess('Login successful! Welcome back.', 'Success');
```

### 2. Signup Screen
```typescript
// Validation errors
toast.showError('Password must be at least 6 characters long', 'Validation Error');

// Success
toast.showSuccess('Account created successfully! Please check your email for verification.', 'Success');
```

### 3. Home Screen
```typescript
// Product actions
toast.showSuccess(`${item.name} added to cart!`, 'Cart');
toast.showWarning(`${item.name} is out of stock`, 'Out of Stock');

// Category selection
toast.showInfo(`${category} category selected`, 'Category');
```

## Customization

### Styling
The toast styles can be customized in `components/Toast.tsx`:
- Colors
- Border radius
- Shadows
- Typography
- Animations

### Animation Duration
Default animations are:
- Show: 300ms
- Hide: 250ms
- Scale spring animation for entrance

### Default Settings
- Duration: 3000ms (3 seconds)
- Position: Top
- Auto-hide: Yes
- Tap to dismiss: Yes

## Best Practices

1. **Use appropriate types**: Match the toast type to the action result
2. **Keep messages concise**: Short, clear messages work best
3. **Provide context**: Use titles for clarity when needed
4. **Don't spam**: Avoid showing multiple toasts simultaneously
5. **Test on devices**: Ensure toasts are visible on different screen sizes

## Migration from Alert

### Before (using Alert)
```typescript
Alert.alert('Error', 'Please enter your email address');
Alert.alert('Success', 'Login successful!');
```

### After (using Toast)
```typescript
toast.showError('Please enter your email address', 'Error');
toast.showSuccess('Login successful!', 'Success');
```

## Demo
The home screen includes a floating demo button (bell icon) that showcases random toast types. Tap it to see the different toast styles in action!

---

The toast system is now ready to use throughout your app. It provides a much more professional and user-friendly experience compared to the default Alert dialogs.
