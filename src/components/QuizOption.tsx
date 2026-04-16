import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../theme/colors';

type OptionState = 'default' | 'selected' | 'correct' | 'wrong';

interface Props {
  label: string;
  state?: OptionState;
  onPress: () => void;
  disabled?: boolean;
}

export function QuizOption({ label, state = 'default', onPress, disabled }: Props) {
  const bgColor = {
    default: Colors.optionDefault,
    selected: Colors.optionSelected,
    correct: Colors.optionCorrect,
    wrong: Colors.optionWrong,
  }[state];

  const borderColor = {
    default: 'rgba(255,255,255,0.1)',
    selected: Colors.purpleLight,
    correct: Colors.optionCorrect,
    wrong: Colors.optionWrong,
  }[state];

  return (
    <TouchableOpacity
      style={[styles.option, { backgroundColor: bgColor, borderColor }]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={styles.label}>{label}</Text>
      {state === 'correct' && <Text style={styles.icon}>✓</Text>}
      {state === 'wrong' && <Text style={styles.icon}>✗</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  option: {
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  label: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '500',
  },
  icon: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});