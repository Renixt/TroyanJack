import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ImageBackground, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation }) {
  const [name, setName] = useState('');
  const [fichas, setFichas] = useState('');


  //recuperar los datos de asyncStorage
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const savedName = await AsyncStorage.getItem('name');
        const savedFichas = await AsyncStorage.getItem('fichas');

        if (savedName) setName(savedName);
        if (savedFichas) setFichas(savedFichas);
        console.log('use state')

      } catch (error) {
        console.log('error al cargar los datos de async storage', error);
      }
    };
    loadUserData();
  }, []);

 const handleStart = async () => {
    const savedName = await AsyncStorage.getItem('name');
    console.log(savedName);
    const savedFichas = await AsyncStorage.getItem('fichas');

    if (name) {
      if (name === savedName) {
        await AsyncStorage.setItem('fichas', savedFichas);
        console.log(fichas);
        await AsyncStorage.setItem('playerName', savedName);
        navigation.navigate('Selection', { playerName: savedName });
        console.log('viejo usuario');


      } else {
        console.log('nuevo usuario');

        const initialFichas = '500';
        setFichas(initialFichas);
        await AsyncStorage.setItem('fichas', fichas);
        const savedFichas = await AsyncStorage.getItem('fichas');
        await AsyncStorage.setItem('playerName', name);
        console.log(`Nuevo usuario: ${name}, fichas: ${savedFichas}`);
        navigation.navigate('Selection', { playerName: name , fichas: fichas});
      }
     
    } else {
      Alert.alert('Advertencia', 'Por favor, ingresa tu nombre');
    }
  }; 

 /* const handleStart = async () => {
    if(name === ''){
    alert('Porfavor ingresa tu nombre')
  }else{
    try{
      await AsyncStorage.setItem('playerName', name);
      await AsyncStorage.setItem('playerFichas', fichas);
      alert('Dato guardado correctamente')
      navigation.navigate('Selection', { playerName: name, playerFichas: fichas }); //manda al siguiente navigation
      console.log(`Nombre: ${playerName}, Fichas ${playerFichas}`);

    } catch (error){
      console.log('ERROR AL GUARDAR LOS DATOS EN AS', error);
    }

    }
  }; */
 

 
 
 
  return (
    <ImageBackground
      source={require('./pantallah.jpg')}
      style={styles.container}
    >
      <Text style={styles.title}>Bienvenido al Troyanjack</Text>
      <TextInput
        style={styles.input}
        placeholder="¿Cómo quieres que te llamen?"
        placeholderTextColor="#888"
        value={name}
        onChangeText={setName}
      />


      <TouchableOpacity style={styles.button} onPress={handleStart}>
        <Text style={styles.buttonText}>Continuar</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Centra el contenido en la pantalla
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20, // Ajuste el margen inferior para el título
    color: '#FFD700', // Color dorado
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
  },
  input: {
    width: '80%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 30,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#FFD700',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: {
    color: '#fff', // Color dorado
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
