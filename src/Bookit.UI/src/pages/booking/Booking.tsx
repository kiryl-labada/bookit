import {FC} from 'react';
import {MapObjectType, MapPageTab, useBookingDbRef} from '../../db';
import {Map} from './Map';
import {HeaderPanel} from '../../components/panels/HeaderPanel';
import {Link} from '@epam/uui';
import {useUrlState} from '../../common';

function getTabLink(mapId: number, tab: MapPageTab): Link {
    return { 
        pathname: '/booking',
        search: `?id=${mapId}` + (tab === MapPageTab.MAP ? '' : `&tab=${tab}`),
    };
}

export const BookingPage: FC = () => {
    const dbRef = useBookingDbRef();
    const [params] = useUrlState<any>();
    const tab: MapPageTab = params.tab ?? MapPageTab.MAP;
    const mapId: number = +params.id;

    const Tab = () => {
        if (tab === MapPageTab.MAP || tab === MapPageTab.BUILDER) {
            return (
                <Map key={ tab } serverMapId={ mapId } isEditMode={ tab === MapPageTab.BUILDER } />
            )
        }
        
        return <div>Dashboard</div>
    }

    return (
        <div>
            <HeaderPanel selectedTab={ tab } getTabLink={ (t) => getTabLink(mapId, t) } />
            <div style={ { display: 'flex', flex: '1 1 auto', position: 'absolute', width: '100%', height: 'calc(100% - 96px)' } }>
                { Tab() }
            </div>
        </div>
    );
};
