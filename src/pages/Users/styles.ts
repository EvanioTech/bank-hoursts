import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 36,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      color: '#FFF',
    },
    dataContainer: {
      width: '100%',
      paddingHorizontal: 16,
    },
    itemContainer: {
      marginBottom: 20,
      padding: 16,
      backgroundColor: '#fff',
      borderRadius: 8,
      shadowColor: '#000',
      justifyContent: 'center',
        alignItems: 'center',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 5, // For Android shadow
    },
    dataText: {
      fontSize: 18,
      color: '#333',
      marginBottom: 10,
    },
    noDataText: {
      fontSize: 18,
      color: '#888',
      marginBottom: 20,
    },
    separator: {
      height: 1,
      backgroundColor: '#ddd',
      marginTop: 10,
    },
    button: {
      marginVertical: 10,
    },
    toralH: {
      fontSize: 18,
      color: '#FFF',
      marginBottom: 10,
    },
  });

    export default styles;