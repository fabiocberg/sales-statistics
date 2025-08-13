import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const firstMissingLetter = (name: string): string => {
  const set = new Set((name || '').toLowerCase().replace(/[^a-z]/g, '').split(''));
  for (let i = 0; i < 26; i++) {
    const ch = String.fromCharCode('a'.charCodeAt(0) + i);
    if (!set.has(ch)) return ch;
  }
  return '-';
};

export default function MissingLetterBadge({ name }: { name: string }) {
  const ch = firstMissingLetter(name || '');
  return (
    <View style={styles.badge}>
      <Text style={styles.text}>{ch}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { backgroundColor: '#eef', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, alignSelf: 'flex-start' },
  text: { color: '#334', fontWeight: '600' },
});
