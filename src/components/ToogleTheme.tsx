import { FC } from 'react';
import { useTheme } from '../providers/ThemeProviders';
import SunIcon from '../assets/icons/SunIcon';
import MoonIcon from '../assets/icons/MoonIcon';

export const ToggleTheme: FC = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button 
      onClick={toggleTheme}
      className="rounded-full cursor-pointer p-2 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      {theme === 'light' ? (
        <MoonIcon />
      ) : (
        <SunIcon />
      )}
    </button>
  );
}