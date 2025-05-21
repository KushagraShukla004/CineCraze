import React from "react";
import NavLayout from "./components/navigation/NavLayout";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import { Route, Routes } from "react-router-dom";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<NavLayout />}>
          <Route index element={<HomePage />} />
        </Route>
        <Route path="auth" element={<AuthPage />} />
      </Routes>
    </>
  );
};

export default App;
