import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { auth } from "../../firebase";

export default function Ajustes() {
  const router = useRouter();
  const user = auth.currentUser;

  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  // Cargar modo guardado
  useEffect(() => {
    const loadSettings = async () => {
      const savedDarkMode = await AsyncStorage.getItem("darkMode");
      if (savedDarkMode !== null) {
        setDarkMode(JSON.parse(savedDarkMode));
      }
    };
    loadSettings();
  }, []);

  // Guardar modo oscuro
  const toggleDarkMode = async (value: boolean) => {
    setDarkMode(value);
    await AsyncStorage.setItem("darkMode", JSON.stringify(value));
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/");
    } catch (error) {
      Alert.alert("Error", "No se pudo cerrar sesión");
    }
  };

  // 🎨 COLORES DINÁMICOS
  const theme = {
    background: darkMode ? "#121212" : "#f5f7fb",
    card: darkMode ? "#1e1e1e" : "#fff",
    text: darkMode ? "#fff" : "#000",
    subtext: darkMode ? "#aaa" : "#6c757d",
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <Text style={[styles.title, { color: theme.text }]}>Ajustes</Text>

      {/* PERFIL */}
      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <Text style={[styles.label, { color: theme.subtext }]}>Correo</Text>
        <Text style={[styles.value, { color: theme.text }]}>
          {user?.email || "No disponible"}
        </Text>
      </View>

      {/* OPCIONES */}
      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <View style={styles.option}>
          <View style={styles.row}>
            <Ionicons name="moon-outline" size={20} color={theme.text} />
            <Text style={[styles.optionText, { color: theme.text }]}>
              Modo oscuro
            </Text>
          </View>
          <Switch value={darkMode} onValueChange={toggleDarkMode} />
        </View>

        <View style={styles.option}>
          <View style={styles.row}>
            <Ionicons
              name="notifications-outline"
              size={20}
              color={theme.text}
            />
            <Text style={[styles.optionText, { color: theme.text }]}>
              Notificaciones
            </Text>
          </View>
          <Switch value={notifications} onValueChange={setNotifications} />
        </View>
      </View>

      {/* INFO APP */}
      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <Text style={[styles.label, { color: theme.subtext }]}>Versión</Text>
        <Text style={[styles.value, { color: theme.text }]}>
          {Constants.expoConfig?.version || "1.0.0"}
        </Text>
      </View>

      {/* LOGOUT */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={22} color="#fff" />
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
  },
  label: {
    fontSize: 13,
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 5,
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  optionText: {
    marginLeft: 10,
    fontSize: 15,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoutButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#d9534f",
    padding: 15,
    borderRadius: 15,
    marginTop: 20,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 10,
  },
});
