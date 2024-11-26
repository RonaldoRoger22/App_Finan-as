import React, { useState } from 'react';
import { StyleSheet, TextInput, View, Text, TouchableOpacity, FlatList, Alert, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';  
import * as SQLite from 'expo-sqlite';  


const openDatabase = () => {
  const db = SQLite.openDatabase('contas.db');
  return db;
};

export default function SignIn({ navigation }) {
  const [accounts, setAccounts] = useState([]);
  const [accountName, setAccountName] = useState('');
  const [accountValue, setAccountValue] = useState('');
  const [expenseLimit, setExpenseLimit] = useState(1000); 


  const createTable = () => {
    const db = openDatabase();
    db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS contas (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          value REAL NOT NULL
        );`
      );
    });
  };

  const addAccount = () => {
    if (accountName && accountValue) {
      const value = parseFloat(accountValue);
      if (!isNaN(value) && value <= expenseLimit) {
        const db = openDatabase();
        db.transaction(tx => {
          tx.executeSql(
            'INSERT INTO contas (name, value) VALUES (?, ?)',
            [accountName, value],
            (_, result) => {
              setExpenseLimit(expenseLimit - value);
              setAccountName('');
              setAccountValue('');
              fetchAccounts(); 
            },
            (tx, error) => console.log('Erro ao inserir conta', error)
          );
        });
      } else {
        Alert.alert('Erro', 'Valor excede o limite disponível ou é inválido!');
      }
    }
  };

 
  const removeAccount = (accountId, accountValue) => {
    const db = openDatabase();
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM contas WHERE id = ?',
        [accountId],
        (_, result) => {
          setExpenseLimit(expenseLimit + accountValue);
          fetchAccounts();  
        },
        (tx, error) => console.log('Erro ao remover conta', error)
      );
    });
  };

 
  const fetchAccounts = () => {
    const db = openDatabase();
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM contas',
        [],
        (_, { rows }) => {
          const fetchedAccounts = rows._array;
          setAccounts(fetchedAccounts);
        },
        (tx, error) => console.log('Erro ao ler contas', error)
      );
    });
  };


  React.useEffect(() => {
    createTable();
    fetchAccounts(); 
  }, []);

 
  const getTotalAccounts = () => accounts.reduce((acc, account) => acc + account.value, 0).toFixed(2);

  return (
    <ImageBackground
      source={{ uri: 'https://static8.depositphotos.com/1010263/1023/i/450/depositphotos_10236704-stock-photo-blue-background.jpg' }}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Controle de Contas</Text>
        <TextInput 
          placeholder="Nome da Conta" 
          style={styles.input} 
          value={accountName} 
          onChangeText={setAccountName} 
        />
        <TextInput 
          placeholder="Valor da Conta" 
          keyboardType="decimal-pad" 
          style={styles.input} 
          value={accountValue} 
          onChangeText={setAccountValue} 
        />
        <TouchableOpacity style={styles.addButton} onPress={addAccount}>
          <Icon name="plus" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Adicionar Conta</Text>
        </TouchableOpacity>
        <FlatList
          data={accounts}
          renderItem={({ item }) => (
            <View style={styles.accountItem}>
              <Text style={styles.accountText}>{item.name} - R$ {item.value.toFixed(2)}</Text>
              <TouchableOpacity onPress={() => removeAccount(item.id, item.value)}>
                <Icon name="trash" size={20} color="red" />
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
        />
        <Text style={styles.total}>Total: R$ {getTotalAccounts()}</Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: { 
    flex: 1,  
    padding: 20 
  },
  title: { 
    fontSize: 26, 
    fontWeight: 'bold', 
    marginBottom: 20, 
    color: '#fff' 
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#34495e', 
    padding: 10, 
    marginBottom: 10, 
    borderRadius: 5, 
    backgroundColor: 'white', 
    color: '#333' 
  },
  addButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: '#4a90e2', 
    borderRadius: 5, 
    padding: 10, 
    marginBottom: 20 
  },
  addButtonText: { 
    color: 'white', 
    marginLeft: 10, 
    fontSize: 16 
  },
  accountItem: { 
    padding: 15, 
    backgroundColor: 'white', 
    borderRadius: 8, 
    shadowColor: '#34495e', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 6, 
    marginBottom: 10, 
    flexDirection: 'row', 
    justifyContent: 'space-between' 
  },
  accountText: { 
    fontSize: 16, 
    color: '#34495e' 
  },
  total: { 
    marginTop: 20, 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#fff' 
  },
});
