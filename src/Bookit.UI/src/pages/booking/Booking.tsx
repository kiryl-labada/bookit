import { Panel, FlexCell, FlexRow, Text, Button } from "@epam/loveship";
import * as React from "react";
import { useRef, useEffect, useState } from "react";
import { fabric } from "fabric";
import { drawPolygon, drawRectangle, enableZoom, moveCanvas } from '../../common';
import css from './Booking.module.scss';

type DrawMode = 'pointer' | 'rect' | 'move' | 'polygon';

export const BookingPage: React.FC<{}> = (props) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [canvas, setCanvas] = useState<fabric.Canvas>();
    const [mode, setMode] = useState<DrawMode>('pointer');

    useEffect(() => {
        const c = new fabric.Canvas(canvasRef.current);
        setCanvas(c);

        c.add(new fabric.Rect({
            left: 100,
            top: 100,
            fill: 'red',
            width: 200,
            height: 200,
            angle: 45
        }));

        enableZoom(c);
    }, []);

    useEffect(() => {
        const c = canvas;
        if (!c) return;

        const resizeCanvas = function() {
            const container = containerRef.current;
            if (container) {
                console.log('width', container.clientWidth);

                c.setWidth(container.clientWidth);
                c.setHeight(container.clientHeight);
                c.calcOffset();
            }
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas, false);
        return () => {
            window.removeEventListener('resize', resizeCanvas, false);
        };
    }, [containerRef, canvas])

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

    const renderButton = (buttonMode: DrawMode) => <Button caption={ buttonMode } fontSize={ mode === buttonMode ? '18' : '12' } onClick={ () => setMode(buttonMode) } />;

    return (
        <div style={ { display: 'flex', flex: '1 1 auto', position: 'absolute', width: '100%', height: '100%' } }>
            <div style={ { flexBasis: 250, flexShrink: 0 } } >
                <Panel background='night50' rawProps={ { style: { height: '100%' } } } >
                    { renderButton('pointer') }
                    { renderButton('rect') }
                    { renderButton('move') }
                    { renderButton('polygon') }
                </Panel>
            </div>
            <div style={ { flexGrow: 1, overflow: 'hidden' } } ref={containerRef} >
                <canvas ref={canvasRef} />
            </div>
            <FlexCell width={ 250 } shrink={ 0 } >
                <Panel background='night50' rawProps={ { style: { height: '100%' } } } >
                    <Text>ajkds</Text>
                </Panel>
            </FlexCell>
        </div>
    );
};

function debounce(f: any, ms: number) {
    let isCooldown = false;

    return function(this: any) {
        if (isCooldown) return;

        f.apply(this, arguments);
        isCooldown = true;
        setTimeout(() => isCooldown = false, ms);
    };
}