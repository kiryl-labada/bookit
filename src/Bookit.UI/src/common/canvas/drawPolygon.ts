import { fabric } from "fabric";

function isClose(canvas: fabric.Canvas, point1: fabric.Point, point2: fabric.Point) {
    return (canvas.getZoom() * point1.distanceFrom(point2)) < 10;
}

function createPolygon(points: fabric.Point[]) {
    return new fabric.Polygon(points, {
        fill: 'rgba(0,0,0,0)',
        stroke:'#7F7F7F'
    });
}

export function drawPolygon(canvas: fabric.Canvas) {
    let points: fabric.Point[] = [];
    let path: fabric.Line[] = [];

    const cleanUp = function() {
        path.forEach((line) => canvas.remove(line));
        points = [];
        path = [];
    }

    const onAddPoint = function(this: any, opt: fabric.IEvent<MouseEvent>) {
        if (!opt.absolutePointer) return;

        this.selection = false;
        const point = opt.absolutePointer;
        
        if (points.length > 2 && isClose(canvas, point, points[0])) {
            this.selection = true;
            const polygon = createPolygon(points);
            canvas.add(polygon);

            cleanUp();
            canvas.renderAll();

            return;
        }

        points.push(point);

        const line = new fabric.Line([point.x, point.y, point.x, point.y], {
            strokeWidth: 1,
            selectable: false,
            stroke: 'red',
            originX: 'left',
            originY: 'top',
        });
        path.push(line);

        canvas.add(line);
    };

    const onMouseMove = function(this: any, opt: fabric.IEvent<MouseEvent>) {
        if (!path.length || !opt.absolutePointer) return;

        const { x, y } = opt.absolutePointer;
        path[path.length - 1].set({
            x2: x,
            y2: y,
        });

        canvas.renderAll();
    };

    canvas.on('mouse:down', onAddPoint);
    canvas.on('mouse:move', onMouseMove);

    return () => {
        cleanUp();

        canvas.off('mouse:down', onAddPoint as any);
        canvas.off('mouse:move', onMouseMove as any);
    };
}