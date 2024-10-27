import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import RouteScreen from './screens/RouteScreen';
import StartNavigationScreen from './screens/StartNavigationScreen';
import { registerRootComponent } from 'expo';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Route" component={RouteScreen} />
        <Stack.Screen name="StartNavigation" component={StartNavigationScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

registerRootComponent(App);
  