import { Panel, RichTextView } from "@epam/loveship";
import * as React from "react";

export const BookingPage: React.FC<{}> = (props) => {
    return (
        <Panel background='white'>
            <RichTextView size="14">
                <h3>Welcome to booking page</h3>
            </RichTextView>
        </Panel>
    );
};