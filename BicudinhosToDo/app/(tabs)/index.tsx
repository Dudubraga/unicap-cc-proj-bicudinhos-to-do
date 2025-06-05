import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import TopBar from "../components/TopBar";
import { useRouter } from "expo-router";
import { useTheme } from "@react-navigation/native";

const integrantes: string[] = [
  "Eduardo",
  "Henrique",
  "Isabela",
  "Júlia",
  "Rafael",
];

function chunkArray<T>(array: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

export default function Index() {
  const router = useRouter();
  const linhas = chunkArray(integrantes, 2);
  const { colors } = useTheme();

  const handleIntegrantePress = (nome: string) => {
    router.push({
      pathname: "./integrante",
      params: { nome: nome },
    });
  };

  return (
    <View style={[styles.body, { backgroundColor: colors.background }]}>
      <TopBar title="Home" />
      <View style={styles.container}>
        {linhas.map((linha, idx) => (
          <View
            key={idx}
            style={linha.length === 1 ? styles.rowCenter : styles.row}
          >
            {linha.map((nome: string) => (
              <TouchableOpacity
                key={nome}
                style={[styles.circle, { backgroundColor: colors.card }]}
                onPress={() => handleIntegrantePress(nome)}
              >
                <Image
                  source={require("../../assets/images/icon-user.png")}
                  style={[styles.icon, { tintColor: colors.text }]}
                />
                <Text style={{ color: colors.text }}>{nome}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
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
    justifyContent: "center",
    width: "90%",
    padding: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  rowCenter: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 30,
  },
  circle: {
    width: 140,
    height: 140,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: "#9C743A",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 30,
  },
  icon: {
    width: 80,
    height: 80,
    opacity: 0.7,
  },
});
