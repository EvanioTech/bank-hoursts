import React, {useState} from 'react';
import { StyleSheet, View, Modal } from 'react-native';
import { Input,  Layout,Text, Button,IndexPath, Select, SelectItem  } from '@ui-kitten/components';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format, min } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import styles from './styles';






  const AddHours = () => {
            const navigation = useNavigation();

    const [date, setDate] = useState(new Date());
            const [show, setShow] = useState(false);

            const onChange = (event, selectedDate) => {
              const currentDate = selectedDate || date;
              setShow(false);
              setDate(currentDate);
          };
  
          const showDatepicker = () => {
              setShow(true);
          };
    
    const formatDate = (date) => {
      return format(date, 'dd/MM/yyyy', { locale: ptBR });
    };
    const [horaEntra, setHoraEntra] = useState('');
    const [minEntra, setMinEntra] = useState('');
    const [horaSai, setHoraSai] = useState('');
    const [minSai, setMinSai] = useState('');
    const [horaExtra, setHoraExtra] = useState('');
    const [minExtra, setMinExtra] = useState('');


    const [motivo, setMotivo] = useState('');

    const [showModal, setShowModal] = useState(false);

    const saveDataToLocalStorage = async (data) => {
      try {
        const jsonValue = JSON.stringify(data);
        await AsyncStorage.setItem('@bank_hours', jsonValue);  // Aqui está a chave
      } catch (e) {
        console.error('Failed to save data to local storage', e);
      }
    };
    

    return (
      <Layout style={styles.container} >
      <View style={styles.titleContainer}>
      <Text category='h3'>Informe a data</Text>
      </View>
      <View style={styles.rowContainer}>
      <Input
      onPress={showDatepicker}
      style={styles.inputDate}
      value={formatDate(date)}
      
      />
      {show && (
      <DateTimePicker
        testID="dateTimePicker"
        value={date}
        mode="date"
        display="default"
        onChange={onChange}
        locale="pt-BR"
      />
      )}
      </View>
      <View style={styles.titleContainer}>
      <Text category='h3'>Horário de Início</Text>
      </View>
      <View style={styles.rowContainer}>
      <Input
      style={styles.input}
      placeholder='Horas'
      value={horaEntra}
      onChangeText={nextValue => setHoraEntra(nextValue)}
      keyboardType='numeric'
      />
      <Input
      style={styles.input}
      placeholder='Minutos'
      value={minEntra}
      onChangeText={nextValue => setMinEntra(nextValue)}
      keyboardType='numeric'
      />
      </View>
      <View style={styles.titleContainer}>
      <Text category='h3'>Horário de Saída</Text>
      </View>
      <View style={styles.rowContainer}>
      <Input
      style={styles.input}
      placeholder='Horas'
      value={horaSai}
      onChangeText={nextValue => setHoraSai(nextValue)}
      keyboardType='numeric'
      />
      <Input
      style={styles.input}
      placeholder='Minutos'
      value={minSai}
      onChangeText={nextValue => setMinSai(nextValue)}
      keyboardType='numeric'
      />
      </View>
      <View style={styles.titleContainer}>
      <Text category='h3'>Horas Extras</Text>
      </View>
      <View style={styles.rowContainer}>
      <Input
      style={styles.input}
      placeholder='Horas'
      value={horaExtra}
      onChangeText={nextValue => setHoraExtra(nextValue)}
      keyboardType='numeric'
      />
      <Input
      style={styles.input}
      placeholder='Minutos'
      value={minExtra}
      onChangeText={nextValue => setMinExtra(nextValue)}
      keyboardType='numeric'
      />
      </View>
      <View style={styles.titleContainer}>
      <Text category='h3'>Motivo</Text>
      </View>
      <View style={styles.rowContainer}>
      <Input
      style={styles.inputDate}
      placeholder='ex: Montagem de Máquinas novas'
      value={motivo}
      onChangeText={nextValue => setMotivo(nextValue)}
      />
      </View>
      <View style={styles.btnContainer}>
      <Button
      style={styles.button}
      appearance='outline'
      status='primary'
      size='large'
      
      onPress={() => setShowModal(true)}
      >
      Salvar
      </Button>
      
      <Modal
      visible={showModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowModal(false)}
      >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
        <Text category='h2' style={styles.txt}>Resumo</Text>
        <Text style={styles.txt}>Data: {formatDate(date)}</Text>
        <Text style={styles.txt}>Horário de Início: {horaEntra}:{minEntra}</Text>
        <Text style={styles.txt}>Horário de Saída: {horaSai}:{minSai}</Text>
        <Text style={styles.txt}>Horas Extras: {horaExtra}:{minExtra}</Text>
        <Text style={styles.txt}>Motivo: {motivo}</Text>
        <Button
  style={{width: '90%', justifyContent: 'center', alignItems: 'center', textAlign: 'center', marginLeft: 15,margin: 5}}
  appearance='outline'
  status='primary'

  onPress={async () => {
    if (!horaEntra || !minEntra || !horaSai || !minSai || !motivo || !horaExtra || !minExtra) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    if (horaEntra > 23 || horaSai > 23 || horaExtra > 23) {
      alert('O valor máximo para horas é 23.');
      return;
    }

    if (minEntra > 59 || minSai > 59 || minExtra > 59) {
      alert('O valor máximo para minutos é 59.');
      return;
    }
    

    const data = {
      date: formatDate(date),
      horaEntra,
      minEntra,
      horaSai,
      minSai,
      motivo,
      horaExtra,
      minExtra,
    };

    // Verificar se já existe um registro com a mesma data
    const existingData = await AsyncStorage.getItem('@bank_hours');
    let newData = existingData ? JSON.parse(existingData) : [];
    if (!Array.isArray(newData)) {
      newData = [];
    }
    const isDateExists = newData.some(item => item.date === data.date);
    if (isDateExists) {
      alert('Já existe um registro com esta data.');
      return;
    }
    try {
      const existingData = await AsyncStorage.getItem('@bank_hours');
      let newData = existingData ? JSON.parse(existingData) : [];
      if (!Array.isArray(newData)) {
        newData = [];
      }
      newData.push(data);
      // Salvar no AsyncStorage
      await saveDataToLocalStorage(newData);
      
      // Resetar os campos após salvar
      setDate(new Date());
             setHoraEntra('');
             setMinEntra('');
             setHoraSai('');
             setMinSai('');
             setMotivo('');
              setHoraExtra('');
              setMinExtra('');
              setShowModal(false);
            navigation.navigate('Bank');
      
    } catch (e) {
      console.error('Falha ao salvar dados no local storage', e);
    }
  }}
>
  Salvar
</Button>
        <Button
        style={{width: '90%', justifyContent: 'center', alignItems: 'center', textAlign: 'center', marginLeft: 15}}
        appearance='outline'
        status='primary'
        
        onPress={() => setShowModal(false)}
        >
        Fechar
        </Button>
        </View>
      </View>
      </Modal>
      
      
      </View>
      <View style={styles.btnContainer}>   
      <Button
       style={{width: '80%', justifyContent: 'center'}}
        appearance='outline'
         status='danger'
          size='large'
           onPress={() => {
             setDate(new Date());
             setHoraEntra('');
             setMinEntra('');
             setHoraSai('');
             setMinSai('');
             setMotivo('');
             setHoraExtra('');
             setMinExtra('');
           }}>
      Limpar
      </Button>
      </View>
      
      </Layout>
    );
  };


export  {AddHours};