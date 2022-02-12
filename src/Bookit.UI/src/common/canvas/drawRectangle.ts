import { fabric } from "fabric";

export function drawRectangle(canvas: fabric.Canvas) {
    canvas.selection = false;

    let origX: number, origY: number, isDown: boolean, rect: fabric.Rect;
    const onDrawingStart = function(o: fabric.IEvent<MouseEvent>) {
        isDown = true;
        const pointer = canvas.getPointer(o.e);
        origX = pointer.x;
        origY = pointer.y;
        rect = new fabric.Rect({
            left: origX,
            top: origY,
            originX: 'left',
            originY: 'top',
            width: pointer.x-origX,
            height: pointer.y-origY,
            angle: 0,
            fill: 'rgba(255,0,0,0.5)',
            transparentCorners: false
        });
        canvas.add(rect);
    };

    const onDrawingEnd = function(o: fabric.IEvent<MouseEvent>){
        isDown = false;
    };

    const onMouseMove = function(o: fabric.IEvent<MouseEvent>){
        if (!isDown) return;
        const pointer = canvas.getPointer(o.e);
        
        if(origX>pointer.x){
            rect.set({ left: Math.abs(pointer.x) });
        }
        if(origY>pointer.y){
            rect.set({ top: Math.abs(pointer.y) });
        }
        
        rect.set({ width: Math.abs(origX - pointer.x) });
        rect.set({ height: Math.abs(origY - pointer.y) });
        
        canvas.renderAll();
    };

    canvas.on('mouse:down', onDrawingStart);
    canvas.on('mouse:move', onMouseMove);
    canvas.on('mouse:up', onDrawingEnd);

    return () => {
        canvas.selection = true;
        canvas.off('mouse:down', onDrawingStart as any);
        canvas.off('mouse:move', onMouseMove as any);
        canvas.off('mouse:up', onDrawingEnd as any);
    };
}
