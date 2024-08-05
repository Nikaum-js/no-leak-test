import React, { useEffect, useRef, useState, useMemo } from 'react';
import h337 from 'heatmap.js';

interface HeatmapProps {
  image: string;
  data: any;
  objectType: string;
}

interface Point {
  x: number;
  y: number;
  value: number;
}

export function Heatmap({ image, data, objectType }: HeatmapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [heatmapInstance, setHeatmapInstance] = useState<any>(null);

  const points = useMemo(() => calculatePoints(data, objectType), [data, objectType]);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImageDimensions({
        width: img.width,
        height: img.height
      });
    };
    img.src = image;
  }, [image]);

  useEffect(() => {
    if (containerRef.current && imageDimensions.width && imageDimensions.height) {
      containerRef.current.style.width = `${imageDimensions.width}px`;
      containerRef.current.style.height = `${imageDimensions.height}px`;

      if (!heatmapInstance) {
        const instance = createHeatmap(containerRef.current, imageDimensions);
        setHeatmapInstance(instance);
      }
      
      if (heatmapInstance) {
        const scaledPoints = scalePoints(points, imageDimensions);
        updateHeatmap(heatmapInstance, scaledPoints);
      }
    }
  }, [points, imageDimensions, heatmapInstance]);

  const handleDownload = () => {
    if (containerRef.current) {
      downloadHeatmap(containerRef.current);
    }
  };

  return (
    <div className="relative" style={{ width: imageDimensions.width, height: imageDimensions.height }}>
      <img
        ref={imageRef}
        src={image}
        alt="Base"
        className="absolute top-0 left-0 w-full h-full object-contain"
      />
      <div ref={containerRef} className="absolute top-0 left-0 w-full h-full" />
      <button
        onClick={handleDownload}
        className="absolute bottom-4 right-4 mt-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 px-4 py-2"
      >
        Download Heatmap
      </button>
    </div>
  );
};

function calculatePoints(data: any, objectType: string): Point[] {
  const objectTracker: { [key: string]: { count: number, x: number, y: number } } = {};

  data.hits.hits.forEach((hit: any) => {
    if (hit.fields && hit.fields['deepstream-msg']) {
      const messages = Array.isArray(hit.fields['deepstream-msg']) 
        ? hit.fields['deepstream-msg'] 
        : [hit.fields['deepstream-msg']];
      
      messages.forEach((msg: string) => {
        if (msg.includes(objectType)) {
          const [trackingId, xMin, yMin, xMax, yMax] = msg.split('|');
          const { x, y } = calculateCentroid(
            parseFloat(xMin),
            parseFloat(yMin),
            parseFloat(xMax),
            parseFloat(yMax)
          );
          
          if (objectTracker[trackingId]) {
            objectTracker[trackingId].count++;
            objectTracker[trackingId].x += x;
            objectTracker[trackingId].y += y;
          } else {
            objectTracker[trackingId] = { count: 1, x, y };
          }
        }
      });
    }
  });

  return Object.values(objectTracker).map(({ count, x, y }) => ({
    x: x / count,
    y: y / count,
    value: count
  }));
}

function calculateCentroid(xMin: number, yMin: number, xMax: number, yMax: number) {
  return {
    x: (xMin + xMax) / 2,
    y: (yMin + yMax) / 2
  };
}

function createHeatmap(container: HTMLElement, dimensions: { width: number; height: number }) {
  return h337.create({
    container,
    radius: Math.min(dimensions.width, dimensions.height) / 30,
    maxOpacity: 0.8,
    minOpacity: 0.1,
    blur: 0.75,
    gradient: {
      0.4: 'blue',
      0.6: 'cyan',
      0.7: 'lime',
      0.8: 'yellow',
      1.0: 'red'
    }
  });
}

function scalePoints(points: Point[], dimensions: { width: number; height: number }): Point[] {
  const maxX = Math.max(...points.map(p => p.x));
  const maxY = Math.max(...points.map(p => p.y));

  const scaledPoints = points.map(point => ({
    x: Math.floor((point.x / maxX) * dimensions.width),
    y: Math.floor((point.y / maxY) * dimensions.height),
    value: point.value
  }));

  return scaledPoints;
}

function updateHeatmap(heatmapInstance: any, points: Point[]) {
  const maxValue = Math.max(...points.map(p => p.value));
  const minValue = Math.min(...points.map(p => p.value));
  
  const normalizedPoints = points.map(point => ({
    ...point,
    value: (point.value - minValue) / (maxValue - minValue)
  }));

  heatmapInstance.setData({
    max: 1,
    data: normalizedPoints,
    min: 0
  });
}

function downloadHeatmap(container: HTMLElement) {
  const canvas = container.querySelector('canvas');
  if (canvas) {
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'heatmap.png';
    link.click();
  }
}
