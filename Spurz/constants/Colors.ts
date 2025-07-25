/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#FFA500'; // Orange primary color
const tintColorDark = '#FFA500'; // Keep orange even in dark mode

export const Colors = {
  light: {
    text: '#11181C',
    background: '#ffffff', // Pure white background
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#999999',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#11181C', // Keep dark text even in "dark" mode for light app
    background: '#ffffff', // Force light background
    tint: tintColorLight, // Keep orange theme
    icon: '#687076',
    tabIconDefault: '#999999',
    tabIconSelected: tintColorLight,
  },
};
