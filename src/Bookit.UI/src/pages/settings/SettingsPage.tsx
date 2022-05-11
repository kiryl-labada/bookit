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
                <LabeledInput label='Booking Confirm Url' { ...lens.prop('bookingConfirmUrl').toProps() }>
                    <TextInput placeholder="Booking Confirm Url" { ...lens.prop('bookingConfirmUrl').toProps() } />
                </LabeledInput>
                <LabeledInput label='User Mapping Url' { ...lens.prop('userMappingUrl').toProps() }>
                    <TextInput placeholder="User Mapping Url" { ...lens.prop('userMappingUrl').toProps() } />
                </LabeledInput>
                <LabeledInput label='Service Url' { ...lens.prop('serviceUrl').toProps() }>
                    <TextInput placeholder="Service Url" { ...lens.prop('serviceUrl').toProps() } />
                </LabeledInput>
                <LabeledInput label='Service Public Api Key' { ...lens.prop('servicePublicApiKey').toProps() }>
                    <TextInput placeholder="Service Public Api Key" { ...lens.prop('servicePublicApiKey').toProps() } />
                </LabeledInput>
                <LabeledInput label='Service Secret Api Key' { ...lens.prop('serviceSecretApiKey').toProps() }>
                    <TextInput placeholder="Service Secret Api Key" { ...lens.prop('bookingConfirmUrl').toProps() } />
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
            <Panel background='white' style={ { width: 750 } }>
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
