import { getAuth } from "firebase/auth";
import {
    collection,
    doc,
    onSnapshot,
    query,
    updateDoc,
    where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { db } from "../../firebase";

export default function Citas() {
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

  // 🎨 COLOR SEGÚN ESTADO
  const getColorEstado = (estado: string) => {
    if (estado === "pendiente") return "#f59e0b";
    if (estado === "atendido") return "#10b981";
    if (estado === "cancelado") return "#ef4444";
    return "#6b7280";
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agenda</Text>

      <FlatList
        data={citas}
        keyExtractor={(item: any) => item.id}
        renderItem={({ item }: any) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => cambiarEstado(item)}
          >
            <View style={styles.row}>
              <View>
                <Text style={styles.nombre}>
                  {item.nombrePaciente}
                </Text>

                <Text style={styles.fecha}>
                  {item.fecha} - {item.hora}
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
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
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
});