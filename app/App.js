import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { authGuard } from './src/services/api/Auth/Authorization';
import Login from './src/views/Login';
import Dashboard from './src/views/Dashboard';
import Register from './src/views/Register';
import EstacaForm from './src/views/estacas/EstacaForm';
import IndexEstacas from './src/views/estacas/IndexEstacas';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const background = '#00496F';
const colorText = '#fff';
const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await authGuard();
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

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator initialRouteName="Dashboard"
      screenOptions={{
        drawerStyle: {
          backgroundColor: background,
          color: colorText
        },
        drawerLabelStyle: {
          color: colorText,
        },
        headerStyle: {
          backgroundColor: background,
        },
        headerTintColor: colorText,
      }}
    >
      <Drawer.Screen name="Dashboard">
        {props => (
          <ProtectedRoute>
            <Dashboard {...props} />
          </ProtectedRoute>
        )}
      </Drawer.Screen>
      {/* <Drawer.Screen name="Estacas">
        {props => (
          <ProtectedRoute>
            <EstacaForm {...props} />
          </ProtectedRoute>
        )}
      </Drawer.Screen> */}
      <Drawer.Screen name="Estacas">
        {props => (
          <ProtectedRoute>
            <IndexEstacas {...props} />
          </ProtectedRoute>
        )}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{
        headerStyle: {
          backgroundColor: background,
        },
        headerTintColor: colorText,
      }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Dashboard" component={DrawerNavigator} options={{ headerShown: false }} />
        <Stack.Screen name='Estaca'>
          {props => (
            <ProtectedRoute>
              <EstacaForm {...props} />
            </ProtectedRoute>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
