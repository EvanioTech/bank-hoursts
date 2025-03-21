

import { NavigationContainer } from '@react-navigation/native';
import { Routes } from './src/routes';
import React from 'react';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Layout, Text } from '@ui-kitten/components';






export default function App() {
  return (
   <NavigationContainer>
      <ApplicationProvider {...eva} theme={eva.dark}>
       
        <Routes />
        
      </ApplicationProvider>

      
    </NavigationContainer>
    
  );
}











