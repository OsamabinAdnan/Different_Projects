'use client'

import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'

export default function ThemeToggle() {
    const [darkMode, setDarkMode] = useState<boolean>(false)
    const [mounted, setMounted] = useState<boolean>(false)

    useEffect(() => {
        setMounted(true)
        // Check for saved theme preference or default to system preference
        const savedTheme = localStorage.getItem('theme')
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

        if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
            setDarkMode(true)
            document.documentElement.classList.add('dark')
        }
    }, [])

    useEffect(() => {
        if (!mounted) return

        if (darkMode){
            document.documentElement.classList.add('dark')
            localStorage.setItem('theme', 'dark')
        }
        else {
            document.documentElement.classList.remove('dark')
            localStorage.setItem('theme', 'light')
        }
    }, [darkMode, mounted])

    if (!mounted) {
        // Return empty div to prevent hydration mismatch
        return <div className='top-2.5 right-4 fixed'></div>
    }

  return (
    <>
        <div className='top-2.5 right-4 fixed'>
            <Button
                onClick={()=>setDarkMode(!darkMode)}
                variant='outline'
                className='bg-transparent hover:bg-transparent border-1'
            >
                {darkMode ? '🌞':'🌙'}
            </Button>
        </div>
    </>
  )
}
