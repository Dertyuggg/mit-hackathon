import React, { useEffect, useState } from 'react';
import { View, Text, Alert, ActivityIndicator, StyleSheet, TouchableOpacity, Vibration } from 'react-native';
import * as Location from 'expo-location';

export default function LocationScreen() {
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Enable location permission in settings');
        setLoading(false);
        return;
      }

      try {
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
        setLocation(loc.coords);
      } catch (error) {
        console.log('Location error:', error);
        Alert.alert('Error', 'Could not fetch location');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text>Loading location...</Text>
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.container}>
        <Text>Location not available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>Latitude: {location.latitude.toFixed(5)}</Text>
      <Text>Longitude: {location.longitude.toFixed(5)}</Text>
      <TouchableOpacity
        style={styles.sosButton}
        onPress={() => {
          Vibration.vibrate(500);
          Alert.alert('SOS', 'ALERT SENT!');
        }}
        accessibilityLabel="Send SOS alert"
      >
        <Text style={styles.sosText}>SOS</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  sosButton: {
    marginTop: 32,
    backgroundColor: 'red',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  sosText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 24,
    letterSpacing: 2,
  },
});
