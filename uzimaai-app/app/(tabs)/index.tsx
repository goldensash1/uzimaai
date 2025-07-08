import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hi, Salomon!</Text>
          <Text style={styles.subtitle}>How are you feeling today?</Text>
        </View>
        <Image
          source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg' }}
          style={styles.profileImage}
        />
      </View>
      {/* Feature Cards */}
      <ScrollView contentContainerStyle={styles.cardsContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.row}>
          <Link href="/two" asChild>
            <FeatureCard
              iconBg="#E6F0FF"
              icon={require('../../assets/images/icon.png')}
              title="Symptom Checker"
              subtitle="Check your symptoms"
              onPress={() => {}}
              fullWidth={false}
            />
          </Link>
          <Link href="/medicine" asChild>
            <FeatureCard
              iconBg="#E6FFF5"
              icon={require('../../assets/images/icon.png')}
              title="Medicine Reviews"
              subtitle="Find medicine info"
              onPress={() => {}}
              fullWidth={false}
            />
          </Link>
        </View>
        <View style={styles.row}>
          <Link href="/chatbot" asChild>
            <FeatureCard
              iconBg="#F3E6FF"
              icon={require('../../assets/images/icon.png')}
              title="AI Chatbot"
              subtitle="Ask health questions"
              onPress={() => {}}
              fullWidth={false}
            />
          </Link>
          <Link href="/emergency" asChild>
            <FeatureCard
              iconBg="#FFE6E6"
              icon={require('../../assets/images/icon.png')}
              title="Emergency Contact"
              subtitle="Quick emergency call"
              onPress={() => {}}
              fullWidth={false}
            />
          </Link>
        </View>
        <View style={styles.fullWidthCard}>
          <Link href="/firstaid" asChild>
            <FeatureCard
              iconBg="linear-gradient(90deg, #377DFF 0%, #2CD283 100%)"
              icon={require('../../assets/images/icon.png')}
              title="First Aid Guide"
              subtitle="Emergency procedures"
              onPress={() => {}}
              fullWidth
            />
          </Link>
        </View>
      </ScrollView>
    </View>
  );
}

function FeatureCard({ icon, iconBg, title, subtitle, onPress, fullWidth = false }: {
  icon: any;
  iconBg: string;
  title: string;
  subtitle: string;
  onPress: () => void;
  fullWidth?: boolean;
}) {
  return (
    <TouchableOpacity
      style={[styles.card, fullWidth && styles.cardFullWidth]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.iconContainer, { backgroundColor: iconBg.includes('linear') ? '#377DFF' : iconBg }]}> 
        <Image source={icon} style={styles.icon} />
      </View>
      <View>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardSubtitle}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#232B38',
  },
  subtitle: {
    fontSize: 16,
    color: '#7B8CA6',
    marginTop: 4,
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  cardsContainer: {
    paddingBottom: 40,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    flex: 1,
    marginHorizontal: 4,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardFullWidth: {
    width: '100%',
    marginHorizontal: 0,
    marginBottom: 0,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  icon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#232B38',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#7B8CA6',
    marginTop: 2,
  },
  fullWidthCard: {
    marginTop: 8,
    marginBottom: 20,
  },
});
