import { useTodoDatabase } from "@/app/database/initService";
import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View, Image, TouchableOpacity } from "react-native";
import * as ImagePicker from 'expo-image-picker';

export default function TamagotchiRegister() {
  const [title, setTitle] = useState<string>("");
  const [imageUri, setImageUri] = useState<string>("");
  const { createTamagotchi } = useTodoDatabase();

  const openImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Precisamos de permissão para acessar a galeria!');
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri); 
    }
  };

  const create = async () => {
    try {
      const res = await createTamagotchi({ name: title, imageUrl: imageUri });
      console.log("criado")
    } catch (error) {
      console.log("Erro ao criar o tamagotchi");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={{ marginBottom: 10, fontSize: 20 }}>Nome do Tamagotchi</Text>
      <TextInput
        placeholder="Nome do Tamagotchi"
        value={title}
        onChangeText={(text) => setTitle(text)}
        style={styles.input}
      />
      <TouchableOpacity style={styles.button} onPress={openImagePicker}>
        <Text style={styles.buttonText}>Selecionar Imagem</Text>
      </TouchableOpacity>

            {imageUri ? (
              <Image
                source={{ uri: imageUri }}
                style={{ width: 150, height: 150, borderRadius: 50 }}
              />
            ) : (
              <Text>Nenhuma imagem selecionada</Text>
            )}
      <TouchableOpacity style={styles.button} onPress={create}>
        <Text style={styles.buttonText}>Criar Tomagochi</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 20,
    width: '100%',
    padding: 10,
    backgroundColor: "#665f5f",
    borderRadius: 10,
  },
    button: {
      backgroundColor: '#2196F3',
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
      margin: 10
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
    },
  });
  

