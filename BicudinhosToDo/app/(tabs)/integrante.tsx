import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import TopBar from "../components/TopBar";
import { api } from "../services/api"; // add depois
import { useTheme } from "@react-navigation/native";

type Tarefa = {
  objectId: string;
  nome: string;
  integrantes: string[];
  concluida: boolean;
};

type Projeto = {
  objectId: string;
  cadeira: string;
  descricao: string;
  Tarefas: Tarefa[];
};

export default function Integrante() {
  const router = useRouter();
  const { nome } = useLocalSearchParams<{ nome: string }>();
  const { colors } = useTheme();

  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!nome) return;

    const fetchTasks = async () => {
      const innerQuery = { integrantes: nome };
      const outerQuery = {
        Tarefas: {
          $inQuery: {
            where: innerQuery,
            className: "Tarefas",
          },
        },
      };

      const params = `where=${JSON.stringify(outerQuery)}&include=Tarefas`;
      const endpoint = `Projeto?${params}`;

      try {
        setLoading(true);
        const data = await api.get(endpoint);
        setProjetos(data.results);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [nome]);

  const handleNavigateToDetails = (projectId: string) => {
    router.push({
      pathname: "./detalhe_projeto",
      params: { projectId: projectId },
    });
  };

  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator size="large" color="#9C743A" />;
    }

    if (error) {
      return (
        <Text style={[styles.errorText, { color: colors.text }]}>
          Erro: {error}
        </Text>
      );
    }

    const projetosDoIntegrante = projetos.filter(
      (p) => p.Tarefas && p.Tarefas.some((t) => t.integrantes.includes(nome!))
    );

    if (projetosDoIntegrante.length === 0) {
      return (
        <Text style={[styles.infoText, { color: colors.text }]}>
          Nenhuma tarefa encontrada para {nome}.
        </Text>
      );
    }

    return projetosDoIntegrante.map((projeto) => (
      <View key={projeto.objectId} style={styles.projetoContainer}>
        <Text
          style={[
            styles.projetoTitle,
            { color: colors.text, borderBottomColor: colors.text },
          ]}
        >
          {projeto.cadeira}
        </Text>
        {projeto.Tarefas.filter((tarefa) =>
          tarefa.integrantes.includes(nome!)
        ).map((tarefa) => (
          <TouchableOpacity
            key={tarefa.objectId}
            onPress={() => handleNavigateToDetails(projeto.objectId)}
          >
            <View style={[styles.taskCard, { backgroundColor: colors.card }]}>
              <Text style={[styles.taskText, { color: colors.text }]}>
                {tarefa.nome}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    ));
  };

  return (
    <View style={[styles.body, { backgroundColor: colors.background }]}>
      <TopBar title={`Tarefas - ${nome}`} />
      <ScrollView>
        <View style={styles.container}>{renderContent()}</View>
      </ScrollView>
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
    width: "90%",
    alignSelf: "center",
    paddingVertical: 20,
  },
  projetoContainer: {
    marginBottom: 24,
  },
  projetoTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    borderBottomWidth: 2,
    paddingBottom: 4,
  },
  taskCard: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
  },
  taskText: {
    fontSize: 16,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    fontSize: 16,
  },
  infoText: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 40,
  },
});
