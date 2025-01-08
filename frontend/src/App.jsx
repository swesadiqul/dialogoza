import React from "react";
import { AuthProvider } from "./context/AuthContext";
import { ChatProvider } from "./context/ChatContext";
import AppRoutes from "./routes";

const App = () => (
  <AuthProvider>
    <ChatProvider>
      <AppRoutes />
    </ChatProvider>
  </AuthProvider>
);

export default App;
