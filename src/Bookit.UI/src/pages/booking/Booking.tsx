import { useEffect, useState, FC } from 'react';
import { BehaviorSubject } from 'rxjs';
import { Panel, FlexCell, Button, Text } from '@epam/loveship';
import css from './Booking.module.scss';
import plan from './../../assets/imgs/floor-plan.jpg';
import { BookingDb, MapObject, MapObjectType, useBookingDbRef } from '../../db';
import { MapCanvasGeneric } from '../../components/map/MapCanvasGeneric';
import { DrawPolygonPlugin, MapPlugin, MoveCanvasPlugin, ZoomPlugin } from '../../common';

const defaultMapPlugins: MapPlugin[] = [new MoveCanvasPlugin(), new ZoomPlugin()];

type DrawMode = 'pointer' | 'rect' | 'move' | 'polygon';

export const BookingPage: FC<{}> = (props) => {
    const dbRef = useBookingDbRef();
    // const map = useDbView((db: BookingDb) => db.mapObjects.toArray());
    const [mode, setMode] = useState<DrawMode>('pointer');
    const [showLeftPanel, setShowLeftPanel] = useState(true);
    const [forceResize, setForceResize] = useState(false);
    const [plugins, setPlugins] = useState<MapPlugin[]>(defaultMapPlugins);
    const [selectedItem, setSelectedItem] = useState<MapObject | null>(null);
    const [selectedItemId] = useState(new BehaviorSubject<number | null>(-3));

    useEffect(() => {
        const s = selectedItemId.subscribe((v) => setSelectedItem(v ? dbRef.db.mapObjects.byId(v) : null));
        return () => s.unsubscribe(); 
    }, []);

    useEffect(() => {
        setForceResize(true);
        setTimeout(() => setForceResize(false), 1000);
    }, [showLeftPanel]);

    useEffect(() => {
        if (dbRef.db.mapObjects.count() !== 0) return;
        dbRef.commitFetch({
            mapObjects: [
                {
                    id: 988,
                    name: "Map1",
                    type: MapObjectType.MAP,
                    background: plan,
                    modifiedAt: new Date(),
                    __typename: 'MapObject',
                },
                {
                    id: 999,
                    name: 'MapObject1',
                    parentId: 988,
                    type: MapObjectType.PLACE,
                    structureJson: '{"type":"rect","version":"4.6.0","originX":"left","originY":"top","left":243,"top":216,"width":368,"height":254,"fill":"rgba(255,0,0,0.5)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0}',
                    modifiedAt: new Date(),
                    __typename: 'MapObject',
                },
                {
                    id: 1000,
                    name: 'MapObject2',
                    parentId: 988,
                    type: MapObjectType.PLACE,
                    structureJson: '{"type":"rect","version":"4.6.0","originX":"left","originY":"top","left":749,"top":38,"width":55,"height":62,"fill":"rgba(255,0,0,0.5)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0}',
                    modifiedAt: new Date(),
                    __typename: 'MapObject',
                },
            ],
        });

        setTimeout(() => {
            setTimeout(() => selectedItemId.next(-4), 1000);
            dbRef.commitFetch({
                mapObjects: [
                    {
                        id: 999,
                        name: 'NewMapObject1',
                        parentId: 988,
                        type: MapObjectType.PLACE,
                        structureJson: '{"type":"rect","version":"4.6.0","originX":"left","originY":"top","left":243,"top":216,"width":368,"height":254,"fill":"rgba(255,0,0,0.5)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0}',
                        modifiedAt: new Date(),
                        __typename: 'MapObject',
                    },
                ]
            });
        }, 5000);
    }, []);

    const mapId = dbRef.db.mapObjects.find({ type: MapObjectType.MAP }).one()?.id;
    const renderButton = (buttonMode: DrawMode) => <Button caption={ buttonMode } fontSize={ mode === buttonMode ? '18' : '12' } onClick={ () => setMode(buttonMode) } />;

    if (!mapId) return null;

    return (
        <div style={ { display: 'flex', flex: '1 1 auto', position: 'absolute', width: '100%', height: '100%' } }>
            <div style={ { flexBasis: 250, flexShrink: 0, marginLeft: !showLeftPanel ? -250 : undefined } } className={ css.sidebar } >
                <Panel background='night50' rawProps={ { style: { height: '100%' } } } >
                    { renderButton('pointer') }
                    { renderButton('rect') }
                    { renderButton('move') }
                    { renderButton('polygon') }
                </Panel>
            </div>
            <div style={ { flexGrow: 1, overflow: 'hidden' } } >
                {/* <MapCanvas 
                    forceResize={ forceResize } 
                    afterResize={ () => setForceResize(false) } 
                    mode={ mode } 
                    background={ plan }
                    map={ map }
                /> */}
                <MapCanvasGeneric 
                    key={ mapId } 
                    mapId={ mapId } 
                    dbRef={ dbRef } 
                    forceResize={ forceResize } 
                    plugins={ plugins } 
                    selectedItem={ selectedItemId } 
                />
            </div>
            <FlexCell width={ 250 } shrink={ 0 } cx={ css.sidebar } >
                <Panel background='night50' rawProps={ { style: { height: '100%' } } } >
                    <Button caption='Hide' onClick={ () => setShowLeftPanel(false) } />
                    <Button caption='Show' onClick={ () => setShowLeftPanel(true) } />
                    <Text>{ selectedItem?.name }</Text>
                </Panel>
            </FlexCell>
        </div>
    );
};
