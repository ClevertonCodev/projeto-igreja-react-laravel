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
import AlaForm from './src/views/alas/AlasForm';
import Alas from './src/views/alas/IndexAlas';
import Tipos from './src/views/tipo-veiculos/IndexTipoV';
import TipoForm from './src/views/tipo-veiculos/TipoVForm';
import VeiculoForm from './src/views/veiculos/VeiculoForm';
import IndexVeiculos from './src/views/veiculos/IndexVeiculos';
import CaravanaForm from './src/views/caravanas/CaravanasForm';
import IndexCaravanas from './src/views/caravanas/indexCaravanas';
import { logout } from './src/services/api/Auth/Auth';

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
      <Drawer.Screen name="Estacas">
        {props => (
          <ProtectedRoute>
            <IndexEstacas {...props} />
          </ProtectedRoute>
        )}
      </Drawer.Screen>
      <Drawer.Screen name="Alas">
        {props => (
          <ProtectedRoute>
            <Alas {...props} />
          </ProtectedRoute>
        )}
      </Drawer.Screen>
      <Drawer.Screen name="Tipos veículos">
        {props => (
          <ProtectedRoute>
            <Tipos {...props} />
          </ProtectedRoute>
        )}
      </Drawer.Screen>
      <Drawer.Screen name="Veículos">
        {props => (
          <ProtectedRoute>
            <IndexVeiculos {...props} />
          </ProtectedRoute>
        )}
      </Drawer.Screen>
      <Drawer.Screen name="Caravanas">
        {props => (
          <ProtectedRoute>
            <IndexCaravanas {...props} />
          </ProtectedRoute>
        )}
      </Drawer.Screen>
      <Drawer.Screen
        name="Sair"
        options={{ drawerLabel: 'Sair' }}
        component={({ navigation }) => {
          logout(navigation);
          return null;
        }}
      />
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
        <Stack.Screen name='Ala'>
          {props => (
            <ProtectedRoute>
              <AlaForm {...props} />
            </ProtectedRoute>
          )}
        </Stack.Screen>
        <Stack.Screen name='Tipo veículo'>
          {props => (
            <ProtectedRoute>
              <TipoForm {...props} />
            </ProtectedRoute>
          )}
        </Stack.Screen>
        <Stack.Screen name='Veículo'>
          {props => (
            <ProtectedRoute>
              <VeiculoForm {...props} />
            </ProtectedRoute>
          )}
        </Stack.Screen>
        <Drawer.Screen name="Caravana">
          {props => (
            <ProtectedRoute>
              <CaravanaForm {...props} />
            </ProtectedRoute>
          )}
        </Drawer.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
