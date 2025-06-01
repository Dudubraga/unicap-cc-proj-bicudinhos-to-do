import { View, StyleSheet, Text, TextInput, Image, TouchableOpacity, ActivityIndicator, Alert, ScrollView, Platform } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTheme } from '@react-navigation/native';
import TopBar from "../components/TopBar";
import { api } from '../services/api';

export default function DetalheProjeto() {
  return (
    <View>
      <TopBar title="Detalhe do Projeto" />
      <View>
        {/* Tela Detalhe do Projeto */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({

});