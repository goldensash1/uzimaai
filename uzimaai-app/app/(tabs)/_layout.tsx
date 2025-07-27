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
          height: 90,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          position: 'absolute',
          left: 16,
          right: 16,
          bottom: 16,
          elevation: 30,
          backgroundColor: 'rgba(255, 255, 255, 0.98)',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -8 },
          shadowOpacity: 0.15,
          shadowRadius: 20,
          borderTopWidth: 0,
          paddingTop: 16,
          paddingBottom: 24,
          paddingHorizontal: 16,
        },
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 6,
        },
        tabBarIconStyle: {
          marginTop: 6,
        },
        tabBarItemStyle: {
          paddingVertical: 6,
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
                name="home-outline" 
                size={focused ? 26 : 24} 
                color={focused ? '#377DFF' : '#A0AEC0'} 
                focused={focused}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="symptoms"
        options={{
          title: 'Symptoms',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
              <TabBarIcon 
                name="stethoscope" 
                size={focused ? 26 : 24} 
                color={focused ? '#377DFF' : '#A0AEC0'} 
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
                color={focused ? '#377DFF' : '#A0AEC0'} 
                focused={focused}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="chatbot"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.centralButton, focused && styles.centralButtonActive]}>
              <View style={styles.centralButtonInner}>
                <TabBarIonicIcon 
                  name="chatbubble-ellipses" 
                  size={28} 
                  color="#fff" 
                  focused={focused}
                />
              </View>
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
                color={focused ? '#377DFF' : '#A0AEC0'} 
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
                color={focused ? '#377DFF' : '#A0AEC0'} 
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
                color={focused ? '#377DFF' : '#A0AEC0'} 
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
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  iconContainerActive: {
    backgroundColor: 'rgba(55, 125, 255, 0.08)',
    transform: [{ scale: 1.05 }],
  },
  centralButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#377DFF',
    shadowColor: '#377DFF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
    marginTop: -24,
    borderWidth: 4,
    borderColor: '#fff',
  },
  centralButtonActive: {
    backgroundColor: '#2B6CD9',
    transform: [{ scale: 1.05 }],
  },
  centralButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
});
