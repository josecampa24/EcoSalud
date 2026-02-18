import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Svg, { Defs, Path, Stop, LinearGradient as SvgLinearGradient } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

export default function App() {

  function SvgTop() {
    return (
      <Svg
        width={width}
        height={250}
        viewBox={`0 0 ${width} 250`}
      >
        <Defs>
          <SvgLinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor="#FFB677" stopOpacity="1" />
            <Stop offset="1" stopColor="#FF3CBD" stopOpacity="1" />
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
        {/* AQUI ESTABA EL CAMBIO: De 'Hello' a 'EcoSalud' */}
        <Text style={styles.titulo}>EcoSalud</Text>
        <Text style={styles.subtitulo}>Sign In to your account</Text>
        
        <TextInput 
          style={styles.inputs}
          placeholder='example@gmail.com'
          keyboardType="email-address"
        />
        <TextInput 
          style={styles.inputs}
          placeholder='password'
          secureTextEntry={true}
        />

        <Link href="/forgot-password" style={styles.forgotPasswordContainer}>
          <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
        </Link>

        <TouchableOpacity style={styles.buttonContainer}>
          <LinearGradient
            colors={['#FFB677', '#FF3CBD']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.gradient}
          >
            <Text style={styles.textButton}>SIGN IN</Text>
          </LinearGradient>
        </TouchableOpacity>
        
        <StatusBar style="auto" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1, 
    backgroundColor: '#f1f1f1',
  },
  containerSvg: {
    width: width,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  container: {
    flex: 1, 
    alignItems: 'center',
    width: width,
    paddingTop: 10, 
  },
  titulo: {
    fontSize: 55, // Esto le da el tamaño grande como en la foto
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
  forgotPasswordContainer: {
    width: '80%',
    alignItems: 'flex-end',
    marginTop: 10,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: 'gray',
  },
  buttonContainer: {
    width: '50%',
    marginTop: 30,
    marginBottom: 20,
  },
  gradient: {
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textButton: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
});