import { Text, View, StyleSheet, Platform } from "react-native";
import { useTheme } from "@react-navigation/native";
import TopBar from "../components/TopBar";

export default function Sobre() {
  const { colors } = useTheme();

  return (
    <View style={[styles.body, { backgroundColor: colors.background }]}>
      <TopBar title="Sobre o App" />
      <View style={styles.container}>
        <Text style={[styles.text, { color: colors.text }]}>
          Este aplicativo foi desenvolvido como parte de uma atividade acadêmica
          para a disciplina de Programação Web Mobile na UNICAP.
        </Text>
        <Text style={[styles.text, { color: colors.text }]}>
          O objetivo do app é ajudar nosso grupo da faculdade a organizar as
          tarefas e responsabilidades de cada integrante nos projetos,
          facilitando o acompanhamento do progresso e a colaboração.
        </Text>
        <Text style={[styles.subtitle, { color: colors.text }]}>
          Tecnologias Utilizadas:
        </Text>
        <Text style={[styles.text, { color: colors.text }]}>
          • React Native com Expo{"\n"}• Expo Router para navegação{"\n"}•
          Gerenciamento de estado global com Zustand{"\n"}• Integração com
          back-end para CRUD de tarefas{"\n"}• Exibição de entidades e
          relacionamento entre usuários e tarefas
        </Text>
        <Text style={[styles.text, { color: colors.text }]}>
          O app possui telas de home, sobre, uma tela dedicada para os
          integrantes da equipe, tela para criação de projeto e tela para edição
          de projeto.
        </Text>
        <Text style={[styles.subtitle, { color: colors.text }]}>
          Integrantes:
        </Text>
        <Text style={[styles.names, { color: colors.text }]}>
          Eduardo Costa Braga{"\n"}
          Henrique Franca Alves de Lima{"\n"}
          Isabela Medeiros Belo Lopes{"\n"}
          Júlia Vilela Cintra Galvão{"\n"}
          Rafael Viana Angelim{"\n"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  container: {
    flex: 1,
    alignItems: "center",
    alignSelf: "center",
    width: "90%",
    padding: 20,
    borderRadius: 15,
  },
  subtitle: {
    fontSize: Platform.OS === "ios" ? 22 : 20,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 6,
  },
  text: {
    fontSize: Platform.OS === "ios" ? 18 : 16,
    textAlign: "justify",
    marginBottom: 8,
  },
  names: {
    fontSize: Platform.OS === "ios" ? 18 : 16,
    textAlign: "center",
    marginBottom: 8,
  },
});
