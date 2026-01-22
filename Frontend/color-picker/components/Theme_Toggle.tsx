'use client'

import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { MdDarkMode, MdLightMode } from 'react-icons/md'

export default function ThemeToggle() {
    const [darkMode, setDarkMode] = useState<boolean>(false)

    useEffect(() => {
        const root = window.document.documentElement

        if (darkMode){
            root.classList.add('dark')
        }
        else {
            root.classList.remove('dark')
        }
    }, [darkMode])
  return (
    <div className='flex justify-end p-4'>
        <Button
            onClick={() =>setDarkMode(!darkMode)}
            variant='outline'
            className='hover:bg-transparent'>
            {darkMode ? <MdLightMode color='yellow'/>:<MdDarkMode color='#4ee'/>}
        </Button>
    </div>
  )
}
