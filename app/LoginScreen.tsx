import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    // Trigger authentication on component mount
    handleAuthentication();
  }, []);

  const handleAuthentication = async () => {
    setIsAuthenticating(true);
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (!hasHardware) {
        Alert.alert('Error', 'Biometric authentication is not available.');
        setIsAuthenticating(false);
        return;
      }

      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!isEnrolled) {
        Alert.alert('Error', 'No biometrics are registered. Please enroll your biometrics first.');
        setIsAuthenticating(false);
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to access your expenditures',
        fallbackLabel: 'Use passcode',
      });

      if (result.success) {
        navigation.replace('HomeScreen');
      } else {
        Alert.alert('Authentication Failed', 'Please try again.');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      Alert.alert('Error', 'Something went wrong during authentication.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <View style={styles.container}>
      {isAuthenticating ? (
        <ActivityIndicator size="large" color="#143D60" />
      ) : (
        <TouchableOpacity style={styles.retryButton} onPress={handleAuthentication}>
          <Text style={styles.buttonText}>Retry Authentication</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E9E9E9',
  },
  retryButton: {
    backgroundColor: '#143D60',
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
