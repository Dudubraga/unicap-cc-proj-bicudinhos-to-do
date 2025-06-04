import { View, StyleSheet, Text, TextInput, Image, TouchableOpacity, ActivityIndicator, Platform, ScrollView, } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { useTheme } from '@react-navigation/native';
import DateTimePicker from "@react-native-community/datetimepicker";
import TopBar from "../components/TopBar";

// integrantes + tasks + pointer

  const integrantes = ["Eduardo", "Henrique", "Isabela", "Júlia", "Rafael"];

  type Task = {
    nome: string;
    integrantes: string[];
  };

  type Pointer = {
    __type: 'Pointer';
    className: string;
    objectId: string;
  };


export default function CriarProjeto() {

  const router = useRouter();
  const [taskInput, setTaskInput] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [date, setDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedIntegrantes, setSelectedIntegrantes] = useState<string[]>([]);
  const [cadeira, setCadeira] = useState("");
  const [descricao, setDescricao] = useState("");
  const [loading, setLoading] = useState(false);
  const { colors } = useTheme();

  async function createTarefaAndGetPointer(task: Task): Promise<Pointer> {
    const applicationId = process.env.EXPO_PUBLIC_PARSE_APPLICATION_ID;
    const restApiKey = process.env.EXPO_PUBLIC_PARSE_REST_API_KEY;

    if (!applicationId || !restApiKey) {
      throw new Error("As chaves da API não foram encontradas. Verifique o arquivo .env");
    }

    const handleAddTask = () => {
    if (taskInput.trim() !== "") {
      setTasks([...tasks, { nome: taskInput, integrantes: selectedIntegrantes }]);
      setTaskInput("");
      setSelectedIntegrantes([]);
     }
    };

    const response = await fetch('https://parseapi.back4app.com/classes/Tarefas', {
      method: 'POST',
      headers: {
        'X-Parse-Application-Id': applicationId,
        'X-Parse-REST-API-Key': restApiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nome: task.nome,
        integrantes: task.integrantes,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Falha ao criar a tarefa "${task.nome}": ${errorData.error}`);
    }

    const createdTask = await response.json();
    return {
      __type: 'Pointer',
      className: 'Tarefas',
      objectId: createdTask.objectId,
    };
    
  }

  async function handleSubmitProjeto() {
    const applicationId = process.env.EXPO_PUBLIC_PARSE_APPLICATION_ID;
    const restApiKey = process.env.EXPO_PUBLIC_PARSE_REST_API_KEY;

    if (loading) return;
    if (!cadeira || !descricao || tasks.length === 0) {
      alert("Por favor, preencha a cadeira, descrição e adicione pelo menos uma tarefa.");
      return;
    }

    setLoading(true);
    try {
      const tarefaPointers = await Promise.all(
        tasks.map(task => createTarefaAndGetPointer(task))
      );

      const projetoPayload = {
        cadeira,
        descricao,
        dataEntrega: date ? { __type: 'Date', iso: date.toISOString() } : null,
        Tarefas: tarefaPointers,
      };

      if (!applicationId || !restApiKey) {
        throw new Error("As chaves da API não foram encontradas. Verifique o arquivo .env");
      }

      const response = await fetch('https://parseapi.back4app.com/classes/Projeto', {
        method: 'POST',
        headers: {
            'X-Parse-Application-Id': applicationId,
            'X-Parse-REST-API-Key': restApiKey,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(projetoPayload),
      });

      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Falha ao criar o projeto final.");
      }

      alert("Projeto criado com sucesso!");
      
      setCadeira("");
      setDescricao("");
      setDate(null);
      setTasks([]);

      router.push('/');
    } catch (error: any) {
      // o ideal seria deletar as tarefas já criadas, mas por simplicidade, so exibimos o erro
      alert(`Erro no processo: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

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