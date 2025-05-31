import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  CircularProgress,
  List,
  ListItem,
  Divider,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { usePollingState } from "../hooks/usePollingState.ts";
import { dataService } from "../services/DataService.ts";
import { ChatMessage, QueryResponse } from "../types";
import VisualizationRenderer from "./VisualizationRenderer.tsx";

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: `Hello! I can help you analyze flight booking data. Try asking questions like: \n

• "Which airline has the most flights?" \n
• "Compare business vs economy class bookings across airlines"\n
• "Show me the trend of bookings by month" \n
• "Display recent booking records" \n

What would you like to know?`,
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [response, startPolling] = usePollingState<QueryResponse>(
    async () => {
      const lastUserMessage = messages.filter((m) => m.role === "user").pop();
      if (!lastUserMessage) throw new Error("No user message found");
      return await dataService.analyzeData(lastUserMessage.content);
    },
    { pollingInterval: 1000 }
  );

  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages when new messages are added
  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Update messages when LLM response is received
  useEffect(() => {
    if (!response.isLoading && !response.isPending && response.data) {
      const text =
        response.data.text || "Sorry, I couldn't process that query.";
      setMessages((prev) => [...prev, { role: "assistant", content: text }]);
    }
  }, [response.data, response.isLoading, response.isPending]);

  // Handle sending a message
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { role: "user", content: inputValue }]);

    // Clear input
    setInputValue("");

    // Start polling for response
    startPolling();
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  // Handle key press (Enter to send)
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        m: 2,
        height: "98%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>
        Flight Data Analysis
      </Typography>

      <Box sx={{ flex: 1, overflow: "auto", mb: 2 }}>
        <List>
          {messages.map((message, index) => (
            <React.Fragment key={index}>
              <ListItem
                sx={{
                  justifyContent:
                    message.role === "user" ? "flex-end" : "flex-start",
                  mb: 1,
                }}
              >
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    maxWidth: "80%",
                    bgcolor: message.role === "user" ? "#e3f2fd" : "#f5f5f5",
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="body1">{message.content}</Typography>
                </Paper>
              </ListItem>

              {/* Show visualization after assistant message */}
              {message.role === "assistant" &&
                index === messages.length - 1 &&
                response.data && (
                  <ListItem>
                    <Box sx={{ width: "100%" }}>
                      <VisualizationRenderer response={response.data} />
                    </Box>
                  </ListItem>
                )}

              {index < messages.length - 1 && (
                <Divider variant="fullWidth" sx={{ my: 1 }} />
              )}
            </React.Fragment>
          ))}

          {/* Show loading indicator when waiting for response */}
          {(response.isLoading || response.isPending) && (
            <ListItem sx={{ justifyContent: "flex-start", mb: 1 }}>
              <CircularProgress size={24} sx={{ mr: 2 }} />
              <Typography variant="body2">Analyzing your query...</Typography>
            </ListItem>
          )}

          {/* Error message if something went wrong */}
          {response.error && (
            <ListItem sx={{ justifyContent: "flex-start", mb: 1 }}>
              <Paper
                elevation={1}
                sx={{ p: 2, bgcolor: "#ffebee", borderRadius: 2 }}
              >
                <Typography variant="body2" color="error">
                  Error: {response.error.message}
                </Typography>
              </Paper>
            </ListItem>
          )}

          <div ref={endOfMessagesRef} />
        </List>
      </Box>

      <Box sx={{ display: "flex", mt: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Ask a question about flight data..."
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          disabled={response.isLoading || response.isPending}
          sx={{ mr: 1 }}
        />
        <Button
          variant="contained"
          color="primary"
          endIcon={<SendIcon />}
          onClick={handleSendMessage}
          disabled={
            response.isLoading || response.isPending || !inputValue.trim()
          }
        >
          Send
        </Button>
      </Box>
    </Paper>
  );
};

export default ChatInterface;
