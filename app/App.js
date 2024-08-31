import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './src/views/Login';
import Dashboard from './src/views/Dashboard';
import { authGuard } from './src/services/api/Auth/Authorization';
const Stack = createNativeStackNavigator();

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await authGuard();
      console.log(token);
      setIsAuthenticated(!!token);
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return isAuthenticated ? children : <Login />;
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen
          name="Dashboard"
          component={() => (
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          )}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

