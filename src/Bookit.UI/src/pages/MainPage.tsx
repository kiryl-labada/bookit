import React, { useMemo, useState } from 'react';
import css from './MainPage.module.scss';
import { Panel, RichTextView, IconContainer, PickerInput, Spinner, DataTable, Text } from '@epam/loveship';
import { ReactComponent as UuiPromoImage } from '../icons/uui-promo-image.svg';
import { DataColumnProps, useArrayDataSource } from '@epam/uui';
import { BookingDbRef, Story, useBookingDbRef } from 'db';
import { getStories } from 'api'


export class MainPage extends React.Component {
    render() {
        return (
            <>
                <div className={ css.bgImg }>
                    <div>
                        <IconContainer icon={ UuiPromoImage } />
                    </div>
                </div>
                <Panel cx={ css.mainPanel } background='white'>
                    <RichTextView size="14">
                        <h3>Welcome to UUI template app</h3>
                        <p>UUI docs: <a href="https://uui.epam.com/">uui.epam.com</a></p>
                        <p>Git: <a href="https://github.com/epam/uui">github.com/epam/uui</a></p>
                        <p>App powered by: <a href="https://create-react-app.dev/">Create React App</a></p>
                    </RichTextView>

                    <MoodPicker />
                    <StoryComponent />
                </Panel>
            </>
        );
    }
}


const MoodPicker: React.FC<any> = () => {
    const [value, onValueChange] = useState(null);

    const dataSource = useArrayDataSource({
        items: [
            { id: 1, mood: 'Bad' },
            { id: 2, mood: 'Normal' },
            { id: 3, mood: 'Good' },
        ],
    }, []);

    return (
        <>
            <PickerInput
                    dataSource={ dataSource }
                    value={ value }
                    onValueChange={ onValueChange }
                    getName={ item => item?.mood ?? '' }
                    entityName='Mood'
                    selectionMode='single'
                    valueType={ 'id' }
                    sorting={ { field: 'id', direction: 'asc' } }
                />
        </>
    );
};

const StoryComponent: React.FC<any> = () => {
    const dbRef = useBookingDbRef();
    console.log('dbRef', dbRef);
    const { isLoading } = dbRef.fetchGQL(getStories, {});

    if ( isLoading ) {
        return <Spinner />;
    }

    return (<StoryComponentImpl dbRef={dbRef} />);
};

const StoryComponentImpl: React.FC<{ dbRef: BookingDbRef }> = (props) => {
    const [value, onValueChange] = useState({});
    const dataSource = useArrayDataSource({
        items: props.dbRef.db.stories.toArray(),
    }, []);

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