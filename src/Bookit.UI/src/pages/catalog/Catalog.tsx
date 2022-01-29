import { Panel, RichTextView } from "@epam/loveship";
import * as React from "react";

export const CatalogPage: React.FC<{}> = (props) => {
    return (
        <Panel background='white'>
            <RichTextView size="14">
                <h3>Welcome to catalog page</h3>
            </RichTextView>
        </Panel>
    );
};