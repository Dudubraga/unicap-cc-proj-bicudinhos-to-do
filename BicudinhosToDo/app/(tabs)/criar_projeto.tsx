import { View, StyleSheet, Text, TextInput, Image, TouchableOpacity, ActivityIndicator, Platform, ScrollView, } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { useTheme } from '@react-navigation/native';
import DateTimePicker from "@react-native-community/datetimepicker";
import TopBar from "../components/TopBar";

export default function CriarProjeto() {
  return (
    <View>
      <TopBar title="Criar Projeto" />
      <View>
        {/* Tela Criar Projeto */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({

});