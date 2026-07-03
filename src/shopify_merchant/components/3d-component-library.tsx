import React, { useState, useRef, MouseEvent } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Sparkles, ArrowUpRight, ShieldCheck, Zap } from 'lucide-react';

interface GlassCard3DProps {
  title: string;
  description?: string;
  tag?: string;
  accentColor?: string;
  isDark?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
  delay?: number;
  key?: React.Key;
}

interface MotionConfig {
  delay?: number;
  duration?: number;
}

/**
 * Custom minimalist motion hook matching the Atelier Noir aesthetic
 */
export function useMotion(config?: MotionConfig) {
  const delay = config?.delay ?? 0;
  const duration = config?.duration ?? 0.55;

  return {
    initial: { opacity: 0, y: 12, scale: 0.985 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1] as const,
    },
    whileHover: { 
      scale: 1.01,
      y: -2,
      transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] as const } 
    },
    whileTap: { 
      scale: 0.995 
    }
  };
}

/**
 * High-End 3D Parallax Glassmorphism Card
 * Features premium interactive lighting reflection and 1px borders
 */
export function GlassCard3D({
  title,
  description,
  tag = 'ACTIVE',
  accentColor = '#07C2E3',
  isDark = true,
  onClick,
  children,
  delay = 0
}: GlassCard3DProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const motionProps = useMotion({ delay });

  // Mouse tilt variables
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for fluid inertia
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [15, -15]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-15, 15]), { stiffness: 150, damping: 20 });

  // Glass flash reflection translation
  const flashX = useSpring(useTransform(x, [-0.5, 0.5], ['-100%', '100%']), { stiffness: 200, damping: 25 });
  const flashY = useSpring(useTransform(y, [-0.5, 0.5], ['-100%', '100%']), { stiffness: 200, damping: 25 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;

    x.set(mouseX / width);
    y.set(mouseY / height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const borderClass = isDark 
    ? 'border-[#38383A] bg-[#1C1C1E]/80 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.5)]' 
    : 'border-[#E1E3E5] bg-[#FFFFFF]/85 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.06)]';

  const textPrimary = isDark ? 'text-white' : 'text-[#202223]';
  const textSecondary = isDark ? 'text-[#8E8E93]' : 'text-[#6D7175]';

  return (
    <div className="perspective-[1000px] w-full" id="glass-3d-card-wrapper">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        {...motionProps}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className={`relative rounded-2xl p-6 border ${borderClass} overflow-hidden cursor-pointer transition-all duration-300 group`}
      >
        {/* Holographic interactive reflection shine layer */}
        <motion.div
          className="absolute inset-x-0 -inset-y-12 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none opacity-40 mix-blend-overlay blur-md"
          style={{ x: flashX, y: flashY }}
        />

        {/* Polaris Ambient radial background gradient representing 3D Depth */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none group-hover:opacity-25 transition-opacity"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${accentColor} 0%, transparent 70%)`
          }}
        />

        {/* Content with simulated depth parallax transformation */}
        <div className="relative space-y-4 [transform:translateZ(40px)] select-none">
          <div className="flex items-center justify-between">
            <span 
              className="px-2.5 py-0.5 rounded-full font-mono text-[9px] font-bold tracking-widest uppercase border border-opacity-30"
              style={{ 
                color: accentColor, 
                backgroundColor: `${accentColor}15`, 
                borderColor: `${accentColor}50` 
              }}
            >
              {tag}
            </span>
            <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors" />
          </div>

          <div className="space-y-1 text-left">
            <h3 className={`text-base font-extrabold tracking-tight ${textPrimary} font-sans`}>
              {title}
            </h3>
            <p className={`text-xs ${textSecondary} leading-relaxed`}>
              {description}
            </p>
          </div>

          {children}
        </div>
      </motion.div>
    </div>
  );
}

interface CyberBadgeProps {
  label?: string;
  text?: string;
  icon?: React.ComponentType<any>;
  accentColor?: string;
  color?: string;
  active?: boolean;
  pulse?: boolean;
}

/**
 * Shopify Commerce OS Cyber Badge Component
 */
export function CyberBadge({ 
  label, 
  text,
  icon: Icon = Sparkles, 
  accentColor, 
  color,
  active,
  pulse
}: CyberBadgeProps) {
  const displayLabel = label || text || '';
  const finalAccentColor = accentColor || color || '#07C2E3';
  const finalActive = active !== undefined ? active : (pulse !== undefined ? pulse : false);

  return (
    <div 
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase transition-all border ${
        finalActive 
          ? 'bg-neutral-900 border-opacity-40 text-white' 
          : 'bg-neutral-150 border-neutral-300 text-neutral-500'
      }`}
      style={{ borderColor: finalActive ? `${finalAccentColor}50` : undefined }}
    >
      <Icon className="w-3.5 h-3.5" color={finalActive ? finalAccentColor : undefined} />
      <span>{displayLabel}</span>
      {finalActive && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: finalAccentColor }} />
          <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: finalAccentColor }} />
        </span>
      )}
    </div>
  );
}

interface HoloViewportProps {
  gridScale?: number;
  pulseColor?: string;
  title?: string;
}

/**
 * 3D Holographic System Diagnostics Viewport
 */
export function HoloViewport({ 
  gridScale = 16, 
  pulseColor = '#07C2E3',
  title = 'ACTIVE SYSTEM DECK'
}: HoloViewportProps) {
  return (
    <div className="relative rounded-2xl bg-neutral-950 p-6 overflow-hidden border border-neutral-850 shadow-2xl h-44 flex items-center justify-center">
      {/* 3D Grid Orthogonal Lines */}
      <div 
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: `radial-gradient(${pulseColor} 1px, transparent 1px)`,
          backgroundSize: `${gridScale}px ${gridScale}px`
        }}
      />
      
      {/* Visual sweep scanning bar */}
      <div 
        className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#07C2E3] to-transparent opacity-60 animate-[bounce_6s_infinite_ease-in-out]"
      />

      <div className="z-10 flex flex-col items-center text-center space-y-1.5 select-none">
        <Zap className="w-6 h-6 text-[#07C2E3] animate-pulse" />
        <span className="text-[10px] font-mono font-bold tracking-widest text-[#07C2E3] block">
          {title}
        </span>
        <div className="flex items-center gap-2">
          <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[9px] font-bold border border-emerald-500/20">
            HSTS LINK SECURE
          </span>
          <span className="px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-400 font-mono text-[9px] border border-neutral-700">
            LATENCY: 1.2ms
          </span>
        </div>
      </div>
    </div>
  );
}
