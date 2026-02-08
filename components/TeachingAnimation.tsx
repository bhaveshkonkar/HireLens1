
import React, { useState, useEffect, useRef } from 'react';
import { VisualState, VisualElement, VisualConnection, VisualPointer } from '../types';

interface TeachingAnimationProps {
  visualState: VisualState;
}

interface PhysicsNode extends VisualElement {
  vx: number;
  vy: number;
  isGrabbing: boolean;
}

export const TeachingAnimation: React.FC<TeachingAnimationProps> = ({ visualState }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<PhysicsNode[]>([]);
  const [isGrabbingAny, setIsGrabbingAny] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Initialize and Position Nodes based on structure type
  useEffect(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const initializedNodes: PhysicsNode[] = visualState.elements.map((el, i) => {
      let x = el.x ?? centerX;
      let y = el.y ?? centerY;

      // Auto-layout if coordinates not provided by AI
      if (el.x === undefined || el.y === undefined) {
        if (visualState.type === 'ARRAY' || visualState.type === 'POINTERS') {
          const spacing = 90;
          x = centerX - ((visualState.elements.length - 1) * spacing) / 2 + i * spacing;
          y = centerY;
        } else if (visualState.type === 'TREE') {
          // Basic horizontal levels
          const level = Math.floor(Math.log2(i + 1));
          const levelWidth = Math.pow(2, level) * 100;
          x = centerX - levelWidth / 2 + (i - (Math.pow(2, level) - 1)) * (levelWidth / Math.pow(2, level));
          y = centerY - 150 + level * 100;
        } else if (visualState.type === 'GRAPH') {
          const angle = (i / visualState.elements.length) * Math.PI * 2;
          x = centerX + Math.cos(angle) * 200;
          y = centerY + Math.sin(angle) * 200;
        } else if (visualState.type === 'LINKED_LIST') {
          x = centerX - 250 + i * 150;
          y = centerY;
        }
      }

      return {
        ...el,
        x,
        y,
        vx: 0,
        vy: 0,
        isGrabbing: false,
        color: el.color || (i % 2 === 0 ? '#3b82f6' : '#ec4899')
      };
    });

    setNodes(initializedNodes);
  }, [visualState]);

  // Physics Loop: Spring forces & Repulsion
  useEffect(() => {
    const loop = () => {
      setNodes(prev => {
        return prev.map((node, i) => {
          if (node.isGrabbing) return node;

          let ax = 0;
          let ay = 0;

          // 1. Repulsion from other nodes
          prev.forEach((other, j) => {
            if (i === j) return;
            const dx = node.x - other.x;
            const dy = node.y - other.y;
            const distSq = dx * dx + dy * dy + 0.1;
            const dist = Math.sqrt(distSq);
            if (dist < 150) {
              const force = (150 - dist) * 0.05;
              ax += (dx / dist) * force;
              ay += (dy / dist) * force;
            }
          });

          // 2. Attraction to connections
          visualState.connections?.forEach(conn => {
            if (conn.from === node.id || conn.to === node.id) {
              const otherId = conn.from === node.id ? conn.to : conn.from;
              const other = prev.find(n => n.id === otherId);
              if (other) {
                const dx = other.x - node.x;
                const dy = other.y - node.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const targetDist = visualState.type === 'TREE' ? 100 : 150;
                if (dist > targetDist) {
                  const force = (dist - targetDist) * 0.02;
                  ax += (dx / dist) * force;
                  ay += (dy / dist) * force;
                }
              }
            }
          });

          // 3. Friction & Velocity
          const vx = (node.vx + ax) * 0.9;
          const vy = (node.vy + ay) * 0.9;

          return {
            ...node,
            vx,
            vy,
            x: node.x + vx,
            y: node.y + vy
          };
        });
      });
      requestAnimationFrame(loop);
    };
    const id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, [visualState.connections, visualState.type]);

  const handleMouseDown = (id: string) => {
    setIsGrabbingAny(true);
    setNodes(prev => prev.map(n => n.id === id ? { ...n, isGrabbing: true, vx: 0, vy: 0 } : n));
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });

    if (isGrabbingAny) {
      setNodes(prev => prev.map(n => n.isGrabbing ? { ...n, x, y } : n));
    }
  };

  const handleMouseUp = () => {
    setIsGrabbingAny(false);
    setNodes(prev => prev.map(n => ({ ...n, isGrabbing: false })));
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className="w-full h-full relative select-none overflow-hidden"
    >
      {/* Background HUD Layer */}
      <div className="absolute top-12 right-12 text-right pointer-events-none z-0">
        <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-2">Structure detected</h4>
        <div className="text-4xl font-black text-white/10 uppercase tracking-tighter leading-none">{visualState.type}</div>
      </div>

      {/* SVG Connection Layer */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orientation="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#ffffff" fillOpacity="0.1" />
          </marker>
        </defs>
        {visualState.connections?.map((conn, idx) => {
          const from = nodes.find(n => n.id === conn.from);
          const to = nodes.find(n => n.id === conn.to);
          if (!from || !to) return null;
          return (
            <line
              key={`conn-${idx}`}
              x1={from.x} y1={from.y}
              x2={to.x} y2={to.y}
              stroke="white" strokeOpacity="0.15" strokeWidth="2"
              markerEnd={visualState.type === 'LINKED_LIST' || visualState.type === 'TREE' ? 'url(#arrowhead)' : ''}
            />
          );
        })}
      </svg>

      {/* Interactive Node Layer */}
      {nodes.map(node => (
        <div
          key={node.id}
          onMouseDown={() => handleMouseDown(node.id)}
          style={{ transform: `translate(${node.x - 35}px, ${node.y - 35}px)` }}
          className={`absolute w-[70px] h-[70px] flex items-center justify-center cursor-grab active:cursor-grabbing transition-shadow ${node.isGrabbing ? 'z-50' : 'z-10'}`}
        >
          <div 
            className="w-full h-full rounded-2xl flex items-center justify-center text-xl font-black text-white shadow-2xl relative border-2"
            style={{ 
              backgroundColor: node.color,
              borderColor: 'rgba(255,255,255,0.2)',
              boxShadow: node.isGrabbing ? `0 0 30px ${node.color}` : 'none'
            }}
          >
            {node.value}
            
            {/* Pointer labels */}
            {visualState.pointers?.filter(p => p.elementId === node.id).map((p, pIdx) => (
              <div 
                key={pIdx}
                className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-black text-white border shadow-lg"
                style={{ backgroundColor: p.color, borderColor: 'rgba(255,255,255,0.3)' }}
              >
                {p.name}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Control Surface */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 pointer-events-auto">
        <div className="glass px-8 py-4 rounded-3xl border border-white/10 flex items-center gap-8 shadow-2xl backdrop-blur-3xl">
           <div className="flex flex-col gap-0.5">
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Active Elements</span>
              <span className="text-sm font-black text-white">{nodes.length} Nodes</span>
           </div>
           <div className="h-8 w-px bg-white/10" />
           <div className="flex gap-4">
              <button className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 transition-all">
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              </button>
              <button className="px-6 h-10 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest transition-all">
                Manual Override
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};
