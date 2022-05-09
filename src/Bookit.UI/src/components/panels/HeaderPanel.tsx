import { FC, useMemo } from 'react';
import { FlexRow, TabButton } from '@epam/loveship';
import { Link } from '@epam/uui';
import { MapPageTab } from '../../db';
import { FlexSpacer } from '@epam/uui-components';
import css from './HeaderPanel.module.scss';

export interface HeaderPanelProps {
    tabs: MapPageTab[];
    selectedTab: MapPageTab;
    getTabLink: (tab: MapPageTab) => Link;
}

export const HeaderPanel: FC<HeaderPanelProps> = ({ selectedTab, tabs, getTabLink }) => {
    const mapTabs: { [key in MapPageTab]: { id: MapPageTab, name: string } } = useMemo(() => ({
        MAP: { id: MapPageTab.MAP, name: 'Map' },
        BUILDER: { id: MapPageTab.BUILDER, name: 'Builder' },
        DASHBOARD: { id: MapPageTab.DASHBOARD, name: 'Dashboard' },
    }), []);

    return (
        <FlexRow cx={ css.panel }>
            <FlexSpacer />
            {
                tabs.map((t) => {
                    const tab = mapTabs[t];
                    return (
                        <TabButton 
                            size='36'
                            caption={ tab.name }
                            isLinkActive={ tab.id === selectedTab }
                            link={ getTabLink(tab.id) }
                            cx={ css.link }
                        />
                    )
                })
            }
        </FlexRow>
    );
};