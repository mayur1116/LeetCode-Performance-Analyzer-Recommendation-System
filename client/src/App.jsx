import { useState, useEffect } from "react";
import Home from "./pages/Home";

function App() {
  // Check localStorage for saved theme, default to light
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  // Apply or remove the "dark" class on <body> whenever darkMode changes
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  function toggleTheme() {
    setDarkMode(!darkMode);
  }

  return <Home darkMode={darkMode} toggleTheme={toggleTheme} />;
}

export default App;
