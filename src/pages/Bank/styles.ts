import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  dataContainer: {
    flex: 1,
    marginBottom: 20,
  },
  itemContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  feriadoContainer: {
    backgroundColor: '#fff8e1', // Cor amarela clara para destacar feriados
    borderLeftWidth: 5,
    borderLeftColor: '#ffc107', // Cor amarela para borda
  },
  dataText: {
    fontSize: 16,
    marginBottom: 5,
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 10,
  },
  button: {
    marginVertical: 5,
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  totalsContainer: {
    marginBottom: 20,
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  // Adicione outros estilos conforme necessário
});