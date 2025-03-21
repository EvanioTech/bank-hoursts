import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import { Home } from '../pages/Home';
import { Bank } from '../pages/Bank';
import { AddHours } from '../pages/AddHours';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Feather from "react-native-vector-icons/Feather"


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();




const BankTabs = () => {
    return (
        <Tab.Navigator
        screenOptions={{
            headerShown: false,
            tabBarHideOnKeyboard: true,
            tabBarShowLabel: false,
            tabBarActiveTintColor: '#FFF',

            tabBarStyle:{
                backgroundColor: '#202225',
                borderTopWidth: 0,
            }
        }}>
             <Tab.Screen 
             name="Add" 
             component={AddHours}
             options={{
                tabBarIcon: ({ color, size}) => {
                    return <Feather name= "edit" color={color} size={size} />
                }
              }}
             />
            <Tab.Screen name="Bank"
             component={Bank}
             options={{
                tabBarIcon: ({ color, size}) => {
                    return <Feather name= "archive" color={color} size={size} />
                }
              }}
             />
           
        </Tab.Navigator>
    );
};

const Routes = () => {
    return (
        <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="BankTabs" component={BankTabs} />
            
        </Stack.Navigator>
    );
};


export  {Routes};