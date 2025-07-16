import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { FontAwesome, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { getSession } from '../../utils/session';

export default function HomeScreen() {
  const [username, setUsername] = useState('');
  useEffect(() => {
    (async () => {
      const session = await getSession();
      setUsername(session?.username || '');
    })();
  }, []);
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hi{username ? `, ${username}!` : '!'}</Text>
          <Text style={styles.subtitle}>How are you feeling today?</Text>
        </View>
        <View style={styles.profileIconBox}>
          <FontAwesome name="user-circle" size={48} color="#377DFF" />
        </View>
      </View>
      {/* Feature Cards */}
      <ScrollView contentContainerStyle={styles.cardsContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.row}>
          <Link href="/two" asChild>
            <FeatureCard
              icon={<MaterialIcons name="sick" size={32} color="#377DFF" />}
              iconBg="#E6F0FF"
              title="Symptom Checker"
              subtitle="Check your symptoms"
              onPress={() => {}}
              fullWidth={false}
            />
          </Link>
          <Link href="/medicine" asChild>
            <FeatureCard
              icon={<FontAwesome name="medkit" size={32} color="#2CD283" />}
              iconBg="#E6FFF5"
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
              icon={<Ionicons name="chatbubble-ellipses" size={32} color="#8B5CF6" />}
              iconBg="#F3E6FF"
              title="AI Chatbot"
              subtitle="Ask health questions"
              onPress={() => {}}
              fullWidth={false}
            />
          </Link>
          <Link href="/emergency" asChild>
            <FeatureCard
              icon={<Ionicons name="call" size={32} color="#E53935" />}
              iconBg="#FFE6E6"
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
              icon={<Ionicons name="medkit" size={32} color="#fff" />}
              iconBg="linear-gradient(90deg, #377DFF 0%, #2CD283 100%)"
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
  icon: React.ReactNode;
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
      activeOpacity={0.85}
    >
      <View style={[styles.iconContainer, { backgroundColor: iconBg.includes('linear') ? '#377DFF' : iconBg }]}> 
        {icon}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle} numberOfLines={1} ellipsizeMode="tail">{title}</Text>
        <Text style={styles.cardSubtitle} numberOfLines={2} ellipsizeMode="tail">{subtitle}</Text>
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
  profileIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E6F0FF',
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
  emoji: {
    fontSize: 36,
    marginBottom: 0,
    textAlign: 'center',
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
    minHeight: 80,
  },
  cardFullWidth: {
    width: '100%',
    marginHorizontal: 0,
    marginBottom: 0,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#232B38',
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#7B8CA6',
    marginTop: 0,
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  fullWidthCard: {
    marginTop: 8,
    marginBottom: 20,
  },
});
