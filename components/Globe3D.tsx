'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface GlobeNode {
  id: string;
  name: string;
  lat: number;
  lon: number;
  status: 'healthy' | 'warning' | 'critical' | 'healing' | 'offline';
  traffic: number;
  region: string;
}

interface GlobeLink {
  source: string;
  target: string;
  traffic: number;
  status: 'active' | 'degraded' | 'down';
}

const STATUS_COLORS: Record<string, string> = {
  healthy: '#00ff88',
  warning: '#ffcc00',
  critical: '#ff3366',
  healing: '#00ccff',
  offline: '#475569',
};

const CITIES: GlobeNode[] = [
  { id: 'delhi', name: 'Delhi-NCR', lat: 28.6139, lon: 77.2090, status: 'healthy', traffic: 8500, region: 'North' },
  { id: 'mumbai', name: 'Mumbai', lat: 19.0760, lon: 72.8777, status: 'healthy', traffic: 9200, region: 'West' },
  { id: 'bangalore', name: 'Bangalore', lat: 12.9716, lon: 77.5946, status: 'healthy', traffic: 7800, region: 'South' },
  { id: 'chennai', name: 'Chennai', lat: 13.0827, lon: 80.2707, status: 'warning', traffic: 6500, region: 'South' },
  { id: 'kolkata', name: 'Kolkata', lat: 22.5726, lon: 88.3639, status: 'healthy', traffic: 5800, region: 'East' },
  { id: 'hyderabad', name: 'Hyderabad', lat: 17.3850, lon: 78.4867, status: 'healthy', traffic: 7200, region: 'South' },
  { id: 'pune', name: 'Pune', lat: 18.5204, lon: 73.8567, status: 'healthy', traffic: 6100, region: 'West' },
  { id: 'ahmedabad', name: 'Ahmedabad', lat: 23.0225, lon: 72.5714, status: 'healthy', traffic: 5400, region: 'West' },
  { id: 'jaipur', name: 'Jaipur', lat: 26.9124, lon: 75.7873, status: 'healthy', traffic: 4200, region: 'North' },
  { id: 'lucknow', name: 'Lucknow', lat: 26.8467, lon: 80.9462, status: 'warning', traffic: 3800, region: 'North' },
  { id: 'singapore', name: 'Singapore', lat: 1.3521, lon: 103.8198, status: 'healthy', traffic: 12000, region: 'Global' },
  { id: 'tokyo', name: 'Tokyo', lat: 35.6762, lon: 139.6503, status: 'healthy', traffic: 15000, region: 'Global' },
  { id: 'london', name: 'London', lat: 51.5074, lon: -0.1278, status: 'healthy', traffic: 11000, region: 'Global' },
  { id: 'newyork', name: 'New York', lat: 40.7128, lon: -74.0060, status: 'healthy', traffic: 13500, region: 'Global' },
  { id: 'dubai', name: 'Dubai', lat: 25.2048, lon: 55.2708, status: 'healthy', traffic: 8000, region: 'Global' },
  { id: 'sydney', name: 'Sydney', lat: -33.8688, lon: 151.2093, status: 'healthy', traffic: 9500, region: 'Global' },
];

const GLOBE_LINKS: GlobeLink[] = [
  { source: 'delhi', target: 'mumbai', traffic: 5000, status: 'active' },
  { source: 'delhi', target: 'kolkata', traffic: 4000, status: 'active' },
  { source: 'delhi', target: 'jaipur', traffic: 3000, status: 'active' },
  { source: 'delhi', target: 'lucknow', traffic: 2500, status: 'active' },
  { source: 'mumbai', target: 'pune', traffic: 4500, status: 'active' },
  { source: 'mumbai', target: 'ahmedabad', traffic: 3500, status: 'active' },
  { source: 'bangalore', target: 'chennai', traffic: 4000, status: 'active' },
  { source: 'bangalore', target: 'hyderabad', traffic: 3800, status: 'active' },
  { source: 'delhi', target: 'singapore', traffic: 8000, status: 'active' },
  { source: 'mumbai', target: 'dubai', traffic: 7000, status: 'active' },
  { source: 'singapore', target: 'tokyo', traffic: 10000, status: 'active' },
  { source: 'london', target: 'newyork', traffic: 9000, status: 'active' },
  { source: 'dubai', target: 'london', traffic: 6000, status: 'active' },
  { source: 'sydney', target: 'singapore', traffic: 7500, status: 'active' },
  { source: 'delhi', target: 'london', traffic: 5500, status: 'active' },
];

export default function Globe3D({ onNodeClick }: { onNodeClick?: (node: GlobeNode) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const rotRef = useRef({ x: 0.3, y: 0 });
  const dragRef = useRef({ active: false, lastX: 0, lastY: 0 });
  const [hoveredCity, setHoveredCity] = useState<GlobeNode | null>(null);
  const [nodes, setNodes] = useState(GLOBE_LINKS);

  const latLonTo3D = (lat: number, lon: number, radius: number) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    return {
      x: -(radius * Math.sin(phi) * Math.cos(theta)),
      y: radius * Math.cos(phi),
      z: radius * Math.sin(phi) * Math.sin(theta),
    };
  };

  const project = (x: number, y: number, z: number, w: number, h: number, rotX: number, rotY: number) => {
    const cosY = Math.cos(rotY);
    const sinY = Math.sin(rotY);
    const cosX = Math.cos(rotX);
    const sinX = Math.sin(rotX);

    let nx = x * cosY - z * sinY;
    let nz = x * sinY + z * cosY;
    let ny = y * cosX - nz * sinX;
    nz = y * sinX + nz * cosX;

    const perspective = 600;
    const scale = perspective / (perspective + nz + 300);

    return {
      sx: w / 2 + nx * scale,
      sy: h / 2 + ny * scale,
      scale,
      z: nz,
    };
  };

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const w = rect.width;
    const h = rect.height;
    const radius = Math.min(w, h) * 0.35;

    const rotX = rotRef.current.x;
    const rotY = rotRef.current.y;

    // Background
    const bgGrad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    bgGrad.addColorStop(0, '#0f1729');
    bgGrad.addColorStop(1, '#050810');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Stars
    for (let i = 0; i < 150; i++) {
      const sx = (Math.sin(i * 127.1 + i * 311.7) * 0.5 + 0.5) * w;
      const sy = (Math.sin(i * 269.5 + i * 183.3) * 0.5 + 0.5) * h;
      const brightness = Math.sin(Date.now() * 0.001 + i) * 0.3 + 0.5;
      ctx.fillStyle = `rgba(255,255,255,${brightness * 0.5})`;
      ctx.beginPath();
      ctx.arc(sx, sy, 0.8, 0, Math.PI * 2);
      ctx.fill();
    }

    // Globe glow
    const glowGrad = ctx.createRadialGradient(w / 2, h / 2, radius * 0.8, w / 2, h / 2, radius * 1.5);
    glowGrad.addColorStop(0, 'rgba(0, 204, 255, 0.08)');
    glowGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = glowGrad;
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, radius * 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Globe sphere
    const sphereGrad = ctx.createRadialGradient(w / 2 - radius * 0.3, h / 2 - radius * 0.3, 0, w / 2, h / 2, radius);
    sphereGrad.addColorStop(0, 'rgba(10, 25, 50, 0.9)');
    sphereGrad.addColorStop(0.5, 'rgba(5, 15, 35, 0.95)');
    sphereGrad.addColorStop(1, 'rgba(2, 8, 20, 1)');
    ctx.fillStyle = sphereGrad;
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, radius, 0, Math.PI * 2);
    ctx.fill();

    // Grid lines (latitude)
    ctx.strokeStyle = 'rgba(0, 204, 255, 0.08)';
    ctx.lineWidth = 0.5;
    for (let lat = -80; lat <= 80; lat += 20) {
      ctx.beginPath();
      for (let lon = 0; lon <= 360; lon += 5) {
        const p = latLonTo3D(lat, lon, radius);
        const proj = project(p.x, p.y, p.z, w, h, rotX, rotY);
        if (lon === 0) ctx.moveTo(proj.sx, proj.sy);
        else ctx.lineTo(proj.sx, proj.sy);
      }
      ctx.stroke();
    }

    // Grid lines (longitude)
    for (let lon = 0; lon < 360; lon += 30) {
      ctx.beginPath();
      for (let lat = -90; lat <= 90; lat += 5) {
        const p = latLonTo3D(lat, lon, radius);
        const proj = project(p.x, p.y, p.z, w, h, rotX, rotY);
        if (lat === -90) ctx.moveTo(proj.sx, proj.sy);
        else ctx.lineTo(proj.sx, proj.sy);
      }
      ctx.stroke();
    }

    // Draw links
    GLOBE_LINKS.forEach(link => {
      const src = CITIES.find(c => c.id === link.source);
      const tgt = CITIES.find(c => c.id === link.target);
      if (!src || !tgt) return;

      const p1 = latLonTo3D(src.lat, src.lon, radius);
      const p2 = latLonTo3D(tgt.lat, tgt.lon, radius);
      const proj1 = project(p1.x, p1.y, p1.z, w, h, rotX, rotY);
      const proj2 = project(p2.x, p2.y, p2.z, w, h, rotX, rotY);

      const midLat = (src.lat + tgt.lat) / 2;
      const midLon = (src.lon + tgt.lon) / 2;
      const pMid = latLonTo3D(midLat, midLon, radius * 1.15);
      const projMid = project(pMid.x, pMid.y, pMid.z, w, h, rotX, rotY);

      ctx.strokeStyle = `rgba(0, 204, 255, ${0.15 + Math.sin(Date.now() * 0.002 + link.traffic * 0.001) * 0.1})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(proj1.sx, proj1.sy);
      ctx.quadraticCurveTo(projMid.sx, projMid.sy, proj2.sx, proj2.sy);
      ctx.stroke();

      // Animated particle on link
      const t = (Date.now() * 0.001 + link.traffic * 0.0001) % 1;
      const pt = 1 - t;
      const px = pt * pt * proj1.sx + 2 * pt * t * projMid.sx + t * t * proj2.sx;
      const py = pt * pt * proj1.sy + 2 * pt * t * projMid.sy + t * t * proj2.sy;
      ctx.fillStyle = 'rgba(0, 255, 136, 0.8)';
      ctx.beginPath();
      ctx.arc(px, py, 1.5, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw city nodes
    CITIES.forEach(city => {
      const p = latLonTo3D(city.lat, city.lon, radius);
      const proj = project(p.x, p.y, p.z, w, h, rotX, rotY);

      if (proj.z < -200) return; // behind globe

      const color = STATUS_COLORS[city.status];
      const isHovered = hoveredCity?.id === city.id;
      const size = isHovered ? 6 : 4;

      // Pulse ring
      const pulseRadius = size + Math.sin(Date.now() * 0.003) * 3;
      ctx.strokeStyle = `${color}44`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(proj.sx, proj.sy, pulseRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Glow
      const glow = ctx.createRadialGradient(proj.sx, proj.sy, 0, proj.sx, proj.sy, size * 3);
      glow.addColorStop(0, `${color}44`);
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(proj.sx, proj.sy, size * 3, 0, Math.PI * 2);
      ctx.fill();

      // Node
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(proj.sx, proj.sy, size, 0, Math.PI * 2);
      ctx.fill();

      // Label for Indian cities
      if (city.region === 'North' || city.region === 'South' || city.region === 'East' || city.region === 'West') {
        ctx.fillStyle = `rgba(255,255,255,${isHovered ? 0.9 : 0.5})`;
        ctx.font = `${isHovered ? '11px' : '9px'} system-ui`;
        ctx.textAlign = 'center';
        ctx.fillText(city.name, proj.sx, proj.sy - size - 6);
      }
    });

    // Hovered city tooltip
    if (hoveredCity) {
      const p = latLonTo3D(hoveredCity.lat, hoveredCity.lon, radius);
      const proj = project(p.x, p.y, p.z, w, h, rotX, rotY);

      const tw = 160;
      const th = 70;
      const tx = proj.sx + 15;
      const ty = proj.sy - th / 2;

      ctx.fillStyle = 'rgba(10, 14, 26, 0.95)';
      ctx.strokeStyle = STATUS_COLORS[hoveredCity.status] + '44';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(tx, ty, tw, th, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#e2e8f0';
      ctx.font = 'bold 11px system-ui';
      ctx.textAlign = 'left';
      ctx.fillText(hoveredCity.name, tx + 10, ty + 18);

      ctx.fillStyle = STATUS_COLORS[hoveredCity.status];
      ctx.font = '10px system-ui';
      ctx.fillText(`Status: ${hoveredCity.status.toUpperCase()}`, tx + 10, ty + 34);

      ctx.fillStyle = '#94a3b8';
      ctx.fillText(`Traffic: ${(hoveredCity.traffic / 1000).toFixed(1)} Gbps`, tx + 10, ty + 48);
      ctx.fillText(`Region: ${hoveredCity.region}`, tx + 10, ty + 62);
    }

    // Title
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.font = '11px system-ui';
    ctx.textAlign = 'left';
    ctx.fillText('Drag to rotate | Scroll to zoom | Click nodes for details', 16, h - 16);

    rotRef.current.y += 0.002;

    animRef.current = requestAnimationFrame(draw);
  }, [hoveredCity]);

  useEffect(() => {
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [draw]);

  const handleMouseDown = (e: React.MouseEvent) => {
    dragRef.current = { active: true, lastX: e.clientX, lastY: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (dragRef.current.active) {
      const dx = e.clientX - dragRef.current.lastX;
      const dy = e.clientY - dragRef.current.lastY;
      rotRef.current.y += dx * 0.005;
      rotRef.current.x += dy * 0.005;
      rotRef.current.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, rotRef.current.x));
      dragRef.current.lastX = e.clientX;
      dragRef.current.lastY = e.clientY;
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const w = rect.width;
    const h = rect.height;
    const radius = Math.min(w, h) * 0.35;

    let found: GlobeNode | null = null;
    for (const city of CITIES) {
      const p = latLonTo3D(city.lat, city.lon, radius);
      const proj = project(p.x, p.y, p.z, w, h, rotRef.current.x, rotRef.current.y);
      if (proj.z < -200) continue;
      if (Math.hypot(proj.sx - mx, proj.sy - my) < 12) {
        found = city;
        break;
      }
    }
    setHoveredCity(found);
  };

  const handleMouseUp = () => {
    dragRef.current.active = false;
  };

  const handleClick = () => {
    if (hoveredCity && onNodeClick) {
      onNodeClick(hoveredCity);
    }
  };

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={handleClick}
    />
  );
}
