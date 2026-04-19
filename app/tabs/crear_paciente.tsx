import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { addDoc, collection } from "firebase/firestore";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "../../firebase";

const { width } = Dimensions.get("window");

export default function NuevoRegistro() {
  const router = useRouter();

  const [imagen, setImagen] = useState<string | null>(null);
  const [altura, setAltura] = useState("");
  const [peso, setPeso] = useState("");
  const [temperatura, setTemperatura] = useState("");
  const [presion, setPresion] = useState("");
  const [sintomasSeleccionados, setSintomasSeleccionados] = useState<string[]>(
    [],
  );
  const [otrosSintomas, setOtrosSintomas] = useState("");
  const [diagnostico, setDiagnostico] = useState("");
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");
  const [recomendaciones, setRecomendaciones] = useState("");
  const [errores, setErrores] = useState<Record<string, string>>({});

  const sintomasData = {
    Generales: [
      "Fiebre",
      "Escalofríos",
      "Fatiga",
      "Debilidad",
      "Pérdida de peso involuntaria",
      "Aumento de peso",
      "Sudoración nocturna",
      "Malestar general",
      "Pérdida de apetito",
      "Deshidratacion",
    ],
    Neurológicos: [
      "Dolor de cabeza",
      "Migraña",
      "Mareo",
      "Vértigo",
      "Desmayo",
      "Convulsiones",
      "Confusión",
      "Hormigueo",
      "Temblores",
      "Entumecimiento",
      "Alteracion del habla",
      "Alteracion visual",
      "Sensiblidad a la luz",
    ],
    Cardiovasculares: [
      "Dolor en el pecho",
      "Palpitaciones",
      "Taquicardia",
      "Dificultad para respirar",
      "Hinchazón en piernas",
      "Presión arterial elevada",
      "Presion baja",
      "Cianosis",
      "Dolor irradiado a brazo",
    ],
    Respiratorios: [
      "Tos seca",
      "Tos con flema",
      "Congestión nasal",
      "Dolor de garganta",
      "Secrecopn nasal",
      "Dolor al respirar",
      "Sibilancias",
      "Ronquera",
      "Expectoracion con sangre",
    ],
    Gastrointestinales: [
      "Náuseas",
      "Vómitos",
      "Diarrea",
      "Estreñimiento",
      "Dolor abdominal",
      "Distension abdominal",
      "Acidez",
      "Reflujo",
      "Sangrado Rectal",
      "Heces osuras",
      "Perdida de apetito",
      "Ictericia",
    ],
    Genitourinarios: [
      "Ardor al orinar",
      "Orina Frecuente",
      "Dolor pelvico",
      "Sangrado urinario",
      "Flujo vaginal anormal",
      "Dolor testicular",
      "Disfuncion erectil",
      "Amenorrea",
      "Dolor Menstural",
      "Embarazo sospechado",
    ],
    Musculo: [
      "Dolor muscular",
      "Dolor articular",
      "Rigidez",
      "Inflamacion",
      "Calambres",
      "Espasmos",
      "Dolor Lumbar",
      "Dolor Cervical",
    ],
    Dermatologicos: [
      "Erupcion",
      "Comezon",
      "Enrojecimiento",
      "Lesiones cutaneas",
      "Moretones faciles",
      "Caida de cabello",
      "Uñas fragiles",
      "Cambio de coloracion",
      "Hinchazon facial",
    ],
    Psiquiátricos: [
      "Ansiedad",
      "Depresión",
      "Insomnio",
      "Irritabilidad",
      "Ataques de pánico",
      "Cambios de humor",
      "Perdida de Interes",
    ],
    Oculares: [
      "Vision borrosa",
      "Dolor ocular",
      "Lagrimeo",
      "Fotofobia",
      "Secrecion ocular",
      "Ojos rojos",
    ],
    Otorrinolaringologicas: [
      "Dolor de oido",
      "Zumbido",
      "Perdida de auditiva",
      "Dolor facial",
      "Dificultad para tragar",
    ],
    Endocrino: [
      "Sed excesiva",
      "Hambre excesiva",
      "Miccion frecuente",
      "Intolerancia al frio",
      "Intolerancia al calor",
      "Cambios hormonales",
    ],
  };

  const validarFormulario = () => {
    const nuevosErrores: Record<string, string> = {};

    if (!nombre.trim()) {
      nuevosErrores.nombre = "El nombre es obligatorio.";
    }

    const edadNum = Number(edad);
    if (!edad.trim()) {
      nuevosErrores.edad = "La edad es obligatoria.";
    } else if (isNaN(edadNum) || edadNum <= 0 || edadNum > 120) {
      nuevosErrores.edad = "Ingresa una edad válida.";
    }

    const alturaNum = Number(altura);
    if (!altura.trim()) {
      nuevosErrores.altura = "La altura es obligatoria.";
    } else if (isNaN(alturaNum) || alturaNum < 30 || alturaNum > 250) {
      nuevosErrores.altura = "Ingresa una altura válida en cm.";
    }

    const pesoNum = Number(peso);
    if (!peso.trim()) {
      nuevosErrores.peso = "El peso es obligatorio.";
    } else if (isNaN(pesoNum) || pesoNum <= 0 || pesoNum > 400) {
      nuevosErrores.peso = "Ingresa un peso válido.";
    }

    const temperaturaNum = Number(temperatura);
    if (!temperatura.trim()) {
      nuevosErrores.temperatura = "La temperatura es obligatoria.";
    } else if (
      isNaN(temperaturaNum) ||
      temperaturaNum < 30 ||
      temperaturaNum > 45
    ) {
      nuevosErrores.temperatura = "Ingresa una temperatura válida.";
    }

    if (!presion.trim()) {
      nuevosErrores.presion = "La presión es obligatoria.";
    } else if (!/^\d{2,3}\/\d{2,3}$/.test(presion.trim())) {
      nuevosErrores.presion = "Usa el formato 120/80.";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const subirImagen = async () => {
    if (!imagen) return null;

    const data = new FormData();

    data.append("file", {
      uri: imagen,
      type: "image/jpeg",
      name: "paciente.jpg",
    } as any);

    data.append("upload_preset", "ecosalud");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dyt8hywwc/image/upload",
        {
          method: "POST",
          body: data,
        },
      );

      const json = await res.json();
      return json.secure_url;
    } catch (error) {
      console.log("Error Cloudinary:", error);
      return null;
    }
  };

  const guardarRegistro = async () => {
    if (!validarFormulario()) {
      Alert.alert("Error", "Corrige los campos marcados en rojo.");
      return;
    }

    try {
      const fotoURL = await subirImagen();

      await addDoc(collection(db, "registros"), {
        nombre: nombre.trim(),
        edad: Number(edad),
        altura: Number(altura),
        peso: Number(peso),
        temperatura: Number(temperatura),
        presion: presion.trim(),
        foto: fotoURL,
        sintomas: [
          ...sintomasSeleccionados,
          ...(otrosSintomas.trim() ? [otrosSintomas.trim()] : []),
        ],
        diagnostico: diagnostico.trim(),
        recomendaciones: recomendaciones.trim(),
        createdAt: new Date(),
      });

      Alert.alert("Éxito", "Registro guardado correctamente");
      limpiarFormulario();
      router.back();
    } catch (error) {
      console.error("Error saving record: ", error);
      Alert.alert(
        "Error",
        "No se pudo guardar el registro. Por favor, intente de nuevo.",
      );
    }
  };

  const toggleSintoma = (sintoma: string) => {
    if (sintomasSeleccionados.includes(sintoma)) {
      setSintomasSeleccionados(
        sintomasSeleccionados.filter((s) => s !== sintoma),
      );
    } else {
      setSintomasSeleccionados([...sintomasSeleccionados, sintoma]);
    }
  };

  const seleccionarImagen = async () => {
    const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permiso.granted) {
      Alert.alert("Permiso requerido", "Debes permitir acceso a fotos");
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!resultado.canceled) {
      setImagen(resultado.assets[0].uri);
    }
  };

  const limpiarFormulario = () => {
    setImagen(null);
    setNombre("");
    setEdad("");
    setAltura("");
    setPeso("");
    setTemperatura("");
    setPresion("");
    setSintomasSeleccionados([]);
    setOtrosSintomas("");
    setDiagnostico("");
    setRecomendaciones("");
    setErrores({});
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.back}>Atrás</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Nuevo Registro</Text>
          <View style={{ width: 50 }} />
        </View>

        <View style={styles.photoSection}>
          <View style={styles.photoWrapper}>
            <View style={styles.photoCircle}>
              {imagen ? (
                <Image source={{ uri: imagen }} style={styles.photo} />
              ) : (
                <Ionicons name="image-outline" size={50} color="#d0d0d0" />
              )}
            </View>
            <TouchableOpacity
              style={styles.cameraButton}
              onPress={seleccionarImagen}
            >
              <Ionicons name="camera" size={22} color="white" />
            </TouchableOpacity>
          </View>
          <Text style={styles.photoLabel}>Foto del Paciente</Text>
        </View>

        <Text style={styles.section}>DATOS DEL PACIENTE</Text>

        <View style={styles.row}>
          <View style={styles.fieldWrapper}>
            <TextInput
              placeholder="Nombre completo"
              placeholderTextColor="#000"
              style={[styles.inputHalf, errores.nombre && styles.inputError]}
              value={nombre}
              onChangeText={setNombre}
            />
            {errores.nombre && (
              <Text style={styles.errorText}>{errores.nombre}</Text>
            )}
          </View>

          <View style={styles.fieldWrapper}>
            <TextInput
              placeholder="Edad"
              placeholderTextColor="#000"
              style={[styles.inputHalf, errores.edad && styles.inputError]}
              value={edad}
              onChangeText={setEdad}
              keyboardType="numeric"
            />
            {errores.edad && (
              <Text style={styles.errorText}>{errores.edad}</Text>
            )}
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.fieldWrapper}>
            <TextInput
              placeholder="Altura (cm)"
              placeholderTextColor="#000"
              style={[styles.inputHalf, errores.altura && styles.inputError]}
              value={altura}
              onChangeText={setAltura}
              keyboardType="numeric"
            />
            {errores.altura && (
              <Text style={styles.errorText}>{errores.altura}</Text>
            )}
          </View>

          <View style={styles.fieldWrapper}>
            <TextInput
              placeholder="Peso (kg)"
              placeholderTextColor="#000"
              style={[styles.inputHalf, errores.peso && styles.inputError]}
              value={peso}
              onChangeText={setPeso}
              keyboardType="numeric"
            />
            {errores.peso && (
              <Text style={styles.errorText}>{errores.peso}</Text>
            )}
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.fieldWrapper}>
            <TextInput
              placeholder="Temp (°C)"
              placeholderTextColor="#000"
              style={[
                styles.inputHalf,
                errores.temperatura && styles.inputError,
              ]}
              value={temperatura}
              onChangeText={setTemperatura}
              keyboardType="numeric"
            />
            {errores.temperatura && (
              <Text style={styles.errorText}>{errores.temperatura}</Text>
            )}
          </View>

          <View style={styles.fieldWrapper}>
            <TextInput
              placeholder="P. Arterial"
              placeholderTextColor="#000"
              style={[styles.inputHalf, errores.presion && styles.inputError]}
              value={presion}
              onChangeText={setPresion}
            />
            {errores.presion && (
              <Text style={styles.errorText}>{errores.presion}</Text>
            )}
          </View>
        </View>

        <Text style={styles.section}>SÍNTOMAS</Text>

        {Object.entries(sintomasData).map(([categoria, lista]) => (
          <View key={categoria}>
            <Text style={{ fontWeight: "600", marginBottom: 5 }}>
              {categoria}
            </Text>

            {lista.map((sintoma) => (
              <TouchableOpacity
                key={sintoma}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 8,
                }}
                onPress={() => toggleSintoma(sintoma)}
              >
                <Ionicons
                  name={
                    sintomasSeleccionados.includes(sintoma)
                      ? "checkbox"
                      : "square-outline"
                  }
                  size={22}
                  color="#1E88E5"
                />
                <Text style={{ marginLeft: 8 }}>{sintoma}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}

        <TextInput
          placeholder="Otros síntomas..."
          placeholderTextColor="#000"
          style={styles.textArea}
          multiline
          value={otrosSintomas}
          onChangeText={setOtrosSintomas}
        />

        <Text style={styles.section}>DIAGNÓSTICO</Text>

        <TextInput
          placeholder="Diagnóstico clínico..."
          placeholderTextColor="#000"
          style={styles.textArea}
          multiline
          value={diagnostico}
          onChangeText={setDiagnostico}
        />

        <TextInput
          placeholder="Recomendaciones..."
          placeholderTextColor="#000"
          style={styles.textArea}
          multiline
          value={recomendaciones}
          onChangeText={setRecomendaciones}
        />

        <TouchableOpacity style={styles.saveButton} onPress={guardarRegistro}>
          <Text style={styles.saveText}>Guardar</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f6fa",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  back: {
    color: "#1E88E5",
    fontWeight: "600",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  photoSection: {
    alignItems: "center",
    marginVertical: 20,
  },
  photoWrapper: {
    position: "relative",
    width: 120,
    height: 120,
  },
  photoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#e9ecef",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  photo: {
    width: "100%",
    height: "100%",
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: -10,
    backgroundColor: "#007BFF",
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#f5f6fa",
  },
  photoLabel: {
    marginTop: 10,
    fontSize: 14,
    color: "#6c757d",
  },
  section: {
    fontWeight: "bold",
    marginVertical: 10,
    color: "#333",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  fieldWrapper: {
    width: "48%",
  },
  inputHalf: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 4,
  },
  inputError: {
    borderWidth: 1.5,
    borderColor: "#ef4444",
  },
  errorText: {
    color: "#ef4444",
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 4,
  },
  textArea: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    height: 100,
    marginBottom: 15,
    textAlignVertical: "top",
  },
  saveButton: {
    backgroundColor: "#1E88E5",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 30,
  },
  saveText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
