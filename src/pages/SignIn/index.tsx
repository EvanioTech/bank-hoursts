import { Animated, StyleSheet, Image, StyleProp, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Layout, Button, Text } from '@ui-kitten/components';
import { StatusBar } from 'expo-status-bar';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  BankTabs: undefined;
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'BankTabs'>;

const SignIn: React.FC = () => {
  const navigate = useNavigation<HomeScreenNavigationProp>();

  const position = new Animated.Value(0); // Valor inicial da posição

  // Função para animar o título
  const animateTitle = () => {
    Animated.loop( // Faz a animação se repetir infinitamente
      Animated.sequence([ // Cria uma sequência de animações
        Animated.timing(position, {
          toValue: 50, // Move o título 50 unidades à direita
          duration: 1000, // A duração para a animação de ir
          useNativeDriver: true, // Usa o driver nativo para melhor performance
        }),
        Animated.timing(position, {
          toValue: -50, // Move o título 50 unidades à esquerda
          duration: 1000, // A duração para a animação de voltar
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  // Inicia a animação assim que o componente é montado
  useEffect(() => {
    animateTitle();
  }, []);

  return (
    <Layout style={styles.container}>
      <Animated.Text
        style={[
          styles.title,
          {
            transform: [{ translateX: position }], // Aplica a animação de movimento
          },
        ]}
      >
        T.I Fácil
      </Animated.Text>
      <Image source={require('./../../assets/d.png')} style={styles.img} />

      <Button
        style={styles.button}
        appearance='outline'
        status='control'
        size='giant'
        onPress={() => navigate.navigate('BankTabs')}
      >
        Cadastrar
      </Button>
      <Text style={styles.footerText}>
        Direitos reservados Octadroid © {new Date().getFullYear()}
      </Text>
      <StatusBar style="light" />
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 46,
    fontWeight: 'bold',
    color: '#fff',
  } ,
  img: {
    width: 380,
    height: 360,
    marginVertical: 20,
  } ,
  button: {
    marginTop: 40,
    width: '80%',
  } ,
  footerText: {
    position: 'absolute',
    bottom: 20,
    color: '#fff',
    fontSize: 16,
  } ,
});

export { SignIn };