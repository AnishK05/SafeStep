import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { getDirections } from '../../utils/directionsService';

type Coordinates = {
  latitude: number;
  longitude: number;
};

const StartNavigationScreen = () => {
  const route = useRoute();
  const { currentLocation, destination } = route.params as {
    currentLocation: Coordinates;
    destination: Coordinates;
  };

  const [currentStep, setCurrentStep] = useState<number>(0);
  const [instructions, setInstructions] = useState<string[]>([]);

  useEffect(() => {
    // Fetch step-by-step instructions from Google Directions API
    getDirections(currentLocation, destination).then(route => {
      const steps = route.legs[0].steps.map((step: any) => step.html_instructions);
      setInstructions(steps); // Store instructions for navigation
    }).catch(error => {
      console.error('Error fetching directions:', error);
    });
  }, [currentLocation, destination]);

  const handleNextStep = () => {
    if (currentStep < instructions.length - 1) {
      setCurrentStep(currentStep + 1); // Move to the next step
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.instruction}>{instructions[currentStep]}</Text>
      <Button title="Next Step" onPress={handleNextStep} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  instruction: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default StartNavigationScreen;
