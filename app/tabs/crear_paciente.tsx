import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  onSnapshot
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
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
const user = getAuth().currentUser;

export default function NuevoRegistro() {
  const router = useRouter();

  const [modoSeleccion, setModoSeleccion] = useState(true);
  const [busquedaPaciente, setBusquedaPaciente] = useState("");
  const [pacientesExistentes, setPacientesExistentes] = useState<any[]>([]);
  const [imagen, setImagen] = useState<string | null>(null);
  const [altura, setAltura] = useState("");
  const [peso, setPeso] = useState("");
  const [temperatura, setTemperatura] = useState("");
  const [pacienteId, setPacienteId] = useState<string | null>(null);
  const [presion, setPresion] = useState("");
  const [sintomasSeleccionados, setSintomasSeleccionados] = useState<string[]>(
    [],
  );

  const [otrosSintomas, setOtrosSintomas] = useState("");
  const [diagnostico, setDiagnostico] = useState("");
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");
  const [unidadEdad, setUnidadEdad] = useState<"años" | "meses">("años");
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

  useEffect(() => {
  const user = getAuth().currentUser;

  if (!user) return;

  const unsubscribe = onSnapshot(
    collection(db, "registros"),
    (snapshot) => {
      const mapa = new Map();

      snapshot.docs.forEach((doc) => {
        const data = doc.data();

        // 🔥 FILTRAR POR USUARIO
        if (data.uid !== user.uid) return;

        if (!data.pacienteId) return;

        if (
          !mapa.has(data.pacienteId) ||
          (data.createdAt?.seconds || 0) >
            (mapa.get(data.pacienteId).createdAt?.seconds || 0)
        ) {
          mapa.set(data.pacienteId, {
            id: doc.id,
            ...data,
          });
        }
      });

      setPacientesExistentes(Array.from(mapa.values()));
    }
  );

  return () => unsubscribe();
}, []);

  const pacientesFiltrados = pacientesExistentes.filter((p) =>
    p.nombre?.toLowerCase().includes(busquedaPaciente.toLowerCase()),
  );

  const seleccionarPaciente = (p: any) => {
    setPacienteId(p.pacienteId);

    setNombre(p.nombre || "");
    setEdad(p.edad?.toString() || "");
    setAltura(p.altura?.toString() || "");
    setPeso(p.peso?.toString() || "");
    setImagen(p.foto || null);

    setModoSeleccion(false);
  };

  const crearNuevoPaciente = () => {
    setPacienteId(null);
    limpiarFormulario();
    setModoSeleccion(false);
  };

  const validarFormulario = () => {
    const nuevosErrores: Record<string, string> = {};

    if (!nombre.trim()) {
      nuevosErrores.nombre = "El nombre es obligatorio.";
    }

    const edadNum = Number(edad);
    if (!edad.trim()) {
      nuevosErrores.edad = "La edad es obligatoria.";
    } else if (isNaN(edadNum) || edadNum <= 0) {
      nuevosErrores.edad = "Edad inválida.";
    } else if (unidadEdad === "años" && edadNum > 120) {
      nuevosErrores.edad = "Máximo 120 años.";
    } else if (unidadEdad === "meses" && edadNum > 24) {
      nuevosErrores.edad = "Máximo 24 meses.";
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
  const user = getAuth().currentUser;

  if (!user) {
    Alert.alert("Error", "No hay usuario autenticado");
    return;
  }

  if (!altura || !peso) {
    Alert.alert("Error", "Altura y peso son obligatorios");
    return;
  }

  try {
    let urlFoto = "";

    // 🔥 SI HAY IMAGEN → subirla primero
    if (imagen) {
      const data = new FormData();

      data.append("file", {
        uri: imagen,
        type: "image/jpeg",
        name: "foto.jpg",
      } as any);

      data.append("upload_preset", "ecosalud");

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dyt8hywwc/image/upload",
        {
          method: "POST",
          body: data,
        }
      );

      const json = await res.json();
      console.log("Cloudinary:", json);

      urlFoto = json.secure_url; // 🔥 AQUÍ
    }

    // 🔥 AHORA sí guardas en Firestore
    await addDoc(collection(db, "registros"), {
      nombre,
      edad: Number(edad),
      altura: Number(altura),
      peso: Number(peso),
      temperatura: Number(temperatura),
      presion,
      sintomas: [
        ...sintomasSeleccionados,
        ...(otrosSintomas ? [otrosSintomas] : []),
      ],
      diagnostico,
      recomendaciones,
      foto: urlFoto,
      pacienteId: pacienteId || new Date().getTime().toString(),
      uid: user.uid,
      createdAt: new Date(),
    });

    Alert.alert("Éxito", "Registro guardado correctamente");
    router.back();

  } catch (error) {
    console.error("ERROR COMPLETO:", error);
    Alert.alert("Error", "No se pudo guardar el registro");
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

  if (modoSeleccion) {
    return (
      <View style={styles.container}>
        <View style={styles.headerConsulta}>
          <Text style={styles.textConsulta}>¿Para quién es la consulta?</Text>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#6b7280" />
          <TextInput
            placeholder="Buscar paciente..."
            value={busquedaPaciente}
            onChangeText={setBusquedaPaciente}
            style={styles.searchInput}
          />
        </View>

        <ScrollView>
          {pacientesFiltrados.map((p) => (
            <TouchableOpacity
              key={p.id}
              style={styles.cardPaciente}
              onPress={() => seleccionarPaciente(p)}
            >
              <View style={styles.row}>
                <View style={styles.avatar}>
                  {p.foto ? (
                    <Image source={{ uri: p.foto }} style={styles.avatarImg} />
                  ) : (
                    <Ionicons name="person" size={20} color="#fff" />
                  )}
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.nombre}>{p.nombre}</Text>
                  <Text>
                    {p.edad} {p.unidadEdad || "años"}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={crearNuevoPaciente}
        >
          <Text style={styles.saveText}>Nuevo paciente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setModoSeleccion(true)}>
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
            <View style={{ position: "relative" }}>
              <TextInput
                placeholder="Edad"
                placeholderTextColor="#000"
                style={[
                  styles.inputHalf,
                  { paddingRight: 70 },
                  errores.edad && styles.inputError,
                ]}
                value={edad}
                onChangeText={setEdad}
                keyboardType="numeric"
              />

              <TouchableOpacity
                style={styles.unitSelector}
                onPress={() =>
                  setUnidadEdad(unidadEdad === "años" ? "meses" : "años")
                }
              >
                <Text style={styles.unitText}>{unidadEdad}</Text>
              </TouchableOpacity>
            </View>
            {errores.edad && (
              <Text style={styles.errorText}>{errores.edad}</Text>
            )}
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.fieldWrapper}>
            <View style={{ position: "relative" }}>
              <TextInput
                placeholder="Altura"
                placeholderTextColor="#000"
                style={[
                  styles.inputHalf,
                  { paddingRight: 40 },
                  errores.altura && styles.inputError,
                ]}
                value={altura}
                onChangeText={setAltura}
                keyboardType="numeric"
              />
              <Text style={styles.unit}>cm</Text>
            </View>
            {errores.altura && (
              <Text style={styles.errorText}>{errores.altura}</Text>
            )}
          </View>

          <View style={styles.fieldWrapper}>
            <TextInput
              placeholder="Peso"
              placeholderTextColor="#000"
              style={[styles.inputHalf, errores.peso && styles.inputError]}
              value={peso}
              onChangeText={setPeso}
              keyboardType="numeric"
            />
            <Text style={styles.unit}>kg</Text>
            {errores.peso && (
              <Text style={styles.errorText}>{errores.peso}</Text>
            )}
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.fieldWrapper}>
            <TextInput
              placeholder="Temp"
              placeholderTextColor="#000"
              style={[
                styles.inputHalf,
                errores.temperatura && styles.inputError,
              ]}
              value={temperatura}
              onChangeText={setTemperatura}
              keyboardType="numeric"
            />
            <Text style={styles.unit}>°C</Text>
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
            <Text style={styles.unit}>mmHg</Text>
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
    marginTop: 15,
    marginBottom: 10,
    color: "#333",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  fieldWrapper: {
    width: "48%",
    marginBottom: 10,
  },
  inputHalf: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 6,
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 12,
  },

  searchInput: {
    marginLeft: 8,
    flex: 1,
    paddingVertical: 10,
  },

  cardPaciente: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },

  headerConsulta: {
    backgroundColor: "#1E88E5",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },

  textConsulta: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },

  unit: {
    position: "absolute",
    right: 12,
    top: 18,
    color: "#6b7280",
    fontSize: 13,
  },

  unitSelector: {
    position: "absolute",
    right: 8,
    top: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#e5e7eb",
    borderRadius: 6,
  },

  unitText: {
    fontSize: 12,
    color: "#374151",
    fontWeight: "600",
  },

  rowItem: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "#9ca3af",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    marginRight: 10,
  },

  avatarImg: {
    width: "100%",
    height: "100%",
  },

  nombre: {
    fontWeight: "bold",
    fontSize: 15,
  },
});
