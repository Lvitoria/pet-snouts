
"use client";

import React, { useEffect, useRef } from 'react';

const AnimatedBackground = () => {
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const background = backgroundRef.current;
    if (!background) return;

    const icons = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🦟', '🦗', '🕷️', '🦂', '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🐅', '🐆', '🦓', '🦏', '🦛', '🐘', '🦒', '🦘', '🐪', '🐫', '🦙', '🦥', '🦨', '🦡', '🐾'];
    const numElements = 40;

    for (let i = 0; i < numElements; i++) {
      const element = document.createElement('div');
      element.classList.add('box', 'animate-fall');
      element.textContent = icons[Math.floor(Math.random() * icons.length)];
      element.style.position = 'absolute';
      element.style.top = '0';
      element.style.left = `${Math.random() * 100}vw`;
      element.style.animationDuration = `${Math.random() * 8 + 7}s`; // 7s to 15s
      element.style.animationDelay = `${Math.random() * 10}s`;
      element.style.fontSize = `${Math.random() * 1.5 + 0.8}rem`; // 0.8rem to 2.3rem
      element.style.filter = `blur(${Math.random() * 1.5}px)`;
      background.appendChild(element);
    }

    // Cleanup function
    return () => {
      if (background) {
        background.innerHTML = '';
      }
    };
  }, []);

  return (
    <div 
      ref={backgroundRef}
      className="absolute top-0 left-0 w-full h-full overflow-hidden z-0"
      id="background-animation"
    />
  );
};

export default AnimatedBackground;
