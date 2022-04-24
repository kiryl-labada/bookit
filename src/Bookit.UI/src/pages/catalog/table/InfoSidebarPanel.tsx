import React from "react";
import css from "./InfoSidebarPanel.module.scss";
import { FlexCell, FlexRow, FlexSpacer, IconButton, Panel, ScrollBars, Text } from "@epam/promo";
import { ReactComponent as CrossIcon } from "@epam/assets/icons/common/navigation-close-24.svg";
import { cx } from "@epam/uui";
import { Person } from "./types";

interface SidebarPanelProps {
    data: Person;
    isVisible: boolean;
    onClose(): void;
}

export const InfoSidebarPanel: React.FC<SidebarPanelProps> = ({ data, isVisible, onClose }) => {
    const renderInfoRow = (title: string, value: any) => {
        return <FlexRow padding="24">
            <FlexCell shrink={ 0 } width={ 162 }>
                <Text color="gray60">{ title }</Text>
            </FlexCell>
            <Text cx={ css.noWrap }>
                { value }
            </Text>
        </FlexRow>;
    };

    return (
        <div className={ cx(css.infoSidebarPanelWrapper, isVisible ? "show" : "hide") }>
            <Panel cx={ css.wrapper } background="white">
                <FlexRow borderBottom padding="24">
                    <Text size="48" font="sans-semibold">Detailed Information</Text>
                    <FlexSpacer/>
                    <FlexCell shrink={ 0 } width="auto"><IconButton icon={ CrossIcon } onClick={ onClose }/></FlexCell>
                </FlexRow>
                { data && (
                    <ScrollBars>
                        { renderInfoRow("Name", data.name) }
                        { renderInfoRow("Email", data.email) }
                        { renderInfoRow("UID", data.uid) }
                    </ScrollBars>
                ) }
            </Panel>
        </div>
    );
};