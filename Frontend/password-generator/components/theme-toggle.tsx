'use client'
import React from 'react'
import { useTheme } from 'next-themes'
import { MdDarkMode, MdLightMode } from 'react-icons/md'

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <div className='absolute top-4 right-8'>
            <button
                onClick={toggleTheme}
                className='hover:scale-150 hover:bg-transparent transition-all duration-300'
                aria-label={theme === 'dark' ? "Switch to light mode" : "Switch to dark mode"}>
                {theme === 'dark' ? <MdLightMode color='yellow'/> : <MdDarkMode color='#3a59d1'/>}
            </button>
        </div>
    )
}
