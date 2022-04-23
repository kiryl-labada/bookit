import { fabric } from 'fabric';
import { MapPlugin } from './types';

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