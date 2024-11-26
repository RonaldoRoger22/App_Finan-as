import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Switch, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';  

export default function Login({ setLogged }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigation = useNavigation(); 

  const handleLogin = () => {
    if (email === 'user@example.com' && password === 'password') {
      setLogged(true);  
    } else {
      alert('Credenciais incorretas');
    }
  };

  return (
    <ImageBackground 
      source={{ uri: 'https://static8.depositphotos.com/1010263/1023/i/450/depositphotos_10236704-stock-photo-blue-background.jpg' }} 
      style={styles.background}
    >
      <View style={styles.wrapper}>
        <Text style={styles.heading}>Easy Management</Text>

        <View style={styles.inputField}>
          <TextInput
            style={styles.input}
            placeholder="Digite seu e-mail"
            placeholderTextColor="#fff"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputField}>
          <TextInput
            style={styles.input}
            placeholder="Digite sua senha"
            placeholderTextColor="#fff"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <View style={styles.forget}>
          <View style={styles.rememberMe}>
            <Switch value={rememberMe} onValueChange={setRememberMe} />
            <Text style={styles.rememberText}>Lembre de mim</Text> 
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Acessar</Text>
        </TouchableOpacity>

        <View style={styles.register}>
          <Text style={styles.registerText}>Não tem conta?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
            <Text style={styles.link}>Registrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapper: {
    width: 300,
    padding: 30,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputField: {
    borderBottomWidth: 2,
    borderBottomColor: '#ccc',
    marginBottom: 20,
  },
  input: {
    color: '#fff',
    height: 40,
    paddingHorizontal: 5,
  },
  forget: {
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  rememberMe: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rememberText: {
    color: '#fff',
    marginLeft: 10,
  },
  link: {
    color: '#efefef',
    textDecorationLine: 'underline',
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  register: {
    marginTop: 20,
    alignItems: 'center',
  },
  registerText: {
    color: '#fff',
  },
});
