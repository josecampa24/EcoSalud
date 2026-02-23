import {
  Feather,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function PatientProfile() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header rosa */}
        <View style={styles.header}>
          <LinearGradient
            colors={['#ff8fb4', '#ff7fd8', '#ff9ce0']}
            style={styles.headerGradient}
          />
        </View>

        {/* Avatar anónimo */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <MaterialCommunityIcons
              name="account"
              size={60}
              color="#ffffff"
            />
          </View>
          <Text style={styles.name}>Juan Pérez</Text>
          <Text style={styles.subtitle}>34 años • O positivo</Text>
        </View>

        {/* Signos vitales */}
        <View style={styles.vitalsCard}>
          <View style={styles.vitalItem}>
            <MaterialCommunityIcons name="heart-pulse" size={22} color="#ff4b6a" />
            <Text style={styles.vitalValue}>72</Text>
            <Text style={styles.vitalUnit}>lpm</Text>
          </View>

          <View style={styles.vitalItem}>
            <MaterialCommunityIcons name="gauge" size={22} color="#2d9cdb" />
            <Text style={styles.vitalValue}>120/80</Text>
          </View>

          <View style={styles.vitalItem}>
            <Feather name="thermometer" size={22} color="#f2994a" />
            <Text style={styles.vitalValue}>36.6°C</Text>
          </View>

          <View style={styles.vitalItem}>
            <MaterialCommunityIcons name="water-percent" size={22} color="#27ae60" />
            <Text style={styles.vitalValue}>98%</Text>
          </View>
        </View>

        {/* Diagnóstico */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Diagnóstico Actual</Text>
          <Text style={styles.sectionText}>
            Hipertensión arterial esencial controlada. Se observa buena respuesta
            al tratamiento actual. Seguimiento trimestral programado.
          </Text>
        </View>

        {/* Alergias */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Alergias</Text>
          <Text style={styles.sectionText}>
            Penicilina, Lactosa, Polen.
          </Text>
        </View>

        {/* Historial reciente */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Historia Reciente</Text>

          <View style={styles.historyItem}>
            <Text style={styles.historyTitle}>Consulta General</Text>
            <Text style={styles.historyDate}>15 Oct 23</Text>
          </View>

          <View style={styles.historyItem}>
            <Text style={styles.historyTitle}>Análisis de Sangre</Text>
            <Text style={styles.historyDate}>02 Oct 23</Text>
          </View>

          <View style={styles.historyItem}>
            <Text style={styles.historyTitle}>Radiografía de Tórax</Text>
            <Text style={styles.historyDate}>20 Sep 23</Text>
          </View>
        </View>

        {/* Botones */}
        <View style={styles.buttonRow}>
          <Pressable style={styles.exportButton}>
            <Text style={styles.exportText}>Exportar</Text>
          </Pressable>

          <Pressable style={styles.newNoteButton}>
            <Text style={styles.newNoteText}>+ Nueva Nota</Text>
          </Pressable>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const CARD_RADIUS = 20;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f7fb',
  },

  header: {
    height: 190,
  },

  headerGradient: {
    flex: 1,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
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
    borderRadius: CARD_RADIUS,
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

  vitalUnit: {
    fontSize: 12,
    color: '#6b7280',
  },

  sectionCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 18,
    borderRadius: CARD_RADIUS,
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
  },

  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },

  historyTitle: {
    fontSize: 14,
  },

  historyDate: {
    fontSize: 13,
    color: '#9ca3af',
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 40,
  },

  exportButton: {
    flex: 1,
    marginRight: 8,
    paddingVertical: 12,
    borderRadius: 30,
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
  },

  exportText: {
    fontWeight: '600',
  },

  newNoteButton: {
    flex: 1,
    marginLeft: 8,
    paddingVertical: 12,
    borderRadius: 30,
    backgroundColor: '#2563eb',
    alignItems: 'center',
  },

  newNoteText: {
    color: '#fff',
    fontWeight: '600',
  },
});