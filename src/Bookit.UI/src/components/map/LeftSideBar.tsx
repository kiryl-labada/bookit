import { FC } from 'react';
import { Icon, IEditable } from '@epam/uui';
import { useDbView } from '@epam/uui-db';
import { DatePicker, FlexCell, FlexRow, IconButton, IconContainer, Panel, Text } from '@epam/loveship';
import { getMapView } from '../../common';
import { MapObjectType } from '../../db';
import { ReactComponent as mapIcon } from '../../assets/icons/map-icon.svg';
import { ReactComponent as itemIcon } from '../../assets/icons/item-icon.svg';
import { ReactComponent as rectIcon } from '../../assets/icons/rect-icon.svg';
import { ReactComponent as arrowIcon } from '../../assets/icons/arrow-icon.svg';
import dayjs from 'dayjs';

export type DrawMode = 'pointer' | 'rect' | 'move' | 'polygon';

export interface LeftSideBarProps {
    mapId: number;
    selectedItemId: IEditable<number | null>; 
    mode: IEditable<DrawMode>;
    day: IEditable<dayjs.Dayjs>;
    isEditMode: boolean;
}

export const LeftSideBar: FC<LeftSideBarProps> = ({ mapId, selectedItemId, mode, isEditMode, day }) => {
    const map = useDbView(getMapView, { mapId });

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

    const updateDay = (v: string) => {
        day.onValueChange((v ? dayjs(v) : dayjs()).startOf('day'));
    } 

    return (
        <Panel>
            { isEditMode && <Toolbar mode={mode} /> }
            { !isEditMode && (
                <DatePicker value={day.value.toISOString()} onValueChange={ updateDay } format='MMM D, YYYY' />
            ) }
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
