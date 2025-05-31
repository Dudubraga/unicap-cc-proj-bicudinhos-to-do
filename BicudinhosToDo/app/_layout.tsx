import { DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import React from 'react';
import { StatusBar as ReactNativeStatusBar, useColorScheme } from 'react-native';
import { useThemeStore } from '../store/themeStore';

const MyDefaultTheme = {
  ...NavigationDefaultTheme,
  colors: {
    ...NavigationDefaultTheme.colors,
    primary: 'rgb(255, 255, 255)',
    background: 'rgb(242, 242, 242)',
    text: 'rgb(0, 0, 0)',
    card: 'rgba(156, 116, 58, 0.35)',
    border: 'rgb(153, 153, 153)',
    notification: '#540000',
  },
};

const MyDarkTheme = {
  ...NavigationDarkTheme,
  colors: {
    ...NavigationDarkTheme.colors,
    primary: 'rgb(207, 207, 207)',
    background: 'rgb(49, 17, 17)',
    text: 'rgb(179, 179, 179)',
    card: 'rgba(156, 116, 58, 0.55)',
    border: 'rgb(167, 167, 167)',
    notification: '#540000',
  },
};

export default function RootLayout() {
  const { theme: appThemePreference } = useThemeStore();
  const systemColorScheme = useColorScheme();

  let currentNavigationTheme;
  let statusBarThemeStyle: 'light-content' | 'dark-content';
  let statusBarBackgroundColor: string;

  if (appThemePreference === 'system') {
    currentNavigationTheme = systemColorScheme === 'dark' ? MyDarkTheme : MyDefaultTheme;
    statusBarThemeStyle = systemColorScheme === 'dark' ? 'light-content' : 'dark-content';
  } else {
    currentNavigationTheme = appThemePreference === 'dark' ? MyDarkTheme : MyDefaultTheme;
    statusBarThemeStyle = appThemePreference === 'dark' ? 'light-content' : 'dark-content';
  }
  statusBarBackgroundColor = currentNavigationTheme.colors.card;

  return (
    <ThemeProvider value={currentNavigationTheme}>
      <ReactNativeStatusBar
        barStyle={statusBarThemeStyle}
        backgroundColor={statusBarBackgroundColor}
        translucent={false}
      />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}