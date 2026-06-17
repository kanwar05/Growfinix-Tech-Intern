import Button from "./Button";
import { useTheme } from "../context/useTheme";
import { FiMoon, FiSun } from "react-icons/fi";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const nextTheme = theme === "dark" ? "light" : "dark";

  return (
    <Button
      aria-label={`Switch to ${nextTheme} mode`}
      className="theme-toggle"
      variant="ghost"
      onClick={toggleTheme}
      title={`Switch to ${nextTheme} mode`}
    >
      <span aria-hidden="true" className="text-base">
        {theme === "dark" ? <FiSun /> : <FiMoon />}
      </span>
    </Button>
  );
};

export default ThemeToggle;
