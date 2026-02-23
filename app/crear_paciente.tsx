import { useRouter } from 'expo-router';
import { addDoc, collection } from 'firebase/firestore';
import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity
} from 'react-native';
import { db } from '../firebase';

export default function CrearPaciente() {
  const router = useRouter();

  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState('');
  const [tipoSangre, setTipoSangre] = useState('');
  const [alergias, setAlergias] = useState('');

  const guardarPaciente = async () => {
    if (!nombre || !edad) {
      Alert.alert('Error', 'Nombre y edad son obligatorios');
      return;
    }

    try {
      await addDoc(collection(db, 'pacientes'), {
        nombre,
        edad: Number(edad),
        tipoSangre,
        alergias,
        createdAt: new Date()
      });

      Alert.alert('Éxito', 'Paciente creado correctamente');
      router.back();
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el paciente');
      console.log(error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Nuevo Paciente</Text>

      <Text style={styles.label}>Nombre completo</Text>
<TextInput
  style={styles.input}
  value={nombre}
  onChangeText={setNombre}
/>

<Text style={styles.label}>Edad</Text>
<TextInput
  keyboardType="numeric"
  style={styles.input}
  value={edad}
  onChangeText={setEdad}
/>

<Text style={styles.label}>Tipo de sangre</Text>
<TextInput
  style={styles.input}
  value={tipoSangre}
  onChangeText={setTipoSangre}
/>

<Text style={styles.label}>Alergias</Text>
<TextInput
  style={styles.input}
  value={alergias}
  onChangeText={setAlergias}
/>

      <TouchableOpacity style={styles.button} onPress={guardarPaciente}>
        <Text style={styles.buttonText}>Guardar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f6fa'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2
  },
  button: {
    backgroundColor: '#1E88E5',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold'
  },

  label: {
  fontSize: 14,
  fontWeight: '600',
  marginBottom: 6,
  marginTop: 10,
  color: '#333'
},

});