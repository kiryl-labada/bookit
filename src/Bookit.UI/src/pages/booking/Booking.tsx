import { useEffect, useState, FC, useMemo } from 'react';
import { MapObjectType, MapPageTab, useBookingDbRef } from '../../db';
import { Map } from './Map';
import css from './Booking.module.scss';
import { HeaderPanel } from '../../components/panels/HeaderPanel';
import { Link } from '@epam/uui';
import { useUrlState } from '../../common';

function getTabLink(tab: MapPageTab): Link {
    return { 
        pathname: '/booking',
        search: tab === MapPageTab.MAP ? '' : `?tab=${tab}`,
    };
}

export const BookingPage: FC = () => {
    const dbRef = useBookingDbRef();
    const [params] = useUrlState<any>();
    const tab: MapPageTab = params.tab ?? MapPageTab.MAP;

    const mapId = dbRef.db.mapObjects.find({ type: MapObjectType.MAP }).one()?.id;

    return (
        <div>
            <HeaderPanel selectedTab={ tab } getTabLink={ getTabLink } />
            <div style={ { display: 'flex', flex: '1 1 auto', position: 'absolute', width: '100%', height: 'calc(100% - 36px)' } }>
                <Map mapId={ mapId } />
            </div>
        </div>
    );
};
