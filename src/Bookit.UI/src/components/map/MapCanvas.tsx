import * as React from 'react';
import { useRef, useEffect, useState } from 'react';
import { fabric } from 'fabric';
import { Bounds, drawPolygon, drawRectangle, enableZoom, moveCanvas } from '../../common';

export type DrawMode = 'pointer' | 'rect' | 'move' | 'polygon';

interface MapCanvasProps {
    forceResize?: boolean;
    afterResize?: () => void;
    mode: DrawMode;
    background: string | null;
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

export const MapCanvas: React.FC<MapCanvasProps> = ({ forceResize, afterResize, mode, background }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [canvas, setCanvas] = useState<fabric.Canvas>();
    const [bounds, setBounds] = useState<Bounds>();

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

        if (background) {
            canvas.setBackgroundImage(background, () => {
                if (canvas.backgroundImage instanceof fabric.Image) {
                    const { width, height } = canvas.backgroundImage;

                    setBounds({
                        offsetX: width! * 0.8,
                        offsetY: height! * 0.8,
                        width: width!,
                        height: height!,
                    });
                }
            });
        } else {
            canvas.backgroundImage = undefined;
            canvas.renderAll();
        }
    }, [background, canvas]);

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
            return moveCanvas(canvas, bounds);
        }

        if (mode === 'polygon') {
            return drawPolygon(canvas);
        }

    }, [canvas, mode, bounds]);

    return <canvas ref={canvasRef} />;
}
