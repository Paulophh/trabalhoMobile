import { useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useTodoDatabase } from "@/app/database/initService"; // Serviço de banco de dados

export default function GamesScreen() {

 
  const [randomNumber, setRandomNumber] = useState(generateRandomNumber());
  const [guess, setGuess] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [message, setMessage] = useState('');

  
 
  function generateRandomNumber() {
    return Math.floor(Math.random() * 100) + 1;
  }

  const checkGuess = async () => {
    const userGuess = parseInt(guess);

    if (isNaN(userGuess)) {
      Alert.alert('Entrada inválida', 'Por favor, insira um número válido!');
      return;
    }

    setAttempts(attempts + 1);

    if (userGuess === randomNumber) {
      Alert.alert(
        'Parabéns!',
        `Você acertou o número ${randomNumber} em ${attempts + 1} tentativas!`,
        [{ text: 'Reiniciar', onPress: resetGame }]
      );
    } else if (userGuess < randomNumber) {
      setMessage('O número é maior.');
    } else {
      setMessage('O número é menor.');
    }

    setGuess(''); 
  };


  const resetGame = () => {
    setRandomNumber(generateRandomNumber());
    setAttempts(0);
    setMessage('');
    setGuess('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Jogo de Adivinhar o Número</Text>
      <Text style={styles.instructions}>Tente adivinhar o número entre 1 e 100!</Text>

      <TextInput
        style={styles.input}
        placeholder="Digite seu palpite"
        keyboardType="numeric"
        value={guess}
        onChangeText={setGuess}
      />

      <Button title="Adivinhar" onPress={checkGuess} />

      {message !== '' && <Text style={styles.message}>{message}</Text>}

      <Text style={styles.attempts}>Tentativas: {attempts}</Text>

      <Button title="Reiniciar Jogo" onPress={resetGame} color="#f00" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  instructions: {
    fontSize: 16,
    marginBottom: 20,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    width: '80%',
    textAlign: 'center',
    borderRadius: 5,
  },
  message: {
    fontSize: 18,
    marginVertical: 20,
    color: '#000',
  },
  attempts: {
    fontSize: 16,
    color: '#555',
  },
});
