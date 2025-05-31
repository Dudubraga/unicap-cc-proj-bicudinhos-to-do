import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from '@react-navigation/native';
import TopBar from "../components/TopBar";

export default function Index() {
  return (
    <View>
      <TopBar title="Home" />
      <View>
        {/* Tela Home */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({

});