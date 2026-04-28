import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Print from "expo-print";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
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

// ─── Helper: detecta qué campos cambiaron entre dos consultas ───────────────
type CamposCambiados = {
  campo: string;
  label: string;
  antes: string;
  despues: string;
};

function getChanges(anterior: Paciente, actual: Paciente): CamposCambiados[] {
  const cambios: CamposCambiados[] = [];

  const comparar = (
    campo: keyof Paciente,
    label: string,
    format?: (v: any) => string,
  ) => {
    const fmt = format ?? ((v: any) => String(v ?? ""));
    const antes = fmt(anterior[campo]);
    const despues = fmt(actual[campo]);
    if (antes !== despues) {
      cambios.push({ campo: campo as string, label, antes, despues });
    }
  };

  comparar("peso", "Peso", (v) => `${v} kg`);
  comparar("altura", "Altura", (v) => `${v} cm`);
  comparar("temperatura", "Temperatura", (v) => `${v} °C`);
  comparar("presion", "Presión arterial");
  comparar("diagnostico", "Diagnóstico");
  comparar("recomendaciones", "Recomendaciones");
  comparar(
    "sintomas",
    "Síntomas",
    (v: string[]) => (v ?? []).slice().sort().join(", "),
  );

  return cambios;
}

export default function PatientProfile() {
  const { id } = useLocalSearchParams();
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [historial, setHistorial] = useState<Paciente[]>([]);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
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
            historial.map((item, index) => {
              // Consulta más reciente que ésta para comparar cambios
              // historial[0] = 2ª más reciente, compare con paciente (la más reciente)
              // historial[1] = 3ª más reciente, compare con historial[0]
              const referencia = index === 0 ? paciente! : historial[index - 1];
              const cambios = getChanges(item, referencia);
              const isOpen = expandedIndex === index;

              return (
                <View key={index} style={styles.histCard}>
                  {/* Cabecera colapsable */}
                  <TouchableOpacity
                    style={styles.histHeader}
                    onPress={() =>
                      setExpandedIndex(isOpen ? null : index)
                    }
                    activeOpacity={0.7}
                  >
                    <View style={styles.histHeaderLeft}>
                      <View style={styles.histDot} />
                      <View>
                        <Text style={styles.histFecha}>
                          {item.createdAt
                            ? new Date(
                                item.createdAt.seconds * 1000,
                              ).toLocaleDateString("es-MX", {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              })
                            : "Sin fecha"}
                        </Text>
                        <Text style={styles.histDiagSmall} numberOfLines={1}>
                          {item.diagnostico || "Sin diagnóstico"}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.histHeaderRight}>
                      {cambios.length > 0 && (
                        <View style={styles.badgeCambios}>
                          <Text style={styles.badgeText}>
                            {cambios.length} cambio{cambios.length > 1 ? "s" : ""}
                          </Text>
                        </View>
                      )}
                      <Ionicons
                        name={isOpen ? "chevron-up" : "chevron-down"}
                        size={18}
                        color="#6b7280"
                      />
                    </View>
                  </TouchableOpacity>

                  {/* Contenido expandido */}
                  {isOpen && (
                    <View style={styles.histBody}>
                      {/* Signos vitales */}
                      <Text style={styles.histSectionLabel}>⚕️ Signos Vitales</Text>
                      <View style={styles.histVitalsRow}>
                        <View style={styles.histVitalBox}>
                          <Text style={styles.histVitalVal}>{item.peso} kg</Text>
                          <Text style={styles.histVitalLbl}>Peso</Text>
                        </View>
                        <View style={styles.histVitalBox}>
                          <Text style={styles.histVitalVal}>{item.altura} cm</Text>
                          <Text style={styles.histVitalLbl}>Altura</Text>
                        </View>
                        <View style={styles.histVitalBox}>
                          <Text style={styles.histVitalVal}>{item.temperatura}°C</Text>
                          <Text style={styles.histVitalLbl}>Temp</Text>
                        </View>
                        <View style={styles.histVitalBox}>
                          <Text style={styles.histVitalVal}>{item.presion}</Text>
                          <Text style={styles.histVitalLbl}>Presión</Text>
                        </View>
                      </View>

                      {/* Síntomas */}
                      <Text style={styles.histSectionLabel}>🩺 Síntomas</Text>
                      <Text style={styles.histBodyText}>
                        {item.sintomas && item.sintomas.length > 0
                          ? item.sintomas.join(", ")
                          : "No registrados"}
                      </Text>

                      {/* Diagnóstico */}
                      <Text style={styles.histSectionLabel}>📋 Diagnóstico</Text>
                      <Text style={styles.histBodyText}>
                        {item.diagnostico || "No registrado"}
                      </Text>

                      {/* Recomendaciones */}
                      <Text style={styles.histSectionLabel}>💊 Recomendaciones</Text>
                      <Text style={styles.histBodyText}>
                        {item.recomendaciones || "No registradas"}
                      </Text>

                      {/* Cambios respecto a la consulta siguiente */}
                      {cambios.length > 0 && (
                        <View style={styles.cambiosContainer}>
                          <Text style={styles.cambiosTitulo}>
                            🔄 Cambios respecto a la consulta siguiente
                          </Text>
                          {cambios.map((c, ci) => (
                            <View key={ci} style={styles.cambioItem}>
                              <Text style={styles.cambioLabel}>{c.label}</Text>
                              <View style={styles.cambioRow}>
                                <View style={styles.cambioAntes}>
                                  <Text style={styles.cambioAntesTxt} numberOfLines={2}>
                                    {c.antes || "—"}
                                  </Text>
                                </View>
                                <Ionicons name="arrow-forward" size={14} color="#6b7280" style={{ marginHorizontal: 4 }} />
                                <View style={styles.cambioDespues}>
                                  <Text style={styles.cambioDespuesTxt} numberOfLines={2}>
                                    {c.despues || "—"}
                                  </Text>
                                </View>
                              </View>
                            </View>
                          ))}
                        </View>
                      )}

                      {cambios.length === 0 && (
                        <View style={styles.sinCambios}>
                          <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                          <Text style={styles.sinCambiosTxt}>
                            Sin cambios respecto a la consulta siguiente
                          </Text>
                        </View>
                      )}
                    </View>
                  )}
                </View>
              );
            })
          ) : (
            <View style={styles.sinHistorial}>
              <Ionicons name="document-outline" size={32} color="#d1d5db" />
              <Text style={styles.sinHistorialTxt}>
                Solo existe una consulta registrada
              </Text>
            </View>
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

  // ── Historial ────────────────────────────────────────────────────────────
  histCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 10,
    overflow: "hidden",
    backgroundColor: "#fafafa",
  },

  histHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff",
  },

  histHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 10,
  },

  histHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  histDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#1E5FA8",
    marginRight: 8,
  },

  histFecha: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
  },

  histDiagSmall: {
    fontSize: 11,
    color: "#6b7280",
    marginTop: 1,
    maxWidth: 200,
  },

  badgeCambios: {
    backgroundColor: "#fff7ed",
    borderWidth: 1,
    borderColor: "#f59e0b",
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },

  badgeText: {
    fontSize: 10,
    color: "#d97706",
    fontWeight: "700",
  },

  histBody: {
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },

  histSectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1E5FA8",
    marginTop: 10,
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  histBodyText: {
    fontSize: 13,
    color: "#374151",
    lineHeight: 18,
  },

  histVitalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },

  histVitalBox: {
    alignItems: "center",
    flex: 1,
    backgroundColor: "#eff6ff",
    borderRadius: 8,
    paddingVertical: 6,
    marginHorizontal: 2,
  },

  histVitalVal: {
    fontWeight: "700",
    fontSize: 13,
    color: "#1e40af",
  },

  histVitalLbl: {
    fontSize: 10,
    color: "#60a5fa",
    marginTop: 2,
  },

  // ── Sección de cambios ───────────────────────────────────────────────────
  cambiosContainer: {
    marginTop: 12,
    backgroundColor: "#fffbeb",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fde68a",
    padding: 10,
  },

  cambiosTitulo: {
    fontSize: 12,
    fontWeight: "700",
    color: "#92400e",
    marginBottom: 8,
  },

  cambioItem: {
    marginBottom: 8,
  },

  cambioLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#78350f",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },

  cambioRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  cambioAntes: {
    flex: 1,
    backgroundColor: "#fee2e2",
    borderRadius: 6,
    padding: 6,
  },

  cambioAntesTxt: {
    fontSize: 12,
    color: "#b91c1c",
  },

  cambioDespues: {
    flex: 1,
    backgroundColor: "#dcfce7",
    borderRadius: 6,
    padding: 6,
  },

  cambioDespuesTxt: {
    fontSize: 12,
    color: "#15803d",
  },

  sinCambios: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    gap: 6,
  },

  sinCambiosTxt: {
    fontSize: 12,
    color: "#10b981",
  },

  sinHistorial: {
    alignItems: "center",
    paddingVertical: 16,
    gap: 8,
  },

  sinHistorialTxt: {
    fontSize: 13,
    color: "#9ca3af",
  },
});
