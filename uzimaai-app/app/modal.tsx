import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';

/**
 * ModalScreen displays a modal with a title, separator, and additional info.
 * The status bar style adapts for iOS to ensure visibility.
 */
const ModalScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Modal title */}
      <Text style={styles.title}>Modal</Text>
      {/* Separator line */}
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      {/* Additional screen info */}
      <EditScreenInfo path="app/modal.tsx" />
      {/* Status bar styling for iOS */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
};

export default ModalScreen;

/**
 * Styles for ModalScreen components.
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
