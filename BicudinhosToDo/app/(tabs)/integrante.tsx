import { View, StyleSheet, Text, TouchableOpacity, ActivityIndicator, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTheme } from '@react-navigation/native';
import TopBar from "../components/TopBar";

export default function Integrante() {
  return (
    <View>
      <TopBar title="Tarefas - Integrante" />
      <ScrollView>
        {/* Tela do Integrante */}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  
});