import React from 'react';
import { View, StyleSheet, Text, Platform } from 'react-native';

type TopBarProps = {
  title: string;
};

export default function TopBar({ title }: TopBarProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7B2D2F',
    padding: 16,
    marginBottom: 15,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: Platform.OS === 'ios' ? 30 : 15,
    color: '#fff',
  },
});