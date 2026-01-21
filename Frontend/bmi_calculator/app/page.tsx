'use client'
import BMICalculator from "@/components/BMI-Calculator";
import { useEffect, useRef } from "react";
import * as THREE from 'three';



export default function Home() {
  // Ref for the container where Vanta background will be applied
      const vantaRef = useRef<HTMLDivElement>(null);
  
      // Ref to store the Vanta effect instance for cleanup
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const vantaEffect = useRef<any>(null)
  
       // Vanta.js background effect initialization
      useEffect(() => {
          const loadVanta = async () => {
          // Dynamically import Vanta Globe effect
          const FOG = (await import('vanta/dist/vanta.fog.min')).default
  
          // Initialize the Vanta effect with custom options
          vantaEffect.current = FOG({
              el: vantaRef.current, // Target element
              THREE: THREE, // Provide THREE.js module
              mouseControls: true,
              touchControls: true,
              gyroControls: false,
  
             // 🟣 Customize fog colors
              highlightColor: 0xff3f81,   // top fog glow
              midtoneColor: 0x6e44ff,     // middle fog body
              lowlightColor: 0x1a1a2e,    // base/edges of fog
              baseColor: 0xffffff,        // background/fog base

              blurFactor: 0.5,
              speed: 1.5,
              zoom: 1.0
          })
          }
  
          // Only load the effect if it's not already loaded and the ref is ready
          if (!vantaEffect.current && vantaRef.current) {
          loadVanta()
      }
  
      // Cleanup: destroy the effect on component unmount
      return () => {
        if (vantaEffect.current) vantaEffect.current.destroy()
      }
    }, [])
  return (
  <>
    <div ref={vantaRef} className="relative">
      <BMICalculator/>
    </div>
    
  </>
  );
}
