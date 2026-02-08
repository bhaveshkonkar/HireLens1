
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { AlgorithmType, VizState } from '../types';

interface VisualizerProps {
  state: VizState | null;
  handData?: any;
}

const COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#ef4444', '#06b6d4', '#8b5cf6'];

const Visualizer: React.FC<VisualizerProps> = ({ state, handData }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  
  // slotOffsets stores the user-driven spatial position of each logical element index
  const [slotOffsets, setSlotOffsets] = useState<Record<string, { dx: number; dy: number }>>({});
  
  // High-frequency refs to handle interaction without triggering React renders every 16ms
  const grabbedIdRef = useRef<string | null>(null);
  const hoveredIdRef = useRef<string | null>(null);
  const lastPinchPosRef = useRef<{ x: number; y: number } | null>(null);
  const isPinchingRef = useRef<boolean>(false);

  // Constants for layout
  const blockW = 60;
  const blockH = 60;
  const gap = 14;

  // Clear spatial state when switching algorithms
  useEffect(() => {
    setSlotOffsets({});
    grabbedIdRef.current = null;
    hoveredIdRef.current = null;
    lastPinchPosRef.current = null;
    isPinchingRef.current = false;
  }, [state?.type]);

  // 1. DATA VISUALIZATION (Updates on State/Offsets change)
  useEffect(() => {
    if (!svgRef.current || !state) return;
    const svg = d3.select(svgRef.current);
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    let mainGroup = svg.select<SVGGElement>('g.main-viz');
    if (mainGroup.empty()) mainGroup = svg.append('g').attr('class', 'main-viz');

    if (state.type === AlgorithmType.ARRAY || state.type === AlgorithmType.STRINGS) {
      const data = Array.isArray(state.data) ? state.data : String(state.data).split('');
      const totalWidth = data.length * (blockW + gap) - gap;
      
      // Adjusted start position to stay clear of the editor
      const startX = Math.max(width * 0.45, (width * 0.4) + (width * 0.55 - totalWidth) / 2);
      const startY = height / 2 - blockH / 2;

      const items = mainGroup.selectAll<SVGGElement, any>('g.draggable-item')
        .data(data, (d, i) => `item-${i}`);

      const enter = items.enter().append('g')
        .attr('class', 'draggable-item')
        .attr('data-id', (d, i) => `item-${i}`)
        .style('opacity', 0);

      // Visible Block
      enter.append('rect')
        .attr('class', 'block-body')
        .attr('width', blockW)
        .attr('height', blockH)
        .attr('rx', 20)
        .attr('fill', (d, i) => COLORS[i % COLORS.length])
        .attr('stroke', 'rgba(255,255,255,0.4)')
        .attr('stroke-width', 2)
        .style('filter', 'drop-shadow(0 8px 16px rgba(0,0,0,0.5))');

      // Enhanced Hit Area (Bigger invisible area for easier grabbing)
      enter.append('rect')
        .attr('class', 'hit-area')
        .attr('x', -20)
        .attr('y', -20)
        .attr('width', blockW + 40)
        .attr('height', blockH + 40)
        .attr('fill', 'transparent')
        .style('pointer-events', 'all');

      enter.append('text')
        .attr('x', blockW / 2)
        .attr('y', blockH / 2 + 10)
        .attr('text-anchor', 'middle')
        .attr('fill', 'white')
        .attr('font-size', '26px')
        .attr('font-weight', '900')
        .style('pointer-events', 'none')
        .style('text-shadow', '0 2px 4px rgba(0,0,0,0.6)');

      const update = enter.merge(items);
      
      update.transition().duration(250).ease(d3.easeCubicOut)
        .style('opacity', 1)
        .attr('transform', (d, i) => {
          const id = `item-${i}`;
          const off = slotOffsets[id] || { dx: 0, dy: 0 };
          // Scale logic: biggest when grabbed, medium when hovered
          let scale = 1.0;
          if (grabbedIdRef.current === id) scale = 1.25;
          else if (hoveredIdRef.current === id) scale = 1.15;
          
          return `translate(${startX + i * (blockW + gap) + off.dx}, ${startY + off.dy}) scale(${scale})`;
        });

      update.select('text').text(d => d);
      
      // Update visual styles based on interaction
      update.select('.block-body')
        .attr('stroke', (d, i) => {
          const id = `item-${i}`;
          if (grabbedIdRef.current === id) return '#fbbf24';
          if (hoveredIdRef.current === id) return 'rgba(255,255,255,0.9)';
          return 'rgba(255,255,255,0.4)';
        })
        .attr('stroke-width', (d, i) => {
          const id = `item-${i}`;
          return (grabbedIdRef.current === id || hoveredIdRef.current === id) ? 4 : 2;
        })
        .style('filter', (d, i) => {
           const id = `item-${i}`;
           if (grabbedIdRef.current === id) return 'drop-shadow(0 15px 30px rgba(251, 191, 36, 0.5))';
           if (hoveredIdRef.current === id) return 'drop-shadow(0 10px 20px rgba(255,255,255,0.2))';
           return 'drop-shadow(0 8px 16px rgba(0,0,0,0.5))';
        });

      items.exit().remove();

      // Pointers update
      let ptrG = mainGroup.select<SVGGElement>('g.pointers');
      if (ptrG.empty()) ptrG = mainGroup.append('g').attr('class', 'pointers');
      
      if (state.pointers) {
        const pData = Object.entries(state.pointers);
        const pts = ptrG.selectAll<SVGTextElement, any>('text.ptr').data(pData, d => d[0]);
        
        pts.enter().append('text').attr('class', 'ptr')
          .attr('text-anchor', 'middle').attr('font-weight', '900')
          .attr('fill', '#fbbf24').attr('font-size', '14px')
          .merge(pts)
          .transition().duration(200)
          .attr('x', ([_, idx]) => {
            const i = Number(idx);
            return startX + i * (blockW + gap) + blockW / 2 + (slotOffsets[`item-${i}`]?.dx || 0);
          })
          .attr('y', ([_, idx], k) => {
            const i = Number(idx);
            return startY - 25 - (k * 25) + (slotOffsets[`item-${i}`]?.dy || 0);
          })
          .text(([label]) => `${label.toUpperCase()} ↓`);
        
        pts.exit().remove();
      }
    }
  }, [state, slotOffsets, handData]); // Re-render on handData to ensure hover state reflects

  // 2. SPATIAL INTERACTION (Hand Tracking & Dragging Loop)
  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    if (handData?.multiHandLandmarks?.[0]) {
      const landmarks = handData.multiHandLandmarks[0];
      const thumb = landmarks[4];
      const index = landmarks[8];
      
      if (thumb && index) {
        const dist = Math.sqrt(Math.pow(thumb.x - index.x, 2) + Math.pow(thumb.y - index.y, 2));
        
        // Slightly more lenient pinch threshold for better stability
        const pinchOn = 0.055;
        const pinchOff = 0.075;
        const isPinching = isPinchingRef.current ? dist < pinchOff : dist < pinchOn;
        isPinchingRef.current = isPinching;

        const currentX = (1 - (thumb.x + index.x) / 2) * width;
        const currentY = ((thumb.y + index.y) / 2) * height;

        // --- HOVER & GRAB DETECTION ---
        let foundHover: string | null = null;
        const blocks = svg.selectAll<SVGGElement, any>('.draggable-item');
        blocks.each(function() {
          const el = d3.select(this);
          const id = el.attr('data-id');
          const bbox = (this as SVGGElement).getBBox();
          const ctm = (this as SVGGElement).getScreenCTM();
          if (!ctm) return;
          
          const pt = svgRef.current!.createSVGPoint();
          pt.x = currentX;
          pt.y = currentY;
          const localPt = pt.matrixTransform(ctm.inverse());

          // Check if hand is within the expanded hit-area of this block
          if (localPt.x >= bbox.x - 20 && localPt.x <= bbox.x + bbox.width + 20 &&
              localPt.y >= bbox.y - 20 && localPt.y <= bbox.y + bbox.height + 20) {
            foundHover = id;
          }
        });

        hoveredIdRef.current = foundHover;

        if (isPinching) {
          if (!grabbedIdRef.current && foundHover) {
            grabbedIdRef.current = foundHover;
          }

          if (grabbedIdRef.current && lastPinchPosRef.current) {
            const dx = currentX - lastPinchPosRef.current.x;
            const dy = currentY - lastPinchPosRef.current.y;
            
            setSlotOffsets(prev => {
              const current = prev[grabbedIdRef.current!] || { dx: 0, dy: 0 };
              const nextX = current.dx + dx;
              const nextY = current.dy + dy;
              
              // Clamping to screen boundaries
              const clampedX = Math.max(-(width * 0.4), Math.min(width * 0.5, nextX));
              const clampedY = Math.max(-(height * 0.45), Math.min(height * 0.45, nextY));

              const newOffsets = { ...prev, [grabbedIdRef.current!]: { dx: clampedX, dy: clampedY } };

              // --- SMOOTH SWAP LOGIC ---
              const grabbedEl = svg.select(`[data-id="${grabbedIdRef.current}"]`);
              if (!grabbedEl.empty()) {
                const gBox = (grabbedEl.node() as SVGGElement).getBBox();
                const gMatrix = (grabbedEl.node() as SVGGElement).getScreenCTM();
                if (gMatrix) {
                  const gCx = gMatrix.e + (gBox.width / 2);
                  const gCy = gMatrix.f + (gBox.height / 2);

                  svg.selectAll<SVGGElement, any>('.draggable-item').each(function() {
                    const other = d3.select(this);
                    const otherId = other.attr('data-id');
                    if (otherId === grabbedIdRef.current) return;

                    const oBox = (this as SVGGElement).getBBox();
                    const oMatrix = (this as SVGGElement).getScreenCTM();
                    if (oMatrix) {
                      const oCx = oMatrix.e + (oBox.width / 2);
                      const oCy = oMatrix.f + (oBox.height / 2);

                      // Distance-based snapping for replacement
                      const distSq = Math.pow(gCx - oCx, 2) + Math.pow(gCy - oCy, 2);
                      if (distSq < Math.pow(blockW * 0.9, 2)) {
                        const temp = newOffsets[otherId] || { dx: 0, dy: 0 };
                        newOffsets[otherId] = newOffsets[grabbedIdRef.current!];
                        newOffsets[grabbedIdRef.current!] = temp;
                      }
                    }
                  });
                }
              }
              return newOffsets;
            });
          }
        } else {
          grabbedIdRef.current = null;
        }

        lastPinchPosRef.current = { x: currentX, y: currentY };

        // --- HAND MESH RENDERING ---
        let gHand = svg.select<SVGGElement>('g.hand-mesh');
        if (gHand.empty()) gHand = svg.append('g').attr('class', 'hand-mesh').style('pointer-events', 'none');
        
        const dots = gHand.selectAll<SVGCircleElement, any>('circle.joint').data(landmarks);
        dots.enter().append('circle').attr('class', 'joint').attr('r', 3.5).merge(dots)
          .attr('cx', (lm: any) => (1 - lm.x) * width)
          .attr('cy', (lm: any) => lm.y * height)
          .attr('fill', isPinching ? '#fbbf24' : (foundHover ? 'rgba(255,255,255,0.8)' : 'rgba(99, 102, 241, 0.4)'));
        dots.exit().remove();

        let cursor = svg.select('circle.pinch-cursor');
        if (cursor.empty()) cursor = svg.append('circle').attr('class', 'pinch-cursor').attr('fill', 'none').attr('stroke-width', 3).style('pointer-events', 'none');
        cursor
          .attr('cx', currentX)
          .attr('cy', currentY)
          .attr('r', isPinching ? 12 : (foundHover ? 25 : 30))
          .attr('stroke', isPinching ? '#fbbf24' : (foundHover ? '#fff' : 'rgba(255,255,255,0.15)'))
          .attr('opacity', 1);
      }
    } else {
      svg.select('g.hand-mesh').selectAll('*').remove();
      svg.select('circle.pinch-cursor').attr('opacity', 0);
      grabbedIdRef.current = null;
      hoveredIdRef.current = null;
      lastPinchPosRef.current = null;
      isPinchingRef.current = false;
    }
  }, [handData]);

  return (
    <div className="w-full h-full relative bg-transparent overflow-hidden">
      <svg ref={svgRef} className="w-full h-full pointer-events-none" />
      {state?.explanation && (
        <div className="absolute bottom-10 right-10 left-[480px] text-center pointer-events-none">
          <div className="bg-black/80 backdrop-blur-3xl text-white px-10 py-5 rounded-[2.5rem] border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] inline-block max-w-2xl transform transition-all duration-700">
            <span className="block text-[10px] font-black tracking-[0.4em] text-blue-500 mb-2 uppercase">Spatial Trace</span>
            <span className="text-sm font-bold tracking-tight leading-relaxed block opacity-95">{state.explanation}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Visualizer;
