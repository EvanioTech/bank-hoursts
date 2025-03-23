import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Feather from 'react-native-vector-icons/Feather';

import { Home } from '../pages/Home';
import { Bank } from '../pages/Bank';
import { AddHours } from '../pages/AddHours';
import { Profile } from '../pages/Users/profile';
import { SignIn } from '../pages/SignIn';
import { SignUp } from '../pages/SignUp';

// Tipagem das rotas
export type RootStackParamList = {
  Home: undefined; 
  BankTabs: undefined; // Navegação em abas (Bank e AddHours)
  SignIn: undefined; // Tela de Login
  SignUp: undefined; // Tela de Cadastro
};

export type BankTabsParamList = {
  Bank: undefined; // Tela do Banco de Horas
  AddHours: undefined; // Tela de Adicionar Horas
  Profile: undefined; // Tela de Perfil
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<BankTabsParamList>();

// Componente das abas (Bank e AddHours)
const BankTabs: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false, // Oculta o cabeçalho
        tabBarHideOnKeyboard: true, // Oculta a barra de abas quando o teclado está aberto
        tabBarShowLabel: false, // Oculta os rótulos das abas
        tabBarActiveTintColor: '#FFF', // Cor do ícone ativo
        tabBarStyle: {
          backgroundColor: '#202225', // Cor de fundo da barra de abas
          borderTopWidth: 0, // Remove a borda superior
        },
      }}
    >
        <Tab.Screen
        name="AddHours"
        component={AddHours}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="plus-circle" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Bank"
        component={Bank}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="archive" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="user" color={color} size={size} />
          ),
        }}
      />
      
    </Tab.Navigator>
  );
};

// Componente principal da navegação em pilha
const AppStack: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      {/* Tela inicial (Home) */}
      <Stack.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }} // Oculta o cabeçalho
      />
      {/* Navegação em abas (BankTabs) */}
      <Stack.Screen
        name="BankTabs"
        component={BankTabs}
        options={{ headerShown: false }} // Oculta o cabeçalho
      />
      
      {/* Tela Login  */}
      <Stack.Screen
        name="SignIn"
        component={SignIn}
        options={{ headerShown: false }} // Oculta o cabeçalho
      />
      
      {/* Tela Cadastro  */}
      <Stack.Screen
        name="SignUp"
        component={SignUp}
        options={{ headerShown: false }} // Oculta o cabeçalho
      />
    </Stack.Navigator>
  );
};

export default AppStack;