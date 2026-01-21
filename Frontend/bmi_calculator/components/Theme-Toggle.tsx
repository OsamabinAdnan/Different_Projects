'use client'
import React, { useEffect, useState } from 'react'
import { Button } from './ui/button';

export default function ThemeToggle() {
    const [isDark, setIsDark] = useState<boolean>(false);

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }, [isDark])

  return (
    <>
        <div className='absolute top-4 right-6'>
            <Button
                onClick={() =>setIsDark(!isDark)}
                variant='outline'
                className='hover:bg-transparent bg-transparent border-1'>
                {isDark ? '🌞':'🌙'}
            </Button>
        </div>
    </>
  )
}
