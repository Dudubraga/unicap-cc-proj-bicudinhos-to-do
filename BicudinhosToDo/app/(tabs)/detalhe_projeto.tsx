import { View, StyleSheet, Text, TextInput, Image, TouchableOpacity, ActivityIndicator, Alert, ScrollView, Platform } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTheme } from '@react-navigation/native';
import TopBar from "../components/TopBar";
import { api } from '../services/api';

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