import { fabric } from 'fabric';
import { MapCanvasController } from '../../components';
import { MapPlugin } from './types';

export class DrawRectanglePlugin extends MapPlugin {
    private isDown: boolean = false;
    private origX: number = 0;
    private origY: number = 0;
    private rect: fabric.Rect | null = null;

    key: string = 'draw_rectangle_plugin';
    activate(canvas: fabric.Canvas, controller: MapCanvasController): void {
        this.canvas = canvas;

        this.listeners.push({ event: 'mouse:down', handler: this.createStartDrawingListener() });
        this.listeners.push({ event: 'mouse:move', handler: this.createMouseMoveListener() });
        this.listeners.push({ event: 'mouse:up', handler: this.createEndDrawingListener() });

        super.activate(canvas, controller);
    }

    private createStartDrawingListener() {
        const ctx = this;
        return function(this: any, opt: fabric.IEvent<MouseEvent>) {
            ctx.isDown = true;
            const pointer = ctx.canvas.getPointer(opt.e);
            ctx.origX = pointer.x;
            ctx.origY = pointer.y;
            ctx.rect = new fabric.Rect({
                left: ctx.origX,
                top: ctx.origY,
                originX: 'left',
                originY: 'top',
                width: pointer.x - ctx.origX,
                height: pointer.y - ctx.origY,
                angle: 0,
                fill: 'rgba(255,0,0,0.5)',
                transparentCorners: false
            });
            ctx.canvas.add(ctx.rect);
        };
    }

    private createEndDrawingListener() {
        const ctx = this;
        return function(this: any, opt: fabric.IEvent<MouseEvent>) {
            ctx.isDown = false;
        };
    }

    private createMouseMoveListener() {
        const ctx = this;
        return function(this: any, opt: fabric.IEvent<MouseEvent>) {
            if (!ctx.isDown || !ctx.rect) return;
            const pointer = ctx.canvas.getPointer(opt.e);
            
            if (ctx.origX > pointer.x){
                ctx.rect.set({ left: Math.abs(pointer.x) });
            }
            if (ctx.origY > pointer.y){
                ctx.rect.set({ top: Math.abs(pointer.y) });
            }
            
            ctx.rect.set({ width: Math.abs(ctx.origX - pointer.x) });
            ctx.rect.set({ height: Math.abs(ctx.origY - pointer.y) });
            
            ctx.canvas.renderAll();
        };
    }
}
