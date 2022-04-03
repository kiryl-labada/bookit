import { useEffect, useState, FC } from 'react';
import { BehaviorSubject } from 'rxjs';
import { Panel, FlexCell, Button, Text, Spinner, TextInput } from '@epam/loveship';
import css from './Booking.module.scss';
import { BookingDb, MapObject, MapObjectType, useBookingDbRef } from '../../db';
import { MapCanvasGeneric } from '../../components/map/MapCanvasGeneric';
import { DrawPolygonPlugin, MapPlugin, MoveCanvasPlugin, useForceUpdate, ZoomPlugin } from '../../common';

const defaultMapPlugins: MapPlugin[] = [new MoveCanvasPlugin(), new ZoomPlugin()];

type DrawMode = 'pointer' | 'rect' | 'move' | 'polygon';

export const BookingPage: FC<{}> = (props) => {
    const dbRef = useBookingDbRef();
    const [mode, setMode] = useState<DrawMode>('pointer');
    const [showLeftPanel, setShowLeftPanel] = useState(true);
    const [forceResize, setForceResize] = useState(false);
    const forceUpdate = useForceUpdate();
    const [plugins, setPlugins] = useState<MapPlugin[]>(defaultMapPlugins);
    const [selectedItemId] = useState(new BehaviorSubject<number | null>(-3));
    const selectedItem = selectedItemId.value ? dbRef.db.mapObjects.byId(selectedItemId.value) : null;

    const { isLoading } = dbRef.fetchMap();

    useEffect(() => {
        const s = selectedItemId.subscribe((v) => forceUpdate());
        return () => s.unsubscribe(); 
    }, []);

    useEffect(() => {
        setForceResize(true);
        setTimeout(() => setForceResize(false), 1000);
    }, [showLeftPanel]);

    const mapId = dbRef.db.mapObjects.find({ type: MapObjectType.MAP }).one()?.id;
    const renderButton = (buttonMode: DrawMode) => <Button caption={ buttonMode } fontSize={ mode === buttonMode ? '18' : '12' } onClick={ () => setMode(buttonMode) } />;

    if (isLoading) {
        return (
            <Spinner />
        );
    }

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
                    { selectedItem && (
                        <TextInput
                            value={ selectedItem.name || '' }
                            onValueChange={ (value: string) => dbRef.actions.updateMapObject({ id: selectedItem.id, name: value }) }
                        />
                    ) }
                </Panel>
            </FlexCell>
        </div>
    );
};
