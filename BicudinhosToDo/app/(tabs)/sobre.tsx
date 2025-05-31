import { Text, View, StyleSheet, Platform } from "react-native";
import { useTheme } from '@react-navigation/native';
import TopBar from "../components/TopBar";

export default function Sobre() {
  const { colors } = useTheme();

  return (
    <View>
      <TopBar title="Sobre o App" />
      <View>
        {/* Tela Sobre */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  
});