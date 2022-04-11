import { MapCanvasController } from '../MapCanvasController';

export interface Listener {
    event: string;
    handler: Function;
}

export abstract class MapPlugin {
    protected listeners: Listener[] = [];
    protected canvas: fabric.Canvas = null as any;
    protected controller: MapCanvasController = null as any;
    abstract key: string;
    activate(canvas: fabric.Canvas, controller: MapCanvasController): void {
        this.canvas = canvas;
        this.controller = controller;

        this.init();
        
        this.listeners.forEach((l) => canvas.on(l.event as any, l.handler as any));
    }
    deactivate() {
        this.cleanUp();
        this.listeners.forEach((l) => this.canvas.off(l.event, l.handler as any));
        this.listeners.length = 0;
    };
    protected abstract init(): void;
    protected cleanUp() {};
}