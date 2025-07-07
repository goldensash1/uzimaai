import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarInactiveTintColor: '#A0AEC0',
        tabBarStyle: {
          height: 70,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          elevation: 10,
          backgroundColor: '#fff',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
        },
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: 13,
          fontWeight: '600',
          marginBottom: 6,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome name="home" size={26} color={color} style={{ marginBottom: -3 }} />
          ),
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Symptoms',
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome name="stethoscope" size={26} color={color} style={{ marginBottom: -3 }} />
          ),
        }}
      />
      <Tabs.Screen
        name="medicine"
        options={{
          title: 'Medicine',
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome name="medkit" size={26} color={color} style={{ marginBottom: -3 }} />
          ),
        }}
      />
      <Tabs.Screen
        name="chatbot"
        options={{
          title: 'Chatbot',
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome name="comment" size={28} color={color} style={{ marginBottom: -3 }} />
          ),
        }}
      />
      <Tabs.Screen
        name="emergency"
        options={{
          title: 'Emergency',
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome name="phone" size={26} color={color} style={{ marginBottom: -3 }} />
          ),
        }}
      />
      {/* Add more tabs here for Medicine, Chatbot, Profile, etc. */}
    </Tabs>
  );
}
