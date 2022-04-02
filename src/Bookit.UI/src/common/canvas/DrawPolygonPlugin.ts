import { MapCanvasController } from '../../components/map/MapCanvasController';
import { fabric } from 'fabric';
import { Listener, MapPlugin } from './types';

function isClose(canvas: fabric.Canvas, point1: fabric.Point, point2: fabric.Point) {
    return (canvas.getZoom() * point1.distanceFrom(point2)) < 10;
}

function createPolygon(points: fabric.Point[]) {
    return new fabric.Polygon(points, {
        fill: 'rgba(0,0,0,0)',
        stroke:'#7F7F7F'
    });
}

export class DrawPolygonPlugin extends MapPlugin {
    private points: fabric.Point[] = [];
    private path: fabric.Line[] = [];

    key: string = 'draw_polygon_plugin';
    activate(canvas: fabric.Canvas, controller: MapCanvasController): void {
        this.canvas = canvas;

        this.listeners.push({ event: 'mouse:down', handler: this.createAddPointListener() });
        this.listeners.push({ event: 'mouse:move', handler: this.createMouseMoveListener() });

        super.activate(canvas, controller);
    }

    deactivate(): void {
        this.cleanUp();
        super.deactivate();
    }

    private cleanUp() {
        this.path.forEach((line) => this.canvas.remove(line));
        this.points = [];
        this.path = [];
    }

    private createAddPointListener() {
        const ctx = this;
        return function(this: any, opt: fabric.IEvent<MouseEvent>) {
            if (!opt.absolutePointer) return;
    
            this.selection = false;
            const point = opt.absolutePointer;
            
            if (ctx.points.length > 2 && isClose(ctx.canvas, point, ctx.points[0])) {
                this.selection = true;
                const polygon = createPolygon(ctx.points);
                ctx.canvas.add(polygon);
    
                ctx.cleanUp();
                ctx.canvas.renderAll();
    
                return;
            }
    
            ctx.points.push(point);
    
            const line = new fabric.Line([point.x, point.y, point.x, point.y], {
                strokeWidth: 1,
                selectable: false,
                stroke: 'red',
                originX: 'left',
                originY: 'top',
            });
            ctx.path.push(line);
    
            ctx.canvas.add(line);
        }
    }

    private createMouseMoveListener() {
        const ctx = this;
        return function(this: any, opt: fabric.IEvent<MouseEvent>) {
            if (!ctx.path.length || !opt.absolutePointer) return;
    
            const { x, y } = opt.absolutePointer;
            ctx.path[ctx.path.length - 1].set({
                x2: x,
                y2: y,
            });
    
            ctx.canvas.renderAll();
        };
    }
}