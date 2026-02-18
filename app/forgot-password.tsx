
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import React from 'react';
import { Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Svg, { Defs, Path, Stop, LinearGradient as SvgLinearGradient } from 'react-native-svg';

const { width } = Dimensions.get('window');

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

export default function ForgotPassword() {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.containerSvg}>
        <SvgTop />
      </View>
      <View style={styles.container}>
        <Text style={styles.titulo}>Forgot Password?</Text>
        <Text style={styles.subtitulo}>Enter your email for a reset link</Text>
        <TextInput 
          style={styles.inputs}
          placeholder='example@gmail.com'
          keyboardType="email-address"
        />
        <TouchableOpacity style={styles.buttonContainer}>
          <LinearGradient
            colors={['#FFB677', '#FF3CBD']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.gradient}
          >
            <Text style={styles.textButton}>SEND</Text>
          </LinearGradient>
        </TouchableOpacity>
        <Link href="/" asChild>
            <TouchableOpacity>
                <Text style={styles.backToLogin}>Back to Sign In</Text>
            </TouchableOpacity>
        </Link>
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
    fontSize: 45,
    fontWeight: "bold",
    color: "#34434D",
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitulo: {
    fontSize: 18,
    color: "gray",
    marginBottom: 20,
    textAlign: 'center'
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
  buttonContainer: {
    width: '80%',
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
  backToLogin: {
    fontSize: 14,
    color: "gray",
    marginTop: 10,
  },
});
