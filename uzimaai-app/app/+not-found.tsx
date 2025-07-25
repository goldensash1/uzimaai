import { Link, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';

/**
 * NotFoundScreen is displayed when a user navigates to a route that does not exist.
 * It provides a message and a link to return to the home screen.
 */
export default function NotFoundScreen() {
  return (
    <>
      {/* Set the screen title to 'Oops!' */}
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        {/* Display not found message */}
        <Text style={styles.title}>This screen doesn't exist.</Text>

        {/* Link to navigate back to the home screen */}
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}

/**
 * Styles for the NotFoundScreen components.
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
