"use client";

import { useEffect, useRef } from 'react';

interface BackgroundCanvasProps {
  color?: string;
  speed?: number;
  minBlur?: number;
  maxBlur?: number;
  minRadius?: number;
  maxRadius?: number;
  opacity?: number;
}

export default function BackgroundCanvas({
  color = '#4ade80', // Standardmäßig ein Grünton
  speed = 0.005,
  minBlur = 70,
  maxBlur = 150,
  minRadius = 200,
  maxRadius = 400,
  opacity = 0.3
}: BackgroundCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    // Werte für die Animation
    let time = 0;
    let blurFactor = minBlur;
    let radiusFactor = minRadius;
    let blurDirection = 1;
    let radiusDirection = 1;
    
    // Positionen der Schatten
    const glowSpots = [
      { x: width * 0.3, y: height * 0.2, sizeMultiplier: 1 },
      { x: width * 0.7, y: height * 0.3, sizeMultiplier: 0.8 },
      { x: width * 0.2, y: height * 0.6, sizeMultiplier: 0.9 },
      { x: width * 0.8, y: height * 0.7, sizeMultiplier: 0.7 }
    ];
    
    const drawGlowEffect = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Update der Faktoren
      time += speed;
      
      // Sanfte Änderung der Unschärfe
      blurFactor += blurDirection * speed * 15;
      if (blurFactor >= maxBlur || blurFactor <= minBlur) {
        blurDirection *= -1;
      }
      
      // Sanfte Änderung des Radius
      radiusFactor += radiusDirection * speed * 30;
      if (radiusFactor >= maxRadius || radiusFactor <= minRadius) {
        radiusDirection *= -1;
      }
      
      // Zeichne pulsierende Schatten
      glowSpots.forEach(spot => {
        // Berechne aktuelle Werte mit Sinus für weiche Animation
        const currentRadius = radiusFactor * spot.sizeMultiplier;
        const currentBlur = blurFactor * spot.sizeMultiplier;
        
        // Extrahiere Farbkomponenten für rgba
        let r = 0, g = 0, b = 0;
        
        // Behandle Hex-Farben
        if (color.startsWith('#')) {
          const hex = color.slice(1);
          r = parseInt(hex.substr(0, 2), 16);
          g = parseInt(hex.substr(2, 2), 16);
          b = parseInt(hex.substr(4, 2), 16);
        }
        // Für andere Farbformate könnte hier mehr Logik hinzugefügt werden
        
        // Zeichne Schatten mit Radialgradient
        const gradient = ctx.createRadialGradient(
          spot.x, spot.y, 0,
          spot.x, spot.y, currentRadius
        );
        
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${opacity})`);
        gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${opacity * 0.5})`);
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        
        ctx.filter = `blur(${currentBlur}px)`;
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(spot.x, spot.y, currentRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.filter = 'none';
      });
    };
    
    let animationId: number;
    
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      drawGlowEffect();
    };
    
    animate();
    
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      
      // Update der Positionen bei Größenänderung
      glowSpots[0].x = width * 0.3;
      glowSpots[0].y = height * 0.2;
      glowSpots[1].x = width * 0.7; 
      glowSpots[1].y = height * 0.3;
      glowSpots[2].x = width * 0.2;
      glowSpots[2].y = height * 0.6;
      glowSpots[3].x = width * 0.8;
      glowSpots[3].y = height * 0.7;
    };
    
    window.addEventListener('resize', handleResize);
    
    // Aufräumen
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [color, speed, minBlur, maxBlur, minRadius, maxRadius, opacity]);
  
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}

