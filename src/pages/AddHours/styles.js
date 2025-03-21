import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
      textAlign: 'center',
      
    },
    modalContent: {
      padding: 16,
      backgroundColor: 'white',
      width: '90%',
      borderRadius: 8,
    },
    txt: {
      marginBottom: 10,
      color: 'black',
    },
  
    container: {
      flex:1,
      padding: 16,
     
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 128,
      
    },
    input: {
      margin: 2,
    },
    inputDate: {
      margin: 6,
      width: '80%',
      alignItems: 'center',
      justifyContent: 'center',
      alignContent: 'center',
    },
    rowContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      
    },
    titleContainer: {
      marginBottom: 10,
      marginTop: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    btnContainer: {
      marginTop: 10,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    button: {
      margin: 0,
      width: '80%',
      
    },
    
    
  });

export default styles;