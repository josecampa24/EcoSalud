import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { getAuth } from "firebase/auth";
import { addDoc, collection, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity
} from "react-native";
import { Calendar } from "react-native-calendars";
import { db } from "../../firebase";

export default function CrearCita() {
  const router = useRouter();

  const [pacientes, setPacientes] = useState<any[]>([]);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState<any>(null);

  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState(new Date());
  const [mostrarHora, setMostrarHora] = useState(false);

  const [motivo, setMotivo] = useState("");

  // 🔥 TRAER PACIENTES
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "registros"), (snapshot) => {
      const mapa = new Map();

      snapshot.docs.forEach((doc) => {
        const data = doc.data();

        if (!data.pacienteId) return;

        if (
          !mapa.has(data.pacienteId) ||
          (data.createdAt?.seconds || 0) >
            (mapa.get(data.pacienteId).createdAt?.seconds || 0)
        ) {
          mapa.set(data.pacienteId, {
            id: data.pacienteId,
            nombre: data.nombre,
          });
        }
      });

      setPacientes(Array.from(mapa.values()));
    });

    return () => unsubscribe();
  }, []);

  // 🔥 GUARDAR CITA
  const guardarCita = async () => {
    const user = getAuth().currentUser;

    if (!user) {
      Alert.alert("Error", "No hay usuario autenticado");
      return;
    }

    if (!pacienteSeleccionado) {
      Alert.alert("Error", "Selecciona un paciente");
      return;
    }

    if (!fecha) {
      Alert.alert("Error", "Selecciona una fecha");
      return;
    }

    try {
      await addDoc(collection(db, "citas"), {
        nombrePaciente: pacienteSeleccionado.nombre,
        pacienteId: pacienteSeleccionado.id,
        fecha,
        hora: hora.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        motivo,
        estado: "pendiente",
        uid: user.uid,
        createdAt: new Date(),
      });

      Alert.alert("Éxito", "Cita creada");
      router.back();
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "No se pudo crear la cita");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Crear Cita</Text>

      {/* PACIENTES */}
      <Text style={styles.label}>Seleccionar Paciente</Text>
      <ScrollView style={{ maxHeight: 150 }}>
        {pacientes.map((p) => (
          <TouchableOpacity
            key={p.id}
            style={[
              styles.pacienteItem,
              pacienteSeleccionado?.id === p.id && styles.selected,
            ]}
            onPress={() => setPacienteSeleccionado(p)}
          >
            <Text
              style={{
                color:
                  pacienteSeleccionado?.id === p.id ? "#fff" : "#000",
              }}
            >
              {p.nombre}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* CALENDARIO */}
      <Text style={styles.label}>Seleccionar Fecha</Text>
      <Calendar
        onDayPress={(day) => setFecha(day.dateString)}
        markedDates={{
          [fecha]: { selected: true, selectedColor: "#1E88E5" },
        }}
      />

      {/* HORA */}
      <Text style={styles.label}>Hora</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setMostrarHora(true)}
      >
        <Text>
          {hora.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </TouchableOpacity>

      {mostrarHora && (
        <DateTimePicker
          value={hora}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={(event, selectedDate) => {
            setMostrarHora(false);
            if (event.type === "dismissed") return;
            if (selectedDate) setHora(selectedDate);
          }}
        />
      )}

      {/* GUARDAR */}
      <TouchableOpacity style={styles.saveButton} onPress={guardarCita}>
        <Text style={styles.saveText}>Guardar Cita</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 15 },
  label: { marginTop: 15, marginBottom: 5, fontWeight: "600" },
  pacienteItem: {
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 5,
  },
  selected: {
    backgroundColor: "#1E88E5",
  },
  button: {
    padding: 12,
    backgroundColor: "#e5e7eb",
    borderRadius: 8,
    alignItems: "center",
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: "#1E88E5",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  saveText: { color: "#fff", fontWeight: "bold" },
});