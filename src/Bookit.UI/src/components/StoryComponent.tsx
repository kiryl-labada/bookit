import React, { useMemo, useState } from 'react';
import { Spinner, DataTable, Text, FlexCell, LabeledInput, TextInput, Button } from '@epam/loveship';
import { DataColumnProps, useArrayDataSource } from '@epam/uui';
import { BookingDbRef, Story, useBookingDbRef, BookingDb } from '../db';
import { getStoriesQuery, createStoryMutation } from '../api';
import { getTempId, useDbView } from '@epam/uui-db';

export const StoryComponent: React.FC<any> = () => {
    const dbRef = useBookingDbRef();
    console.log('dbRef', dbRef);
    const { isLoading } = dbRef.fetchGQL(getStoriesQuery, {});

    if ( isLoading ) {
        return <Spinner />;
    }

    return (
        <>
            <StorySubmitComponent dbRef={ dbRef } />
            <StoryComponentImpl dbRef={ dbRef } />
        </>
    );
};

const StorySubmitComponent: React.FC<{ dbRef: BookingDbRef }> = (props) =>  {
    const [name, setName] = useState<string>();
    const [isLoading, setLoading] = useState<boolean>(false);

    const createStory = (dbRef: BookingDbRef, storyName: string) => {
        const story: Story = {
            id: getTempId(),
            name: storyName,
        };
        const payload = { stories: [story] };

        setLoading(true);
        dbRef.mutateGQL(createStoryMutation, { payload })
            .then((result) => {
                if (!result.errors) {
                    setName(undefined);
                }
            })
            .finally(() => setLoading(false));
    };

    if ( isLoading ) {
        return <Spinner />;
    }

    return (
        <FlexCell width='auto' >
                <LabeledInput label='Some label' >
                    <TextInput value={ name } onValueChange={ setName } placeholder='Please type text' />
                </LabeledInput>
                <Button 
                    caption="Submit" 
                    isDisabled={ !name }
                    onClick={ () => name && createStory(props.dbRef, name) } />
        </FlexCell>
    );
};

const StoryComponentImpl: React.FC<{ dbRef: BookingDbRef }> = (props) => {
    const [value, onValueChange] = useState({});
    const stories = useDbView((db: BookingDb) => db.stories.toArray());
    const dataSource = useArrayDataSource({
        items: stories
    }, [stories]);

    const view = dataSource.useView(value, onValueChange, {});

    const productColumns: DataColumnProps<Story>[] = useMemo(() => [
        {
            key: 'id',
            caption: 'Id',
            render: item => <Text>{ item.id }</Text>,
            isSortable: true,
            isAlwaysVisible: true,
            grow: 0, shrink: 0, width: 100,
        }, {
            key: 'name',
            caption: 'Name',
            render: item => <Text>{ item.name }</Text>,
            isSortable: true,
            grow: 0, minWidth: 300,
        }
    ], []);

    return (
        <DataTable
            { ...view.getListProps() }
            getRows={ view.getVisibleRows }
            value={ value }
            onValueChange={ onValueChange }
            columns={ productColumns }
            headerTextCase='upper'
        />
    );
};