import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../theme/colors';

interface Props {
  label: string;
  onPress: () => void;
  style?: ViewStyle;
}

export function PrimaryButton({ label, onPress, style }: Props) {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress} activeOpacity={0.85}>
      <Text style={styles.label}>{label} ›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.pink,
    borderRadius: 32,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  label: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});