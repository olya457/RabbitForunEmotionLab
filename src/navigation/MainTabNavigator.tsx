import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, StyleSheet, Platform, View } from 'react-native';
import { EmotionsScreen } from '../screens/EmotionsScreen';
import { MyBunnyScreen } from '../screens/MyBunnyScreen';
import { SavedScreen } from '../screens/SavedScreen';
import { FriendsScreen } from '../screens/FriendsScreen';
import { GameScreen } from '../screens/GameScreen';
import { Colors } from '../theme/colors';

export type MainTabParamList = {
  Emotions: undefined;
  MyBunny: undefined;
  Saved: undefined;
  Friends: undefined;
  Game: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const TAB_ICONS: Record<keyof MainTabParamList, string> = {
  Emotions: '😊',
  MyBunny: '🐰',
  Saved: '🤍',
  Friends: '👥',
  Game: '⚡',
};

export function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: Colors.pink,
        tabBarInactiveTintColor: Colors.tabInactive,
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.tabBarItem,
        tabBarIconStyle: styles.tabBarIconStyle,
        tabBarIcon: ({ color, focused }) => (
          <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
            <Text
              style={[
                styles.tabIcon,
                { color: focused ? Colors.pink : color },
              ]}
            >
              {TAB_ICONS[route.name as keyof MainTabParamList]}
            </Text>
          </View>
        ),
      })}
    >
      <Tab.Screen name="Emotions" component={EmotionsScreen} />
      <Tab.Screen name="MyBunny" component={MyBunnyScreen} />
      <Tab.Screen name="Saved" component={SavedScreen} />
      <Tab.Screen name="Friends" component={FriendsScreen} />
      <Tab.Screen name="Game" component={GameScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: Platform.OS === 'ios' ? 20 : 40,
    height: 74,
    backgroundColor: Colors.tabBackground,
    borderTopWidth: 0,
    borderWidth: 1,
    borderColor: 'rgba(255, 92, 151, 0.35)',
    borderRadius: 24,
    paddingTop: 10,
    paddingBottom: 10,
    elevation: 12,
    shadowColor: '#000',
    shadowOpacity: 0.22,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },

  tabBarItem: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  tabBarIconStyle: {
    marginTop: 8,
    marginBottom: 0,
  },

  iconWrap: {
    minWidth: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconWrapActive: {
    backgroundColor: 'rgba(255, 92, 151, 0.18)',
  },

  tabIcon: {
    fontSize: 24,
    textAlign: 'center',
  },
});