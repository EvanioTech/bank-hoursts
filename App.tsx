import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import * as eva from '@eva-design/eva';
import { ApplicationProvider } from '@ui-kitten/components';
import  Routes  from './src/routes';

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <ApplicationProvider {...eva} theme={eva.dark}>
        <Routes />
      </ApplicationProvider>
    </NavigationContainer>
  );
};

export default App;





