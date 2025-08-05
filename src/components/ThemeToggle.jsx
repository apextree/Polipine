import { useTheme } from '../context/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className="theme-toggle-container">
      <span className="theme-label">🌞</span>
      <label className="theme-toggle">
        <input
          type="checkbox"
          checked={isDarkMode}
          onChange={toggleTheme}
          className="theme-toggle-input"
        />
        <span className="theme-toggle-slider"></span>
      </label>
      <span className="theme-label">🌙</span>
    </div>
  );
};

export default ThemeToggle;
