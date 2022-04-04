import { MapCanvasController } from '../../components/map/MapCanvasController';
import { fabric } from 'fabric';
import { MapPlugin } from './types';

export interface Bounds {
    height: number;
    width: number;
    offsetX: number;
    offsetY: number;
}

interface EventThis {
    vptCoords: {
        bl: fabric.Point;
        br: fabric.Point;
        tl: fabric.Point;
        tr: fabric.Point;
    };
    viewportTransform: number[];
    lastPosX: number;
    lastPosY: number;
    isDragging: boolean;
    selection: boolean;
    setViewportTransform: Function;
    requestRenderAll: Function;
}

const threshold = 10;

function normalizeStep(x: number) {
    if (Math.abs(x) > 100) {
        return Math.sign(x) * 10;
    }

    return Math.floor(x * 0.1);
}

function isAllowed(vptCoords: EventThis['vptCoords'], step: fabric.Point, bounds: Bounds | null) {
    if (!bounds) return step;

    const b = {
        tl: { x: -bounds.offsetX, y: -bounds.offsetY },
        br: { x: bounds.width + bounds.offsetX, y: bounds.height + bounds.offsetY },
    };

    const bottomRightDiff = vptCoords.br.subtract(b.br);
    const topLeftDiff = vptCoords.tl.subtract(b.tl);
    
    const outOfLeftBound = topLeftDiff.x < threshold;
    const outOfRightBound = bottomRightDiff.x > -threshold;
    const outOfTopBound = topLeftDiff.y < threshold;
    const outOfBottomBound = bottomRightDiff.y > -threshold;

    if (outOfLeftBound && outOfRightBound) step.setX(0);
    if (outOfTopBound && outOfBottomBound) step.setY(0);
    if ((outOfLeftBound && outOfRightBound) || (outOfTopBound && outOfBottomBound)) return step;

    if (topLeftDiff.x < -threshold) step.setX(normalizeStep(topLeftDiff.x));
    if (topLeftDiff.y < -threshold) step.setY(normalizeStep(topLeftDiff.y));

    if (bottomRightDiff.x > threshold) step.setX(normalizeStep(bottomRightDiff.x));
    if (bottomRightDiff.y > threshold) step.setY(normalizeStep(bottomRightDiff.y));

    return step;
}

export class MoveCanvasPlugin extends MapPlugin {
    key: string = 'move_canvas_plugin';

    protected init() {
        this.listeners.push({ event: 'mouse:down', handler: this.createStartMoveListener() });
        this.listeners.push({ event: 'mouse:up', handler: this.createEndMoveListener() });
        this.listeners.push({ event: 'mouse:move', handler: this.createMovingListener() });
    }

    private createStartMoveListener() {
        return function(this: any, opt: fabric.IEvent<MouseEvent>) {
            var evt = opt.e;
            if (evt.ctrlKey) {
                this.isDragging = true;
                this.selection = false;
                this.lastPosX = evt.clientX;
                this.lastPosY = evt.clientY;
            }
        }
    }
    private createEndMoveListener() {
        return function(this: any, opt: fabric.IEvent<MouseEvent>) {
            this.setViewportTransform(this.viewportTransform);
            this.isDragging = false;
            this.selection = true;
        };
    }

    private createMovingListener() {
        const ctx = this;
        return function(this: any, opt: fabric.IEvent<MouseEvent>) {
            if (this.isDragging) {
                const e = opt.e;
                const vpt = this.viewportTransform;
    
                const diffX = e.clientX - this.lastPosX;
                const diffY = e.clientY - this.lastPosY;
    
                const step = isAllowed(this.vptCoords, new fabric.Point(diffX, diffY), ctx.controller.bounds);
                vpt[4] += step.x;
                vpt[5] += step.y;
    
                this.lastPosX = e.clientX;
                this.lastPosY = e.clientY;
    
                this.requestRenderAll();
            }
        };
    }
}
