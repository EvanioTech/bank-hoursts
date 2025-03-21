import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Feather from 'react-native-vector-icons/Feather';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Home } from '../pages/Home';
import { Bank } from '../pages/Bank';
import { AddHours } from '../pages/AddHours';

// Tipagem das rotas
export type RootStackParamList = {
    Home: undefined;
    Bank: undefined;
    AddHours: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootStackParamList>();

const BankTabs: React.FC = () => {
    return (
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={{
                headerShown: false,
                tabBarHideOnKeyboard: true,
                tabBarShowLabel: false,
                tabBarActiveTintColor: '#FFF',
                tabBarStyle: {
                    backgroundColor: '#202225',
                    borderTopWidth: 0,
                },
            }}
        >
            <Tab.Screen 
                name="Home" 
                component={Home}
                options={{
                    tabBarIcon: ({ color, size }: { color: string; size: number }) => (
                        <Feather name="home" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen 
                name="AddHours" 
                component={AddHours}
                options={{
                    tabBarIcon: ({ color, size }: { color: string; size: number }) => (
                        <Feather name="plus-circle" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen 
                name="Bank"
                component={Bank} 
                options={{
                    tabBarIcon: ({ color, size }: { color: string; size: number }) => (
                        <Feather name="archive" color={color} size={size} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

export default BankTabs;