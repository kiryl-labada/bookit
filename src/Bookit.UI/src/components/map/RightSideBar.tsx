import { FC } from 'react';
import { useDbView } from '@epam/uui-db';
import { Avatar, FlexCell, IconButton, LabeledInput, Panel, TextInput, Text } from '@epam/loveship';
import { BookingDb, BookingDbRef, MapObjectType } from '../../db';
import css from './RightSideBar.module.scss';

export const RightSideBar: FC<{ dbRef: BookingDbRef, selectedItemId: number }> = ({dbRef, selectedItemId}) => {
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
