import React, { useRef, useEffect } from 'react';
import { PerspectiveId } from '../../types/story';

interface CinematicCanvasRendererProps {
  perspectiveId: PerspectiveId;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  filmGrainEnabled: boolean;
}

interface RainParticle {
  x: number;
  y: number;
  length: number;
  speed: number;
  opacity: number;
}

export const CinematicCanvasRenderer: React.FC<CinematicCanvasRendererProps> = ({
  perspectiveId,
  currentTime,
  duration,
  isPlaying,
  filmGrainEnabled,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rainParticles = useRef<RainParticle[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const lightningIntensity = useRef<number>(0);

  // Initialize rain particles
  useEffect(() => {
    const count = 180;
    const particles: RainParticle[] = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * 1920,
        y: Math.random() * 1080,
        length: 20 + Math.random() * 35,
        speed: 18 + Math.random() * 22,
        opacity: 0.15 + Math.random() * 0.45,
      });
    }
    rainParticles.current = particles;
  }, []);

  // Lightning triggers at specific critical dramatic moments
  useEffect(() => {
    if (
      (currentTime >= 11 && currentTime <= 11.4) ||
      (currentTime >= 44 && currentTime <= 44.6) ||
      (currentTime >= 71 && currentTime <= 71.3)
    ) {
      lightningIntensity.current = 0.85;
    }
  }, [currentTime]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let localFrame = 0;

    const render = () => {
      localFrame++;
      const w = canvas.width;
      const h = canvas.height;

      // Decay lightning
      if (lightningIntensity.current > 0.02) {
        lightningIntensity.current *= 0.86;
      } else {
        lightningIntensity.current = 0;
      }

      ctx.clearRect(0, 0, w, h);

      // 1. Sky & Atmosphere Background
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
      if (perspectiveId === 'witness') {
        skyGrad.addColorStop(0, '#040b14');
        skyGrad.addColorStop(0.6, '#08172b');
        skyGrad.addColorStop(1, '#02060d');
      } else if (perspectiveId === 'suspect') {
        skyGrad.addColorStop(0, '#120707');
        skyGrad.addColorStop(0.6, '#241010');
        skyGrad.addColorStop(1, '#080303');
      } else {
        skyGrad.addColorStop(0, '#100c05');
        skyGrad.addColorStop(0.6, '#1f1809');
        skyGrad.addColorStop(1, '#080603');
      }
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h);

      // Lightning flash layer
      if (lightningIntensity.current > 0) {
        ctx.fillStyle = `rgba(215, 235, 255, ${lightningIntensity.current * 0.45})`;
        ctx.fillRect(0, 0, w, h);
      }

      // 2. Distant City Skyline Silhouettes
      ctx.fillStyle = 'rgba(7, 11, 18, 0.95)';
      const buildingWidths = [140, 90, 160, 110, 180, 130, 200, 120, 150, 170, 110, 190, 140];
      let curX = 0;
      for (let i = 0; i < buildingWidths.length; i++) {
        const bw = buildingWidths[i];
        const bh = 220 + ((i * 53) % 240);
        ctx.fillRect(curX, h - bh - 160, bw, bh + 160);

        // Scattered window lights
        ctx.fillStyle = (i % 2 === 0) ? 'rgba(245, 158, 11, 0.4)' : 'rgba(56, 189, 248, 0.3)';
        for (let wy = h - bh - 140; wy < h - 180; wy += 28) {
          for (let wx = curX + 15; wx < curX + bw - 15; wx += 22) {
            if ((wx + wy + i * 17) % 5 === 0) {
              ctx.fillRect(wx, wy, 8, 12);
            }
          }
        }
        ctx.fillStyle = 'rgba(7, 11, 18, 0.95)';
        curX += bw + 8;
      }

      // 3. Perspective-Specific Architectural Staging
      drawPerspectiveScene(ctx, w, h, perspectiveId, currentTime, duration, localFrame);

      // 4. Torrential Rain Particle Animation
      ctx.lineWidth = 1.5;
      for (let i = 0; i < rainParticles.current.length; i++) {
        const p = rainParticles.current[i];
        ctx.strokeStyle = `rgba(186, 215, 245, ${p.opacity})`;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - 8, p.y + p.length);
        ctx.stroke();

        if (isPlaying) {
          p.x -= 2.5;
          p.y += p.speed;
          if (p.y > h) {
            p.y = -p.length;
            p.x = Math.random() * (w + 200);
          }
          if (p.x < 0) {
            p.x = w + 10;
          }
        }
      }

      // 5. Film Grain / CRT Scanlines
      if (filmGrainEnabled && localFrame % 2 === 0) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.025)';
        for (let g = 0; g < 450; g++) {
          const gx = Math.random() * w;
          const gy = Math.random() * h;
          ctx.fillRect(gx, gy, 1.5, 1.5);
        }
      }

      // 6. Perspective HUD & Watermark
      drawCinematicHUD(ctx, w, h, perspectiveId, currentTime);

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [perspectiveId, currentTime, duration, isPlaying, filmGrainEnabled]);

  return (
    <canvas
      ref={canvasRef}
      width={1920}
      height={1080}
      className="w-full h-full object-cover select-none pointer-events-none"
    />
  );
};

// Helper: Staging the dynamic 2.5D silhouettes for each perspective
function drawPerspectiveScene(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  perspective: PerspectiveId,
  currentTime: number,
  _duration: number,
  frame: number
) {
  const normTime = currentTime; // 0 to 90s

  if (perspective === 'witness') {
    // === WITNESS PERSPECTIVE (Marcus Ward) ===
    // Looking through high-powered telephoto lens across courtyard at Blackwood Heights rooftop
    
    // Parapet of Blackwood Heights across alley
    const roofY = h * 0.58;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(w * 0.35, roofY, w * 0.55, h * 0.42);

    // Granite coping stone
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(w * 0.35, roofY - 14, w * 0.55, 16);

    // Water tower on left casting optical obstruction
    ctx.fillStyle = '#090d16';
    ctx.fillRect(w * 0.12, roofY - 260, 240, 320);
    // Water tower legs
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(w * 0.14, roofY + 60);
    ctx.lineTo(w * 0.16, roofY - 260);
    ctx.moveTo(w * 0.23, roofY + 60);
    ctx.lineTo(w * 0.21, roofY - 260);
    ctx.stroke();

    // Silhouettes of Elena & Julian
    const elenaX = w * 0.72 - (normTime > 40 ? (normTime - 40) * 1.5 : 0);
    const julianX = w * 0.60 + (normTime > 20 ? (normTime - 20) * 0.8 : 0);

    // Julian silhouette
    ctx.fillStyle = '#020617';
    // Body & arms reaching
    ctx.beginPath();
    ctx.arc(julianX, roofY - 110, 18, 0, Math.PI * 2); // Head
    ctx.fillRect(julianX - 16, roofY - 90, 32, 90); // Torso & Trenchcoat
    // Arms extending forward towards Elena
    ctx.lineWidth = 12;
    ctx.strokeStyle = '#020617';
    ctx.beginPath();
    ctx.moveTo(julianX + 12, roofY - 65);
    ctx.lineTo(julianX + 55, roofY - (normTime > 40 ? 45 : 60));
    ctx.stroke();

    // Elena silhouette
    if (normTime < 46) {
      // Standing on ledge
      ctx.beginPath();
      ctx.arc(elenaX, roofY - 115, 16, 0, Math.PI * 2);
      ctx.fillRect(elenaX - 14, roofY - 95, 28, 95);
      // Wind blowing trenchcoat
      ctx.beginPath();
      ctx.moveTo(elenaX + 14, roofY - 70);
      ctx.lineTo(elenaX + 38 + Math.sin(frame * 0.1) * 8, roofY - 30);
      ctx.lineTo(elenaX + 10, roofY);
      ctx.fill();
    } else {
      // Falling sequence (plunging below roof line)
      const fallDelta = (normTime - 46) * 45;
      if (roofY - 80 + fallDelta < h + 100) {
        ctx.beginPath();
        ctx.arc(elenaX + 15, roofY - 80 + fallDelta, 16, 0, Math.PI * 2);
        ctx.fillRect(elenaX + 2, roofY - 60 + fallDelta, 26, 80);
      }
    }

    // Telephoto Binocular / Lens reticle overlay
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    // Center crosshair with mil dots
    ctx.moveTo(w * 0.5 - 70, h * 0.5);
    ctx.lineTo(w * 0.5 + 70, h * 0.5);
    ctx.moveTo(w * 0.5, h * 0.5 - 70);
    ctx.lineTo(w * 0.5, h * 0.5 + 70);
    ctx.stroke();

    // Outer telephoto vignette mask
    const radGrad = ctx.createRadialGradient(w * 0.5, h * 0.5, h * 0.35, w * 0.5, h * 0.5, h * 0.68);
    radGrad.addColorStop(0, 'rgba(0,0,0,0)');
    radGrad.addColorStop(1, 'rgba(3, 7, 18, 0.88)');
    ctx.fillStyle = radGrad;
    ctx.fillRect(0, 0, w, h);

  } else if (perspective === 'suspect') {
    // === SUSPECT PERSPECTIVE (Julian Mercer) ===
    // Rooftop first-person / over-shoulder close shot, halogen floodlights, gravel deck
    
    // Rooftop deck ground
    ctx.fillStyle = '#111827';
    ctx.fillRect(0, h * 0.62, w, h * 0.38);

    // Parapet ledge on right
    ctx.fillStyle = '#1f2937';
    ctx.fillRect(w * 0.68, h * 0.52, w * 0.32, h * 0.48);
    ctx.fillStyle = '#374151';
    ctx.fillRect(w * 0.68, h * 0.50, w * 0.32, 22);

    // Warm halogen maintenance floodlight flare
    const flareGrad = ctx.createRadialGradient(w * 0.15, h * 0.4, 20, w * 0.15, h * 0.4, 380);
    flareGrad.addColorStop(0, 'rgba(245, 158, 11, 0.4)');
    flareGrad.addColorStop(0.5, 'rgba(239, 68, 68, 0.12)');
    flareGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = flareGrad;
    ctx.fillRect(0, 0, w, h);

    // Elena at the ledge in high emotional intensity
    const elenaX = w * 0.76;
    const elenaY = h * 0.48;

    if (normTime < 46) {
      ctx.fillStyle = '#030712';
      ctx.beginPath();
      ctx.arc(elenaX, elenaY - 140, 26, 0, Math.PI * 2);
      ctx.fillRect(elenaX - 22, elenaY - 110, 44, 140);
      // Trenchcoat fluttering violently
      ctx.beginPath();
      ctx.moveTo(elenaX - 22, elenaY - 80);
      ctx.lineTo(elenaX - 65 + Math.sin(frame * 0.15) * 12, elenaY - 20);
      ctx.lineTo(elenaX - 20, elenaY + 20);
      ctx.fill();
    } else {
      // Disappeared over the ledge; empty parapet with rain splashing
      ctx.fillStyle = 'rgba(239, 68, 68, 0.18)';
      ctx.beginPath();
      ctx.arc(elenaX, elenaY + 20, 80, 0, Math.PI * 2);
      ctx.fill();
    }

    // First person hands reaching out frantically from bottom
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    // Left hand & sleeve
    ctx.moveTo(w * 0.32, h);
    ctx.lineTo(w * 0.42, h * 0.68);
    ctx.lineTo(w * 0.48, h * 0.70);
    ctx.lineTo(w * 0.38, h);
    ctx.fill();
    // Watch on left wrist
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(w * 0.41, h * 0.73, 16, 22);

    // Right hand reaching forward towards Elena
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.moveTo(w * 0.54, h);
    ctx.lineTo(w * 0.65, h * 0.58);
    ctx.lineTo(w * 0.71, h * 0.61);
    ctx.lineTo(w * 0.60, h);
    ctx.fill();

  } else {
    // === VICTIM PERSPECTIVE (Elena Vance) ===
    // Facing outward from the ledge: Dutch angle, vertigo overlooking glowing city avenue below
    
    // Angled parapet wall
    ctx.save();
    ctx.translate(w * 0.5, h * 0.5);
    ctx.rotate(0.06); // Subtle Dutch angle tilt

    // The vertiginous drop below
    const dropGrad = ctx.createLinearGradient(0, 0, 0, h * 0.5);
    dropGrad.addColorStop(0, '#0a0d14');
    dropGrad.addColorStop(1, '#020408');
    ctx.fillStyle = dropGrad;
    ctx.fillRect(-w * 0.5, 0, w, h * 0.5);

    // Golden street traffic streaks far below
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.35)';
    ctx.lineWidth = 4;
    for (let s = -300; s < 300; s += 80) {
      ctx.beginPath();
      ctx.moveTo(s, h * 0.28);
      ctx.lineTo(s * 1.4, h * 0.48);
      ctx.stroke();
    }

    // Parapet coping stone right in the foreground
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-w * 0.5, -40, w, 80);

    // Micro-recorder with pulsating red LED near vent on left
    ctx.fillStyle = '#020617';
    ctx.fillRect(-w * 0.28, -25, 45, 25);
    // Pulsing recording LED
    const ledAlpha = 0.5 + Math.sin(frame * 0.2) * 0.5;
    ctx.fillStyle = `rgba(239, 68, 68, ${ledAlpha})`;
    ctx.beginPath();
    ctx.arc(-w * 0.28 + 10, -12, 4, 0, Math.PI * 2);
    ctx.fill();

    // Silhouette of Julian Mercer confronting on the roof
    ctx.fillStyle = '#090d16';
    ctx.beginPath();
    ctx.arc(w * 0.15, -180, 36, 0, Math.PI * 2);
    ctx.fillRect(w * 0.15 - 35, -140, 70, 160);
    // Arms grasping forward for the recorder
    ctx.lineWidth = 14;
    ctx.strokeStyle = '#090d16';
    ctx.beginPath();
    ctx.moveTo(w * 0.15, -100);
    ctx.lineTo(w * 0.02, -50);
    ctx.stroke();

    ctx.restore();
  }
}

// Helper: Cinematic Timecode & HUD Watermarks
function drawCinematicHUD(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  perspective: PerspectiveId,
  currentTime: number
) {
  ctx.save();
  ctx.font = '12px "JetBrains Mono", monospace';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';

  // Format timecode: 00:01:24:12
  const mins = Math.floor(currentTime / 60).toString().padStart(2, '0');
  const secs = Math.floor(currentTime % 60).toString().padStart(2, '0');
  const frames = Math.floor((currentTime % 1) * 24).toString().padStart(2, '0');
  const tcString = `TC 00:${mins}:${secs}:${frames}`;

  ctx.fillText(tcString, 48, 54);

  // Perspective Tag
  const pTag = perspective.toUpperCase();
  ctx.fillStyle = perspective === 'witness' ? '#38bdf8' : perspective === 'suspect' ? '#ef4444' : '#f59e0b';
  ctx.fillText(`CAM // PERSPECTIVE: ${pTag}`, 48, 74);

  // Resolution & FPS indicator
  ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.fillText('4K MASTER // 2.39:1 ANAMORPHIC', w - 240, 54);
  ctx.fillText('SYNCHRONIZED MULTI-STREAM AUDIO', w - 240, 74);

  // Watermark for placeholder scenes
  ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
  ctx.fillText('ORIGINAL CINEMATIC PLACEHOLDER SCENE — REAL-TIME SYNCHRONIZED RENDERER', 48, h - 38);

  ctx.restore();
}
