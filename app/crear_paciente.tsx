import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { addDoc, collection } from 'firebase/firestore';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { db } from '../firebase';

const { width } = Dimensions.get('window');

export default function NuevoRegistro() {
  const router = useRouter();

  const [altura, setAltura] = useState('');
  const [peso, setPeso] = useState('');
  const [temperatura, setTemperatura] = useState('');
  const [presion, setPresion] = useState('');
  const [sintomasSeleccionados, setSintomasSeleccionados] = useState<string[]>([]);
  const [otrosSintomas, setOtrosSintomas] = useState('');
  const [diagnostico, setDiagnostico] = useState('');
  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState('');
  const [recomendaciones, setRecomendaciones] = useState('');

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

  const guardarRegistro = async () => {
    if (!altura || !peso) {
      Alert.alert('Error', 'Altura y peso son obligatorios');
      return;
    }

    try {
      await addDoc(collection(db, 'registros'), {
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
        createdAt: new Date()
      });

      Alert.alert('Éxito', 'Registro guardado correctamente');
      router.back();
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'No se pudo guardar el registro');
    }
  };

  const toggleSintoma = (sintoma: string) => {
  if (sintomasSeleccionados.includes(sintoma)) {
    setSintomasSeleccionados(
      sintomasSeleccionados.filter((s) => s !== sintoma)
    );
  } else {
    setSintomasSeleccionados([...sintomasSeleccionados, sintoma]);
  }
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
          <View style={styles.photoCircle}>
            <Ionicons name="image-outline" size={50} color="#d0d0d0" />
          </View>

          <TouchableOpacity style={styles.cameraButton}>
            <Ionicons name="camera" size={18} color="white" />
          </TouchableOpacity>

          <Text style={styles.photoLabel}>Foto del Paciente</Text>
        </View>

        <Text style={styles.section}>DATOS DEL PACIENTE</Text>

        <View style={styles.row}>
  <TextInput
    placeholder="Nombre completo"
    placeholderTextColor="#000"
    style={styles.inputHalf}
    value={nombre}
    onChangeText={setNombre}
  />

  <TextInput
    placeholder="Edad"
    placeholderTextColor="#000"
    style={styles.inputHalf}
    value={edad}
    onChangeText={setEdad}
    keyboardType="numeric"
  />
</View>

        <View style={styles.row}>
          <TextInput
            placeholder="Altura (cm)"
            placeholderTextColor="#000"
            style={styles.inputHalf}
            value={altura}
            onChangeText={setAltura}
            keyboardType="numeric"
          />
          <TextInput
            placeholder="Peso (kg)"
            placeholderTextColor="#000"
            style={styles.inputHalf}
            value={peso}
            onChangeText={setPeso}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.row}>
          <TextInput
            placeholder="Temp (°C)"
            placeholderTextColor="#000"
            style={styles.inputHalf}
            value={temperatura}
            onChangeText={setTemperatura}
            keyboardType="numeric"
          />
          <TextInput
            placeholder="P. Arterial"
            placeholderTextColor="#000"
            style={styles.inputHalf}
            value={presion}
            onChangeText={setPresion}
          />
        </View>

        <Text style={styles.section}>SÍNTOMAS</Text>

{Object.entries(sintomasData).map(([categoria, lista]) => (
  <View key={categoria}>
    <Text style={{ fontWeight: '600', marginBottom: 5 }}>
      {categoria}
    </Text>

    {lista.map((sintoma) => (
      <TouchableOpacity
        key={sintoma}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 8,
        }}
        onPress={() => toggleSintoma(sintoma)}
      >
        <Ionicons
          name={
            sintomasSeleccionados.includes(sintoma)
              ? 'checkbox'
              : 'square-outline'
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
    backgroundColor: '#f5f6fa',
    paddingHorizontal: 20,
    paddingTop: 50,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  back: {
    color: '#1E88E5',
    fontWeight: '600',
  },

  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  photoSection: {
    alignItems: 'center',
    marginBottom: 25,
  },

  photoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },

  cameraButton: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    backgroundColor: '#1E88E5',
    padding: 8,
    borderRadius: 20,
  },

  photoLabel: {
    marginTop: 10,
    color: '#555',
  },

  section: {
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#333',
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  inputHalf: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    width: '48%',
    marginBottom: 15,
  },

  textArea: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    height: 100,
    marginBottom: 15,
    textAlignVertical: 'top',
  },

  saveButton: {
    backgroundColor: '#1E88E5',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },

  saveText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});