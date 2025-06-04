import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { useTheme } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import TopBar from "../components/TopBar";

// integrantes + tasks + pointer

const integrantes = ["Eduardo", "Henrique", "Isabela", "Júlia", "Rafael"];

type Task = {
  nome: string;
  integrantes: string[];
};

type Pointer = {
  __type: "Pointer";
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
      throw new Error(
        "As chaves da API não foram encontradas. Verifique o arquivo .env"
      );
    }

    const handleAddTask = () => {
      if (taskInput.trim() !== "") {
        setTasks([
          ...tasks,
          { nome: taskInput, integrantes: selectedIntegrantes },
        ]);
        setTaskInput("");
        setSelectedIntegrantes([]);
      }
    };

    const toggleIntegrante = (nome: string) => {
      setSelectedIntegrantes((prev) =>
        prev.includes(nome) ? prev.filter((n) => n !== nome) : [...prev, nome]
      );
    };

    const onChangeDate = (event: any, selectedDate?: Date) => {
      setShowDatePicker(false);
      if (selectedDate) setDate(selectedDate);
    };

    const response = await fetch(
      "https://parseapi.back4app.com/classes/Tarefas",
      {
        method: "POST",
        headers: {
          "X-Parse-Application-Id": applicationId,
          "X-Parse-REST-API-Key": restApiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: task.nome,
          integrantes: task.integrantes,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Falha ao criar a tarefa "${task.nome}": ${errorData.error}`
      );
    }

    const createdTask = await response.json();
    return {
      __type: "Pointer",
      className: "Tarefas",
      objectId: createdTask.objectId,
    };
  }

  async function handleSubmitProjeto() {
    const applicationId = process.env.EXPO_PUBLIC_PARSE_APPLICATION_ID;
    const restApiKey = process.env.EXPO_PUBLIC_PARSE_REST_API_KEY;

    if (loading) return;
    if (!cadeira || !descricao || tasks.length === 0) {
      alert(
        "Por favor, preencha a cadeira, descrição e adicione pelo menos uma tarefa."
      );
      return;
    }

    setLoading(true);
    try {
      const tarefaPointers = await Promise.all(
        tasks.map((task) => createTarefaAndGetPointer(task))
      );

      const projetoPayload = {
        cadeira,
        descricao,
        dataEntrega: date ? { __type: "Date", iso: date.toISOString() } : null,
        Tarefas: tarefaPointers,
      };

      if (!applicationId || !restApiKey) {
        throw new Error(
          "As chaves da API não foram encontradas. Verifique o arquivo .env"
        );
      }

      const response = await fetch(
        "https://parseapi.back4app.com/classes/Projeto",
        {
          method: "POST",
          headers: {
            "X-Parse-Application-Id": applicationId,
            "X-Parse-REST-API-Key": restApiKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(projetoPayload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Falha ao criar o projeto final.");
      }

      alert("Projeto criado com sucesso!");

      setCadeira("");
      setDescricao("");
      setDate(null);
      setTasks([]);

      router.push("/");
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
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.container}>
            <View style={styles.row}>
              <TextInput
                placeholder="Cadeira"
                placeholderTextColor="rgba(156,116,58,0.5)"
                style={[styles.input, { backgroundColor: colors.card }]}
                value={cadeira}
                onChangeText={setCadeira}
              />
              <TouchableOpacity
                style={[styles.iconBox, { backgroundColor: colors.card }]}
                onPress={() => setShowDatePicker(true)}
              >
                <Image
                  source={require("../../assets/images/icon-calendar.png")}
                  style={[styles.icon, { tintColor: colors.text }]}
                />
              </TouchableOpacity>
            </View>
            {showDatePicker && (
              <View style={{ backgroundColor: "lightgrey", borderRadius: 10 }}>
                <DateTimePicker
                  value={date || new Date()}
                  mode="date"
                  display={Platform.OS === "ios" ? "inline" : "default"}
                  onChange={onChangeDate}
                  textColor={Platform.OS === "ios" ? "black" : undefined}
                />
              </View>
            )}
            <TextInput
              placeholder="Descrição"
              placeholderTextColor="rgba(156,116,58,0.5)"
              style={[
                styles.input,
                styles.inputDescricao,
                { backgroundColor: colors.card },
              ]}
              multiline
              value={descricao}
              onChangeText={setDescricao}
            />
            <View style={styles.row}>
              <TextInput
                placeholder="Task"
                placeholderTextColor="rgba(156,116,58,0.5)"
                style={[styles.input, { backgroundColor: colors.card }]}
                value={taskInput}
                onChangeText={setTaskInput}
              />
              <TouchableOpacity
                style={[styles.iconBox, { backgroundColor: colors.card }]}
                onPress={handleAddTask}
              >
                <Image
                  source={require("../../assets/images/icon-add.png")}
                  style={[styles.icon, { tintColor: colors.text }]}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.integrantesRow}>
              {integrantes.map((nome) => (
                <TouchableOpacity
                  key={nome}
                  style={[
                    styles.userBox,
                    selectedIntegrantes.includes(nome) && {
                      borderColor: colors.text,
                    },
                    { backgroundColor: colors.card },
                  ]}
                  onPress={() => toggleIntegrante(nome)}
                >
                  <Image
                    source={require("../../assets/images/icon-user.png")}
                    style={[styles.userIcon, { tintColor: colors.text }]}
                  />
                  <Text style={[{ fontSize: 12 }, { color: colors.text }]}>
                    {nome}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.tasksGrid}>
              {tasks.map((task, i) => (
                <View
                  key={i}
                  style={[styles.taskBox, { backgroundColor: colors.card }]}
                >
                  <Text style={{ color: colors.text, fontSize: 18 }}>
                    {task.nome}
                  </Text>
                  <Text style={{ color: colors.text, fontSize: 12 }}>
                    {task.integrantes.join(", ")}
                  </Text>
                </View>
              ))}
            </View>
            <TouchableOpacity
              style={[
                styles.submitButton,
                loading && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmitProjeto}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Criar Projeto</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
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
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
  },
  container: {
    borderRadius: 0,
    padding: 20,
    margin: 0,
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
    width: "100%",
  },
  input: {
    flex: 1,
    borderColor: "#9C743A",
    borderWidth: 3,
    borderRadius: 12,
    fontSize: 22,
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginRight: 12,
  },
  inputDescricao: {
    maxHeight: 100,
    marginBottom: 18,
    marginRight: 0,
    width: "100%",
  },
  iconBox: {
    width: 60,
    height: 60,
    borderColor: "#9C743A",
    borderWidth: 3,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    width: 36,
    height: 36,
  },
  integrantesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 18,
  },
  userBox: {
    width: 60,
    height: 60,
    borderColor: "#9C743A",
    borderWidth: 3,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  userIcon: {
    width: 36,
    height: 36,
  },
  tasksGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
  taskBox: {
    width: "47%",
    height: 80,
    borderColor: "#9C743A",
    borderWidth: 3,
    borderRadius: 12,
    marginBottom: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButton: {
    backgroundColor: "#9C743A",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
    width: "100%",
    height: 58,
    justifyContent: "center",
  },
  submitButtonDisabled: {
    backgroundColor: "#B0AFAF",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
});
