import { fabric } from 'fabric';
import { BehaviorSubject, Unsubscribable, fromEventPattern } from 'rxjs';
import { Bounds } from '../../common/canvas/MoveCanvasPlugin';
import { BookingDb, BookingDbRef, MapObject, MapObjectType } from '../../db';
import { MapPlugin } from '../../common';

interface MapObjectState {
    current: MapObject;
    prev?: MapObject;
    view: fabric.Object;
}

interface MapCanvasOptions {
    selectedItem?: BehaviorSubject<number | null>;
}

export class MapCanvasController {
    private dbRef: BookingDbRef;
    private options: MapCanvasOptions;
    private mapState = new Map<number, MapObjectState>();
    private plugins = new Map<string, MapPlugin>();
    private canvas: fabric.Canvas;
    private mapId: number;

    private addQueue: MapObject[] = [];
    private removeQueue: MapObject[] = [];
    private updateQueue: MapObject[] = [];

    private subsriptions: Unsubscribable[] = [];

    bounds: Bounds | null = null;

    constructor(canvas: HTMLCanvasElement, mapId: number, dbRef: BookingDbRef, options: MapCanvasOptions = {}) {
        this.canvas = new fabric.Canvas(canvas);
        this.dbRef = dbRef;
        this.mapId = mapId;
        this.options = options;
        this.init();
    }

    private init() {
        this.detectChanges();
        this.handleQueue();
        this.subscribe();
    }

    private subscribe() {
        const selectionClearedEvent = fromEventPattern((h) => this.canvas.on('selection:cleared', h), (h) => this.canvas.off('selection:cleared', h));
        const selectionCreatedEvent = fromEventPattern((h) => this.canvas.on('selection:created', h), (h) => this.canvas.off('selection:created', h));
        const selectionUpdatedEvent = fromEventPattern((h) => this.canvas.on('selection:updated', h), (h) => this.canvas.off('selection:updated', h));
        
        const s1 = selectionCreatedEvent.subscribe(() => {
            console.log('selection created');
            const activeView = this.canvas.getActiveObject();
            const state = this.findMapObjectByView(activeView);
            state && this.options.selectedItem?.next(state.current.id);
        });

        const s2 = selectionUpdatedEvent.subscribe(() => {
            console.log('selection updated')
            const activeView = this.canvas.getActiveObject();
            const state = this.findMapObjectByView(activeView);
            if (state && state.current.id !== this.options.selectedItem?.value) {
                this.options.selectedItem?.next(state.current.id);
            } else if (!state) {
                this.options.selectedItem?.next(null);
            }
        });

        const s3 = selectionClearedEvent.subscribe(() => {
            if (this.options.selectedItem?.value) {
                this.options.selectedItem.next(null);
            }
            console.log('canvas deselect');
        });

        const s4 = this.options.selectedItem?.subscribe((id) => {
            const view = (id && this.mapState.get(id)?.view) || null;

            if (view) {
                this.canvas.setActiveObject(view).requestRenderAll();
            } else if (this.canvas.getActiveObjects()) {
                this.canvas.discardActiveObject();
            }
        });

        this.subsriptions.push(s1);
        this.subsriptions.push(s2);
        this.subsriptions.push(s3);
        s4 && this.subsriptions.push(s4);
    }

    setPlugins(plugins: MapPlugin[]) {
        plugins.forEach((plugin) => {
            const existingPlugin = this.plugins.get(plugin.key);
            if (existingPlugin === plugin) return;
            
            existingPlugin?.deactivate();
            this.plugins.set(plugin.key, plugin);
            plugin.activate(this.canvas, this);
        });

        const keys = new Set(plugins.map((p) => p.key));
        const keysToDelete: string[] = [];
        this.plugins.forEach((_, k) => !keys.has(k) && keysToDelete.push(k));
        keysToDelete.forEach((k) => { this.plugins.get(k)?.deactivate(); this.plugins.delete(k); });
    }

    detectChanges() {
        const newView = getMapObjects(this.dbRef.db, { mapId: this.mapId });
        const ids = new Set<number>();
        console.log(newView);
        newView.forEach((item) => {
            ids.add(item.id);
            const savedState = this.mapState.get(item.id);
            if (!savedState) {
                this.addQueue.push(item);
                return;
            }

            if (savedState.current.modifiedAt !== item.modifiedAt) {
                this.updateQueue.push(item);
            }
        });

        this.mapState.forEach((itemState, key) => {
            if (!ids.has(key)) {
                this.removeQueue.push(itemState.current);
            }
        });
    }

    handleQueue() {
        this.addQueue.forEach((item) => {
            this.mountItem(item);
            this.updateQueue.push(item);
        });

        this.removeQueue.forEach((item) => this.unmountItem(item));
        this.updateQueue.forEach((item) => this.updateItem(item));

        if (this.addQueue.length || this.removeQueue.length || this.updateQueue.length) {
            console.log('renderAll');
            this.canvas.renderAll();
        }

        this.addQueue.length = 0;
        this.removeQueue.length = 0;
        this.updateQueue.length = 0;
    }

    mountItem(item: MapObject) {
        console.log('mount', item);
        if (item.type === MapObjectType.MAP) {
            this.mapState.set(item.id, { current: item, view: null as any });
            return;
        }

        fabric.util.enlivenObjects([JSON.parse(item.structureJson)], (objects: fabric.Object[]) => {
            const obj = objects[0];
            this.canvas.add(obj);

            const itemModified = fromEventPattern<fabric.IEvent<Event>>(
                (handler) => obj.on('modified', handler),
                (handler) => obj.off('modified', handler),
            );

            itemModified.subscribe((e) => {
                console.log('item modified');
                this.dbRef.commitFetch({
                    mapObjects: [
                        {
                            id: this.dbRef.idMap.clientToServer(item.id),
                            name: new Date().toISOString(),
                            structureJson: JSON.stringify(obj),
                        },
                    ],
                });
            });

            // obj.on('selected' as any, () => {
            //     if (this.options.selectedItem && this.options.selectedItem.value !== item.id) {
            //         console.log('selectedItem', item);
            //         this.options.selectedItem.next(item.id);
            //     }
            // });

            this.mapState.set(item.id, { current: item, view: obj });
        }, undefined as any);
    }

    unmountItem(item: MapObject) {
        console.log('unmount', item);
        const view = this.mapState.get(item.id)!.view;
        view && this.canvas.remove(view);
        this.mapState.delete(item.id);
    }

    updateItem(item: MapObject) {
        // console.log('update', item);
        const state = this.mapState.get(item.id)!;
        state.prev = state.current;
        state.current = item;

        if (item.name === 'NewMapObject1') {
            state.view.set({ width: 50 });
        }

        if (item.background) {
            this.canvas.setBackgroundImage(item.background, () => {
                if (this.canvas.backgroundImage instanceof fabric.Image) {
                    const { width, height } = this.canvas.backgroundImage.getOriginalSize();

                    this.bounds = {
                        offsetX: width * 0.8,
                        offsetY: height * 0.8,
                        width: width,
                        height: height,
                    };

                    this.canvas.requestRenderAll();
                }
            });
        }
    }

    resize({width, height}: { width: number, height: number }) {
        if (this.canvas.width !== width || this.canvas.height !== height) {
            this.canvas.setWidth(width);
            this.canvas.setHeight(height);
            this.canvas.calcOffset();
        }
    }

    dispose() {
        this.subsriptions.forEach((s) => s.unsubscribe());
    }

    private findMapObjectByView(view: fabric.Object): MapObjectState | null {
        let value: MapObjectState | null = null;
        this.mapState.forEach((v) => {
            if (v.view === view) {
                value = v;
            }
        });
        return value;
    }
}


const getMapObjects = (db: BookingDb, { mapId }: { mapId: number }): MapObject[] => {
    console.log('mapId', mapId);
    const map = db.mapObjects.byId(mapId);
    const mapObjects = db.mapObjects.find({ parentId: mapId }).toArray();
    return [map, ...mapObjects];
};
