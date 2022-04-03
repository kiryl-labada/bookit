import * as React from 'react';
import { BehaviorSubject, fromEvent, interval, throttle, Unsubscribable } from 'rxjs';
import { BookingDbRef } from '../../db';
import { MapCanvasController } from './MapCanvasController';
import { MapPlugin } from '../../common';
// import memoize from "memoize-one";

interface A {
    firstName: string;
}

interface MapCanvasGenericProps {
    mapId: number;
    dbRef: BookingDbRef;
    forceResize: boolean;
    plugins: MapPlugin[];
    selectedItem?: BehaviorSubject<number | null>;
}

export class MapCanvasGeneric extends React.Component<MapCanvasGenericProps, A> {
    private mapController: MapCanvasController | null = null;
    private htmlCanvas: HTMLCanvasElement | null = null;
    private subscriptions: Unsubscribable[] = [];
    
    render() {
        console.log('render');
        return <canvas ref={ (c) => this.setCanvas(c) } />
    }

    shouldComponentUpdate(nextProps: MapCanvasGenericProps) {
        console.log('shouldComponentUpdate')
        this.mapController?.detectChanges();
        this.mapController?.handleQueue();
        this.mapController?.setPlugins(nextProps.plugins);
        this.handleResizeRequest(nextProps.forceResize);
        return this.props.mapId !== nextProps.mapId;
    }

    setCanvas(canvas: HTMLCanvasElement | null) {
        console.log('setCanvas');
        this.htmlCanvas = canvas;
        if (canvas) {
            this.mapController && this.mapController.dispose();
            this.mapController = new MapCanvasController(canvas, this.props.mapId, this.props.dbRef, { selectedItem: this.props.selectedItem });
        }
    }

    componentDidMount() {
        console.log('componentDidMount');

        this.mapController?.detectChanges();
        this.mapController?.handleQueue();
        this.resize();

        this.subscriptions.push(
            fromEvent(window, 'resize')
                .pipe(throttle(ev => interval(150)))
                .subscribe(() => this.resize())
        );
    }

    componentWillUnmount() {
        console.log('componentWillUnmount');
        this.resizeTimer && clearInterval(this.resizeTimer);
        this.subscriptions.forEach((s) => s.unsubscribe());
    }

    componentDidUpdate(prevProps: MapCanvasGenericProps, prevState: A, snapshot: any) {
        console.log('componentDidUpdate');

        this.mapController?.detectChanges();
        this.mapController?.handleQueue();
    }

    // getSnapshotBeforeUpdate(prevProps: MapCanvasGenericProps, prevState: A) {
    //     return null;
    // }

    // shouldComponentUpdate(nextProps: MapCanvasGenericProps, nextState: A) {
    //     return true;
    // }

    private resizeTimer: any = null;
    handleResizeRequest(forceResize: boolean) {
        if (!forceResize && this.resizeTimer) {
            clearInterval(this.resizeTimer);
            this.resize();
        }

        if (forceResize) {
            this.resizeTimer && clearInterval(this.resizeTimer);
            this.resizeTimer = setInterval(() => {
                this.resize();
            }, 100);
        }
    }

    resize() {
        if (!this.htmlCanvas) return;
        this.mapController?.resize(calculateParentSize(this.htmlCanvas));
    }
}

function calculateParentSize(canvas: HTMLCanvasElement) {
    if (canvas.parentElement?.parentElement) {
        return { 
            width: canvas.parentElement.parentElement.clientWidth,
            height: canvas.parentElement.parentElement.clientHeight,
        };
    }

    return { width: canvas.clientWidth, height: canvas.clientHeight };
}