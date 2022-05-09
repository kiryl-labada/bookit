import { FC } from 'react';
import { useDbView } from '@epam/uui-db';
import { TimePickerValue, IEditable } from '@epam/uui-core';
import { Avatar, FlexCell, IconButton, LabeledInput, Panel, TextInput, Text, Button, Spinner, FlexRow, TimePicker, FlexSpacer } from '@epam/loveship';
import dayjs from 'dayjs';
import { BookingDb, BookingDbRef, InstanceType, MapObjectType, SlotStatus } from '../../db';
import css from './RightSideBar.module.scss';
import { svc } from '../../services';
import { useValue } from '../../common';

const isValid = (from: TimePickerValue | null, to: TimePickerValue | null) => {
    return from && to && ((from.hours * 60 + from.minutes) <= (to.hours * 60 + to.minutes));
}

const RangeTimePicker: FC<{ from: IEditable<TimePickerValue | null>, to: IEditable<TimePickerValue | null> }> = ({ from, to }) => {
    const isInvalid = !isValid(from.value, to.value);
    return (
        <LabeledInput isInvalid={ isInvalid } validationMessage={ isInvalid ? 'From time should be before To' : undefined }>
            <FlexRow>
                <TimePicker
                    value={ from.value! }
                    onValueChange={ from.onValueChange }
                    format={ 24 }
                />
                <Text>-</Text>
                <TimePicker
                    value={ to.value! }
                    onValueChange={ to.onValueChange }
                    format={ 24 }
                />
            </FlexRow>
        </LabeledInput>
    );
}

export const RightSideBar: FC<{ dbRef: BookingDbRef, selectedItemId: number, selectedDay: dayjs.Dayjs, isEditMode: boolean, isAdmin: boolean }> = ({
    dbRef, selectedItemId, selectedDay, isEditMode, isAdmin,
}) => {
    const fromProps = useValue<TimePickerValue | null>(null);
    const toProps = useValue<TimePickerValue | null>(null);

    const selectedItem = useDbView(
        (db: BookingDb, params: { id: number }) => db.mapObjects.byId(params.id),
        { id: selectedItemId },
    );
    
    const view = dbRef.db.mapObjectViews.find({ mapObjectId: selectedItem.id }).one();
    const renderPublishBlock = () => {
        if (selectedItem.type !== MapObjectType.MAP || selectedItem.instanceType !== InstanceType.DRAFT) {
            return null;
        }

        const onClick = () => {
            const originalMap = dbRef.db.mapObjects.find({ prototypeId: selectedItem.id }).one();
            const originalServerId = dbRef.idMap.clientToServer(originalMap.id);
            dbRef.publish(originalServerId).then((v) => {
                svc.uuiRouter.redirect({ pathname: '/booking', search: `?id=${originalServerId}` });
            });
        }

        return <Button onClick={ onClick } caption='Publish' />
    }

    const renderSlotBlock = () => {
        if (selectedItem.type === MapObjectType.MAP || selectedItem.instanceType === InstanceType.DRAFT) {
            return null;
        }

        const from = selectedDay.startOf('day').toISOString();
        const to = selectedDay.endOf('day').toISOString();
        const { isLoading } = dbRef.fetchSlots(dbRef.idMap.clientToServer(selectedItem.id), from, to);

        if (isLoading) {
            return <Spinner />;
        }

        const slots = dbRef.db.slots.find({ mapObjectId: selectedItem.id })
            .toArray()
            .filter((x) => dayjs(x.from).isAfter(from) && dayjs(x.to).isBefore(to))
            .sort((a, b) => dayjs(a.from).diff(b.from));

        const isInvalid = !isValid(fromProps.value, toProps.value);
        const createSlot = () => {
            const from = selectedDay.startOf('day').set('hour', fromProps.value!.hours).set('minute', fromProps.value!.minutes);
            const to = selectedDay.startOf('day').set('hour', toProps.value!.hours).set('minute', toProps.value!.minutes);
            dbRef.actions.createSlot({ mapObjectId: selectedItem.id, from: new Date(from.toISOString()), to: new Date(to.toISOString()) });

            fromProps.onValueChange(null);
            toProps.onValueChange(null);
        };

        return (
            <>
                { isAdmin && (
                    <FlexCell>
                        <RangeTimePicker from={ fromProps } to={ toProps } />
                        <Button caption="Create slot" onClick={ createSlot } isDisabled={ isInvalid } />
                    </FlexCell> 
                ) }
                <FlexCell>
                    { slots.map((slot) => (
                        <FlexRow>
                            <Text key={slot.id}>{ `${dayjs(slot.from).format('HH-mm')} - ${dayjs(slot.to).format('HH-mm')}` }</Text>
                            <FlexSpacer />
                            { slot.status === SlotStatus.AVAILABLE 
                                ? <Button caption='Book' onClick={ () => dbRef.bookPlace(dbRef.idMap.clientToServer(slot.id)) } />
                                : <Text>Booked</Text>
                            }
                        </FlexRow>
                    ))}
                </FlexCell>
            </>
        );
    }

    return (
        <Panel>
            <FlexCell cx={ css.bottomLine } >
                <TextInput 
                    value={ selectedItem.name || '' }
                    onValueChange={ (value: string) => dbRef.actions.updateMapObject({ id: selectedItemId, name: value }) }
                    isDisabled={ !isEditMode }
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

            <FlexCell>
                { renderPublishBlock() }
            </FlexCell>

            <FlexCell>
                { renderSlotBlock() }
            </FlexCell>
        </Panel>
    );
};
