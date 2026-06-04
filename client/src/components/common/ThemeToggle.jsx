import { useTheme } from "../../context/ThemeContext";
import Button from "./Button";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button variant="outline" onClick={toggleTheme}>
      {theme === "dark" ? "Light" : "Dark"}
    </Button>
  );
};

export default ThemeToggle;