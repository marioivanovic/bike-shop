import React, { createContext, useState } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('light');

    const themeToggle = () => {
        setTheme((previousTheme) => (previousTheme === 'light' ? 'dark' : 'light'));
    };
    return (

        <ThemeContext.Provider value={{ theme, themeToggle }}>
            <div className={`app ${theme}`} style={{
                minHeight: '100vh'
            }}>{children}</div>

        </ThemeContext.Provider>
    )

}
