import React, { useState } from 'react';
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
import { COMPATIBILITY_MATRIX } from '../data/friendsQuizData';
import { BUNNY_TYPES, BunnyTypeId } from '../data/bunnyTypes';
import { PrimaryButton } from '../components/PrimaryButton';
import { QuizOption } from '../components/QuizOption';
import { ProgressBar } from '../components/ProgressBar';
import { BunnyImage } from '../components/BunnyImage';
import { Colors } from '../theme/colors';

const { width, height } = Dimensions.get('window');

const isSmall = height < 760;
const isVerySmall = height < 700;
const isAndroid = Platform.OS === 'android';

type Step = 'home' | 'intro' | 'quiz1' | 'handoff' | 'quiz2' | 'result';

export function FriendsScreen() {
  const [step, setStep] = useState<Step>('home');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [scores1, setScores1] = useState<Record<BunnyTypeId, number>>({
    happy: 0,
    angry: 0,
    smart: 0,
    wild: 0,
  });
  const [scores2, setScores2] = useState<Record<BunnyTypeId, number>>({
    happy: 0,
    angry: 0,
    smart: 0,
    wild: 0,
  });
  const [type1, setType1] = useState<BunnyTypeId | null>(null);
  const [type2, setType2] = useState<BunnyTypeId | null>(null);

  const question = PERSONALITY_QUESTIONS[questionIndex];

  const getWinner = (scores: Record<BunnyTypeId, number>): BunnyTypeId => {
    return (Object.keys(scores) as BunnyTypeId[]).reduce((a, b) =>
      scores[a] >= scores[b] ? a : b
    );
  };

  const getCompatibilityLabel = (percentage: number) => {
    if (percentage >= 90) return 'Best Bunny Match';
    if (percentage >= 75) return 'Great Friendship Match';
    if (percentage >= 60) return 'Good Bunny Connection';
    if (percentage >= 40) return 'Playful Bunny Duo';
    return 'Different but Fun Pair';
  };

  const handleSelect1 = (type: BunnyTypeId) => {
    const newScores = {
      ...scores1,
      [type]: scores1[type] + 1,
    };

    setScores1(newScores);

    if (questionIndex < PERSONALITY_QUESTIONS.length - 1) {
      setQuestionIndex(i => i + 1);
    } else {
      setType1(getWinner(newScores));
      setQuestionIndex(0);
      setStep('handoff');
    }
  };

  const handleSelect2 = (type: BunnyTypeId) => {
    const newScores = {
      ...scores2,
      [type]: scores2[type] + 1,
    };

    setScores2(newScores);

    if (questionIndex < PERSONALITY_QUESTIONS.length - 1) {
      setQuestionIndex(i => i + 1);
    } else {
      setType2(getWinner(newScores));
      setStep('result');
    }
  };

  const handleReset = () => {
    setStep('home');
    setQuestionIndex(0);
    setScores1({
      happy: 0,
      angry: 0,
      smart: 0,
      wild: 0,
    });
    setScores2({
      happy: 0,
      angry: 0,
      smart: 0,
      wild: 0,
    });
    setType1(null);
    setType2(null);
  };

  const compatibility = type1 && type2 ? COMPATIBILITY_MATRIX[type1][type2] : null;
  const bunny1 = type1 ? BUNNY_TYPES[type1] : null;
  const bunny2 = type2 ? BUNNY_TYPES[type2] : null;

  const duoImageSize = isVerySmall ? 150 : isSmall ? 175 : 210;
  const quizBunnySize = isVerySmall ? 130 : isSmall ? 145 : 160;
  const resultBunnySize = isVerySmall ? 82 : isSmall ? 90 : 100;

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/bg_main.png')}
        style={styles.bg}
        resizeMode="cover"
      />

      <SafeAreaView style={[styles.safe, isAndroid && styles.safeAndroid]}>
        {(step === 'home' || step === 'intro' || step === 'handoff') && (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.staticScrollContent}
          >
            {step === 'home' && (
              <View style={styles.centered}>
                <BunnyImage
                  source={require('../assets/bunny_duo.png')}
                  size={duoImageSize}
                />

                <View style={styles.iconBadge}>
                  <Text style={styles.iconEmoji}>👥</Text>
                </View>

                <Text style={[styles.title, isVerySmall && styles.titleVerySmall]}>
                  Friendship Compatibility!
                </Text>

                <Text style={[styles.body, isVerySmall && styles.bodyVerySmall]}>
                  Find out how compatible you and your friend are as bunnies!
                  Take turns answering the quiz and discover your bunny types and
                  friendship bond.
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
                  source={require('../assets/bunny_duo.png')}
                  size={duoImageSize}
                />

                <Text style={[styles.title, isVerySmall && styles.titleVerySmall]}>
                  Take Turns!
                </Text>

                <Text style={[styles.body, isVerySmall && styles.bodyVerySmall]}>
                  Player 1 answers first, then Player 2. At the end we will reveal
                  both bunny types and your friendship compatibility score.
                </Text>

                <PrimaryButton
                  label="Start Compatibility 🐰"
                  onPress={() => setStep('quiz1')}
                  style={styles.btn}
                />
              </View>
            )}

            {step === 'handoff' && (
              <View style={styles.centered}>
                <BunnyImage
                  source={require('../assets/bunny_duo.png')}
                  size={duoImageSize}
                />

                {bunny1 && (
                  <Text style={[styles.bunnyResult, isVerySmall && styles.bunnyResultVerySmall]}>
                    {bunny1.emoji} {bunny1.name}
                  </Text>
                )}

                <Text style={[styles.title, isVerySmall && styles.titleVerySmall]}>
                  Now Player 2!
                </Text>

                <Text style={[styles.body, isVerySmall && styles.bodyVerySmall]}>
                  Pass the phone to your friend. It is their turn to answer the quiz.
                </Text>

                <PrimaryButton
                  label="Player 2, Ready! 🐰"
                  onPress={() => setStep('quiz2')}
                  style={styles.btn}
                />
              </View>
            )}
          </ScrollView>
        )}

        {(step === 'quiz1' || step === 'quiz2') && (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.quizScrollContent}
          >
            <View style={styles.quizWrap}>
              <Text style={styles.playerLabel}>
                {step === 'quiz1' ? 'Player 1' : 'Player 2'}
              </Text>

              <ProgressBar
                progress={(questionIndex + 1) / PERSONALITY_QUESTIONS.length}
              />

              <Text style={styles.questionNum}>
                Question {questionIndex + 1} of {PERSONALITY_QUESTIONS.length}
              </Text>

              <View style={styles.quizBunnyWrap}>
                <BunnyImage
                  source={require('../assets/bunny_walking.png')}
                  size={quizBunnySize}
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
                    onPress={() =>
                      step === 'quiz1' ? handleSelect1(opt.type) : handleSelect2(opt.type)
                    }
                  />
                ))}
              </View>
            </View>
          </ScrollView>
        )}

        {step === 'result' && compatibility && bunny1 && bunny2 && (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.resultScrollContent}
          >
            <View style={styles.resultWrap}>
              <Text style={[styles.resultHeader, isVerySmall && styles.resultHeaderVerySmall]}>
                Compatibility Results
              </Text>

              <View style={styles.bunniesRow}>
                <View style={styles.bunnyCol}>
                  <BunnyImage source={bunny1.image} size={resultBunnySize} />
                  <Text style={[styles.bunnyName, isVerySmall && styles.bunnyNameVerySmall]}>
                    {bunny1.emoji} {bunny1.name}
                  </Text>
                </View>

                <Text style={[styles.heart, isVerySmall && styles.heartVerySmall]}>❤️</Text>

                <View style={styles.bunnyCol}>
                  <BunnyImage source={bunny2.image} size={resultBunnySize} />
                  <Text style={[styles.bunnyName, isVerySmall && styles.bunnyNameVerySmall]}>
                    {bunny2.emoji} {bunny2.name}
                  </Text>
                </View>
              </View>

              <Text style={[styles.percent, isVerySmall && styles.percentVerySmall]}>
                {compatibility.percentage}%
              </Text>

              <Text style={[styles.compatTitle, isVerySmall && styles.compatTitleVerySmall]}>
                {getCompatibilityLabel(compatibility.percentage)}
              </Text>

              <Text style={[styles.compatDesc, isVerySmall && styles.compatDescVerySmall]}>
                {compatibility.description}
              </Text>

              <PrimaryButton
                label="Share Result"
                onPress={() =>
                  Share.share({
                    message: `${bunny1.name} + ${bunny2.name} = ${compatibility.percentage}% compatible! #BunnyMood`,
                  })
                }
                style={styles.btn}
              />

              <TouchableOpacity onPress={handleReset} activeOpacity={0.8}>
                <Text style={styles.backText}>Play Again 🎉</Text>
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
    paddingTop: isVerySmall ? 12 : 20,
    gap: isVerySmall ? 12 : 16,
  },

  quizWrap: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: isVerySmall ? 10 : 16,
    gap: isVerySmall ? 10 : 12,
  },

  resultWrap: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: isVerySmall ? 16 : 24,
    gap: isVerySmall ? 12 : 16,
  },

  quizBunnyWrap: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
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
    width: '100%',
  },

  playerLabel: {
    color: Colors.pink,
    fontSize: isVerySmall ? 12 : 13,
    fontWeight: '700',
    textAlign: 'center',
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

  bunnyResult: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.pink,
    textAlign: 'center',
  },

  bunnyResultVerySmall: {
    fontSize: 16,
  },

  resultHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textSecondary,
    textAlign: 'center',
  },

  resultHeaderVerySmall: {
    fontSize: 16,
  },

  bunniesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: isVerySmall ? 8 : 12,
    width: '100%',
  },

  bunnyCol: {
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },

  bunnyName: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },

  bunnyNameVerySmall: {
    fontSize: 12,
  },

  heart: {
    fontSize: 28,
  },

  heartVerySmall: {
    fontSize: 22,
  },

  percent: {
    fontSize: 48,
    fontWeight: '800',
    color: Colors.pink,
    textAlign: 'center',
  },

  percentVerySmall: {
    fontSize: 40,
  },

  compatTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.white,
    textAlign: 'center',
  },

  compatTitleVerySmall: {
    fontSize: 18,
  },

  compatDesc: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },

  compatDescVerySmall: {
    fontSize: 12,
    lineHeight: 18,
  },

  backText: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginTop: 4,
  },
});