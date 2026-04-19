import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, {
  Defs,
  Path,
  Stop,
  LinearGradient as SvgLinearGradient,
} from "react-native-svg";
import { auth } from "../firebase";

const { width } = Dimensions.get("window");

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [errorEmail, setErrorEmail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [errorGeneral, setErrorGeneral] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const isValidEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSignIn = async () => {
    setErrorEmail("");
    setErrorPassword("");
    setErrorGeneral("");

    if (!email) {
      setErrorEmail("El correo es obligatorio");
      return;
    }

    if (!isValidEmail(email)) {
      setErrorEmail("Correo inválido");
      return;
    }

    if (!password) {
      setErrorPassword("La contraseña es obligatoria");
      return;
    }

    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/tabs/pacientes");
    } catch (err) {
      console.log("ERROR:", err);
      const error = err as any;

      if (error.code === "auth/user-not-found") {
        setErrorEmail("El usuario no existe");
      } else if (error.code === "auth/wrong-password") {
        setErrorPassword("Contraseña incorrecta");
      } else if (error.code === "auth/invalid-email") {
        setErrorEmail("Correo inválido");
      } else if (error.code === "auth/invalid-credential") {
        setErrorGeneral("Credenciales incorrectas");
      } else {
        setErrorGeneral("Error al iniciar sesión");
      }
    } finally {
      setLoading(false);
    }
  };

  function SvgTop() {
    return (
      <Svg width={width} height={250} viewBox={`0 0 ${width} 250`}>
        <Defs>
          <SvgLinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor="#1E5FA8" stopOpacity="1" />
            <Stop offset="1" stopColor="#2FA4D6" stopOpacity="1" />
          </SvgLinearGradient>
        </Defs>
        <Path
          d={`M0 0 H${width} V180 C${width} 180 ${width * 0.7} 260 ${width * 0.5} 210 C${width * 0.3} 160 0 220 0 220 V0 Z`}
          fill="url(#grad)"
        />
      </Svg>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.containerSvg}>
        <SvgTop />
      </View>

      <View style={styles.container}>
        <Text style={styles.titulo}>EcoSalud</Text>
        <Text style={styles.subtitulo}>Sign In to your account</Text>

        {/* EMAIL */}
        <TextInput
          style={[styles.inputs, errorEmail ? styles.inputError : {}]}
          placeholder="example@gmail.com"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        {errorEmail ? <Text style={styles.errorText}>{errorEmail}</Text> : null}

        {/* PASSWORD */}
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.inputFull, errorPassword ? styles.inputError : {}]}
            placeholder="password"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#666"
            />
          </TouchableOpacity>
        </View>

        {errorPassword ? (
          <Text style={styles.errorText}>{errorPassword}</Text>
        ) : null}

        {/* ERROR GENERAL */}
        {errorGeneral ? (
          <Text style={styles.errorTextGeneral}>{errorGeneral}</Text>
        ) : null}

        <Link href="/forgot-password" style={styles.forgotPasswordContainer}>
          <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
        </Link>

        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={handleSignIn}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <LinearGradient
              colors={["#2FA4D6", "#1E5FA8"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradient}
            >
              <Text style={styles.textButton}>SIGN IN</Text>
            </LinearGradient>
          )}
        </TouchableOpacity>

        <StatusBar style="auto" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#f1f1f1",
  },
  containerSvg: {
    width: width,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  container: {
    flex: 1,
    alignItems: "center",
    width: width,
    paddingTop: 10,
  },
  titulo: {
    fontSize: 55,
    fontWeight: "bold",
    color: "#34434D",
  },
  subtitulo: {
    fontSize: 18,
    color: "gray",
    marginBottom: 20,
  },
  inputs: {
    width: "80%",
    padding: 10,
    height: 50,
    marginTop: 20,
    borderRadius: 30,
    backgroundColor: "white",
    paddingStart: 20,
    color: "gray",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  passwordContainer: {
    width: "80%",
    position: "relative",
    justifyContent: "center",
  },
  inputFull: {
    width: "100%",
    padding: 10,
    height: 50,
    marginTop: 20,
    borderRadius: 30,
    backgroundColor: "white",
    paddingStart: 20,
    paddingRight: 45,
    color: "gray",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  eyeIcon: {
    position: "absolute",
    right: 15,
    top: 35,
  },
  inputError: {
    borderColor: "red",
    borderWidth: 1,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    width: "80%",
    marginTop: 5,
  },
  errorTextGeneral: {
    color: "red",
    fontSize: 14,
    marginTop: 10,
    textAlign: "center",
  },
  forgotPasswordContainer: {
    width: "80%",
    alignItems: "flex-end",
    marginTop: 10,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: "gray",
  },
  buttonContainer: {
    width: "50%",
    marginTop: 30,
    marginBottom: 20,
  },
  gradient: {
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textButton: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
});
