import * as React from "react";
import { Panel, FlexCell, Button } from "@epam/loveship";
import { useEffect, useState } from "react";
import css from './Booking.module.scss';
import { DrawMode, MapCanvas } from "components";


export const BookingPage: React.FC<{}> = (props) => {
    const [mode, setMode] = useState<DrawMode>('pointer');
    const [showLeftPanel, setShowLeftPanel] = useState(true);
    const [forceResize, setForceResize] = useState(false);

    useEffect(() => {
        let n = 1;
        const step = 250;

        const intervalID = setInterval(() => {
            setForceResize(true);

            if (++n * step > 1000) {
                clearInterval(intervalID)
            }
        }, step);
    }, [showLeftPanel]);

    const renderButton = (buttonMode: DrawMode) => <Button caption={ buttonMode } fontSize={ mode === buttonMode ? '18' : '12' } onClick={ () => setMode(buttonMode) } />;

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
                <MapCanvas 
                    forceResize={ forceResize } 
                    afterResize={ () => setForceResize(false) } 
                    mode={ mode } 
                />
            </div>
            <FlexCell width={ 250 } shrink={ 0 } cx={ css.sidebar } >
                <Panel background='night50' rawProps={ { style: { height: '100%' } } } >
                    <Button caption='Hide' onClick={ () => setShowLeftPanel(false) } />
                    <Button caption='Show' onClick={ () => setShowLeftPanel(true) } />
                </Panel>
            </FlexCell>
        </div>
    );
};
