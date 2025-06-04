import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Platform } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { api } from '../services/api';
import TopBar from "../components/TopBar";
import { useTheme } from '@react-navigation/native';

export default function DetalheProjeto() {
  const router = useRouter();
  const { projectId } = useLocalSearchParams<{ projectId: string }>();
  const { colors } = useTheme();

  const [cadeira, setCadeira] = useState("");
  const [descricao, setDescricao] = useState("");
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  
  const [newTaskName, setNewTaskName] = useState("");
  const [newSelectedIntegrantes, setNewSelectedIntegrantes] = useState<string[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjectDetails = async () => {
    if (!projectId) return;
    const endpoint = `Projeto/${projectId}?include=Tarefas`;
    try {
      !loading && setLoading(true);
      const data = await api.get(endpoint);
      setCadeira(data.cadeira);
      setDescricao(data.descricao);
      setTarefas(data.Tarefas || []);
    } catch (e: any) {
      setError(e.message);
      Alert.alert("Erro", "Falha ao carregar detalhes do projeto.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchProjectDetails();
    }
  }, [projectId]);

  const handleToggleTask = async (task: Tarefa) => {
    const endpoint = `Tarefas/${task.objectId}`;
    const newStatus = !task.concluida;
    try {
      await api.put(endpoint, { concluida: newStatus });
      setTarefas(prevTasks =>
        prevTasks.map(t =>
          t.objectId === task.objectId ? { ...t, concluida: newStatus } : t
        )
      );
    } catch (e: any) {
      Alert.alert("Erro", "Não foi possível atualizar a tarefa.");
    }
  };

  const handleAddTask = async () => {
    if (!newTaskName || newSelectedIntegrantes.length === 0) {
      Alert.alert("Atenção", "Preencha o nome da tarefa e selecione ao menos um integrante.");
      return;
    }
    if (!projectId) {
        Alert.alert("Erro", "ID do projeto não encontrado.");
        return;
    }

    try {
      const newTarefaData = {
        nome: newTaskName,
        integrantes: newSelectedIntegrantes,
        concluida: false
      };
      const newTarefa = await api.post('Tarefas', newTarefaData);

      const updateProjectPayload = {
        Tarefas: {
          __op: 'AddUnique',
          objects: [{ __type: 'Pointer', className: 'Tarefas', objectId: newTarefa.objectId }]
        }
      };
      await api.put(`Projeto/${projectId}`, updateProjectPayload);

      Alert.alert("Sucesso", "Nova tarefa adicionada!");
      setNewTaskName("");
      setNewSelectedIntegrantes([]);
      fetchProjectDetails();
    } catch (e: any) {
        Alert.alert("Erro", `Não foi possível adicionar a nova tarefa: ${e.message}`);
    }
  };
  const handleUpdateProject = async () => {
    if (!projectId) return;
    const endpoint = `Projeto/${projectId}`;
    try {
      await api.put(endpoint, { cadeira, descricao });
      Alert.alert("Sucesso", "Projeto atualizado!");
      router.back();
    } catch (e: any) {
      Alert.alert("Erro", `Não foi possível salvar as alterações: ${e.message}`);
    }
  };

  const handleDeleteProject = async () => {
    if (!projectId) return;
    const endpoint = `Projeto/${projectId}`;
    try {
      await api.del(endpoint);
      Alert.alert("Sucesso", "Projeto excluído.");
      router.push('/');
    } catch (e: any) {
      Alert.alert("Erro", `Não foi possível excluir o projeto: ${e.message}`);
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      "Confirmar Exclusão",
      "Você tem certeza que deseja excluir este projeto? Esta ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", style: "destructive", onPress: handleDeleteProject },
      ]
    );
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#9C743A" />
      </View>
    );
  }

  if (error && !loading) {
    return (
        <View style={[styles.body, {backgroundColor: colors.background}]}>
            <TopBar title="Detalhes do Projeto" />
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20}}>
                <Text style={styles.errorText}>Erro: {error}</Text>
                <TouchableOpacity style={styles.saveButton} onPress={fetchProjectDetails}>
                    <Text style={styles.buttonText}>Tentar Novamente</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
  }

  return (
    <View>
      <TopBar title="Detalhe do Projeto" />
      <View>
        {/* Tela Detalhe do Projeto */}
      </View>
    </View>
  );
}

const m = Platform.OS === "ios" ? 12 : 10;
const styles = StyleSheet.create({
    body: {
        flex: 1,
    },
    container: {
        padding: 20,
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 8,
    },
    input: {
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#9C743A'
    },
    inputDescricao: {
        height: 100,
        textAlignVertical: 'top',
    },
    taskCard: {
        borderRadius: 8,
        padding: 16,
        marginBottom: 10,
    },
    taskContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 24,
        height: 24,
        marginRight: 12,
    },
    taskText: {
        fontSize: 16,
        fontWeight: 'bold',
        flex: 1,
    },
    taskTextCompleted: {
        textDecorationLine: 'line-through',
    },
    integrantesText: {
        fontSize: 14,
        marginTop: 4,
        marginLeft: 36,
    },
    addTaskContainer: {
        marginTop: 24,
        paddingTop: 24,
        borderTopWidth: 1,
    },
    integrantesLabel: {
        fontSize: 16,
        marginTop: 12,
        marginBottom: 8,
    },
    integrantesSelector: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 12,
    },
    integranteChip: {
        backgroundColor: '#e0e0e0',
        borderRadius: 16,
        paddingVertical: 6,
        paddingHorizontal: m,
        margin: 4,
    },
    integranteChipSelected: {
        backgroundColor: '#7B2D2F',
    },
    integranteChipText: {
        color: '#333',
    },
    integranteChipTextSelected: {
        color: '#fff',
    },
    addButton: {
        backgroundColor: '#3B9C7A',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 12,
    },
    saveButton: {
        backgroundColor: '#9C743A',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 30,
    },
    deleteButton: {
        backgroundColor: '#7B2D2F',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 12,
        marginBottom: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        fontSize: 16,
        marginBottom: 10,
    },
});