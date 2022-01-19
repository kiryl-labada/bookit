import React, { useState } from 'react';
import css from './MainPage.module.scss';
import { Panel, RichTextView, IconContainer, PickerInput } from '@epam/loveship';
import { ReactComponent as UuiPromoImage } from '../icons/uui-promo-image.svg';
import { useArrayDataSource } from '@epam/uui';


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