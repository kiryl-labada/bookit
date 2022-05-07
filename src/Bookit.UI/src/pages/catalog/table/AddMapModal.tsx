import { Button, DropSpot, FileCard, FlexCell, FlexRow, FlexSpacer, LabeledInput, ModalBlocker, ModalFooter, ModalHeader, ModalWindow, Panel, PickerInput, RadioGroup, ScrollBars, TextInput, useForm } from "@epam/promo";
import { FileUploadResponse, IModal } from "@epam/uui-core";
import { useState } from "react";
import { MapObject, MapPageTab, useBookingDbRef } from "../../../db";
import { svc } from "../../../services";

interface CreateMapModel {
    name?: MapObject['name'];
    backgroundImage?: string;
}

type AttachmentType = FileUploadResponse & { progress?: number };

export function AddMapModal(modalProps: IModal<any>) {
    const dbRef = useBookingDbRef();
    const [attachment, setAttachment] = useState<AttachmentType>();

    const onSave = (input: CreateMapModel) => {
        return dbRef.createMap(input.name!, input.backgroundImage!)
            .then((res) => {
                console.log('res', res);
                svc.uuiRouter.redirect({ pathname: '/booking', search: `?id=${res.originalMapId}&tab=${MapPageTab.BUILDER}` });
            });
    };
    
    const { lens, save } = useForm<CreateMapModel>({
        value: {},
        onSave: map => onSave(map).then((res) => ({ form: map })),
        onSuccess: person => modalProps.success(person),
        getMetadata: () => ({
            props: {
                name: { isRequired: true },
                backgroundImage: { isRequired: true },
            },
        }),
        beforeLeave: null,
    });

    const trackProgress = (progress: number, id: number) => {
        setAttachment(prev => prev && ({ ...prev, progress }));
    };

    const updateFile = (file: AttachmentType, id: number) => {
        setAttachment(file);
        file.path && lens.prop('backgroundImage').toProps().onValueChange(file.path);
    };

    const uploadFile = (files: File[]) => {
        if (!files?.length) return;

        const file = files[0];
        const tempId = 1;
        setAttachment({ id: tempId, name: file.name, size: file.size });
        svc.uuiApi.uploadFile('/api/file/upload', file, {
            onProgress: progress => trackProgress(progress, tempId),
        }).then(res => updateFile({ ...res, progress: 100 }, tempId));
    };

    return (
        <ModalBlocker { ...modalProps } abort={ modalProps.abort }>
            <ModalWindow >
                <ModalHeader borderBottom title="Create New Map" onClose={ modalProps.abort } />
                <ScrollBars>
                    <Panel>
                        <FlexRow padding='24' vPadding='12'>
                            <FlexCell grow={ 1 }>
                                <LabeledInput label='Name' { ...lens.prop('name').toProps() } >
                                    <TextInput placeholder='Name' { ...lens.prop('name').toProps() } />
                                </LabeledInput>
                            </FlexCell>
                        </FlexRow>
                        <div>
                            { !attachment && <DropSpot onUploadFiles={ uploadFile } single /> }
                            { attachment && (
                                <FileCard
                                    file={ attachment }
                                    onClick={ () => { setAttachment(undefined); console.log('clear'); } }
                                />
                            ) }
                        </div>
                    </Panel>
                    <ModalFooter borderTop>
                        <FlexSpacer />
                        <Button color='gray50' fill='white' onClick={ modalProps.abort } caption='Cancel' />
                        <Button color='green' caption='Confirm' onClick={ save } />
                    </ModalFooter>
                    <FlexSpacer />
                </ScrollBars>
            </ModalWindow>
        </ModalBlocker>
    );
}