'use client';

import { useEffect, useRef, useState } from 'react';
import { NetworkNode, NetworkLink } from '@/lib/types';

interface Props {
  nodes: NetworkNode[];
  links: NetworkLink[];
  selectedNode: string | null;
  onNodeSelect: (nodeId: string | null) => void;
}

const STATUS_COLORS: Record<string, string> = {
  healthy: '#00ff88',
  warning: '#ffcc00',
  critical: '#ff3366',
  offline: '#475569',
  healing: '#00ccff',
};

const TYPE_SHAPES: Record<string, string> = {
  tower: 'diamond',
  'edge-server': 'square',
  'core-router': 'hexagon',
  'base-station': 'circle',
  gateway: 'triangle',
};

export default function NetworkTopology({ nodes, links, selectedNode, onNodeSelect }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
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

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#0a0e1a';
    ctx.fillRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.03)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    ctx.save();
    ctx.translate(offset.x, offset.y);
    ctx.scale(scale, scale);

    // Draw links
    links.forEach(link => {
      const source = nodes.find(n => n.id === link.source);
      const target = nodes.find(n => n.id === link.target);
      if (!source || !target) return;

      const isHighlighted = link.source === selectedNode || link.target === selectedNode;
      const isHovered = link.source === hoveredNode || link.target === hoveredNode;

      ctx.beginPath();
      ctx.strokeStyle = link.status === 'down'
        ? 'rgba(255, 51, 102, 0.3)'
        : isHighlighted
        ? 'rgba(0, 255, 136, 0.6)'
        : isHovered
        ? 'rgba(0, 204, 255, 0.5)'
        : 'rgba(100, 116, 139, 0.2)';
      ctx.lineWidth = isHighlighted ? 2.5 : 1.5;

      ctx.moveTo(source.x, source.y);
      ctx.lineTo(target.x, target.y);
      ctx.stroke();

      // Traffic flow animation dots
      if (link.status === 'active') {
        const t = (Date.now() % 2000) / 2000;
        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const dotX = source.x + dx * t;
        const dotY = source.y + dy * t;
        ctx.fillStyle = isHighlighted ? 'rgba(0, 255, 136, 0.8)' : 'rgba(0, 204, 255, 0.4)';
        ctx.beginPath();
        ctx.arc(dotX, dotY, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Draw nodes
    nodes.forEach(node => {
      const isSelected = node.id === selectedNode;
      const isHovered = node.id === hoveredNode;
      const color = STATUS_COLORS[node.status];
      const size = isSelected ? 14 : isHovered ? 12 : 10;

      // Glow effect
      if (node.status === 'critical' || isSelected) {
        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, size * 3);
        gradient.addColorStop(0, `${color}33`);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, size * 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Node shape
      ctx.fillStyle = color;
      ctx.strokeStyle = isSelected ? '#ffffff' : `${color}66`;
      ctx.lineWidth = isSelected ? 2 : 1;

      const shape = TYPE_SHAPES[node.type];
      ctx.beginPath();

      if (shape === 'diamond') {
        ctx.moveTo(node.x, node.y - size);
        ctx.lineTo(node.x + size, node.y);
        ctx.lineTo(node.x, node.y + size);
        ctx.lineTo(node.x - size, node.y);
        ctx.closePath();
      } else if (shape === 'square') {
        ctx.rect(node.x - size * 0.7, node.y - size * 0.7, size * 1.4, size * 1.4);
      } else if (shape === 'hexagon') {
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i - Math.PI / 6;
          const x = node.x + size * Math.cos(angle);
          const y = node.y + size * Math.sin(angle);
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.closePath();
      } else if (shape === 'triangle') {
        ctx.moveTo(node.x, node.y - size);
        ctx.lineTo(node.x + size, node.y + size);
        ctx.lineTo(node.x - size, node.y + size);
        ctx.closePath();
      } else {
        ctx.arc(node.x, node.y, size, 0, Math.PI * 2);
      }

      ctx.fill();
      ctx.stroke();

      // Label
      if (isSelected || isHovered) {
        ctx.fillStyle = '#e2e8f0';
        ctx.font = '10px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText(node.name.split(' ').slice(-2).join(' '), node.x, node.y + size + 14);
      }
    });

    ctx.restore();
  }, [nodes, links, selectedNode, hoveredNode, scale, offset]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - offset.x) / scale;
    const y = (e.clientY - rect.top - offset.y) / scale;

    const clicked = nodes.find(n => Math.hypot(n.x - x, n.y - y) < 15);
    onNodeSelect(clicked ? clicked.id : null);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      setOffset({
        x: offset.x + (e.clientX - lastMouse.x),
        y: offset.y + (e.clientY - lastMouse.y),
      });
      setLastMouse({ x: e.clientX, y: e.clientY });
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - offset.x) / scale;
    const y = (e.clientY - rect.top - offset.y) / scale;

    const hovered = nodes.find(n => Math.hypot(n.x - x, n.y - y) < 15);
    setHoveredNode(hovered ? hovered.id : null);
    canvas.style.cursor = hovered ? 'pointer' : 'grab';
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const newScale = Math.max(0.3, Math.min(3, scale + (e.deltaY > 0 ? -0.1 : 0.1)));
    setScale(newScale);
  };

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
        onMouseDown={(e) => { setIsDragging(true); setLastMouse({ x: e.clientX, y: e.clientY }); }}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => { setIsDragging(false); setHoveredNode(null); }}
        onWheel={handleWheel}
      />
      <div className="absolute bottom-4 left-4 flex items-center gap-2">
        <button
          onClick={() => setScale(s => Math.min(3, s + 0.2))}
          className="w-8 h-8 rounded bg-white/10 text-white text-sm hover:bg-white/20"
        >+</button>
        <button
          onClick={() => setScale(s => Math.max(0.3, s - 0.2))}
          className="w-8 h-8 rounded bg-white/10 text-white text-sm hover:bg-white/20"
        >-</button>
        <button
          onClick={() => { setScale(1); setOffset({ x: 0, y: 0 }); }}
          className="px-3 h-8 rounded bg-white/10 text-white text-xs hover:bg-white/20"
        >Reset</button>
      </div>
    </div>
  );
}
