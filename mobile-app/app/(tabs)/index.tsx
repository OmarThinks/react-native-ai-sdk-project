import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { fetch as expoFetch } from "expo/fetch";
import { useState } from "react";
import { SafeAreaView, ScrollView, Text, TextInput, View } from "react-native";

export default function App() {
  const [input, setInput] = useState("");
  const { messages, error, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      fetch: expoFetch as unknown as typeof globalThis.fetch,
      api: "http://192.168.8.103:3000/api/chat",
    }),
    onError: (error) => console.error(error, "ERROR"),
  });

  if (error) return <Text>{error.message}</Text>;

  return (
    <SafeAreaView style={{ height: "100%" }}>
      <View
        style={{
          height: "95%",
          display: "flex",
          flexDirection: "column",
          paddingHorizontal: 8,
        }}
      >
        <ScrollView style={{ flex: 1 }}>
          {messages.map((m) => (
            <View key={m.id} style={{ marginVertical: 8 }}>
              <View>
                <Text style={{ fontWeight: 700, fontSize: 32, color: "black" }}>
                  {m.role}
                </Text>
                {m.parts.map((part, i) => {
                  switch (part.type) {
                    case "text":
                      return (
                        <Text
                          key={`${m.id}-${i}`}
                          style={{ fontSize: 36, color: "#111" }}
                        >
                          {part.text}
                        </Text>
                      );
                  }
                })}
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={{ marginTop: 8 }}>
          <TextInput
            style={{ backgroundColor: "white", padding: 8, fontSize: 24 }}
            placeholder="Say something..."
            value={input}
            onChange={(e) => setInput(e.nativeEvent.text)}
            onSubmitEditing={(e) => {
              e.preventDefault();
              sendMessage({ text: input });
              setInput("");
            }}
            autoFocus={true}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
