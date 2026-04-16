import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  Share,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { PERSONALITY_QUESTIONS } from '../data/personalityQuizData';
import { BUNNY_TYPES, BunnyTypeId } from '../data/bunnyTypes';
import { PrimaryButton } from '../components/PrimaryButton';
import { QuizOption } from '../components/QuizOption';
import { ProgressBar } from '../components/ProgressBar';
import { BunnyImage } from '../components/BunnyImage';
import { Colors } from '../theme/colors';
import { saveQuote } from '../store/savedStore';
import { setMyBunnyType } from '../store/myBunnyStore';
import { SavedQuote } from '../types/quiz';

const { width, height } = Dimensions.get('window');

const isSmall = height < 760;
const isVerySmall = height < 700;
const isAndroid = Platform.OS === 'android';

type Step = 'home' | 'intro' | 'quiz' | 'result';

export function MyBunnyScreen() {
  const [step, setStep] = useState<Step>('home');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [scores, setScores] = useState<Record<BunnyTypeId, number>>({
    happy: 0,
    angry: 0,
    smart: 0,
    wild: 0,
  });
  const [resultType, setResultType] = useState<BunnyTypeId | null>(null);
  const [saved, setSaved] = useState(false);

  const question = PERSONALITY_QUESTIONS[questionIndex];
  const bunny = resultType ? BUNNY_TYPES[resultType] : null;

  const selectedQuote = useMemo(() => {
    if (!bunny) return '';
    if (Array.isArray(bunny.quotes) && bunny.quotes.length > 0) {
      return bunny.quotes[0];
    }
    return '';
  }, [bunny]);

  const handleSelect = (type: BunnyTypeId) => {
    const newScores = {
      ...scores,
      [type]: scores[type] + 1,
    };

    setScores(newScores);

    if (questionIndex < PERSONALITY_QUESTIONS.length - 1) {
      setQuestionIndex(i => i + 1);
      return;
    }

    const winner = (Object.keys(newScores) as BunnyTypeId[]).reduce((a, b) =>
      newScores[a] >= newScores[b] ? a : b
    );

    setResultType(winner);
    setMyBunnyType(winner);
    setStep('result');
  };

  const handleSave = async () => {
    if (!resultType || saved) return;

    const bunnyData = BUNNY_TYPES[resultType];
    const quoteToSave =
      Array.isArray(bunnyData.quotes) && bunnyData.quotes.length > 0
        ? bunnyData.quotes[0]
        : '';

    const quote: SavedQuote = {
      id: Date.now().toString(),
      bunnyType: resultType,
      quote: quoteToSave,
      date: new Date().toLocaleDateString('uk-UA').replace(/\//g, '.'),
    };

    await saveQuote(quote);
    setSaved(true);
  };

  const handleReset = () => {
    setStep('home');
    setQuestionIndex(0);
    setScores({
      happy: 0,
      angry: 0,
      smart: 0,
      wild: 0,
    });
    setResultType(null);
    setSaved(false);
  };

  const bunnySizeHome = isVerySmall ? 130 : isSmall ? 150 : 180;
  const bunnySizeQuiz = isVerySmall ? 130 : isSmall ? 150 : 180;
  const bunnySizeResult = isVerySmall ? 140 : isSmall ? 160 : 190;

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/bg_main.png')}
        style={styles.bg}
        resizeMode="cover"
      />

      <SafeAreaView style={[styles.safe, isAndroid && styles.safeAndroid]}>
        {(step === 'home' || step === 'intro') && (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.staticScrollContent}
          >
            {step === 'home' && (
              <View style={styles.centered}>
                <BunnyImage
                  source={require('../assets/bunny_walking.png')}
                  size={bunnySizeHome}
                />

                <View style={styles.iconBadge}>
                  <Text style={styles.iconEmoji}>✨</Text>
                </View>

                <Text style={[styles.title, isVerySmall && styles.titleVerySmall]}>
                  Which Bunny Are You?
                </Text>

                <Text style={[styles.body, isVerySmall && styles.bodyVerySmall]}>
                  Answer 5 fun questions and discover your inner bunny personality!
                  Are you happy, angry, smart, or wild?
                </Text>

                <PrimaryButton
                  label="Next"
                  onPress={() => setStep('intro')}
                  style={styles.btn}
                />
              </View>
            )}

            {step === 'intro' && (
              <View style={styles.centered}>
                <BunnyImage
                  source={require('../assets/bunny_walking.png')}
                  size={bunnySizeHome}
                />

                <Text style={[styles.title, isVerySmall && styles.titleVerySmall]}>
                  No Right or Wrong!
                </Text>

                <Text style={[styles.body, isVerySmall && styles.bodyVerySmall]}>
                  This quiz is all about you. Pick the answer that feels most like
                  you. Then get a unique quote to save and share.
                </Text>

                <PrimaryButton
                  label="Discover My Bunny! ✨"
                  onPress={() => setStep('quiz')}
                  style={styles.btn}
                />
              </View>
            )}
          </ScrollView>
        )}

        {step === 'quiz' && (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.quizScrollContent}
          >
            <View style={styles.quizWrap}>
              <ProgressBar progress={(questionIndex + 1) / PERSONALITY_QUESTIONS.length} />

              <Text style={styles.questionNum}>
                Question {questionIndex + 1} of {PERSONALITY_QUESTIONS.length}
              </Text>

              <View style={styles.quizBunnyWrap}>
                <BunnyImage
                  source={require('../assets/bunny_walking.png')}
                  size={bunnySizeQuiz}
                />
              </View>

              <Text style={[styles.questionText, isVerySmall && styles.questionTextVerySmall]}>
                {question.question}
              </Text>

              <View style={styles.options}>
                {question.options.map(opt => (
                  <QuizOption
                    key={opt.type}
                    label={opt.text}
                    onPress={() => handleSelect(opt.type)}
                  />
                ))}
              </View>
            </View>
          </ScrollView>
        )}

        {step === 'result' && bunny && (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.resultScrollContent}
          >
            <View style={styles.resultWrap}>
              <Text style={styles.youAre}>You are...</Text>

              <Text style={[styles.bunnyLabel, isVerySmall && styles.bunnyLabelVerySmall]}>
                {bunny.name}
              </Text>

              <BunnyImage source={bunny.image} size={bunnySizeResult} />

              <Text style={[styles.description, isVerySmall && styles.descriptionVerySmall]}>
                {bunny.description}
              </Text>

              {!!selectedQuote && (
                <Text style={[styles.quote, isVerySmall && styles.quoteVerySmall]}>
                  {selectedQuote}
                </Text>
              )}

              <View style={styles.tags}>
                {bunny.tags.map(tag => (
                  <View key={tag} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.resultActions}>
                <TouchableOpacity
                  style={[styles.actionBtn, saved && styles.actionBtnSaved]}
                  onPress={handleSave}
                  activeOpacity={0.85}
                >
                  <Text style={styles.actionBtnText}>
                    {saved ? 'Saved! ✓' : 'Save'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionBtn}
                  activeOpacity={0.85}
                  onPress={() =>
                    Share.share({
                      message: selectedQuote
                        ? `I'm a ${bunny.name}! ${selectedQuote}`
                        : `I'm a ${bunny.name}!`,
                    })
                  }
                >
                  <Text style={styles.actionBtnText}>Share</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={handleReset} activeOpacity={0.8}>
                <Text style={styles.backText}>Take again</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
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

  staticScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 80,
  },

  quizScrollContent: {
    flexGrow: 1,
    paddingBottom: 80,
  },

  resultScrollContent: {
    flexGrow: 1,
    paddingBottom: 80,
  },

  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: isVerySmall ? 10 : 20,
    gap: isVerySmall ? 12 : 16,
  },

  quizWrap: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: isVerySmall ? 10 : 16,
    gap: isVerySmall ? 10 : 12,
  },

  quizBunnyWrap: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  resultWrap: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: isVerySmall ? 16 : 24,
    gap: isVerySmall ? 12 : 16,
  },

  iconBadge: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 16,
    padding: isVerySmall ? 10 : 12,
  },

  iconEmoji: {
    fontSize: isVerySmall ? 22 : 24,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.white,
    textAlign: 'center',
  },

  titleVerySmall: {
    fontSize: 20,
  },

  body: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },

  bodyVerySmall: {
    fontSize: 12,
    lineHeight: 18,
  },

  btn: {
    marginTop: 8,
    alignSelf: 'stretch',
  },

  questionNum: {
    color: Colors.textSecondary,
    fontSize: 12,
    textAlign: 'center',
  },

  questionText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
    textAlign: 'center',
  },

  questionTextVerySmall: {
    fontSize: 14,
  },

  options: {
    gap: isVerySmall ? 8 : 10,
  },

  youAre: {
    color: Colors.textSecondary,
    fontSize: 14,
  },

  bunnyLabel: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.white,
    textAlign: 'center',
  },

  bunnyLabelVerySmall: {
    fontSize: 20,
  },

  description: {
    color: Colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },

  descriptionVerySmall: {
    fontSize: 12,
    lineHeight: 18,
  },

  quote: {
    color: Colors.white,
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 22,
    backgroundColor: Colors.backgroundCard,
    borderRadius: 16,
    padding: isVerySmall ? 12 : 16,
    borderLeftWidth: 3,
    borderLeftColor: Colors.pink,
    width: '100%',
  },

  quoteVerySmall: {
    fontSize: 12,
    lineHeight: 18,
  },

  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },

  tag: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Colors.purpleLight,
  },

  tagText: {
    color: Colors.purpleLight,
    fontSize: 13,
    fontWeight: '600',
  },

  resultActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },

  actionBtn: {
    flex: 1,
    backgroundColor: Colors.backgroundCard,
    borderRadius: 16,
    paddingVertical: isVerySmall ? 12 : 14,
    paddingHorizontal: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.pink,
  },

  actionBtnSaved: {
    borderColor: Colors.optionCorrect,
  },

  actionBtnText: {
    color: Colors.white,
    fontWeight: '700',
  },

  backText: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginTop: 4,
  },
});