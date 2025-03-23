import { StyleSheet } from "react-native";

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


  export default styles;