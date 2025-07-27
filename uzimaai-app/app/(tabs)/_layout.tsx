import React from 'react';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { Link, Tabs } from 'expo-router';
import { Pressable, View, Text, StyleSheet } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

// Custom Tab Bar Icon Component with better styling
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
  focused: boolean;
  size?: number;
}) {
  return <FontAwesome size={props.size || 24} style={{ marginBottom: -3 }} {...props} />;
}

// Custom Ionicons component
function TabBarIonicIcon(props: {
  name: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
  focused: boolean;
  size?: number;
}) {
  return <Ionicons size={props.size || 24} style={{ marginBottom: -3 }} {...props} />;
}

// Custom MaterialIcons component
function TabBarMaterialIcon(props: {
  name: React.ComponentProps<typeof MaterialIcons>['name'];
  color: string;
  focused: boolean;
  size?: number;
}) {
  return <MaterialIcons size={props.size || 24} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#377DFF',
        tabBarInactiveTintColor: '#A0AEC0',
        tabBarStyle: {
          height: 80,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          position: 'absolute',
          left: 8,
          right: 8,
          bottom: 8,
          elevation: 20,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          shadowColor: '#377DFF',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          borderTopWidth: 0,
          paddingTop: 8,
          paddingBottom: 16,
          paddingHorizontal: 8,
        },
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
              <TabBarIonicIcon 
                name="home" 
                size={focused ? 26 : 24} 
                color={focused ? '#377DFF' : color} 
                focused={focused}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Symptoms',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
              <TabBarMaterialIcon 
                name="sick" 
                size={focused ? 26 : 24} 
                color={focused ? '#377DFF' : color} 
                focused={focused}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="medicine"
        options={{
          title: 'Medicine',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
              <TabBarIcon 
                name="medkit" 
                size={focused ? 26 : 24} 
                color={focused ? '#377DFF' : color} 
                focused={focused}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="chatbot"
        options={{
          title: 'AI Chat',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
              <TabBarIonicIcon 
                name="chatbubble-ellipses" 
                size={focused ? 28 : 26} 
                color={focused ? '#377DFF' : color} 
                focused={focused}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="emergency"
        options={{
          title: 'Emergency',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
              <TabBarIonicIcon 
                name="call" 
                size={focused ? 26 : 24} 
                color={focused ? '#377DFF' : color} 
                focused={focused}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="firstaid"
        options={{
          title: 'First Aid',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
              <TabBarMaterialIcon 
                name="health-and-safety" 
                size={focused ? 26 : 24} 
                color={focused ? '#377DFF' : color} 
                focused={focused}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
              <TabBarIcon 
                name="user" 
                size={focused ? 26 : 24} 
                color={focused ? '#377DFF' : color} 
                focused={focused}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  iconContainerActive: {
    backgroundColor: 'rgba(55, 125, 255, 0.1)',
    transform: [{ scale: 1.1 }],
  },
});
