import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme, Theme } from "../contexts/ThemeContext";

interface ThemeToggleProps {
  showLabels?: boolean;
  className?: string;
}

export function ThemeToggle({
  showLabels = false,
  className = "",
}: ThemeToggleProps) {
  const { theme, setTheme, toggleTheme } = useTheme();

  // Simple toggle button (light/dark only)
  if (!showLabels) {
    return (
      <button
        onClick={toggleTheme}
        className={`p-2 rounded-lg bg-theme-modal-bg hover:bg-theme-accent/20 hover:cursor-pointer
          border border-theme-border-accent/50 transition-all duration-200
          text-theme-text-primary hover:text-theme-accent ${className}`}
        aria-label="Toggle theme"
      >
        {theme === "dark" ? (
          <Sun className="w-5 h-5" />
        ) : (
          <Moon className="w-5 h-5" />
        )}
      </button>
    );
  }

  // Full theme selector with all options
  const themes: { value: Theme; label: string; icon: React.ReactNode }[] = [
    { value: "light", label: "Light", icon: <Sun className="w-4 h-4" /> },
    { value: "dark", label: "Dark", icon: <Moon className="w-4 h-4" /> },
    { value: "system", label: "System", icon: <Monitor className="w-4 h-4" /> },
  ];

  return (
    <div
      className={`flex gap-1 p-1 rounded-lg bg-theme-modal-bg border border-theme-border-accent/50 ${className}`}
    >
      {themes.map(({ value, label, icon }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium
            transition-all duration-200
            ${
              theme === value
                ? "bg-theme-accent text-theme-envelope-darker"
                : "text-theme-text-muted hover:text-theme-text-primary hover:bg-theme-accent/10"
            }`}
        >
          {icon}
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}

// Compact icon-only theme selector
export function ThemeSelector({ className = "" }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  const themes: { value: Theme; icon: React.ReactNode; label: string }[] = [
    { value: "light", icon: <Sun className="w-4 h-4" />, label: "Light mode" },
    { value: "dark", icon: <Moon className="w-4 h-4" />, label: "Dark mode" },
    {
      value: "system",
      icon: <Monitor className="w-4 h-4" />,
      label: "System theme",
    },
  ];

  return (
    <div
      className={`flex gap-0.5 p-0.5 rounded-full bg-theme-modal-bg/50 backdrop-blur ${className}`}
    >
      {themes.map(({ value, icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={`p-2 rounded-full transition-all duration-200
            ${
              theme === value
                ? "bg-theme-accent text-theme-envelope-darker shadow-sm"
                : "text-theme-text-muted hover:text-theme-text-primary"
            }`}
          aria-label={label}
          title={label}
        >
          {icon}
        </button>
      ))}
    </div>
  );
}
