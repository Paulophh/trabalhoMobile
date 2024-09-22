import { useRouter } from 'expo-router';
import React from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';

const HomeScreen = () => {

  const router = useRouter()
  const goNextScreen = () => {
    router.push("/tamagotchiRegister")
  }

  return (
    <View style={styles.container}>
      <Text>Bem-vindo ao Tamagotchi App!</Text>
      <Button title='Iniciar Tamagotchi' onPress={goNextScreen}/>
    </View>
  );
};

const styles  = StyleSheet.create({
  container : {
    flex: 1, 
    alignItems: "center",
    marginTop: 100
  },

})

export default HomeScreen;
