import { Button, FlexRow, Form, LabeledInput, Panel, ScrollBars, Spinner, TextInput } from "@epam/loveship";
import { RenderFormProps } from "@epam/uui";
import { FlexSpacer } from "@epam/uui-components";
import { FC } from "react";
import { ClientOrg, useBookingDbRef } from "../../db";

interface SettingsState extends ClientOrg {
}

export const SettingsPage: FC = () => {
    const dbRef = useBookingDbRef();

    const { isLoading } = dbRef.getClientOrg();
    if (isLoading) return <Spinner />

    const renderForm = (formProps: RenderFormProps<SettingsState>) => {
        const { lens, save } = formProps;
        return (
            <>
                <LabeledInput label='Org Name' { ...lens.prop('name').toProps() }>
                    <TextInput placeholder="Org Name" { ...lens.prop('name').toProps() } />
                </LabeledInput>
                <LabeledInput label='Public Api Key' { ...lens.prop('publicApiKey').toProps() }>
                    <TextInput placeholder="Public Api Key" { ...lens.prop('publicApiKey').toProps() } isReadonly />
                </LabeledInput>
                <LabeledInput label='Secret Api Key' { ...lens.prop('secretApiKey').toProps() }>
                    <TextInput placeholder="Secret Api Key" { ...lens.prop('secretApiKey').toProps() } isReadonly />
                </LabeledInput>
                <LabeledInput label='Confirm Url' { ...lens.prop('confirmUrl').toProps() }>
                    <TextInput placeholder="Confirm Url" { ...lens.prop('confirmUrl').toProps() } />
                </LabeledInput>
                <FlexRow vPadding='24'>
                    <FlexSpacer />
                    <Button caption='Save' onClick={ save } />
                </FlexRow>
            </>
        );
    }

    const value = dbRef.db.clientOrgs.one();

    return (
        <div style={ { display: 'flex', flex: '1 1 auth', width: '100%', height: 'calc(100% - 60px)', justifyContent: 'center', position: 'absolute' } }>
            <Panel background='white' style={ { width: 500 } }>
                <ScrollBars>
                    <div style={ { padding: 24 } }>
                        <Form 
                            value={ value }
                            renderForm={ renderForm }
                            onSave={ (state) => {
                                dbRef.actions.updateClientOrg(state);
                                return Promise.resolve();
                            } }
                            beforeLeave={ () => Promise.resolve(false) }
                        />
                    </div>
                </ScrollBars>
            </Panel>
        </div>
    );
}
