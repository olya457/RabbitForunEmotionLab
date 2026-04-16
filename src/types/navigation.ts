import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Main: undefined;
};

export type MainTabParamList = {
  Emotions: undefined;
  MyBunny: undefined;
  Saved: undefined;
  Friends: undefined;
  Game: undefined;
};

export type RootNavProp = NativeStackNavigationProp<RootStackParamList>;

export type TabNavProp = BottomTabNavigationProp<MainTabParamList>;