import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Share } from 'react-native';
import { SavedQuote } from '../types/quiz';
import { BUNNY_TYPES } from '../data/bunnyTypes';
import { Colors } from '../theme/colors';

interface Props {
  quote: SavedQuote;
  onDelete: (id: string) => void;
}

export function SavedQuoteCard({ quote, onDelete }: Props) {
  const bunny = BUNNY_TYPES[quote.bunnyType];

  const handleShare = async () => {
    await Share.share({ message: quote.quote });
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.emoji}>{bunny.emoji}</Text>
          <View>
            <Text style={styles.name}>{bunny.name}</Text>
            <Text style={styles.date}>{quote.date}</Text>
          </View>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity onPress={handleShare} style={styles.actionBtn}>
            <Text style={styles.actionIcon}>🔗</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onDelete(quote.id)} style={styles.actionBtn}>
            <Text style={styles.actionIcon}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.divider} />
      <Text style={styles.quoteText}>{quote.quote}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.pink,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  emoji: {
    fontSize: 28,
  },
  name: {
    color: Colors.pink,
    fontWeight: '700',
    fontSize: 14,
  },
  date: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    backgroundColor: Colors.backgroundCardActive,
    borderRadius: 10,
    padding: 8,
  },
  actionIcon: {
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  quoteText: {
    color: Colors.textPrimary,
    fontSize: 14,
    lineHeight: 22,
    fontStyle: 'italic',
  },
});