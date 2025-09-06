import React from "react";
import Dashboard from "./components/Dashboard";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="p-4">
        <Dashboard />
      </main>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;
