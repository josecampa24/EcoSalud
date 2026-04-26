import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { getAuth } from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import Svg, {
  Defs,
  Path,
  Stop,
  LinearGradient as SvgLinearGradient,
} from "react-native-svg";
import { db } from "../../firebase";

type Registro = {
  id: string;
  nombre: string;
  uid?: string;
  edad: number;
  unidadEdad?: "años" | "meses";
  foto?: string;
  createdAt?: any;
  esDuplicado?: boolean;
  pacienteId?: string;
};

export default function Registros() {
  const { width } = Dimensions.get("window");

  function SvgTop() {
    return (
      <Svg width={width} height={220} viewBox={`0 0 ${width} 220`}>
        <Defs>
          <SvgLinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor="#1E5FA8" stopOpacity="1" />
            <Stop offset="1" stopColor="#2FA4D6" stopOpacity="1" />
          </SvgLinearGradient>
        </Defs>
        <Path
          d={`M0 0 H${width} V150 C${width} 150 ${width * 0.7} 220 ${
            width * 0.5
          } 180 C${width * 0.3} 140 0 200 0 200 V0 Z`}
          fill="url(#grad)"
        />
      </Svg>
    );
  }
  const router = useRouter();
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [busqueda, setBusqueda] = useState("");

useEffect(() => {
  const user = getAuth().currentUser;

  if (!user) return;

  const q = query(
    collection(db, "registros"),
    where("uid", "==", user.uid)
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const lista = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Registro, "id">),
    }));

    // 🔥 aplicar duplicados aquí
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

  const eliminarPaciente = (item: Registro) => {
    Alert.alert(
      "Eliminar paciente",
      "Se eliminarán TODAS las consultas de este paciente. ¿Continuar?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              const pacienteId = item.pacienteId || item.id;

              const q = query(
                collection(db, "registros"),
                where("pacienteId", "==", pacienteId),
              );

              const snapshot = await getDocs(q);

              const eliminaciones = snapshot.docs.map((docItem) =>
                deleteDoc(doc(db, "registros", docItem.id)),
              );

              await Promise.all(eliminaciones);
            } catch (error) {
              console.error("Error eliminando paciente:", error);
            }
          },
        },
      ],
    );
  };

  const renderRightActions = (item: Registro) => {
    return (
      <TouchableOpacity
        style={styles.deleteSwipe}
        onPress={() => eliminarPaciente(item)}
      >
        <Ionicons name="trash" size={24} color="#fff" />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.mainContainer}>
      {/* SVG FONDO */}
      <View style={styles.containerSvg}>
        <SvgTop />
      </View>

      <SafeAreaView style={styles.container}>
        {/* HEADER */}
        <View style={styles.headerContent}>
          <Text style={styles.title}>Lista de Pacientes</Text>
          <Text style={styles.subtitle}>Registros recientes</Text>
        </View>

        {/* BUSCADOR */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#6b7280" />
          <TextInput
            placeholder="Buscar por nombre..."
            value={busqueda}
            onChangeText={setBusqueda}
            style={styles.searchInput}
          />
        </View>

        {/* LISTA */}
        <FlatList
          data={registrosFiltrados}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <Swipeable renderRightActions={() => renderRightActions(item)}>
              <TouchableOpacity
                style={[styles.card, item.esDuplicado && styles.cardDuplicado]}
                onPress={() => router.push(`/patient-profile?id=${item.id}`)}
              >
                <View style={styles.row}>
                  <View style={styles.avatar}>
                    {item.foto ? (
                      <Image
                        source={{ uri: item.foto }}
                        style={styles.avatarImg}
                      />
                    ) : (
                      <Ionicons name="person" size={24} color="#fff" />
                    )}
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={styles.nombre}>{item.nombre}</Text>
                    <Text>
                      Edad: {item.edad}{" "}
                      {item.unidadEdad === "meses" ? "mes(es)" : "año(s)"}
                    </Text>

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
            </Swipeable>
          )}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 0,
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
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

  deleteSwipe: {
    backgroundColor: "#ef4444",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    borderRadius: 12,
    marginBottom: 12,
  },

  mainContainer: {
    flex: 1,
    backgroundColor: "#f5f6fa",
  },

  containerSvg: {
    position: "absolute",
    top: 0,
    width: "100%",
  },

  headerContent: {
    marginTop: 100,
    alignItems: "center",
    marginBottom: 15,
  },

  subtitle: {
    color: "#e0f2fe",
    fontSize: 13,
  },
});
