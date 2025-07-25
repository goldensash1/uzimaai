import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, Image, ActivityIndicator, Alert } from 'react-native';
import * as Speech from 'expo-speech';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { API_ENDPOINTS } from '../../constants/api';
import { apiRequest } from '../../utils/api';
import { getSession } from '../../utils/session';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: string;
}

const INITIAL_MESSAGE: ChatMessage = {
  id: '1',
  sender: 'bot',
  text: "Hello! I'm your medical assistant. I can help you with health information and guidance. How can I assist you today?",
  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
};

export default function ChatbotScreen() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [loading, setLoading] = useState(false);
  const [userid, setUserid] = useState<number | null>(null);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    // Get user session and load chat history
    (async () => {
      const session = await getSession();
      if (session?.userid) {
        setUserid(session.userid);
        loadChatHistory(session.userid);
      }
    })();
  }, []);

  const loadChatHistory = async (uid: number) => {
    try {
      const response = await apiRequest(API_ENDPOINTS.getChatHistory, 'GET', undefined, uid.toString());
      if (response.success && response.data) {
        const historyMessages: ChatMessage[] = response.data.map((item: any, index: number) => ({
          id: (index + 2).toString(), // Start from 2 since we have initial message
          sender: 'user',
          text: item.message,
          time: new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }));

        // Add bot responses
        const botMessages: ChatMessage[] = response.data.map((item: any, index: number) => ({
          id: `bot-${index + 2}`,
          sender: 'bot',
          text: item.response,
          time: new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }));

        // Interleave user and bot messages
        const allMessages = [INITIAL_MESSAGE];
        response.data.forEach((item: any, index: number) => {
          allMessages.push(historyMessages[index]);
          allMessages.push(botMessages[index]);
        });

        setMessages(allMessages);
      }
    } catch (error) {
      console.log('Failed to load chat history:', error);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    if (!userid) {
      Alert.alert('Error', 'Please log in to use this feature');
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      const response = await apiRequest(
        API_ENDPOINTS.aiChat,
        'POST',
        {
          message: input,
          userid: userid,
          type: 'chat'
        }
      );

      if (response.success) {
        const botMessage: ChatMessage = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: response.response,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, botMessage]);
        
        // Scroll to bottom after bot response
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      } else {
        Alert.alert('Error', response.error || 'Failed to get response');
        // Remove the user message if failed
        setMessages(prev => prev.filter(msg => msg.id !== userMessage.id));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to connect to AI service');
      // Remove the user message if failed
      setMessages(prev => prev.filter(msg => msg.id !== userMessage.id));
    } finally {
      setLoading(false);
    }
  };

  const speakMessage = (text: string) => {
    Speech.speak(text, { language: 'en' });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 60}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Image source={require('../../assets/images/icon.png')} style={styles.avatarBot} resizeMode="contain" />
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
          
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#377DFF" />
              <Text style={styles.loadingText}>AI is thinking...</Text>
            </View>
          )}
          
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
              editable={!loading}
            />
            <TouchableOpacity 
              style={[styles.sendBtn, loading && styles.sendBtnDisabled]} 
              onPress={sendMessage}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Ionicons name="send" size={20} color="#fff" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function ChatBubble({ message, onSpeak }: { message: ChatMessage, onSpeak: (text: string) => void }) {
  const isUser = message.sender === 'user';
  return (
    <View style={[styles.bubbleRow, isUser && { justifyContent: 'flex-end' }]}>
      {!isUser && <Image source={require('../../assets/images/icon.png')} style={styles.avatarBotSmall} resizeMode="contain" />}
      <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleBot]}>
        <Text style={[styles.bubbleText, isUser && { color: '#fff' }]}>{message.text}</Text>
        <View style={styles.bubbleFooter}>
          <Text style={[styles.bubbleTime, isUser && { color: '#E2E8F0' }]}>{message.time}</Text>
          {!isUser && (
            <TouchableOpacity onPress={() => onSpeak(message.text)} style={styles.speakBtn}>
              <Ionicons name="volume-high" size={20} color="#377DFF" style={styles.speakIcon} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      {isUser && <Image source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }} style={styles.avatarUserSmall} resizeMode="contain" />}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 0,
    paddingBottom: 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 0,
    paddingBottom: 0,
    justifyContent: 'flex-end',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    marginBottom: 2,
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
    backgroundColor: '#fff',
  },
  avatarBotSmall: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
    alignSelf: 'flex-end',
    backgroundColor: '#fff',
  },
  avatarUserSmall: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginLeft: 8,
    alignSelf: 'flex-end',
    backgroundColor: '#fff',
  },
  bubbleRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  bubble: {
    maxWidth: '85%',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 14,
    marginBottom: 1,
    flexShrink: 1,
    flexWrap: 'wrap',
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
    fontSize: 15,
    color: '#232B38',
    flexWrap: 'wrap',
    maxWidth: '100%',
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
    fontSize: 20,
    color: '#377DFF',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
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
    paddingHorizontal: 8,
    paddingBottom: 8,
    backgroundColor: '#fff',
    minHeight: 56,
  },
  input: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 15,
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
  sendBtnDisabled: {
    backgroundColor: '#A0AEC0',
  },
}); 