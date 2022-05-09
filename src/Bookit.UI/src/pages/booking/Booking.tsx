import {FC} from 'react';
import {MapObjectType, MapPageTab, useBookingDbRef} from '../../db';
import {Map} from './Map';
import {HeaderPanel} from '../../components/panels/HeaderPanel';
import {Link} from '@epam/uui';
import {useUrlState} from '../../common';
import { Spinner } from '@epam/loveship';

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

    const { isLoading } = dbRef.fetchMapInfo(mapId);
    if (isLoading) {
        return <Spinner />
    }

    const map = dbRef.db.mapObjects.byId(dbRef.idMap.serverToClient('mapObjects', mapId));
    const Tab = () => {
        const serverOriginalId = dbRef.idMap.clientToServer(map.id);
        const serverDraftId = map.prototypeId && dbRef.idMap.clientToServer(map.prototypeId);

        if (tab === MapPageTab.MAP && serverOriginalId) {
            return (
                <Map key={ tab } serverMapId={ serverOriginalId } isEditMode={ false } isAdmin={ map.isAdmin } />
            )
        }

        if (tab === MapPageTab.BUILDER && serverDraftId) {
            return (
                <Map key={ tab } serverMapId={ serverDraftId } isEditMode={ true } isAdmin={ map.isAdmin } />
            )
        }
        
        return <div>Dashboard</div>
    }

    const tabs = map.isAdmin
        ? [MapPageTab.MAP, MapPageTab.DASHBOARD, MapPageTab.BUILDER]
        : [MapPageTab.MAP];

    return (
        <div>
            <HeaderPanel tabs={ tabs } selectedTab={ tab } getTabLink={ (t) => getTabLink(mapId, t) } />
            <div style={ { display: 'flex', flex: '1 1 auto', position: 'absolute', width: '100%', height: 'calc(100% - 96px)' } }>
                { Tab() }
            </div>
        </div>
    );
};
