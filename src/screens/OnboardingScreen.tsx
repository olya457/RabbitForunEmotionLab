import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  StatusBar,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ONBOARDING_PAGES } from '../data/onboardingData';
import { PaginationDots } from '../components/PaginationDots';
import { PrimaryButton } from '../components/PrimaryButton';
import { Colors } from '../theme/colors';
import { RootNavProp } from '../types/navigation';

const { width, height } = Dimensions.get('window');
const isSmallScreen = height < 700;
const isAndroid = Platform.OS === 'android';

export function OnboardingScreen() {
  const navigation = useNavigation<RootNavProp>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const page = ONBOARDING_PAGES[currentIndex];
  const isLast = currentIndex === ONBOARDING_PAGES.length - 1;

  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    opacity.setValue(0);
    translateY.setValue(16);

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentIndex, opacity, translateY]);

  const handleNext = () => {
    if (isLast) {
      navigation.replace('Main');
    } else {
      setCurrentIndex(i => i + 1);
    }
  };

  const handleSkip = () => {
    navigation.replace('Main');
  };

  const animatedTranslateY = isAndroid
    ? translateY.interpolate({
        inputRange: [0, 16],
        outputRange: [-30, -14],
      })
    : translateY;

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Image
        source={require('../assets/bg_main.png')}
        style={styles.bg}
        resizeMode="cover"
      />

      <SafeAreaView style={styles.safe}>
        <View style={[styles.topBar, isAndroid && styles.topBarAndroid]}>
          <View style={styles.topBarLeft} />

          <PaginationDots
            total={ONBOARDING_PAGES.length}
            current={currentIndex}
          />

          <TouchableOpacity
            onPress={handleSkip}
            style={styles.skipWrap}
            activeOpacity={0.8}
          >
            <Text style={styles.skip}>Skip</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.bunnyWrap, isAndroid && styles.bunnyWrapAndroid]}>
          <Image
            source={page.image}
            style={styles.bunnyImage}
            resizeMode="contain"
          />
        </View>

        <Animated.View
          style={[
            styles.content,
            {
              opacity,
              transform: [{ translateY: animatedTranslateY }],
            },
          ]}
        >
          <View style={styles.iconBadge}>
            <Text style={styles.iconEmoji}>{page.iconEmoji}</Text>
          </View>

          <Text style={styles.title}>{page.title}</Text>
          <Text style={styles.subtitle}>{page.subtitle}</Text>
          <Text style={styles.description}>{page.description}</Text>

          <PrimaryButton
            label={page.buttonLabel}
            onPress={handleNext}
            style={styles.btn}
          />
        </Animated.View>
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

  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: isSmallScreen ? 8 : 16,
    paddingBottom: 0,
    marginBottom: 20,
  },

  topBarAndroid: {
    marginBottom: -10,
    transform: [{ translateY: 30 }],
  },

  topBarLeft: {
    width: 40,
  },

  skipWrap: {
    width: 40,
    alignItems: 'flex-end',
  },

  skip: {
    color: Colors.textSecondary,
    fontSize: 14,
  },

  bunnyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  bunnyWrapAndroid: {
    flex: 0.8,
  },

  bunnyImage: {
    width: isSmallScreen ? width * 0.6 : width * 0.75,
    height: isSmallScreen ? width * 0.6 : width * 0.75,
  },

  content: {
    paddingHorizontal: 24,
    paddingBottom: isSmallScreen ? 16 : 32,
    alignItems: 'center',
    gap: isSmallScreen ? 8 : 12,
    marginTop: -20,
  },

  iconBadge: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 16,
    padding: isSmallScreen ? 8 : 12,
  },

  iconEmoji: {
    fontSize: isSmallScreen ? 20 : 24,
  },

  title: {
    fontSize: isSmallScreen ? 22 : 26,
    fontWeight: '700',
    color: Colors.white,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: isSmallScreen ? 13 : 14,
    fontWeight: '600',
    color: Colors.pink,
    textAlign: 'center',
  },

  description: {
    fontSize: isSmallScreen ? 13 : 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: isSmallScreen ? 20 : 22,
  },

  btn: {
    marginTop: isSmallScreen ? 4 : 8,
  },
});