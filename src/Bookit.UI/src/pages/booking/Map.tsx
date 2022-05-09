import {FC, useEffect, useMemo, useState} from 'react';
import {BehaviorSubject} from 'rxjs';
import {Button, FlexCell, Panel, Spinner} from '@epam/loveship';
import {MapObjectType, useBookingDbRef} from '../../db';
import {
    DrawPolygonPlugin,
    DrawRectanglePlugin,
    MapPlugin,
    MoveCanvasPlugin,
    useForceUpdate,
    useValue,
    ZoomPlugin
} from '../../common';
import {DrawMode, LeftSideBar, MapCanvas, RightSideBar} from '../../components';
import css from './Map.module.scss';
import dayjs from 'dayjs';


const defaultMapPlugins: MapPlugin[] = [new MoveCanvasPlugin(), new ZoomPlugin()];

const DrawModeToPlugin: { [key: string]: MapPlugin | null } = {
    'pointer': null,
    'rect': new DrawRectanglePlugin(),
    'polygon': new DrawPolygonPlugin(),
};

export interface MapProps {
    serverMapId: number;
    isEditMode: boolean;
    isAdmin: boolean;
}

export const Map: FC<MapProps> = ({ serverMapId, isEditMode, isAdmin }) => {
    const dbRef = useBookingDbRef();
    const [mapId, setMapId] = useState<number>();
    const day = useValue<dayjs.Dayjs>(dayjs().startOf('day'));
    const [mode, setMode] = useState<DrawMode>('pointer');
    const [showLeftPanel, setShowLeftPanel] = useState(true);
    const [forceResize, setForceResize] = useState(false);
    const forceUpdate = useForceUpdate();
    const [plugins, setPlugins] = useState<MapPlugin[]>(defaultMapPlugins);
    const [selectedItemId] = useState(new BehaviorSubject<number | null>(null));

    const { isLoading, isLoaded } = dbRef.fetchMap(serverMapId);
    
    useEffect(() => {
        if (isLoaded) {
            const mapId = dbRef.idMap.serverToClient('mapObjects', serverMapId);
            const map = dbRef.db.mapObjects.byId(mapId);
            if (map.type === MapObjectType.MAP) {
                setMapId(mapId);
            }
        }
    }, [isLoaded]);

    const selectedItemProps = useMemo(() => ({ 
        value: selectedItemId.value, 
        onValueChange: (id: number | null) => selectedItemId.next(id),
    }), [selectedItemId.value]);

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
        if (!mapId) return;
        
        const s = selectedItemId.subscribe((v) => {
            v === null ? selectedItemId.next(mapId) : forceUpdate();
        });
        return () => s.unsubscribe(); 
    }, [mapId]);

    useEffect(() => {
        setForceResize(true);
        setTimeout(() => setForceResize(false), 1000);
    }, [showLeftPanel]);


    if (isLoading || !mapId) {
        return (
            <FlexCell grow={ 1 }>
                <Spinner />
            </FlexCell>
        );
    }

    return (
        <>
            <div style={ { flexBasis: 250, flexShrink: 0, marginLeft: !showLeftPanel ? -250 : undefined } } className={ css.sidebar } >
                <Panel background='night50' rawProps={ { style: { height: '100%' } } } >
                    <LeftSideBar
                        mapId={ mapId } 
                        selectedItemId={ selectedItemProps }
                        mode={ modeProps }
                        day={ day }
                        isEditMode={ isEditMode }
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
                    isEditMode={ isEditMode }
                />
            </div>
            <FlexCell width={ 250 } shrink={ 0 } cx={ css.sidebar } >
                <Panel background='night50' rawProps={ { style: { height: '100%' } } } >
                    <Button caption='Hide' onClick={ () => setShowLeftPanel(false) } />
                    <Button caption='Show' onClick={ () => setShowLeftPanel(true) } />
                    { selectedItemId.value && (
                        <RightSideBar 
                            dbRef={ dbRef } 
                            selectedItemId={ selectedItemId.value } 
                            selectedDay={ day.value } 
                            isAdmin={ isAdmin } 
                            isEditMode={ isEditMode }
                        />
                    ) }
                </Panel>
            </FlexCell>
        </>
    );
};
