import {
  Feather,
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { db } from '../firebase';

type Paciente = {
  nombre: string;
  edad: number;
  altura: number;
  peso: number;
  temperatura: number;
  presion: string;
  foto?:string;
  sintomas?: string[];
  diagnostico?: string;
  recomendaciones?: string;
};

export default function PatientProfile() {
  const { id } = useLocalSearchParams();
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const router = useRouter();

  useEffect(() => {
    const obtenerPaciente = async () => {
      if (!id) return;

      const ref = doc(db, 'registros', id as string);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setPaciente(snap.data() as Paciente);
      }
    };

    obtenerPaciente();
  }, [id]);

  if (!paciente) return null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <LinearGradient
            colors={['#2FA4D6', '#1E5FA8']}
            style={styles.headerGradient}
          />
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={28} color="white" />
          </TouchableOpacity>
        </View>

        {/* Avatar y datos */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
  {paciente.foto ? (
    <Image
      source={{ uri: paciente.foto }}
      style={styles.avatarImage}
    />
  ) : (
    <MaterialCommunityIcons
      name="account"
      size={60}
      color="#ffffff"
    />
  )}
</View>

          <Text style={styles.name}>{paciente.nombre}</Text>
          <Text style={styles.subtitle}>{paciente.edad} años</Text>
        </View>

        {/* Signos vitales */}
        <View style={styles.vitalsCard}>
          <View style={styles.vitalItem}>
            <MaterialCommunityIcons name="heart-pulse" size={22} color="#ff4b6a" />
            <Text style={styles.vitalValue}>{paciente.presion || '--'}</Text>
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

          {paciente.sintomas && paciente.sintomas.length > 0 ? (
            paciente.sintomas.map((s, i) => (
              <Text key={i} style={styles.sectionText}>
                • {s}
              </Text>
            ))
          ) : (
            <Text style={styles.sectionText}>No registrados</Text>
          )}
        </View>

        {/* Diagnóstico */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Diagnóstico</Text>
          <Text style={styles.sectionText}>
            {paciente.diagnostico || 'No registrado'}
          </Text>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Recomendaciones</Text>
          <Text style={styles.sectionText}>
            {paciente.recomendaciones || 'No registrado'}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f7fb',
  },

  header: {
    height: 190,
  },

  avatarImage: {
  width: '100%',
  height: '100%',
  borderRadius: 60,
},

  headerGradient: {
    flex: 1,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },

  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 1,
  },

  avatarContainer: {
    alignItems: 'center',
    marginTop: -70,
    marginBottom: 16,
  },

  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#9ca3af',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#ffffff',
  },

  name: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 10,
  },

  subtitle: {
    fontSize: 14,
    color: '#6b7280',
  },

  vitalsCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 16,
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: '#fff',
    elevation: 3,
  },

  vitalItem: {
    alignItems: 'center',
    flex: 1,
  },

  vitalValue: {
    fontWeight: '700',
    marginTop: 4,
  },

  sectionCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 18,
    borderRadius: 20,
    backgroundColor: '#fff',
    elevation: 2,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },

  sectionText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
});
