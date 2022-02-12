import { fabric } from "fabric";

export function moveCanvas(canvas: fabric.Canvas) {
    const onMoveStart = function(this: any, opt: fabric.IEvent<MouseEvent>) {
        var evt = opt.e;
        // if (evt.altKey === true) {
        this.isDragging = true;
        this.selection = false;
        this.lastPosX = evt.clientX;
        this.lastPosY = evt.clientY;
        // }
    };

    const onMoveEnd = function(this: any, opt: fabric.IEvent<MouseEvent>) {
        // on mouse up we want to recalculate new interaction
        // for all objects, so we call setViewportTransform
        this.setViewportTransform(this.viewportTransform);
        this.isDragging = false;
        this.selection = true;
    }

    const onMoving = function(this: any, opt: fabric.IEvent<MouseEvent>) {
        if (this.isDragging) {
            var e = opt.e;
            var vpt = this.viewportTransform;
            vpt[4] += e.clientX - this.lastPosX;
            vpt[5] += e.clientY - this.lastPosY;
            this.requestRenderAll();
            this.lastPosX = e.clientX;
            this.lastPosY = e.clientY;
        }
    }

    canvas.on('mouse:down', onMoveStart);
    canvas.on('mouse:move', onMoving);
    canvas.on('mouse:up', onMoveEnd);

    return () => {
        canvas.off('mouse:down', onMoveStart as any);
        canvas.off('mouse:move', onMoveEnd as any);
        canvas.off('mouse:up', onMoving as any);
    };
};