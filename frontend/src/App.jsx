import React from "react";
import AuthPage from "./pages/AuthPage";
import { Route, Routes } from "react-router-dom";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="auth" element={<AuthPage />} />
      </Routes>
    </>
  );
};

export default App;
