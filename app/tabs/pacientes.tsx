import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { collection, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { db } from '../../firebase';

type Paciente = {
  id: string;
  nombre: string;
  edad: number;
  tipoSangre: string;
  alergias: string;
};

export default function Pacientes() {
  const router = useRouter();
  const [pacientes, setPacientes] = useState<Paciente[]>([]);

  useEffect(() => {
  const unsubscribe = onSnapshot(collection(db, 'pacientes'), (snapshot) => {
    const lista: Paciente[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<Paciente, 'id'>)
    }));

    setPacientes(lista);
  });

  return () => unsubscribe();
}, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Lista de Pacientes</Text>

      <FlatList
        data={pacientes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.nombre}>{item.nombre}</Text>
            <Text>Edad: {item.edad}</Text>
            <Text>Tipo de sangre: {item.tipoSangre}</Text>
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/crear_paciente')}
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
  flex: 1,
  backgroundColor: '#f5f6fa',
  padding: 20,
},

title: {
  fontSize: 24,
  fontWeight: 'bold',
  marginBottom: 15,
},

card: {
  backgroundColor: 'white',
  padding: 15,
  borderRadius: 12,
  marginBottom: 12,
  elevation: 3,
},

nombre: {
  fontWeight: 'bold',
  fontSize: 16,
  marginBottom: 4,
},

fab: {
  position: 'absolute',
  bottom: 30,
  right: 30,
  backgroundColor: '#1E88E5',
  width: 60,
  height: 60,
  borderRadius: 30,
  justifyContent: 'center',
  alignItems: 'center',
  elevation: 6,
},
  button: {
  marginTop: 20,
  backgroundColor: '#2563eb',
  padding: 15,
  borderRadius: 10,
  alignItems: 'center',
},

buttonText: {
  color: 'white',
  fontWeight: 'bold',
  fontSize: 16,
},

});