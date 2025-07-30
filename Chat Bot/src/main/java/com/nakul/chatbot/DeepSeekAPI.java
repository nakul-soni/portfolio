package com.nakul.chatbot;

import okhttp3.*;
import com.google.gson.*;

import java.io.IOException;

public class DeepSeekAPI {
    private static final String API_KEY = "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";

    private static final String API_URL = "https://openrouter.ai/api/v1/chat/completions";

    private final OkHttpClient client = new OkHttpClient();

    public String sendMessage(String message) throws IOException {
        JsonObject payload = new JsonObject();
        payload.addProperty("model", "deepseek/deepseek-chat");

        JsonArray messages = new JsonArray();
        JsonObject userMsg = new JsonObject();
        userMsg.addProperty("role", "user");
        userMsg.addProperty("content", message);
        messages.add(userMsg);

        payload.add("messages", messages);

        // Create request
        Request request = new Request.Builder()
                .url(API_URL)
                .addHeader("Authorization", "Bearer " + API_KEY)
                .addHeader("Content-Type", "application/json")
                .post(RequestBody.create(payload.toString(), MediaType.get("application/json")))
                .build();

        // Debug: Print the payload
        System.out.println("Sending request to OpenRouter:");
        System.out.println(payload.toString());

        // Send request
        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                System.err.println("HTTP Error: " + response.code());
                System.err.println("Response: " + response.body().string());
                throw new IOException("Failed request with code " + response.code());
            }

            // Parse response
            String responseBody = response.body().string();
            System.out.println("Raw response: " + responseBody);

            JsonObject jsonResponse = JsonParser.parseString(responseBody).getAsJsonObject();
            JsonObject messageObj = jsonResponse
                    .getAsJsonArray("choices")
                    .get(0).getAsJsonObject()
                    .getAsJsonObject("message");

            return messageObj.get("content").getAsString().trim();
        }
    }
}
