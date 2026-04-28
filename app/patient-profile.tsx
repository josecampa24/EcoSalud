import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Print from "expo-print";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "../firebase";

type Paciente = {
  id?: string;
  pacienteId?: string;
  nombre: string;
  edad: number;
  unidadEdad?: string;
  altura: number;
  peso: number;
  temperatura: number;
  presion: string;
  foto?: string;
  sintomas?: string[];
  diagnostico?: string;
  recomendaciones?: string;
  createdAt?: any;
};

export default function PatientProfile() {
  const { id } = useLocalSearchParams();
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [historial, setHistorial] = useState<Paciente[]>([]);
  const router = useRouter();

 useEffect(() => {
  if (!id) return;

  const q = query(
    collection(db, "registros"),
    where("pacienteId", "==", id)
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const lista = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Paciente[];

    if (lista.length === 0) return;

    // ordenar
    lista.sort(
      (a, b) =>
        (b.createdAt?.seconds || 0) -
        (a.createdAt?.seconds || 0)
    );

    setPaciente(lista[0]);
    setHistorial(lista.slice(1));
  });

  return () => unsubscribe();
  }, [id]);

  

  if (!paciente) return null;

  const eliminarPaciente = () => {
    Alert.alert(
      "Eliminar expediente",
      "Se eliminarán TODAS las consultas de este paciente. ¿Continuar?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              if (!paciente?.pacienteId) {
                Alert.alert(
                  "Error",
                  "Este paciente no tiene identificador válido.",
                );
                return;
              }

              const q = query(
                collection(db, "registros"),
                where("pacienteId", "==", paciente.pacienteId),
              );

              const snapshot = await getDocs(q);

              const eliminaciones = snapshot.docs.map((docItem) =>
                deleteDoc(doc(db, "registros", docItem.id)),
              );

              await Promise.all(eliminaciones);

              Alert.alert("Eliminado", "Paciente eliminado correctamente");
              router.back();
            } catch (error) {
              console.error(error);
              Alert.alert("Error", "No se pudo eliminar el paciente");
            }
          },
        },
      ],
    );
  };

  const generarPDF = async () => {
    const html = `
    <html>
      <body style="font-family: Arial; padding: 20px;">
        <h1 style="text-align:center; color:#1E5FA8;">EcoSalud</h1>
        <h2 style="text-align:center;">Expediente Clínico</h2>
        <hr/>

        <h3>Datos</h3>
        <p><b>Nombre:</b> ${paciente.nombre}</p>
        <p><b>Edad:</b> ${paciente.edad} ${paciente.unidadEdad || "años"}</p>

        <h3>Signos</h3>
        <p>Peso: ${paciente.peso}</p>
        <p>Altura: ${paciente.altura}</p>
        <p>Temp: ${paciente.temperatura}</p>
        <p>Presión: ${paciente.presion}</p>

        <h3>Síntomas</h3>
        <ul>
          ${
            paciente.sintomas?.length
              ? paciente.sintomas.map((s) => `<li>${s}</li>`).join("")
              : "<li>No registrados</li>"
          }
        </ul>

        <h3>Diagnóstico</h3>
        <p>${paciente.diagnostico || "No registrado"}</p>

        <h3>Recomendaciones</h3>
        <p>${paciente.recomendaciones || "No registrado"}</p>
      </body>
    </html>
    `;

    const { uri } = await Print.printToFileAsync({ html });
    await Sharing.shareAsync(uri);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        {/* HEADER */}
        <View style={styles.header}>
          <LinearGradient
            colors={["#2FA4D6", "#1E5FA8"]}
            style={styles.headerGradient}
          />
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={28} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteIcon}
            onPress={eliminarPaciente}
          >
            <Ionicons name="trash" size={26} color="#ef4444" />
          </TouchableOpacity>
        </View>

        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            {paciente.foto && paciente.foto.trim() !== "" ? (
              <Image
                source={{ uri: paciente.foto }}
                style={styles.avatarImage}
              />
            ) : (
              <MaterialCommunityIcons name="account" size={60} color="#fff" />
            )}
          </View>

          <Text style={styles.name}>{paciente.nombre}</Text>
          <Text style={styles.subtitle}>
            {" "}
            {paciente.edad} {paciente.unidadEdad || "años"}
          </Text>
        </View>

        {/* SIGNOS */}
        <View style={styles.vitalsCard}>
          <View style={styles.vitalItem}>
            <MaterialCommunityIcons
              name="heart-pulse"
              size={22}
              color="#ff4b6a"
            />
            <Text style={styles.vitalValue}>{paciente.presion}</Text>
          </View>

          <View style={styles.vitalItem}>
            <Feather name="thermometer" size={22} color="#f2994a" />
            <Text style={styles.vitalValue}>{paciente.temperatura}°C</Text>
          </View>

          <View style={styles.vitalItem}>
            <MaterialCommunityIcons
              name="weight-kilogram"
              size={22}
              color="#2d9cdb"
            />
            <Text style={styles.vitalValue}>{paciente.peso} kg</Text>
          </View>

          <View style={styles.vitalItem}>
            <MaterialCommunityIcons
              name="human-male-height"
              size={22}
              color="#27ae60"
            />
            <Text style={styles.vitalValue}>{paciente.altura} cm</Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Síntomas</Text>
          {paciente.sintomas?.length ? (
            paciente.sintomas.map((s, i) => <Text key={i}>• {s}</Text>)
          ) : (
            <Text>No registrados</Text>
          )}
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Diagnóstico</Text>
          <Text>{paciente.diagnostico || "No registrado"}</Text>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Recomendaciones</Text>
          <Text>{paciente.recomendaciones || "No registrado"}</Text>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Historial de consultas</Text>

          {historial.length > 0 ? (
            historial.map((item, index) => (
              <View key={index} style={styles.histItem}>
                <Text style={styles.histFecha}>
                  {item.createdAt
                    ? new Date(
                        item.createdAt.seconds * 1000,
                      ).toLocaleDateString()
                    : "Sin fecha"}
                </Text>

                <Text style={styles.histDiag}>
                  {item.diagnostico || "Sin diagnóstico"}
                </Text>

                <Text style={{ fontSize: 12, color: "#9ca3af" }}>
                  Temp: {item.temperatura}°C | Peso: {item.peso}kg
                </Text>
              </View>
            ))
          ) : (
            <Text>No hay historial</Text>
          )}
        </View>

        <TouchableOpacity style={styles.pdfButton} onPress={generarPDF}>
          <Text style={styles.pdfText}>Descargar PDF</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f5f7fb" },

  header: { height: 190 },

  headerGradient: {
    flex: 1,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },

  backButton: {
    position: "absolute",
    top: 60,
    left: 20,
    zIndex: 1,
  },

  deleteIcon: {
    position: "absolute",
    top: 60,
    right: 20,
    zIndex: 1,
  },

  avatarContainer: {
    alignItems: "center",
    marginTop: -70,
    marginBottom: 16,
  },

  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#9ca3af",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "#fff",
  },

  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 60,
  },

  name: {
    fontSize: 24,
    fontWeight: "700",
    marginTop: 10,
  },

  subtitle: {
    fontSize: 14,
    color: "#6b7280",
  },

  vitalsCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginBottom: 16,
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: "#fff",
    elevation: 3,
  },

  vitalItem: { alignItems: "center", flex: 1 },

  vitalValue: { fontWeight: "700", marginTop: 4 },

  sectionCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 18,
    borderRadius: 20,
    backgroundColor: "#fff",
    elevation: 2,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },

  pdfButton: {
    margin: 20,
    backgroundColor: "#1E5FA8",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },

  pdfText: { color: "#fff", fontWeight: "bold" },

  deleteButton: {
    marginHorizontal: 20,
    marginBottom: 40,
    backgroundColor: "#ef4444",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },

  histItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingVertical: 8,
  },

  histFecha: {
    fontSize: 12,
    color: "#6b7280",
  },

  histDiag: {
    fontWeight: "600",
    marginTop: 2,
  },
});
