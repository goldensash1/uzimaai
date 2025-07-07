import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      {/* Background icons */}
      <View style={styles.bgIcon1} />
      <View style={styles.bgIcon2} />
      <View style={styles.bgIcon3} />
      <View style={styles.bgIcon4} />
      <View style={styles.bgIcon5} />
      {/* Main logo */}
      <View style={styles.centerContent}>
        <Image source={require('../assets/images/splash-icon.png')} style={styles.logo} />
        <Text style={styles.title}>UZIMA AI</Text>
        <Text style={styles.subtitle}>Your smart health assistant</Text>
        <Text style={styles.subtext}>AI-powered care in your pocket</Text>
      </View>
      {/* Dots */}
      <View style={styles.dotsContainer}>
        <View style={[styles.dot, { backgroundColor: '#377DFF' }]} />
        <View style={[styles.dot, { backgroundColor: '#2CD283' }]} />
        <View style={[styles.dot, { backgroundColor: '#377DFF' }]} />
      </View>
      {/* Version */}
      <Text style={styles.version}>Version 1.0.0</Text>
    </View>
  );
}

const ICON_SIZE = 40;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: height * 0.15,
  },
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
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#232B38',
    marginTop: 8,
    letterSpacing: 1.2,
  },
  subtitle: {
    fontSize: 18,
    color: '#4A5568',
    marginTop: 16,
    fontWeight: '500',
  },
  subtext: {
    fontSize: 16,
    color: '#7B8CA6',
    marginTop: 16,
    marginBottom: 32,
    textAlign: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 6,
  },
  version: {
    position: 'absolute',
    bottom: 32,
    alignSelf: 'center',
    color: '#A0AEC0',
    fontSize: 16,
  },
  // Placeholder background icons
  bgIcon1: {
    position: 'absolute',
    top: 40,
    left: 32,
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
    backgroundColor: '#377DFF22',
  },
  bgIcon2: {
    position: 'absolute',
    top: 80,
    right: 32,
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
    backgroundColor: '#2CD28322',
  },
  bgIcon3: {
    position: 'absolute',
    bottom: 120,
    left: 24,
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
    backgroundColor: '#377DFF22',
  },
  bgIcon4: {
    position: 'absolute',
    bottom: 80,
    right: 32,
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
    backgroundColor: '#2CD28322',
  },
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