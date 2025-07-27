import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';

// Get device screen dimensions
const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      {/* Decorative background circular icons */}
      <View style={styles.bgIcon1} />
      <View style={styles.bgIcon2} />
      <View style={styles.bgIcon3} />
      <View style={styles.bgIcon4} />
      <View style={styles.bgIcon5} />

      {/* Center content: logo and text */}
      <View style={styles.centerContent}>
        {/* App Logo */}
        <Image source={require('../assets/images/splash-icon.png')} style={styles.logo} />
        
        {/* App Title */}
        <Text style={styles.title}>UZIMA AI</Text>
        
        {/* App Subtitle */}
        <Text style={styles.subtitle}>Your smart health assistant</Text>
        
        {/* Supporting tagline */}
        <Text style={styles.subtext}>AI-powered care in your pocket</Text>
      </View>

      {/* Three decorative dots (could be loading or step indicator) */}
      <View style={styles.dotsContainer}>
        <View style={[styles.dot, { backgroundColor: '#377DFF' }]} />
        <View style={[styles.dot, { backgroundColor: '#2CD283' }]} />
        <View style={[styles.dot, { backgroundColor: '#377DFF' }]} />
      </View>

      {/* App version at the bottom */}
      <Text style={styles.version}>Version 1.0.0</Text>
    </View>
  );
}

// Size constant for the decorative icons
const ICON_SIZE = 40;

const styles = StyleSheet.create({
  // Main container for splash screen
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Center block that holds logo and texts
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: height * 0.15, // push content down slightly
  },

  // Logo image styling
  logo: {
    width: 120,
    height: 120,
    borderRadius: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },

  // App title styling
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#232B38',
    marginTop: 8,
    letterSpacing: 1.2,
  },

  // Subtitle text style
  subtitle: {
    fontSize: 18,
    color: '#4A5568',
    marginTop: 16,
    fontWeight: '500',
  },

  // Additional tagline/subtext style
  subtext: {
    fontSize: 16,
    color: '#7B8CA6',
    marginTop: 16,
    marginBottom: 32,
    textAlign: 'center',
  },

  // Dots container
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },

  // Style for each dot
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 6,
  },

  // Version text style (fixed at the bottom)
  version: {
    position: 'absolute',
    bottom: 32,
    alignSelf: 'center',
    color: '#A0AEC0',
    fontSize: 16,
  },

  // Decorative background circular icon 1 (top-left)
  bgIcon1: {
    position: 'absolute',
    top: 40,
    left: 32,
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
    backgroundColor: '#377DFF22', // light blue transparency
  },

  // Decorative background circular icon 2 (top-right)
  bgIcon2: {
    position: 'absolute',
    top: 80,
    right: 32,
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
    backgroundColor: '#2CD28322', // light green transparency
  },

  // Decorative background circular icon 3 (bottom-left)
  bgIcon3: {
    position: 'absolute',
    bottom: 120,
    left: 24,
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
    backgroundColor: '#377DFF22',
  },

  // Decorative background circular icon 4 (bottom-right)
  bgIcon4: {
    position: 'absolute',
    bottom: 80,
    right: 32,
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
    backgroundColor: '#2CD28322',
  },

  // Decorative background circular icon 5 (center-right)
  bgIcon5: {
    position: 'absolute',
    top: height * 0.5,
    right: width * 0.2,
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
    backgroundColor: '#377DFF11',
  },
});