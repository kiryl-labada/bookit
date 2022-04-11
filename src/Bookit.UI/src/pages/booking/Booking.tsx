import { useEffect, useState, FC, useMemo } from 'react';
import { BehaviorSubject } from 'rxjs';
import { Panel, FlexCell, Button, Spinner } from '@epam/loveship';
import { MapObjectType, useBookingDbRef } from '../../db';
import { DrawPolygonPlugin, DrawRectanglePlugin, MapPlugin, MoveCanvasPlugin, useForceUpdate, ZoomPlugin } from '../../common';
import { DrawMode, LeftSideBar, MapCanvas, RightSideBar } from '../../components';
import css from './Booking.module.scss';


const defaultMapPlugins: MapPlugin[] = [new MoveCanvasPlugin(), new ZoomPlugin()];

const DrawModeToPlugin: { [key: string]: MapPlugin | null } = {
    'pointer': null,
    'rect': new DrawRectanglePlugin(),
    'polygon': new DrawPolygonPlugin(),
};

export const BookingPage: FC<{}> = (props) => {
    const dbRef = useBookingDbRef();
    const [mode, setMode] = useState<DrawMode>('pointer');
    const [showLeftPanel, setShowLeftPanel] = useState(true);
    const [forceResize, setForceResize] = useState(false);
    const forceUpdate = useForceUpdate();
    const [plugins, setPlugins] = useState<MapPlugin[]>(defaultMapPlugins);
    const [selectedItemId] = useState(new BehaviorSubject<number | null>(-3));
    const mapId = dbRef.db.mapObjects.find({ type: MapObjectType.MAP }).one()?.id;

    const { isLoading } = dbRef.fetchMap();

    const selectedItemProps = useMemo(() => ({ 
            value: selectedItemId.value, 
            onValueChange: (id: number | null) => selectedItemId.next(id),
        }), 
        [selectedItemId.value],
    );

    const modeProps = useMemo(() => ({
            value: mode,
            onValueChange: (newMode: DrawMode) => {
                const prevPlugin = DrawModeToPlugin[mode];
                const newPlugin = DrawModeToPlugin[newMode];

                setMode(newMode);
                setPlugins((prevPlugins) => {
                    const newPlugins = [...prevPlugins.filter((p) => p !== prevPlugin)];
                    newPlugin && newPlugins.push(newPlugin);
                    return newPlugins;
                });
            },
        }),
        [mode],
    );

    useEffect(() => {
        const s = selectedItemId.subscribe((v) => {
            const mapId = dbRef.idMap.serverToClient('mapObjects', 3);
            v === null ? selectedItemId.next(mapId) : forceUpdate();
        });
        return () => s.unsubscribe(); 
    }, []);

    useEffect(() => {
        setForceResize(true);
        setTimeout(() => setForceResize(false), 1000);
    }, [showLeftPanel]);


    if (isLoading) {
        return (
            <Spinner />
        );
    }

    return (
        <div style={ { display: 'flex', flex: '1 1 auto', position: 'absolute', width: '100%', height: '100%' } }>
            <div style={ { flexBasis: 250, flexShrink: 0, marginLeft: !showLeftPanel ? -250 : undefined } } className={ css.sidebar } >
                <Panel background='night50' rawProps={ { style: { height: '100%' } } } >
                    <LeftSideBar 
                        mapId={ mapId } 
                        selectedItemId={ selectedItemProps }
                        mode={ modeProps }
                    />
                </Panel>
            </div>
            <div style={ { flexGrow: 1, overflow: 'hidden' } } >
                <MapCanvas 
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
                    { selectedItemId.value && <RightSideBar dbRef={ dbRef } selectedItemId={ selectedItemId.value } /> }
                </Panel>
            </FlexCell>
        </div>
    );
};
