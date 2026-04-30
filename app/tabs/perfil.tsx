import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { getAuth, signOut } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, {
  Defs,
  Path,
  Stop,
  LinearGradient as SvgLinearGradient,
} from "react-native-svg";
import { db } from "../../firebase";

const { width } = Dimensions.get("window");

function SvgTop() {
  return (
    <Svg width={width} height={220} viewBox={`0 0 ${width} 220`}>
      <Defs>
        <SvgLinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor="#1E5FA8" />
          <Stop offset="1" stopColor="#2FA4D6" />
        </SvgLinearGradient>
      </Defs>
      <Path
        d={`M0 0 H${width} V150 C${width} 150 ${width * 0.7} 220 ${
          width * 0.5
        } 180 C${width * 0.3} 140 0 200 0 200 V0 Z`}
        fill="url(#grad)"
      />
    </Svg>
  );
}

export default function Perfil() {
  const router = useRouter();

  const [usuario, setUsuario] = useState<any>(null);
  const [pacientes, setPacientes] = useState<any[]>([]);
  const [imagen, setImagen] = useState<string | null>(null);

  useEffect(() => {
    const cargarDatos = async () => {
      const user = getAuth().currentUser;
      if (!user) return;

      const qUser = query(
        collection(db, "usuarios"),
        where("uid", "==", user.uid)
      );

      const snapUser = await getDocs(qUser);

      if (!snapUser.empty) {
        setUsuario(snapUser.docs[0].data());
      }

      const qPacientes = query(
        collection(db, "registros"),
        where("uid", "==", user.uid)
      );

      const snapPacientes = await getDocs(qPacientes);

      const lista = snapPacientes.docs.map((doc) => doc.data());
      setPacientes(lista);
    };

    cargarDatos();
  }, []);

  const elegirImagen = async () => {
    const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permiso.granted) {
      Alert.alert("Permiso requerido", "Se necesita acceso a la galería");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImagen(result.assets[0].uri);
    }
  };

  const cerrarSesion = async () => {
    try {
      await signOut(getAuth());
      router.replace("/");
    } catch (error) {
      console.log(error);
    }
  };

  if (!usuario) return null;

  return (
    <View style={styles.mainContainer}>
      <View style={styles.containerSvg}>
        <SvgTop />
      </View>

      <SafeAreaView style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>

          {/* AVATAR */}
          <TouchableOpacity onPress={elegirImagen}>
            <View style={styles.avatar}>
              {imagen ? (
                <Image source={{ uri: imagen }} style={styles.avatarImg} />
              ) : (
                <Ionicons name="person" size={40} color="#fff" />
              )}
            </View>
          </TouchableOpacity>

          <Text style={styles.nombre}>{usuario.nombre}</Text>
          <Text style={styles.email}>{usuario.email}</Text>
        </View>

        {/* INFO */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Información</Text>
          <Text>📧 Correo: {usuario.email}</Text>
          <Text>🔒 Contraseña: ********</Text>
        </View>

        {/* PACIENTES */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Pacientes ({pacientes.length})
          </Text>

          <FlatList
            data={pacientes}
            keyExtractor={(_, i) => i.toString()}
            renderItem={({ item }) => (
              <Text style={styles.pacienteItem}>• {item.nombre}</Text>
            )}
          />
        </View>

        {/* BOTÓN CERRAR SESIÓN */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={cerrarSesion}
        >
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#f5f6fa",
  },

  containerSvg: {
    position: "absolute",
    top: 0,
    width: "100%",
  },

  container: {
    flex: 1,
    paddingHorizontal: 20,
  },

  header: {
    alignItems: "center",
    marginTop: 100,
    marginBottom: 20,
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#1E88E5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 4,
    borderColor: "#fff",
    overflow: "hidden",
  },

  avatarImg: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },

  nombre: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
  },

  email: {
    color: "#000",
  },

  card: {
    backgroundColor: "white",
    padding: 18,
    borderRadius: 16,
    marginBottom: 15,
    elevation: 3,
  },

  cardTitle: {
    fontWeight: "bold",
    marginBottom: 8,
    fontSize: 16,
  },

  pacienteItem: {
    marginBottom: 5,
  },

  logoutButton: {
    backgroundColor: "#ef4444",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },

  logoutText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
