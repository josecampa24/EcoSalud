import { Ionicons } from "@expo/vector-icons";
import { getAuth } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import Svg, { Defs, Path, Stop, LinearGradient as SvgLinearGradient } from "react-native-svg";
import { db } from "../../firebase";

export default function Citas() {
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

  const [citas, setCitas] = useState<any[]>([]);

  useEffect(() => {
  
    const user = getAuth().currentUser;
    if (!user) return;

    const q = query(
      collection(db, "citas"),
      where("uid", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // 🔥 ORDENAR POR FECHA Y HORA
      lista.sort((a: any, b: any) => {
        const fechaA = new Date(`${a.fecha}T${a.hora}`);
        const fechaB = new Date(`${b.fecha}T${b.hora}`);
        return fechaA.getTime() - fechaB.getTime();
      });

      setCitas(lista);
    });

    return () => unsubscribe();
  }, []);

    const eliminarCita = (item: any) => {
      Alert.alert(
        "Eliminar cita",
        "¿Seguro que deseas eliminar esta cita?",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Eliminar",
            style: "destructive",
            onPress: async () => {
              try {
                await deleteDoc(doc(db, "citas", item.id));
              } catch (error) {
                console.log(error);
              }
            },
          },
        ]
      );
    };

    const renderRightActions = (item: any) => {
      return (
        <TouchableOpacity
          style={styles.deleteSwipe}
          onPress={() => eliminarCita(item)}
        >
          <Ionicons name="trash" size={24} color="#fff" />
        </TouchableOpacity>
      );
    };

  // 🔥 CAMBIAR ESTADO
  const cambiarEstado = (cita: any) => {
    Alert.alert(
      "Cambiar estado",
      "Selecciona un estado",
      [
        {
          text: "Pendiente",
          onPress: () => actualizarEstado(cita.id, "pendiente"),
        },
        {
          text: "Atendido",
          onPress: () => actualizarEstado(cita.id, "atendido"),
        },
        {
          text: "Cancelado",
          onPress: () => actualizarEstado(cita.id, "cancelado"),
        },
        { text: "Cancelar", style: "cancel" },
      ]
    );
  };

  const actualizarEstado = async (id: string, estado: string) => {
  try {
    await updateDoc(doc(db, "citas", id), {
      estado,
    });
  } catch (error) {
    console.log(error);
  }
  };


  const getColorEstado = (estado: string) => {
    if (estado === "pendiente") return "#f59e0b";
    if (estado === "atendido") return "#10b981";
    if (estado === "cancelado") return "#ef4444";
    return "#6b7280";
  };

      return (
        <View style={styles.mainContainer}>
          <View style={styles.containerSvg}>
            <SvgTop />
          </View>

          <SafeAreaView style={styles.container}>
            <View style={styles.headerContent}>
              <Text style={styles.title}>Citas</Text>
              <Text style={styles.subtitle}>Agenda de pacientes</Text>
            </View>

      <FlatList
        data={citas}
        keyExtractor={(item: any) => item.id}
        renderItem={({ item }: any) => (
          <Swipeable renderRightActions={(progress, dragX) => renderRightActions(item)}>
            <TouchableOpacity
              style={styles.card}
              onPress={() => cambiarEstado(item)}
            >
            
              <View style={styles.row}>
              <View style={styles.avatar}>
                <Ionicons name="calendar" size={22} color="#fff" />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.nombre}>{item.nombrePaciente}</Text>
                <Text style={styles.fecha}>
                  {item.fecha} - {item.motivo} - {item.hora}
                </Text>
              </View>

              <View
                style={[
                  styles.estado,
                  { backgroundColor: getColorEstado(item.estado) },
                ]}
              >
                <Text style={styles.estadoText}>
                  {item.estado}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          </Swipeable>
        )}
      ></FlatList>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    paddingHorizontal: 20,
    paddingTop: 0, },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
  },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 3,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  nombre: {
    fontWeight: "bold",
    fontSize: 16,
  },

  fecha: {
    color: "#6b7280",
    marginTop: 2,
  },

  estado: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },

  estadoText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
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
    marginTop: 2,
    letterSpacing: 0.3,
  },

  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "#1E88E5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  deleteSwipe: {
    backgroundColor: "#ef4444",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    borderRadius: 12,
    marginBottom: 10,
  },  
});
