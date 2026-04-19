import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { collection, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "../../firebase";

type Registro = {
  id: string;
  nombre: string;
  edad: number;
  foto?: string;
  createdAt?: any;
  esDuplicado?: boolean;
};

export default function Registros() {
  const router = useRouter();
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "registros"), (snapshot) => {
      const lista: Registro[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt || null,
        } as Registro;
      });

      // 🔥 Ordenar por fecha (más reciente primero)
      lista.sort((a, b) => {
        if (!a.createdAt || !b.createdAt) return 0;
        return b.createdAt.seconds - a.createdAt.seconds;
      });

      const listaConDuplicados = marcarDuplicados(lista);
      setRegistros(listaConDuplicados);
    });

    return () => unsubscribe();
  }, []);

  // 🔍 BUSCADOR (nombre + fecha)
  const registrosFiltrados = registros.filter((p) => {
    const texto = busqueda.toLowerCase();

    const nombreMatch = p.nombre.toLowerCase().includes(texto);

    const fechaMatch = p.createdAt
      ? new Date(p.createdAt.seconds * 1000)
          .toLocaleDateString()
          .toLowerCase()
          .includes(texto)
      : false;

    return nombreMatch || fechaMatch;
  });

  // 🧠 DUPLICADOS
  const marcarDuplicados = (lista: Registro[]) => {
    const mapa = new Map<string, number>();

    lista.forEach((p) => {
      const clave = `${p.nombre.trim().toLowerCase()}-${p.edad}`;
      mapa.set(clave, (mapa.get(clave) || 0) + 1);
    });

    return lista.map((p) => {
      const clave = `${p.nombre.trim().toLowerCase()}-${p.edad}`;
      return {
        ...p,
        esDuplicado: (mapa.get(clave) || 0) > 1,
      };
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Lista de Pacientes</Text>

      {/* 🔍 BUSCADOR */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#6b7280" />
        <TextInput
          placeholder="Buscar por nombre..."
          value={busqueda}
          onChangeText={setBusqueda}
          style={styles.searchInput}
        />
      </View>

      <FlatList
        data={registrosFiltrados}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, item.esDuplicado && styles.cardDuplicado]}
            onPress={() => router.push(`/patient-profile?id=${item.id}`)}
          >
            <View style={styles.row}>
              <View style={styles.avatar}>
                {item.foto ? (
                  <Image source={{ uri: item.foto }} style={styles.avatarImg} />
                ) : (
                  <Ionicons name="person" size={24} color="#fff" />
                )}
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.nombre}>{item.nombre}</Text>
                <Text>Edad: {item.edad}</Text>

                <Text style={styles.fecha}>
                  {item.createdAt
                    ? new Date(
                        item.createdAt.seconds * 1000,
                      ).toLocaleDateString()
                    : "Sin fecha"}
                </Text>

                {item.esDuplicado && (
                  <Text style={styles.dupText}>Posible duplicado</Text>
                )}
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f6fa",
    padding: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },

  searchInput: {
    marginLeft: 8,
    flex: 1,
    paddingVertical: 10,
  },

  card: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
  },

  cardDuplicado: {
    borderWidth: 2,
    borderColor: "#f59e0b",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#9ca3af",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "#fff",
    marginRight: 12,
  },

  avatarImg: {
    width: "100%",
    height: "100%",
  },

  nombre: {
    fontWeight: "bold",
    fontSize: 16,
  },

  fecha: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },

  dupText: {
    color: "#f59e0b",
    fontWeight: "600",
    marginTop: 4,
  },
});
