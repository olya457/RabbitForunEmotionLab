import React, { useState, useEffect, useRef } from 'react';
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
import { EMOTION_ROUNDS, EMOTION_QUIZ_CONFIG, EMOTION_RESULT_TIERS } from '../data/emotionsQuizData';
import { PrimaryButton } from '../components/PrimaryButton';
import { QuizOption } from '../components/QuizOption';
import { ProgressBar } from '../components/ProgressBar';
import { BunnyImage } from '../components/BunnyImage';
import { Colors } from '../theme/colors';

const { width, height } = Dimensions.get('window');

const isSmall = height < 760;
const isVerySmall = height < 700;
const isAndroid = Platform.OS === 'android';

type Step = 'home' | 'intro' | 'quiz' | 'result';

export function EmotionsScreen() {
  const [step, setStep] = useState<Step>('home');
  const [roundIndex, setRoundIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(EMOTION_QUIZ_CONFIG.secondsPerRound);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const round = EMOTION_ROUNDS[roundIndex];

  useEffect(() => {
    if (step !== 'quiz') return;

    setTimeLeft(EMOTION_QUIZ_CONFIG.secondsPerRound);
    setSelected(null);
    setAnswered(false);

    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          setAnswered(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [step, roundIndex]);

  const handleSelect = (option: string) => {
    if (answered) return;

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setSelected(option);
    setAnswered(true);

    if (option === round.correctAnswer) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (roundIndex < EMOTION_ROUNDS.length - 1) {
      setRoundIndex(i => i + 1);
    } else {
      setStep('result');
    }
  };

  const handleReset = () => {
    setStep('home');
    setRoundIndex(0);
    setScore(0);
    setSelected(null);
    setAnswered(false);
    setTimeLeft(EMOTION_QUIZ_CONFIG.secondsPerRound);
  };

  const getResultTier = () =>
    EMOTION_RESULT_TIERS.find(t => score >= t.minScore && score <= t.maxScore)!;

  const getOptionState = (option: string) => {
    if (!answered) return 'default';
    if (option === round.correctAnswer) return 'correct';
    if (option === selected) return 'wrong';
    return 'default';
  };

  const bunnySizeHome = isVerySmall ? 130 : isSmall ? 150 : 180;
  const bunnySizeQuiz = isVerySmall ? 130 : isSmall ? 150 : 180;
  const bunnySizeResult = isVerySmall ? 130 : isSmall ? 150 : 180;

  return (
    <View style={styles.container}>
      <Image source={require('../assets/bg_main.png')} style={styles.bg} resizeMode="cover" />

      <SafeAreaView style={[styles.safe, isAndroid && styles.safeAndroid]}>
        {(step === 'home' || step === 'intro' || step === 'result') && (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.staticScrollContent}
          >
            {step === 'home' && (
              <View style={styles.centered}>
                <BunnyImage source={require('../assets/bunny_thinking.png')} size={bunnySizeHome} />

                <View style={styles.iconBadge}>
                  <Text style={styles.iconEmoji}>🎯</Text>
                </View>

                <Text style={[styles.title, isVerySmall && styles.titleVerySmall]}>
                  Guess the Emotion!
                </Text>

                <Text style={[styles.body, isVerySmall && styles.bodyVerySmall]}>
                  A bunny will show you an emotion. Pick the right one from 3 options — but hurry,
                  you only have 10 seconds per question!
                </Text>

                <PrimaryButton label="Next" onPress={() => setStep('intro')} style={styles.btn} />
              </View>
            )}

            {step === 'intro' && (
              <View style={styles.centered}>
                <BunnyImage source={require('../assets/bunny_thinking.png')} size={bunnySizeHome} />

                <Text style={[styles.title, isVerySmall && styles.titleVerySmall]}>
                  5 Rounds, 10 Seconds Each
                </Text>

                <Text style={[styles.body, isVerySmall && styles.bodyVerySmall]}>
                  There are 5 questions total. Answer quickly and correctly to get the highest
                  score. Ready to test your emotional intelligence?
                </Text>

                <PrimaryButton
                  label="Start quiz"
                  onPress={() => setStep('quiz')}
                  style={styles.btn}
                />
              </View>
            )}

            {step === 'result' && (() => {
              const tier = getResultTier();

              return (
                <View style={styles.centered}>
                  <BunnyImage
                    source={require('../assets/bunny_default.png')}
                    size={bunnySizeResult}
                  />

                  <Text style={[styles.bigScore, isVerySmall && styles.bigScoreVerySmall]}>
                    {score}/{EMOTION_ROUNDS.length}
                  </Text>

                  <Text style={[styles.tierTitle, isVerySmall && styles.tierTitleVerySmall]}>
                    {tier.title} {tier.emoji}
                  </Text>

                  <View style={styles.statsRow}>
                    <View style={styles.statBox}>
                      <Text style={[styles.statNum, isVerySmall && styles.statNumVerySmall]}>
                        {score}
                      </Text>
                      <Text style={styles.statLabel}>Correct</Text>
                    </View>

                    <View style={styles.statBox}>
                      <Text style={[styles.statNum, isVerySmall && styles.statNumVerySmall]}>
                        {EMOTION_ROUNDS.length - score}
                      </Text>
                      <Text style={styles.statLabel}>Wrong</Text>
                    </View>

                    <View style={styles.statBox}>
                      <Text style={[styles.statNum, isVerySmall && styles.statNumVerySmall]}>
                        {Math.round((score / EMOTION_ROUNDS.length) * 100)}%
                      </Text>
                      <Text style={styles.statLabel}>Accurate</Text>
                    </View>
                  </View>

                  <PrimaryButton
                    label="Share"
                    onPress={() =>
                      Share.share({
                        message: `I scored ${score}/${EMOTION_ROUNDS.length} on BunnyMood Emotions! ${tier.emoji}`,
                      })
                    }
                    style={styles.btn}
                  />

                  <TouchableOpacity onPress={handleReset}>
                    <Text style={styles.backText}>Play again</Text>
                  </TouchableOpacity>
                </View>
              );
            })()}
          </ScrollView>
        )}

        {step === 'quiz' && (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.quizScrollContent}
          >
            <View style={styles.quizWrap}>
              <View style={styles.quizTop}>
                <Text style={styles.timerLabel}>Time left</Text>
                <Text style={[styles.timerValue, isVerySmall && styles.timerValueVerySmall]}>
                  {timeLeft}s
                </Text>
                <ProgressBar progress={timeLeft / EMOTION_QUIZ_CONFIG.secondsPerRound} />
                <Text style={styles.roundLabel}>
                  {roundIndex + 1}/{EMOTION_ROUNDS.length}
                </Text>
              </View>

              <Text style={[styles.question, isVerySmall && styles.questionVerySmall]}>
                What emotion is this bunny showing?
              </Text>

              <View style={styles.bunnyCenterWrap}>
                <BunnyImage source={round.bunnyImage} size={bunnySizeQuiz} />
              </View>

              <View style={styles.options}>
                {round.options.map(opt => (
                  <QuizOption
                    key={opt}
                    label={opt}
                    state={getOptionState(opt)}
                    onPress={() => handleSelect(opt)}
                    disabled={answered}
                  />
                ))}
              </View>

              {answered && (
                <PrimaryButton
                  label={roundIndex < EMOTION_ROUNDS.length - 1 ? 'Next question' : 'Result'}
                  onPress={handleNext}
                  style={styles.btn}
                />
              )}
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
    paddingTop: 20,
  },

  staticScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 60,
  },

  quizScrollContent: {
    flexGrow: 1,
    paddingBottom: 60,
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

  quizTop: {
    gap: 4,
  },

  timerLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
  },

  timerValue: {
    color: Colors.white,
    fontSize: 22,
    fontWeight: '700',
  },

  timerValueVerySmall: {
    fontSize: 18,
  },

  roundLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
    textAlign: 'right',
  },

  question: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },

  questionVerySmall: {
    fontSize: 14,
  },

  bunnyCenterWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },

  options: {
    gap: isVerySmall ? 8 : 10,
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

  bigScore: {
    fontSize: 52,
    fontWeight: '800',
    color: Colors.white,
  },

  bigScoreVerySmall: {
    fontSize: 40,
  },

  tierTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.pink,
    textAlign: 'center',
  },

  tierTitleVerySmall: {
    fontSize: 18,
  },

  statsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },

  statBox: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 16,
    padding: isVerySmall ? 12 : 16,
    alignItems: 'center',
    flex: 1,
  },

  statNum: {
    color: Colors.white,
    fontSize: 22,
    fontWeight: '700',
  },

  statNumVerySmall: {
    fontSize: 18,
  },

  statLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
    textAlign: 'center',
  },

  backText: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginTop: 8,
  },
});