import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Modal, Alert, Switch } from 'react-native';
import { Input, Layout, Text, Button } from '@ui-kitten/components';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import styles from './styles';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Bank: undefined;
};

type AddHoursScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Bank'>;

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
  
}

const AddHours: React.FC = () => {
  const navigation = useNavigation<AddHoursScreenNavigationProp>();

  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [saidaNormal, setSaidaNormal] = useState('');
  const [minSaidaNormal, setMinSaidaNormal] = useState('');
  const [horaSai, setHoraSai] = useState('');
  const [minSai, setMinSai] = useState('');
  const [motivo, setMotivo] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [horaExtraDiurna, setHoraExtraDiurna] = useState('0');
  const [minExtraDiurna, setMinExtraDiurna] = useState('0');
  const [horaExtraNoturna, setHoraExtraNoturna] = useState('0');
  const [minExtraNoturna, setMinExtraNoturna] = useState('0');
  

  const onChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
  };

  const showDatepicker = () => {
    setShow(true);
  };

  const formatDate = (date: Date) => {
    return format(date, 'dd/MM/yyyy', { locale: ptBR });
  };

  const saveDataToLocalStorage = async (data: BankData[]) => {
    try {
      const jsonValue = JSON.stringify(data);
      await AsyncStorage.setItem('@bank_hours', jsonValue);
    } catch (e) {
      console.error('Failed to save data to local storage', e);
    }
  };

  const calculateExtraHours = () => {
    if (!saidaNormal || !minSaidaNormal || !horaSai || !minSai) return;

    // Converter horários para minutos
    const saidaNormalMinutes = parseInt(saidaNormal) * 60 + parseInt(minSaidaNormal);
    let saidaRealMinutes = parseInt(horaSai) * 60 + parseInt(minSai);

    // Se a saída real for menor que a saída normal, assume que passou para o dia seguinte
    if (saidaRealMinutes < saidaNormalMinutes) {
      saidaRealMinutes += 24 * 60;
    }

    // Total de minutos extras
    const extraMinutes = saidaRealMinutes - saidaNormalMinutes;
    
    if (extraMinutes <= 0) {
      setHoraExtraDiurna('0');
      setMinExtraDiurna('0');
      setHoraExtraNoturna('0');
      setMinExtraNoturna('0');
      return;
    }

    // Definir períodos noturnos (22:00 às 5:00)
    const nightStart = 22 * 60 ; // 22:00 em minutos
    const nightEnd = 5 * 60; // 5:00 em minutos

    let nightMinutes = 0;
    let dayMinutes = 0;

    // Se terminar no período noturno (22:00-23:59)
    if (saidaRealMinutes > nightStart) {
      nightMinutes = saidaRealMinutes - Math.max(saidaNormalMinutes, nightStart);
    }
    // Se terminar no período noturno após meia-noite (00:00-05:00)
    else if (saidaRealMinutes <= nightEnd) {
      nightMinutes = saidaRealMinutes;
      if (saidaNormalMinutes < nightStart) {
        nightMinutes += (24 * 60 - nightStart); // Adiciona minutos desde 22:01 até 00:00
      }
    }

    // Garantir que não ultrapasse o total de minutos extras
    nightMinutes = Math.min(nightMinutes, extraMinutes);
    dayMinutes = extraMinutes - nightMinutes;

    setHoraExtraDiurna(Math.floor(dayMinutes / 60).toString());
    setMinExtraDiurna((dayMinutes % 60).toString());
    setHoraExtraNoturna(Math.floor(nightMinutes / 60).toString());
    setMinExtraNoturna((nightMinutes % 60).toString());
  };

  useEffect(() => {
    calculateExtraHours();
  }, [saidaNormal, minSaidaNormal, horaSai, minSai]);

  return (
    <Layout style={styles.container}>
      <View style={styles.titleContainer}>
        <Text category='h5'>Informe a data</Text>
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
        <Text category='h5'>Horário de Saída Normal</Text>
      </View>
      <View style={styles.rowContainer}>
        <Input
          style={styles.input}
          placeholder='Horas'
          value={saidaNormal}
          onChangeText={setSaidaNormal}
          keyboardType='numeric'
        />
        <Input
          style={styles.input}
          placeholder='Minutos'
          value={minSaidaNormal}
          onChangeText={setMinSaidaNormal}
          keyboardType='numeric'
        />
      </View>
      <View style={styles.titleContainer}>
        <Text category='h5'>Horário de Saída Real</Text>
      </View>
      <View style={styles.rowContainer}>
        <Input
          style={styles.input}
          placeholder='Horas'
          value={horaSai}
          onChangeText={setHoraSai}
          keyboardType='numeric'
        />
        <Input
          style={styles.input}
          placeholder='Minutos'
          value={minSai}
          onChangeText={setMinSai}
          keyboardType='numeric'
        />
      </View>
      <View style={styles.titleContainer}>
        <Text category='h5'>Horas Extras Diurnas</Text>
      </View>
      <View style={styles.rowContainer}>
        <Input
          style={styles.input}
          placeholder='Horas'
          value={horaExtraDiurna}
          onChangeText={setHoraExtraDiurna}
          keyboardType='numeric'
          disabled
        />
        <Input
          style={styles.input}
          placeholder='Minutos'
          value={minExtraDiurna}
          onChangeText={setMinExtraDiurna}
          keyboardType='numeric'
          disabled
        />
      </View>
      <View style={styles.titleContainer}>
        <Text category='h5'>Horas Extras Noturnas</Text>
      </View>
      <View style={styles.rowContainer}>
        <Input
          style={styles.input}
          placeholder='Horas'
          value={horaExtraNoturna}
          onChangeText={setHoraExtraNoturna}
          keyboardType='numeric'
          disabled
        />
        <Input
          style={styles.input}
          placeholder='Minutos'
          value={minExtraNoturna}
          onChangeText={setMinExtraNoturna}
          keyboardType='numeric'
          disabled
        />
      </View>
   

      <View style={styles.titleContainer}>
        <Text category='h5'>Motivo</Text>
      </View>
      <View style={styles.rowContainer}>
        <Input
          style={styles.inputDate}
          placeholder='ex: Montagem de Máquinas novas'
          value={motivo}
          onChangeText={setMotivo}
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
              <Text style={styles.txt}>Saída Normal: {saidaNormal.padStart(2, '0')}:{minSaidaNormal.padStart(2, '0')}</Text>
              <Text style={styles.txt}>Saída Real: {horaSai.padStart(2, '0')}:{minSai.padStart(2, '0')}</Text>
              <Text style={styles.txt}>Horas Extras Diurnas: {horaExtraDiurna.padStart(2, '0')}h {minExtraDiurna.padStart(2, '0')}m</Text>
              <Text style={styles.txt}>Horas Extras Noturnas: {horaExtraNoturna.padStart(2, '0')}h {minExtraNoturna.padStart(2, '0')}m</Text>
              <Text style={styles.txt}>Motivo: {motivo}</Text>
              <Button
                style={{ width: '90%', justifyContent: 'center', alignItems: 'center', textAlign: 'center', marginLeft: 15, margin: 5 }}
                appearance='outline'
                status='primary'
                onPress={async () => {
                  if (!saidaNormal || !minSaidaNormal || !horaSai || !minSai || !motivo) {
                    alert('Por favor, preencha todos os campos.');
                    return;
                  }

                  if (parseInt(saidaNormal) > 23 || parseInt(horaSai) > 23) {
                    alert('O valor máximo para horas é 23.');
                    return;
                  }

                  if (parseInt(minSaidaNormal) > 59 || parseInt(minSai) > 59) {
                    alert('O valor máximo para minutos é 59.');
                    return;
                  }

                  const data: BankData = {
                    date: formatDate(date),
                    saidaNormal,
                    minSaidaNormal,
                    horaSai,
                    minSai,
                    motivo,
                    horaExtraDiurna,
                    minExtraDiurna,
                    horaExtraNoturna,
                    minExtraNoturna,
                  };

                  const existingData = await AsyncStorage.getItem('@bank_hours');
                  let newData = existingData ? JSON.parse(existingData) : [];
                  if (!Array.isArray(newData)) {
                    newData = [];
                  }
                  const isDateExists = newData.some((item: BankData) => item.date === data.date);
                  if (isDateExists) {
                    alert('Já existe um registro com esta data.');
                    return;
                  }

                  try {
                    newData.push(data);
                    await saveDataToLocalStorage(newData);

                    setDate(new Date());
                    setSaidaNormal('');
                    setMinSaidaNormal('');
                    setHoraSai('');
                    setMinSai('');
                    setMotivo('');
                    setHoraExtraDiurna('0');
                    setMinExtraDiurna('0');
                    setHoraExtraNoturna('0');
                    setMinExtraNoturna('0');
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
                style={{ width: '90%', justifyContent: 'center', alignItems: 'center', textAlign: 'center', marginLeft: 15 }}
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
          style={{ width: '80%', justifyContent: 'center' }}
          appearance='outline'
          status='danger'
          size='large'
          onPress={() => {
            setDate(new Date());
            setSaidaNormal('');
            setMinSaidaNormal('');
            setHoraSai('');
            setMinSai('');
            setMotivo('');
            setHoraExtraDiurna('0');
            setMinExtraDiurna('0');
            setHoraExtraNoturna('0');
            setMinExtraNoturna('0');
          }}
        >
          Limpar
        </Button>
      </View>
    </Layout>
  );
};

export { AddHours };