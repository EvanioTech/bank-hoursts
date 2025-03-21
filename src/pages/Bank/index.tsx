import React, { useState, useEffect, useCallback } from "react"; 
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Layout, Button } from "@ui-kitten/components";
import * as Linking from 'expo-linking';
import { useFocusEffect } from '@react-navigation/native'; 
import styles from './styles';

const Bank = () => {
  const navigation = useNavigation();
  const [savedData, setSavedData] = useState([]);
  const [totalHours, setTotalHours] = useState(0);

  

  // Recarrega os dados toda vez que a tela for aberta
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const value = await AsyncStorage.getItem('@bank_hours');
          if (value !== null) {
            const parsedData = JSON.parse(value);
            setSavedData(parsedData);  // Salvando como array de objetos
            
            console.log("Dados carregados com !");
            
            
            
          }
        } catch (error) {
          console.error(error);
        }
      };

      fetchData(); // Carrega os dados toda vez que a tela for focada
      

        }, [])  // O array com savedData significa que a função será chamada quando savedData mudar
  );

  useEffect(() => {
    if (savedData && savedData.length >=0){ // Verifica se savedData está carregado e não está vazio
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
      console.log("Total de horas extras calculado!");
    }
  }, [savedData]); // Só calcula quando savedData for alterado

  const handleDelete = async (indexToDelete) => {
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
              setSavedData(updatedData);  // Atualiza o estado para refletir a exclusão
              
              console.log("Item excluído com sucesso!");
            } catch (error) {
              console.error("Erro ao excluir o item:", error);
            }
          }
        }
      ]
    );
  };

  // Função para limpar o banco de dados
 

  // Função para formatar os dados para o WhatsApp
 

const handleExportToWhatsApp = async () => {
  let message : string = "Banco de Horas:\n\n";
  let totalHours : number = 0;
  let totalMinutes : number = 0;

  // Adiciona os dados de cada dia no banco de dados
  savedData.forEach((data) => {
    message += `
      Data: ${data.date}
      Horário de Início: ${data.horaEntra}:${data.minEntra}
      Horário de Saída: ${data.horaSai}:${data.minSai}
      Motivo: ${data.motivo}
      Horas Extras: ${data.horaExtra}:${data.minExtra}

      ----------------------
    `;

    // Calcula o total de horas extras
    totalHours += parseInt(data.horaExtra, 10);
    totalMinutes += parseInt(data.minExtra, 10);
  });

  // Converte total de minutos para horas e minutos
  totalHours += Math.floor(totalMinutes / 60);
  totalMinutes = totalMinutes % 60;

  // Adiciona o total de horas extras ao final da mensagem
  message += `\nTotal de Horas Extras: ${totalHours}h ${totalMinutes}m\n`;

  const encodedMessage = encodeURIComponent(message); // Codificando a string para URL

  // Abrindo o WhatsApp com a mensagem formatada
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
  
    // Adiciona os dados de cada dia no banco de dados
    savedData.forEach((data) => {
      message += `
        Data: ${data.date}
        Horário de Início: ${data.horaEntra}:${data.minEntra}
        Horário de Saída: ${data.horaSai}:${data.minSai}
        Horas Extras: ${data.horaExtra}:${data.minExtra}
        Motivo: ${data.motivo}
        ----------------------
      `;
  
      // Calcula o total de horas extras
      totalHours += parseInt(data.horaExtra, 10);
      totalMinutes += parseInt(data.minExtra, 10);
    });
  
    // Converte total de minutos para horas e minutos
    totalHours += Math.floor(totalMinutes / 60);
    totalMinutes = totalMinutes % 60;
  
    // Adiciona o total de horas extras ao final da mensagem
    message += `\nTotal de Horas Extras: ${totalHours}h ${totalMinutes}m\n`;
  
    const subject = "Horas Extras"; // Assunto do e-mail
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(message);
  
    // Abrindo o Gmail com a mensagem formatada
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
                onPress={() => handleDelete(index)}  // Passando o índice para identificar o item a ser excluído
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
                    setTotalHours(0);
                    console.log("Banco de dados limpo com sucesso!");
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
