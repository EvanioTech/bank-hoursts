import { Input } from "@ui-kitten/components";
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
    input: {
     width: '85%',
     marginTop: 20,
    } ,
    button: {
      marginTop: 40,
      width: '60%',
    } ,
    footerText: {
      position: 'absolute',
      bottom: 20,
      color: '#fff',
      fontSize: 16,
    } ,
  });


  export default styles;