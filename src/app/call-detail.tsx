import { doc, getDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { ALUNO_ID, db } from '../firebase/config';

type Chamado = {
  description: string;
  photoUri?: string | null;
  address?: string | null;
  status: string;
};

export default function CallDetailScreen({ route }: any) {
  const { chamadoId } = route.params;
  const [chamado, setChamado] = useState<Chamado | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function carregarChamado() {
      setLoading(true);
      try {
        const docRef = doc(db, 'alunos', ALUNO_ID, 'chamados', chamadoId);
        const snapshot = await getDoc(docRef);

        if (snapshot.exists()) {
          setChamado(snapshot.data() as Chamado);
        } else {
          Alert.alert('Erro', 'Chamado não encontrado.');
        }
      } catch (error) {
        console.log('Erro ao carregar chamado', error);
        Alert.alert('Erro', 'Não foi possível carregar os detalhes do chamado.');
      } finally {
        setLoading(false);
      }
    }

    carregarChamado();
  }, [chamadoId]);

  async function mudarStatus(novoStatus: string) {
    setUpdating(true);
    try {
      const docRef = doc(db, 'alunos', ALUNO_ID, 'chamados', chamadoId);
      await updateDoc(docRef, { status: novoStatus });

      setChamado((prev) => (prev ? { ...prev, status: novoStatus } : null));
      Alert.alert('Sucesso', 'Status atualizado com sucesso!');
    } catch (error) {
      console.log('Erro ao atualizar status', error);
      Alert.alert('Erro', 'Não foi possível atualizar o status.');
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2e7d32" />
      </View>
    );
  }

  if (!chamado) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Chamado não encontrado.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Status</Text>
        <Text style={styles.statusText}>{chamado.status.toUpperCase()}</Text>

        <Text style={styles.label}>Descrição</Text>
        <Text style={styles.valueText}>{chamado.description}</Text>

        {chamado.address ? (
          <>
            <Text style={styles.label}>Endereço</Text>
            <Text style={styles.valueText}>{chamado.address}</Text>
          </>
        ) : null}

        {chamado.photoUri ? (
          <>
            <Text style={styles.label}>Foto</Text>
            <Image source={{ uri: chamado.photoUri }} style={styles.image} />
          </>
        ) : null}
      </View>

      {updating && <ActivityIndicator size="small" color="#2e7d32" style={{ marginBottom: 12 }} />}

      {chamado.status === 'aberto' && (
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.button, styles.startButton, updating && styles.disabledButton]}
            disabled={updating}
            onPress={() => mudarStatus('atendendo')}
          >
            <Text style={styles.buttonText}>Iniciar Atendimento</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.cancelButton, updating && styles.disabledButton]}
            disabled={updating}
            onPress={() => mudarStatus('cancelado')}
          >
            <Text style={styles.buttonText}>Cancelar Chamado</Text>
          </TouchableOpacity>
        </View>
      )}

      {chamado.status === 'atendendo' && (
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.button, styles.completeButton, updating && styles.disabledButton]}
            disabled={updating}
            onPress={() => mudarStatus('concluido')}
          >
            <Text style={styles.buttonText}>Concluir Atendimento</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText: { fontSize: 16, color: '#999' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#eee',
  },
  label: {
    fontSize: 12,
    color: '#666',
    marginTop: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  statusText: { fontSize: 16, fontWeight: 'bold', color: '#1976d2', marginTop: 4 },
  valueText: { fontSize: 16, color: '#333', marginTop: 4 },
  image: { width: '100%', height: 200, borderRadius: 8, marginTop: 8 },
  actionsContainer: { gap: 10 },
  button: { padding: 16, borderRadius: 8, alignItems: 'center' },
  disabledButton: { opacity: 0.6 },
  startButton: { backgroundColor: '#1976d2' },
  completeButton: { backgroundColor: '#2e7d32' },
  cancelButton: { backgroundColor: '#d32f2f' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});
