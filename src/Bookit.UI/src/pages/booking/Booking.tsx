import { useEffect, useState, FC, useMemo, useCallback } from 'react';
import { BehaviorSubject } from 'rxjs';
import { Panel, FlexCell, Button, Text, Spinner, TextInput, LabeledInput, IconButton, Avatar, FlexRow } from '@epam/loveship';
import css from './Booking.module.scss';
import { BookingDb, BookingDbRef, MapObject, MapObjectType, useBookingDbRef } from '../../db';
import { MapCanvasGeneric } from '../../components/map/MapCanvasGeneric';
import { DrawPolygonPlugin, DrawRectanglePlugin, MapPlugin, MoveCanvasPlugin, useForceUpdate, ZoomPlugin } from '../../common';
import { DbRef, useDbView } from '@epam/uui-db';
import { IconContainer } from '@epam/uui-components';
import { ReactComponent as mapIcon } from '../../assets/icons/map-icon.svg';
import { ReactComponent as itemIcon } from '../../assets/icons/item-icon.svg';
import { ReactComponent as rectIcon } from '../../assets/icons/rect-icon.svg';
import { ReactComponent as arrowIcon } from '../../assets/icons/arrow-icon.svg';
import { Icon, IEditable } from '@epam/uui';

const defaultMapPlugins: MapPlugin[] = [new MoveCanvasPlugin(), new ZoomPlugin()];

type DrawMode = 'pointer' | 'rect' | 'move' | 'polygon';

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
    // const selectedItem = selectedItemId.value ? dbRef.db.mapObjects.byId(selectedItemId.value) : null;

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
                    { selectedItemId.value && <RightSideBar dbRef={ dbRef } selectedItemId={ selectedItemId.value } /> }
                </Panel>
            </FlexCell>
        </div>
    );
};

const LeftSideBar: FC<{ mapId: number, selectedItemId: IEditable<number | null>, mode: IEditable<DrawMode> }> = ({ mapId, selectedItemId, mode}) => {
    const map = useDbView(
        (db: BookingDb, params: { mapId: number }) => {
            const map = db.mapObjects.byId(mapId);
            const children = db.mapObjects.find({ mapId });

            return {
                ...map,
                level: 0,
                children: children.map((item) => ({ ...item, level: 1, children: null }))
            };
        },
        { mapId },
    );

    const spacer = <div style={ { width: 8 } }></div>;

    const renderItem = (item: any) => {
        return (
            <FlexRow padding='6' key={ item.id } onClick={ () => selectedItemId.onValueChange(item.id) }>
                { Array(item.level).fill(spacer) }
                <IconContainer
                    icon={ item.type === MapObjectType.MAP ? mapIcon : itemIcon }
                />
                <Text size={ selectedItemId.value === item.id ? '30' : '24' }>{ item.name }</Text>
            </FlexRow>
        );
    };

    return (
        <Panel>
            <Toolbar mode={mode} />
            <FlexCell>
                { renderItem(map) }
                { map.children.map((x) => renderItem(x)) }
            </FlexCell>
        </Panel>
    );
};

const Toolbar: FC<{mode: IEditable<DrawMode>}> = ({mode}) => {
    const renderItem = (m: DrawMode, icon: Icon) => (
        <FlexCell width='auto'>
            <IconButton 
                onClick={ () => mode.value !== m && mode.onValueChange(m) }
                icon={ icon }
                isDisabled={ m === mode.value }
            />
        </FlexCell>
    );

    return (
        <FlexRow padding='6' borderBottom>
            { renderItem('pointer', arrowIcon) }
            { renderItem('rect', rectIcon) }
            { renderItem('polygon', rectIcon) }
        </FlexRow>
    );
};

const RightSideBar: FC<{ dbRef: BookingDbRef, selectedItemId: number }> = ({dbRef, selectedItemId}) => {
    const selectedItem = useDbView(
        (db: BookingDb, params: { id: number }) => db.mapObjects.byId(params.id),
        { id: selectedItemId },
    );

    const view = dbRef.db.mapObjectViews.find({ mapObjectId: selectedItem.id }).one();

    return (
        <Panel>
            <FlexCell cx={ css.bottomLine } >
                <TextInput 
                    value={ selectedItem.name || '' }
                    onValueChange={ (value: string) => dbRef.actions.updateMapObject({ id: selectedItemId, name: value }) }
                />

                <Text>External id: { dbRef.idMap.clientToServer(selectedItem.id) }</Text>
            </FlexCell>
            
            <FlexCell>
                { selectedItem.type === MapObjectType.MAP && ( 
                    <LabeledInput label='Map image' labelPosition='left'>
                        <IconButton 
                            onClick={ () => console.log('allow to select image') }
                            icon={ () => <Avatar alt='avatar' img={ view.backgroundUrl || '' } size='30' /> }
                        />
                    </LabeledInput>
                ) }
            </FlexCell>
        </Panel>
    );
};
