import { fabric } from 'fabric';
import { MapPlugin } from './types';

export function enableZoom(canvas: fabric.Canvas) {
    const onZoom = function(opt: fabric.IEvent<WheelEvent>) {
        const delta = opt.e.deltaY;
        let zoom = canvas.getZoom();
        zoom *= 0.999 ** delta;
        if (zoom > 20) zoom = 20;
        if (zoom < 0.01) zoom = 0.01;
        canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
        opt.e.preventDefault();
        opt.e.stopPropagation();
    }

    canvas.on('mouse:wheel', onZoom);

    return () => {
        canvas.off('mouse:wheel', onZoom as any);
    };
}

export class ZoomPlugin extends MapPlugin {
    key: string = 'zoom_plugin';

    protected init() {
        this.listeners.push({ event: 'mouse:wheel', handler: this.createMouseWheelListener() });
    }

    private createMouseWheelListener() {
        const ctx = this;
        return function(this: any, opt: fabric.IEvent<WheelEvent>) {
            const delta = opt.e.deltaY;
            let zoom = ctx.canvas.getZoom();
            zoom *= 0.999 ** delta;
            if (zoom > 20) zoom = 20;
            if (zoom < 0.01) zoom = 0.01;
            ctx.canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
            opt.e.preventDefault();
            opt.e.stopPropagation();
        };
    }
}