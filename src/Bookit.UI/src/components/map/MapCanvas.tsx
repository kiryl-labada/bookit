import * as React from 'react';
import { useRef, useEffect, useState } from 'react';
import { fabric } from 'fabric';
import { drawPolygon, drawRectangle, enableZoom, moveCanvas } from '../../common';

export type DrawMode = 'pointer' | 'rect' | 'move' | 'polygon';

interface MapCanvasProps {
    forceResize?: boolean;
    afterResize?: () => void;
    mode: DrawMode;
}

function calculateParentSize(canvas: HTMLCanvasElement) {
    if (canvas.parentElement?.parentElement) {
        return { 
            width: canvas.parentElement.parentElement.clientWidth,
            height: canvas.parentElement.parentElement.clientHeight,
        };
    }

    return { width: canvas.clientWidth, height: canvas.clientHeight };
}

function debounce(f: any, ms: number) {
    let isCooldown = false;

    return function(this: any) {
        if (isCooldown) return;

        f.apply(this, arguments);
        isCooldown = true;
        setTimeout(() => isCooldown = false, ms);
    };
}

export const MapCanvas: React.FC<MapCanvasProps> = ({ forceResize, afterResize, mode }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [canvas, setCanvas] = useState<fabric.Canvas>();

    const resizeCanvas = () => {
        if (canvasRef.current && canvas) {
            const { width, height } = calculateParentSize(canvasRef.current);
            canvas.setWidth(width);
            canvas.setHeight(height);
            canvas.calcOffset();
        }
    };

    useEffect(() => {
        const c = new fabric.Canvas(canvasRef.current);
        setCanvas(c);
    }, []);

    useEffect(() => {
        if (!canvas) return;

        const disposeZoom = enableZoom(canvas);

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas, false);
        return () => {
            disposeZoom();
            window.removeEventListener('resize', resizeCanvas, false);
        };
    }, [canvas]);

    useEffect(() => {
        if (forceResize) {
            resizeCanvas();
            afterResize && afterResize();
        }
    }, [forceResize]);

    useEffect(() => {
        if (!canvas) {
            return;
        }

        if (mode === 'rect') {
            return drawRectangle(canvas);
        }

        if (mode === 'move') {
            return moveCanvas(canvas);
        }

        if (mode === 'polygon') {
            return drawPolygon(canvas);
        }

    }, [canvas, mode]);

    return <canvas ref={canvasRef} />;
}
