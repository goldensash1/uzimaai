import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, Image, SafeAreaView } from 'react-native';
import * as Speech from 'expo-speech';

const CHAT = [
  { id: '1', sender: 'bot', text: "Hello! I'm your medical assistant. I can help you with health information and guidance. How can I assist you today?", time: '9:42 AM' },
  { id: '2', sender: 'user', text: "I've been having headaches for the past few days. What could be causing this?", time: '9:45 AM' },
  { id: '3', sender: 'bot', text: "Headaches can have several causes. Here are some common ones:\n\n• Dehydration\n• Stress or tension\n• Lack of sleep\n• Eye strain", time: '9:46 AM' },
  { id: '4', sender: 'user', text: "What can I do to relieve them?", time: '9:47 AM' },
  { id: '5', sender: 'bot', text: "Here are some ways to help relieve headaches:\n\n💧 Drink plenty of water\n🛏️ Get adequate rest\n🌿 Try relaxation techniques", time: '9:48 AM' },
];

export default function ChatbotScreen() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(CHAT);
  const flatListRef = useRef<FlatList>(null);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, { id: Date.now().toString(), sender: 'user', text: input, time: 'Now' }]);
    setInput('');
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const speakMessage = (text: string) => {
    Speech.speak(text, { language: 'en' });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Image source={require('../../assets/images/icon.png')} style={styles.avatarBot} />
            <View style={{ flex: 1 }}>
              <Text style={styles.headerTitle}>Medical Assistant</Text>
              <Text style={styles.headerStatus}>Online</Text>
            </View>
          </View>
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={item => item.id}
            renderItem={({ item }) => <ChatBubble message={item} onSpeak={speakMessage} />}
            contentContainerStyle={{ paddingVertical: 16, paddingHorizontal: 8 }}
            showsVerticalScrollIndicator={false}
          />
          <View style={styles.warningBox}>
            <Text style={styles.warningText}>⚠️ This is not medical advice. Always consult a professional.</Text>
          </View>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Type your message..."
              placeholderTextColor="#B0B8C1"
              value={input}
              onChangeText={setInput}
              multiline
            />
            <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
              <Text style={styles.sendIcon}>➤</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function ChatBubble({ message, onSpeak }: { message: { sender: string; text: string; time: string }, onSpeak: (text: string) => void }) {
  const isUser = message.sender === 'user';
  return (
    <View style={[styles.bubbleRow, isUser && { justifyContent: 'flex-end' }]}>
      {!isUser && <Image source={require('../../assets/images/icon.png')} style={styles.avatarBotSmall} />}
      <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleBot]}>
        <Text style={[styles.bubbleText, isUser && { color: '#fff' }]}>{message.text}</Text>
        <View style={styles.bubbleFooter}>
          <Text style={styles.bubbleTime}>{message.time}</Text>
          {!isUser && (
            <TouchableOpacity onPress={() => onSpeak(message.text)} style={styles.speakBtn}>
              <Text style={styles.speakIcon}>🔊</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      {isUser && <Image source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }} style={styles.avatarUserSmall} />}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#232B38',
  },
  headerStatus: {
    fontSize: 14,
    color: '#2CD283',
    fontWeight: '600',
  },
  avatarBot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  avatarBotSmall: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
    alignSelf: 'flex-end',
  },
  avatarUserSmall: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginLeft: 8,
    alignSelf: 'flex-end',
  },
  bubbleRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  bubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 2,
  },
  bubbleBot: {
    backgroundColor: '#F5F7FA',
    borderTopLeftRadius: 0,
  },
  bubbleUser: {
    backgroundColor: '#377DFF',
    borderTopRightRadius: 0,
  },
  bubbleText: {
    fontSize: 16,
    color: '#232B38',
  },
  bubbleFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    justifyContent: 'space-between',
  },
  bubbleTime: {
    fontSize: 12,
    color: '#A0AEC0',
    textAlign: 'right',
  },
  speakBtn: {
    marginLeft: 8,
    padding: 2,
  },
  speakIcon: {
    fontSize: 18,
    color: '#377DFF',
  },
  warningBox: {
    backgroundColor: '#FFF7E6',
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#FFE6A0',
  },
  warningText: {
    color: '#B7791F',
    fontSize: 14,
    textAlign: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingBottom: 16,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 12,
    fontSize: 16,
    color: '#232B38',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginRight: 8,
    minHeight: 44,
    maxHeight: 100,
  },
  sendBtn: {
    backgroundColor: '#377DFF',
    borderRadius: 24,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#377DFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  sendIcon: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
}); 