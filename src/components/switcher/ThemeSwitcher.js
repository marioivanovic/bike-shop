import React, { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

const ThemeSwitcher = () => {
    const { theme, themeToggle } = useContext(ThemeContext);
    console.log("Thème actuel dans ThemeSwitcher.js :", theme)
    return (
        <div>
            <h3>{theme}</h3>
            <button onClick={themeToggle}>Changes de theme</button>
        </div>
    )

};

export default ThemeSwitcher;