import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  FlatList,
  Platform,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getSavedQuotes, deleteQuote } from '../store/savedStore';
import { SavedQuoteCard } from '../components/SavedQuoteCard';
import { SavedQuote } from '../types/quiz';
import { Colors } from '../theme/colors';

const { width, height } = Dimensions.get('window');

const isSmall = height < 760;
const isVerySmall = height < 700;
const isAndroid = Platform.OS === 'android';

export function SavedScreen() {
  const [quotes, setQuotes] = useState<SavedQuote[]>([]);

  useFocusEffect(
    useCallback(() => {
      getSavedQuotes().then(setQuotes);
    }, [])
  );

  const handleDelete = async (id: string) => {
    await deleteQuote(id);
    setQuotes(q => q.filter(item => item.id !== id));
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/bg_main.png')}
        style={styles.bg}
        resizeMode="cover"
      />

      <SafeAreaView style={[styles.safe, isAndroid && styles.safeAndroid]}>
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Text style={[styles.headerEmoji, isVerySmall && styles.headerEmojiVerySmall]}>
              💾
            </Text>
          </View>

          <View style={styles.headerTextWrap}>
            <Text style={[styles.headerTitle, isVerySmall && styles.headerTitleVerySmall]}>
              Saved Quotes
            </Text>
            <Text style={[styles.headerSub, isVerySmall && styles.headerSubVerySmall]}>
              {quotes.length} quotes saved
            </Text>
          </View>
        </View>

        {quotes.length === 0 ? (
          <View style={styles.empty}>
            <Image
              source={require('../assets/bunny_crossed.png')}
              style={[styles.sadBunny, isVerySmall && styles.sadBunnyVerySmall]}
              resizeMode="contain"
            />

            <Text style={[styles.emptyTitle, isVerySmall && styles.emptyTitleVerySmall]}>
              No quotes yet!
            </Text>

            <Text style={[styles.emptyBody, isVerySmall && styles.emptyBodyVerySmall]}>
              Take the "Which Bunny Are You?" quiz and save your result quote here.
            </Text>
          </View>
        ) : (
          <FlatList
            data={quotes}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <SavedQuoteCard quote={item} onDelete={handleDelete} />
            )}
          />
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  bg: {
    ...StyleSheet.absoluteFillObject,
    width,
    height,
  },

  safe: {
    flex: 1,
  },

  safeAndroid: {
    paddingTop: 30,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: isVerySmall ? 10 : 16,
    paddingBottom: isVerySmall ? 6 : 8,
  },

  headerIcon: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: isVerySmall ? 12 : 14,
    padding: isVerySmall ? 8 : 10,
  },

  headerEmoji: {
    fontSize: 22,
  },

  headerEmojiVerySmall: {
    fontSize: 18,
  },

  headerTextWrap: {
    flex: 1,
  },

  headerTitle: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: '700',
  },

  headerTitleVerySmall: {
    fontSize: 18,
  },

  headerSub: {
    color: Colors.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },

  headerSubVerySmall: {
    fontSize: 12,
  },

  list: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 80,
    gap: 12,
    flexGrow: 1,
  },

  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: isVerySmall ? 24 : 32,
    paddingBottom: 80,
    gap: isVerySmall ? 12 : 16,
  },

  sadBunny: {
    width: 200,
    height: 200,
  },

  sadBunnyVerySmall: {
    width: 150,
    height: 150,
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.pink,
    textAlign: 'center',
  },

  emptyTitleVerySmall: {
    fontSize: 18,
  },

  emptyBody: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },

  emptyBodyVerySmall: {
    fontSize: 12,
    lineHeight: 18,
  },
});