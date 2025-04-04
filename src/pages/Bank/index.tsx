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
  saidaNormal: string;
  minSaidaNormal: string;
  horaSai: string;
  minSai: string;
  motivo: string;
  horaExtraDiurna: string;
  minExtraDiurna: string;
  horaExtraNoturna: string;
  minExtraNoturna: string;
  isFeriado: boolean;
  horasFeriadoDiurno: string;
  minutosFeriadoDiurno: string;
  horasFeriadoNoturno: string;
  minutosFeriadoNoturno: string;
}

const Bank: React.FC = () => {
  const navigation = useNavigation<BankScreenNavigationProp>();
  const [savedData, setSavedData] = useState<BankData[]>([]);
  const [totalDiurno, setTotalDiurno] = useState<string>("0h 0m");
  const [totalNoturno, setTotalNoturno] = useState<string>("0h 0m");
  const [totalFeriadoDiurno, setTotalFeriadoDiurno] = useState<string>("0h 0m");
  const [totalFeriadoNoturno, setTotalFeriadoNoturno] = useState<string>("0h 0m");
  const [totalFeriados, setTotalFeriados] = useState<number>(0);

  const safeFormat = (value: string | undefined, defaultValue: string = '00') => {
    return value ? value.padStart(2, '0') : defaultValue;
  };

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
          Alert.alert("Erro", "Não foi possível carregar os dados.");
        }
      };

      fetchData();
    }, [])
  );

  useEffect(() => {
    if (savedData && savedData.length > 0) {
      let totalDiurnoHours = 0;
      let totalDiurnoMinutes = 0;
      let totalNoturnoHours = 0;
      let totalNoturnoMinutes = 0;
      let totalFeriadoDiurnoHours = 0;
      let totalFeriadoDiurnoMinutes = 0;
      let totalFeriadoNoturnoHours = 0;
      let totalFeriadoNoturnoMinutes = 0;
      let feriadosCount = 0;

      savedData.forEach((data) => {
        if (data.isFeriado) {
          feriadosCount++;
          totalFeriadoDiurnoHours += parseInt(data.horasFeriadoDiurno || '0', 10);
          totalFeriadoDiurnoMinutes += parseInt(data.minutosFeriadoDiurno || '0', 10);
          totalFeriadoNoturnoHours += parseInt(data.horasFeriadoNoturno || '0', 10);
          totalFeriadoNoturnoMinutes += parseInt(data.minutosFeriadoNoturno || '0', 10);
        } else {
          totalDiurnoHours += parseInt(data.horaExtraDiurna || '0', 10);
          totalDiurnoMinutes += parseInt(data.minExtraDiurna || '0', 10);
          totalNoturnoHours += parseInt(data.horaExtraNoturna || '0', 10);
          totalNoturnoMinutes += parseInt(data.minExtraNoturna || '0', 10);
        }
      });

      // Converter minutos em horas para diurno
      totalDiurnoHours += Math.floor(totalDiurnoMinutes / 60);
      totalDiurnoMinutes = totalDiurnoMinutes % 60;

      // Converter minutos em horas para noturno
      totalNoturnoHours += Math.floor(totalNoturnoMinutes / 60);
      totalNoturnoMinutes = totalNoturnoMinutes % 60;

      // Converter minutos em horas para feriado diurno
      totalFeriadoDiurnoHours += Math.floor(totalFeriadoDiurnoMinutes / 60);
      totalFeriadoDiurnoMinutes = totalFeriadoDiurnoMinutes % 60;

      // Converter minutos em horas para feriado noturno
      totalFeriadoNoturnoHours += Math.floor(totalFeriadoNoturnoMinutes / 60);
      totalFeriadoNoturnoMinutes = totalFeriadoNoturnoMinutes % 60;

      setTotalDiurno(`${totalDiurnoHours}h ${totalDiurnoMinutes}m`);
      setTotalNoturno(`${totalNoturnoHours}h ${totalNoturnoMinutes}m`);
      setTotalFeriadoDiurno(`${totalFeriadoDiurnoHours}h ${totalFeriadoDiurnoMinutes}m`);
      setTotalFeriadoNoturno(`${totalFeriadoNoturnoHours}h ${totalFeriadoNoturnoMinutes}m`);
      setTotalFeriados(feriadosCount);
    } else {
      setTotalDiurno("0h 0m");
      setTotalNoturno("0h 0m");
      setTotalFeriadoDiurno("0h 0m");
      setTotalFeriadoNoturno("0h 0m");
      setTotalFeriados(0);
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
              Alert.alert("Erro", "Não foi possível excluir o item.");
            }
          }
        }
      ]
    );
  };

  const handleExportToWhatsApp = async () => {
    if (savedData.length === 0) {
      Alert.alert("Aviso", "Não há dados para exportar.");
      return;
    }

    let message = "Horas Extras:\n\n";
    let totalDiurnoHours = 0;
    let totalDiurnoMinutes = 0;
    let totalNoturnoHours = 0;
    let totalNoturnoMinutes = 0;
    let totalFeriadoDiurnoHours = 0;
    let totalFeriadoDiurnoMinutes = 0;
    let totalFeriadoNoturnoHours = 0;
    let totalFeriadoNoturnoMinutes = 0;
    let feriadosCount = 0;

    savedData.forEach((data) => {
      message += `
Data: ${data.date} ${data.isFeriado ? '(FERIADO)' : ''}
Saída Normal: ${safeFormat(data.saidaNormal)}:${safeFormat(data.minSaidaNormal)}
Saída Real: ${safeFormat(data.horaSai)}:${safeFormat(data.minSai)}
${data.isFeriado ? 
  `Horas Feriado Diurnas: ${safeFormat(data.horasFeriadoDiurno)}h ${safeFormat(data.minutosFeriadoDiurno)}m
Horas Feriado Noturnas: ${safeFormat(data.horasFeriadoNoturno)}h ${safeFormat(data.minutosFeriadoNoturno)}m` : 
  `Extras Diurnas: ${safeFormat(data.horaExtraDiurna)}h ${safeFormat(data.minExtraDiurna)}m
Extras Noturnas: ${safeFormat(data.horaExtraNoturna)}h ${safeFormat(data.minExtraNoturna)}m`}
Motivo: ${data.motivo || 'Não informado'}
---------------------
      `;

      if (data.isFeriado) {
        feriadosCount++;
        totalFeriadoDiurnoHours += parseInt(data.horasFeriadoDiurno || '0', 10);
        totalFeriadoDiurnoMinutes += parseInt(data.minutosFeriadoDiurno || '0', 10);
        totalFeriadoNoturnoHours += parseInt(data.horasFeriadoNoturno || '0', 10);
        totalFeriadoNoturnoMinutes += parseInt(data.minutosFeriadoNoturno || '0', 10);
      } else {
        totalDiurnoHours += parseInt(data.horaExtraDiurna || '0', 10);
        totalDiurnoMinutes += parseInt(data.minExtraDiurna || '0', 10);
        totalNoturnoHours += parseInt(data.horaExtraNoturna || '0', 10);
        totalNoturnoMinutes += parseInt(data.minExtraNoturna || '0', 10);
      }
    });

    // Converter minutos em horas para diurno
    totalDiurnoHours += Math.floor(totalDiurnoMinutes / 60);
    totalDiurnoMinutes = totalDiurnoMinutes % 60;

    // Converter minutos em horas para noturno
    totalNoturnoHours += Math.floor(totalNoturnoMinutes / 60);
    totalNoturnoMinutes = totalNoturnoMinutes % 60;

    // Converter minutos em horas para feriado diurno
    totalFeriadoDiurnoHours += Math.floor(totalFeriadoDiurnoMinutes / 60);
    totalFeriadoDiurnoMinutes = totalFeriadoDiurnoMinutes % 60;

    // Converter minutos em horas para feriado noturno
    totalFeriadoNoturnoHours += Math.floor(totalFeriadoNoturnoMinutes / 60);
    totalFeriadoNoturnoMinutes = totalFeriadoNoturnoMinutes % 60;

    message += `\nTotal de Horas Extras Diurnas: ${totalDiurnoHours}h ${totalDiurnoMinutes}m\n`;
    message += `Total de Horas Extras Noturnas: ${totalNoturnoHours}h ${totalNoturnoMinutes}m\n`;
    message += `\nTotal de Horas Feriado Diurnas: ${totalFeriadoDiurnoHours}h ${totalFeriadoDiurnoMinutes}m\n`;
    message += `Total de Horas Feriado Noturnas: ${totalFeriadoNoturnoHours}h ${totalFeriadoNoturnoMinutes}m\n`;
    message += `\nTotal de Feriados: ${feriadosCount}\n`;

    try {
      const encodedMessage = encodeURIComponent(message);
      const url = `whatsapp://send?text=${encodedMessage}`;
      await Linking.openURL(url);
    } catch (error) {
      console.error("Erro ao abrir o WhatsApp:", error);
      Alert.alert("Erro", "Não foi possível abrir o WhatsApp.");
    }
  };

  const handleExportToGmail = async () => {
    if (savedData.length === 0) {
      Alert.alert("Aviso", "Não há dados para exportar.");
      return;
    }

    let message = " Horas Extras:\n\n";
    let totalDiurnoHours = 0;
    let totalDiurnoMinutes = 0;
    let totalNoturnoHours = 0;
    let totalNoturnoMinutes = 0;
    let totalFeriadoDiurnoHours = 0;
    let totalFeriadoDiurnoMinutes = 0;
    let totalFeriadoNoturnoHours = 0;
    let totalFeriadoNoturnoMinutes = 0;
    let feriadosCount = 0;

    savedData.forEach((data) => {
      message += `
Data: ${data.date} ${data.isFeriado ? '(FERIADO)' : ''}
Saída Normal: ${safeFormat(data.saidaNormal)}:${safeFormat(data.minSaidaNormal)}
Saída Real: ${safeFormat(data.horaSai)}:${safeFormat(data.minSai)}
${data.isFeriado ? 
  `Horas Feriado Diurnas: ${safeFormat(data.horasFeriadoDiurno)}h ${safeFormat(data.minutosFeriadoDiurno)}m
Horas Feriado Noturnas: ${safeFormat(data.horasFeriadoNoturno)}h ${safeFormat(data.minutosFeriadoNoturno)}m` : 
  `Extras Diurnas: ${safeFormat(data.horaExtraDiurna)}h ${safeFormat(data.minExtraDiurna)}m
Extras Noturnas: ${safeFormat(data.horaExtraNoturna)}h ${safeFormat(data.minExtraNoturna)}m`}
Motivo: ${data.motivo || 'Não informado'}
---------------------
      `;

      if (data.isFeriado) {
        feriadosCount++;
        totalFeriadoDiurnoHours += parseInt(data.horasFeriadoDiurno || '0', 10);
        totalFeriadoDiurnoMinutes += parseInt(data.minutosFeriadoDiurno || '0', 10);
        totalFeriadoNoturnoHours += parseInt(data.horasFeriadoNoturno || '0', 10);
        totalFeriadoNoturnoMinutes += parseInt(data.minutosFeriadoNoturno || '0', 10);
      } else {
        totalDiurnoHours += parseInt(data.horaExtraDiurna || '0', 10);
        totalDiurnoMinutes += parseInt(data.minExtraDiurna || '0', 10);
        totalNoturnoHours += parseInt(data.horaExtraNoturna || '0', 10);
        totalNoturnoMinutes += parseInt(data.minExtraNoturna || '0', 10);
      }
    });

    // Converter minutos em horas para diurno
    totalDiurnoHours += Math.floor(totalDiurnoMinutes / 60);
    totalDiurnoMinutes = totalDiurnoMinutes % 60;

    // Converter minutos em horas para noturno
    totalNoturnoHours += Math.floor(totalNoturnoMinutes / 60);
    totalNoturnoMinutes = totalNoturnoMinutes % 60;

    // Converter minutos em horas para feriado diurno
    totalFeriadoDiurnoHours += Math.floor(totalFeriadoDiurnoMinutes / 60);
    totalFeriadoDiurnoMinutes = totalFeriadoDiurnoMinutes % 60;

    // Converter minutos em horas para feriado noturno
    totalFeriadoNoturnoHours += Math.floor(totalFeriadoNoturnoMinutes / 60);
    totalFeriadoNoturnoMinutes = totalFeriadoNoturnoMinutes % 60;

    message += `\nTotal de Horas Extras Diurnas: ${totalDiurnoHours}h ${totalDiurnoMinutes}m\n`;
    message += `Total de Horas Extras Noturnas: ${totalNoturnoHours}h ${totalNoturnoMinutes}m\n`;
    message += `\nTotal de Horas Feriado Diurnas: ${totalFeriadoDiurnoHours}h ${totalFeriadoDiurnoMinutes}m\n`;
    message += `Total de Horas Feriado Noturnas: ${totalFeriadoNoturnoHours}h ${totalFeriadoNoturnoMinutes}m\n`;
    message += `\nTotal de Feriados: ${feriadosCount}\n`;

    try {
      const subject = "Relatório de Horas Extras";
      const encodedSubject = encodeURIComponent(subject);
      const encodedBody = encodeURIComponent(message);
      const url = `mailto:?subject=${encodedSubject}&body=${encodedBody}`;
      await Linking.openURL(url);
    } catch (error) {
      console.error("Erro ao abrir o Gmail:", error);
      Alert.alert("Erro", "Não foi possível abrir o Gmail.");
    }
  };

  const handleClearAll = async () => {
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
              setTotalDiurno("0h 0m");
              setTotalNoturno("0h 0m");
              setTotalFeriadoDiurno("0h 0m");
              setTotalFeriadoNoturno("0h 0m");
              setTotalFeriados(0);
            } catch (error) {
              console.error("Erro ao limpar o banco de dados:", error);
              Alert.alert("Erro", "Não foi possível limpar os dados.");
            }
          }
        }
      ]
    );
  };

  return (
    <Layout style={styles.container}>
      <Text style={styles.title}>Banco de Horas</Text>
      
      {savedData.length > 0 ? (
        <ScrollView style={styles.dataContainer}>
          {savedData.map((data, index) => (
            <View 
              key={index} 
              style={[
                styles.itemContainer, 
                data.isFeriado ? styles.feriadoContainer : null
              ]}
            >
              <Text style={styles.dataText}>Data: {data.date} {data.isFeriado ? '(FERIADO)' : ''}</Text>
              <Text style={styles.dataText}>Saída Normal: {safeFormat(data.saidaNormal)}:{safeFormat(data.minSaidaNormal)}</Text>
              <Text style={styles.dataText}>Saída Real: {safeFormat(data.horaSai)}:{safeFormat(data.minSai)}</Text>
              {data.isFeriado ? (
                <>
                  <Text style={styles.dataText}>Horas Feriado Diurnas: {safeFormat(data.horasFeriadoDiurno)}h {safeFormat(data.minutosFeriadoDiurno)}m</Text>
                  <Text style={styles.dataText}>Horas Feriado Noturnas: {safeFormat(data.horasFeriadoNoturno)}h {safeFormat(data.minutosFeriadoNoturno)}m</Text>
                </>
              ) : (
                <>
                  <Text style={styles.dataText}>Extras Diurnas: {safeFormat(data.horaExtraDiurna)}h {safeFormat(data.minExtraDiurna)}m</Text>
                  <Text style={styles.dataText}>Extras Noturnas: {safeFormat(data.horaExtraNoturna)}h {safeFormat(data.minExtraNoturna)}m</Text>
                </>
              )}
              <Text style={styles.dataText}>Motivo: {data.motivo || 'Não informado'}</Text>
              <View style={styles.separator} />
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

      <View style={styles.totalsContainer}>
        <Text style={styles.totalText}>Total de Horas Diurnas: {totalDiurno}</Text>
        <Text style={styles.totalText}>Total de Horas Noturnas: {totalNoturno}</Text>
        <Text style={styles.totalText}>Total de Horas Feriado Diurnas: {totalFeriadoDiurno}</Text>
        <Text style={styles.totalText}>Total de Horas Feriado Noturnas: {totalFeriadoNoturno}</Text>
        <Text style={styles.totalText}>Total de Feriados: {totalFeriados}</Text>
      </View>

      <View style={styles.buttonsContainer}>
        <Button
          style={styles.button}
          appearance='outline'
          status='success'
          onPress={handleExportToWhatsApp}
        >
          WhatsApp
        </Button>
        <Button
          style={styles.button}
          appearance='outline'
          status='warning'
          onPress={handleExportToGmail}
        >
          Email
        </Button>
        <Button
          style={styles.button}
          appearance='outline'
          status='danger'
          onPress={handleClearAll}
        >
          Limpar Tudo
        </Button>
      </View>
    </Layout>
  );
};

export { Bank };