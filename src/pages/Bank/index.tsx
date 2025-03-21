import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Layout, Button } from "@ui-kitten/components";
import * as Linking from 'expo-linking';
import { useFocusEffect } from '@react-navigation/native';
import styles from './styles';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  BankTabs: undefined;
};

type BankScreenNavigationProp = StackNavigationProp<RootStackParamList, 'BankTabs'>;

interface BankData {
  date: string;
  horaEntra: string;
  minEntra: string;
  horaSai: string;
  minSai: string;
  motivo: string;
  horaExtra: string;
  minExtra: string;
}

const Bank: React.FC = () => {
  const navigation = useNavigation<BankScreenNavigationProp>();
  const [savedData, setSavedData] = useState<BankData[]>([]);
  const [totalHours, setTotalHours] = useState<string>("0h 0m");

  // Recarrega os dados toda vez que a tela for aberta
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const value = await AsyncStorage.getItem('@bank_hours');
          if (value !== null) {
            const parsedData = JSON.parse(value) as BankData[];
            setSavedData(parsedData);
          }
        } catch (error) {
          console.error(error);
        }
      };

      fetchData();
    }, [])
  );

  useEffect(() => {
    if (savedData && savedData.length >= 0) {
      let totalHours = 0;
      let totalMinutes = 0;

      savedData.forEach((data) => {
        totalHours += parseInt(data.horaExtra, 10);
        totalMinutes += parseInt(data.minExtra, 10);
      });

      // Converte minutos em horas e minutos
      totalHours += Math.floor(totalMinutes / 60);
      totalMinutes = totalMinutes % 60;

      setTotalHours(`${totalHours}h ${totalMinutes}m`);
    }
  }, [savedData]);

  const handleDelete = async (indexToDelete: number) => {
    Alert.alert(
      "Confirmar exclusão",
      "Tem certeza que deseja excluir este item?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Excluir",
          onPress: async () => {
            try {
              const updatedData = savedData.filter((_, index) => index !== indexToDelete);
              await AsyncStorage.setItem('@bank_hours', JSON.stringify(updatedData));
              setSavedData(updatedData);
            } catch (error) {
              console.error("Erro ao excluir o item:", error);
            }
          }
        }
      ]
    );
  };

  const handleExportToWhatsApp = async () => {
    let message: string = "Banco de Horas:\n\n";
    let totalHours: number = 0;
    let totalMinutes: number = 0;

    savedData.forEach((data) => {
      message += `
        Data: ${data.date}
        Horário de Início: ${data.horaEntra}:${data.minEntra}
        Horário de Saída: ${data.horaSai}:${data.minSai}
        Motivo: ${data.motivo}
        Horas Extras: ${data.horaExtra}:${data.minExtra}
        ----------------------
      `;

      totalHours += parseInt(data.horaExtra, 10);
      totalMinutes += parseInt(data.minExtra, 10);
    });

    totalHours += Math.floor(totalMinutes / 60);
    totalMinutes = totalMinutes % 60;

    message += `\nTotal de Horas Extras: ${totalHours}h ${totalMinutes}m\n`;

    const encodedMessage = encodeURIComponent(message);
    const url = `whatsapp://send?text=${encodedMessage}`;

    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error("Erro ao abrir o WhatsApp:", error);
    }
  };

  const handleExportToGmail = async () => {
    let message = "Banco de Horas:\n\n";
    let totalHours = 0;
    let totalMinutes = 0;

    savedData.forEach((data) => {
      message += `
        Data: ${data.date}
        Horário de Início: ${data.horaEntra}:${data.minEntra}
        Horário de Saída: ${data.horaSai}:${data.minSai}
        Horas Extras: ${data.horaExtra}:${data.minExtra}
        Motivo: ${data.motivo}
        ----------------------
      `;

      totalHours += parseInt(data.horaExtra, 10);
      totalMinutes += parseInt(data.minExtra, 10);
    });

    totalHours += Math.floor(totalMinutes / 60);
    totalMinutes = totalMinutes % 60;

    message += `\nTotal de Horas Extras: ${totalHours}h ${totalMinutes}m\n`;

    const subject = "Horas Extras";
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(message);

    const url = `mailto:?subject=${encodedSubject}&body=${encodedBody}`;

    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error("Erro ao abrir o Gmail:", error);
    }
  };

  return (
    <Layout style={styles.container}>
      <Text style={styles.title}>Banco de Horas</Text>
      {savedData.length > 0 ? (
        <ScrollView style={styles.dataContainer}>
          {savedData.map((data, index) => (
            <View key={index} style={styles.itemContainer}>
              <Text style={styles.dataText}>Data: {data.date}</Text>
              <Text style={styles.dataText}>Horário de Início: {data.horaEntra}:{data.minEntra}</Text>
              <Text style={styles.dataText}>Horário de Saída: {data.horaSai}:{data.minSai}</Text>
              <Text style={styles.dataText}>Horas Extras: {data.horaExtra}:{data.minExtra}</Text>
              <Text style={styles.dataText}>Motivo: {data.motivo}</Text>
              <View style={styles.separator}></View>
              <Button
                style={styles.button}
                appearance='outline'
                status='danger'
                onPress={() => handleDelete(index)}
              >
                Excluir
              </Button>
            </View>
          ))}
        </ScrollView>
      ) : (
        <Text style={styles.noDataText}>Nenhum dado salvo</Text>
      )}
      <Text style={styles.toralH}>Total de Horas Extras: {totalHours}</Text>

      <Button
        style={styles.button}
        appearance='outline'
        status='success'
        onPress={handleExportToWhatsApp}
      >
        Enviar para WhatsApp
      </Button>
      <Button
        style={styles.button}
        appearance='outline'
        status='warning'
        onPress={handleExportToGmail}
      >
        Enviar para Gmail
      </Button>
      <Button
        style={styles.button}
        appearance='outline'
        status='danger'
        onPress={async () => {
          Alert.alert(
            "Confirmar limpeza",
            "Tem certeza que deseja limpar todos os dados?",
            [
              {
                text: "Cancelar",
                style: "cancel"
              },
              {
                text: "Limpar",
                onPress: async () => {
                  try {
                    await AsyncStorage.removeItem('@bank_hours');
                    setSavedData([]);
                    setTotalHours("0h 0m");
                  } catch (error) {
                    console.error("Erro ao limpar o banco de dados:", error);
                  }
                }
              }
            ]
          );
        }}
      >
        Limpar Banco de Horas
      </Button>
    </Layout>
  );
};

export { Bank };