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
import { GAME_ROUNDS, GAME_RESULT_TIERS } from '../data/gameData';
import { PrimaryButton } from '../components/PrimaryButton';
import { BunnyImage } from '../components/BunnyImage';
import { ProgressBar } from '../components/ProgressBar';
import { Colors } from '../theme/colors';

const { width, height } = Dimensions.get('window');

const isSmall = height < 760;
const isVerySmall = height < 700;
const isSE = height <= 667;
const isAndroid = Platform.OS === 'android';
const MAX_ATTEMPTS = 1;

type Step = 'home' | 'intro' | 'play' | 'round_result' | 'result';

export function GameScreen() {
  const [step, setStep] = useState<Step>('home');
  const [roundIndex, setRoundIndex] = useState(0);
  const [scores, setScores] = useState<boolean[]>([]);
  const [uniqueIndex, setUniqueIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [wrongIndexes, setWrongIndexes] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [roundWon, setRoundWon] = useState(false);
  const [attemptsLeft, setAttemptsLeft] = useState(MAX_ATTEMPTS);
  const [failReason, setFailReason] = useState<'time' | 'attempts' | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const round = GAME_ROUNDS[roundIndex];
  const totalCells = round.gridColumns * round.gridRows;

  useEffect(() => {
    if (step !== 'play') return;

    const idx = Math.floor(Math.random() * totalCells);

    setUniqueIndex(idx);
    setSelected(null);
    setWrongIndexes([]);
    setAttemptsLeft(MAX_ATTEMPTS);
    setTimeLeft(round.timeSeconds);
    setRoundWon(false);
    setFailReason(null);

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setRoundWon(false);
          setFailReason('time');
          setScores(current => [...current, false]);
          setStep('round_result');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [step, roundIndex, totalCells, round.timeSeconds]);

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const finishRound = (won: boolean, reason?: 'time' | 'attempts') => {
    stopTimer();
    setRoundWon(won);
    setFailReason(won ? null : reason ?? null);
    setScores(prev => [...prev, won]);
    setStep('round_result');
  };

  const handleCellPress = (index: number) => {
    if (step !== 'play') return;
    if (selected !== null) return;
    if (wrongIndexes.includes(index)) return;

    if (index === uniqueIndex) {
      setSelected(index);
      finishRound(true);
      return;
    }

    const nextAttempts = attemptsLeft - 1;
    setWrongIndexes(prev => [...prev, index]);

    if (nextAttempts <= 0) {
      setSelected(index);
      setAttemptsLeft(0);
      finishRound(false, 'attempts');
      return;
    }

    setAttemptsLeft(nextAttempts);
  };

  const handleNextRound = () => {
    if (roundIndex < GAME_ROUNDS.length - 1) {
      setRoundIndex(prev => prev + 1);
      setStep('play');
    } else {
      setStep('result');
    }
  };

  const handleReset = () => {
    stopTimer();
    setStep('home');
    setRoundIndex(0);
    setScores([]);
    setUniqueIndex(0);
    setSelected(null);
    setWrongIndexes([]);
    setTimeLeft(0);
    setRoundWon(false);
    setAttemptsLeft(MAX_ATTEMPTS);
    setFailReason(null);
  };

  const totalScore = scores.filter(Boolean).length;
  const tier =
    GAME_RESULT_TIERS.find(
      t => totalScore >= t.minScore && totalScore <= t.maxScore
    ) || GAME_RESULT_TIERS[0];

  const getCellSize = () => {
    const horizontalPadding = 48;
    const gap = isSE ? 5 : isVerySmall ? 6 : 8;
    const availableWidth =
      width - horizontalPadding - (round.gridColumns - 1) * gap;
    const rawSize = availableWidth / round.gridColumns;

    if (isSE) return Math.min(rawSize, 58);
    if (isVerySmall) return Math.min(rawSize, 62);
    if (isSmall) return Math.min(rawSize, 70);
    return Math.min(rawSize, 82);
  };

  const cellSize = getCellSize();
  const bunnyImageSize = Math.round(cellSize * 0.82);

  const getCellStyle = (index: number) => {
    const isWrong = wrongIndexes.includes(index);
    const isCorrectSelected = roundWon && index === uniqueIndex;
    const revealCorrect = !roundWon && step === 'round_result' && index === uniqueIndex;

    return [
      styles.cell,
      {
        width: cellSize,
        height: cellSize,
        borderRadius: isSE ? 8 : isVerySmall ? 10 : 12,
        opacity: isWrong ? 0.45 : 1,
        borderWidth: isCorrectSelected || revealCorrect ? 2 : 0,
        borderColor:
          isCorrectSelected || revealCorrect ? Colors.optionCorrect : 'transparent',
      },
    ];
  };

  const bunnyIntroSize = isSE ? 105 : isVerySmall ? 120 : isSmall ? 140 : 170;
  const bunnyRoundResultSize = isSE ? 105 : isVerySmall ? 120 : isSmall ? 140 : 170;
  const bunnyResultSize = isSE ? 110 : isVerySmall ? 120 : isSmall ? 140 : 170;

  const roundGap = isSE ? 5 : isVerySmall ? 6 : 8;

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/bg_main.png')}
        style={styles.bg}
        resizeMode="cover"
      />

      <SafeAreaView style={[styles.safe, isAndroid && styles.safeAndroid]}>
        {(step === 'home' || step === 'intro' || step === 'round_result' || step === 'result') && (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.staticScrollContent}
          >
            {step === 'home' && (
              <View style={styles.centered}>
                <BunnyImage
                  source={require('../assets/bunny_magnifier.png')}
                  size={bunnyIntroSize}
                />

                <View style={styles.iconBadge}>
                  <Text style={styles.iconEmoji}>🔍</Text>
                </View>

                <Text style={[styles.title, isVerySmall && styles.titleVerySmall]}>
                  Find the Unique Bunny!
                </Text>

                <Text style={[styles.body, isVerySmall && styles.bodyVerySmall]}>
                  A grid of bunnies will appear. Only one bunny is different.
                  Find it before time runs out.
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
                  source={require('../assets/bunny_magnifier.png')}
                  size={bunnyIntroSize}
                />

                <Text style={[styles.title, isVerySmall && styles.titleVerySmall]}>
                  3 Rounds, 1 Attempt
                </Text>

                <Text style={[styles.body, isVerySmall && styles.bodyVerySmall]}>
                  You have only one attempt in each round. One wrong tap ends the round,
                  so choose carefully.
                </Text>

                <PrimaryButton
                  label="Start Game 🔍"
                  onPress={() => setStep('play')}
                  style={styles.btn}
                />
              </View>
            )}

            {step === 'round_result' && (
              <View style={styles.centered}>
                <BunnyImage
                  source={require('../assets/bunny_magnifier.png')}
                  size={bunnyRoundResultSize}
                />

                <Text style={styles.bigEmoji}>{roundWon ? '🎯' : '❌'}</Text>

                <Text
                  style={[
                    styles.roundResultTitle,
                    { color: roundWon ? Colors.optionCorrect : Colors.optionWrong },
                    isVerySmall && styles.roundResultTitleVerySmall,
                  ]}
                >
                  {roundWon ? 'Found it!' : 'Round lost'}
                </Text>

                <Text style={[styles.scoreText, isVerySmall && styles.scoreTextVerySmall]}>
                  {roundWon
                    ? 'You found the unique bunny.'
                    : failReason === 'attempts'
                    ? 'Wrong tap. The round is over.'
                    : 'Time is over.'}
                </Text>

                <Text style={[styles.scoreText, isVerySmall && styles.scoreTextVerySmall]}>
                  Score: {scores.filter(Boolean).length}/{scores.length} rounds
                </Text>

                <PrimaryButton
                  label={roundIndex < GAME_ROUNDS.length - 1 ? `Round ${roundIndex + 2} →` : 'See result'}
                  onPress={handleNextRound}
                  style={styles.btn}
                />
              </View>
            )}

            {step === 'result' && tier && (
              <View style={styles.centered}>
                <BunnyImage
                  source={require('../assets/bunny_magnifier.png')}
                  size={bunnyResultSize}
                />

                <Text style={[styles.bigScore, isVerySmall && styles.bigScoreVerySmall]}>
                  {totalScore}/3
                </Text>

                <Text style={[styles.tierTitle, isVerySmall && styles.tierTitleVerySmall]}>
                  {tier.title} {tier.emoji}
                </Text>

                <Text style={[styles.tierDesc, isVerySmall && styles.tierDescVerySmall]}>
                  {tier.description}
                </Text>

                <View style={styles.dotsRow}>
                  {scores.map((won, i) => (
                    <View
                      key={i}
                      style={[
                        styles.scoreDot,
                        {
                          backgroundColor: won
                            ? Colors.optionCorrect
                            : Colors.optionWrong,
                        },
                      ]}
                    />
                  ))}
                </View>

                <PrimaryButton
                  label="Share"
                  onPress={() =>
                    Share.share({
                      message: `I scored ${totalScore}/3 in Find the Unique Bunny! ${tier.emoji} #BunnyMood`,
                    })
                  }
                  style={styles.btn}
                />

                <TouchableOpacity onPress={handleReset} activeOpacity={0.8}>
                  <Text style={styles.backText}>Play again</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        )}

        {step === 'play' && (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.playScrollContent}
          >
            <View style={styles.playWrap}>
              <View style={styles.playHeader}>
                <Text style={styles.roundLabel}>
                  Round {round.roundNumber}/{GAME_ROUNDS.length}
                </Text>
                <Text style={[styles.timerValue, isVerySmall && styles.timerValueVerySmall]}>
                  {timeLeft}s
                </Text>
              </View>

              <ProgressBar progress={timeLeft / round.timeSeconds} />

              <View style={styles.statusRow}>
                <Text style={[styles.findText, isVerySmall && styles.findTextVerySmall]}>
                  Find the bunny that's different
                </Text>
                <Text style={[styles.attemptsText, isVerySmall && styles.attemptsTextVerySmall]}>
                  Attempts: {attemptsLeft}/{MAX_ATTEMPTS}
                </Text>
              </View>

              <View style={[styles.grid, { gap: roundGap }]}>
                {Array.from({ length: totalCells }).map((_, i) => {
                  const isWrong = wrongIndexes.includes(i);

                  return (
                    <TouchableOpacity
                      key={i}
                      style={getCellStyle(i)}
                      onPress={() => handleCellPress(i)}
                      activeOpacity={0.85}
                      disabled={isWrong}
                    >
                      <View style={styles.innerCell}>
                        <Image
                          source={
                            i === uniqueIndex
                              ? require('../assets/bunny_magnifier.png')
                              : require('../assets/bunny_default.png')
                          }
                          style={[
                            styles.cellImage,
                            {
                              width: bunnyImageSize,
                              height: bunnyImageSize,
                            },
                          ]}
                          resizeMode="contain"
                        />
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
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

  playScrollContent: {
    flexGrow: 1,
    paddingBottom: 80,
  },

  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: isSE ? 8 : isVerySmall ? 12 : 20,
    gap: isSE ? 10 : isVerySmall ? 12 : 16,
  },

  playWrap: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: isSE ? 6 : isVerySmall ? 10 : 16,
    gap: isSE ? 8 : isVerySmall ? 10 : 12,
  },

  playHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  roundLabel: {
    color: Colors.textSecondary,
    fontSize: isSE ? 11 : isVerySmall ? 12 : 13,
    fontWeight: '600',
  },

  timerValue: {
    color: Colors.white,
    fontSize: 22,
    fontWeight: '700',
  },

  timerValueVerySmall: {
    fontSize: 18,
  },

  statusRow: {
    gap: isSE ? 4 : 6,
  },

  findText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },

  findTextVerySmall: {
    fontSize: 12,
  },

  attemptsText: {
    color: Colors.pink,
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },

  attemptsTextVerySmall: {
    fontSize: 12,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignSelf: 'center',
    width: '100%',
  },

  cell: {
    overflow: 'hidden',
    backgroundColor: '#F35A9B',
    alignItems: 'center',
    justifyContent: 'center',
  },

  innerCell: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  cellImage: {
    alignSelf: 'center',
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

  bigEmoji: {
    fontSize: isVerySmall ? 42 : 52,
  },

  roundResultTitle: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
  },

  roundResultTitleVerySmall: {
    fontSize: 22,
  },

  scoreText: {
    color: Colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },

  scoreTextVerySmall: {
    fontSize: 12,
    lineHeight: 18,
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
    fontSize: 22,
    fontWeight: '700',
    color: Colors.pink,
    textAlign: 'center',
  },

  tierTitleVerySmall: {
    fontSize: 18,
  },

  tierDesc: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },

  tierDescVerySmall: {
    fontSize: 12,
    lineHeight: 18,
  },

  dotsRow: {
    flexDirection: 'row',
    gap: 12,
  },

  scoreDot: {
    width: isVerySmall ? 14 : 16,
    height: isVerySmall ? 14 : 16,
    borderRadius: 999,
  },

  backText: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginTop: 4,
  },
});