import { useEffect, useState } from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

type Puerto = { id: number; nombre: string };
type Embarcacion = { id: number; nombre: string; esloraMetros: number; puerto: Puerto };

export default function App() {
  const [embarcaciones, setEmbarcaciones] = useState<Embarcacion[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function cargarEmbarcaciones() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/embarcaciones`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      setEmbarcaciones((await response.json()) as Embarcacion[]);
    } catch {
      setEmbarcaciones([]);
      setError("No se pudo conectar. Comprueba NestJS, PostgreSQL y la URL de la API.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void cargarEmbarcaciones();
  }, []);

  const puertos = [...new Map(embarcaciones.map((e) => [e.puerto.id, e.puerto])).values()];

  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.card}>
        <Text style={styles.eyebrow}>PUERTO · REGISTROS</Text>
        {loading ? <Text style={styles.status}>Cargando…</Text> : null}
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {puertos.map((puerto) => (
          <View key={puerto.id} style={styles.group}>
            <Text style={styles.title}>{puerto.nombre}</Text>
            <Text style={styles.subtitle}>Embarcaciones</Text>
            {embarcaciones
              .filter((e) => e.puerto.id === puerto.id)
              .map((e) => (
                <Text key={e.id} style={styles.item}>
                  {e.nombre} · {e.esloraMetros} m
                </Text>
              ))}
          </View>
        ))}
        <Pressable accessibilityRole="button" onPress={() => void cargarEmbarcaciones()} style={styles.button}>
          <Text style={styles.buttonText}>Volver a cargar</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, justifyContent: "center", padding: 24, backgroundColor: "#f3f5ed" },
  card: { width: "100%", maxWidth: 620, alignSelf: "center", padding: 28, borderRadius: 16, backgroundColor: "#ffffff", gap: 12 },
  eyebrow: { color: "#47705f", fontSize: 12, fontWeight: "700", letterSpacing: 1.2 },
  group: { gap: 6 },
  title: { color: "#183a32", fontSize: 30, fontWeight: "800" },
  subtitle: { color: "#52675d", fontSize: 16, fontWeight: "700" },
  item: { color: "#334d43", fontSize: 16 },
  status: { color: "#52675d" },
  error: { color: "#a13030" },
  button: { alignSelf: "flex-start", marginTop: 4, paddingVertical: 11, paddingHorizontal: 16, borderRadius: 8, backgroundColor: "#204e43" },
  buttonText: { color: "#ffffff", fontWeight: "700" },
});
