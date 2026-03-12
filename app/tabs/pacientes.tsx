import { useRouter } from 'expo-router';
import { collection, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity
} from 'react-native';
import { db } from '../../firebase';

type Registro = {
  id: string;
  nombre: string;
  edad: number;
  altura: number;
  peso: number;
  temperatura: number;
  presion: string;
};

export default function Registros() {
  const router = useRouter();
  const [registros, setRegistros] = useState<Registro[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'registros'), (snapshot) => {
      const lista: Registro[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Registro, 'id'>)
      }));

      setRegistros(lista);
    });

    return () => unsubscribe();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Lista de Registros</Text>

      <FlatList
        data={registros}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/patient-profile?id=${item.id}`)}
          >
            <Text style={styles.nombre}>{item.nombre}</Text>
            <Text>Edad: {item.edad}</Text>
          </TouchableOpacity>
        )}
      />
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
});
