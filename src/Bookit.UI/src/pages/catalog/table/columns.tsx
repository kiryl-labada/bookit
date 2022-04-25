import * as React from 'react';
import { Text, IconButton } from '@epam/promo';
import { DataColumnProps } from "@epam/uui";
import css from './DemoTable.module.scss';
import { ReactComponent as ViewIcon } from '@epam/assets/icons/common/action-eye-18.svg';
import {MapObject} from "../../../db";

export function getColumns<TFilter extends Record<string, any>>(): DataColumnProps<MapObject, number>[] {
    return [
        {
            key: 'name',
            caption: "Name",
            render: p => <Text>{ p.name }</Text>,
            width: 200,
            fix: 'left',
            isSortable: true,
        },
        {
            key: 'createdAt',
            caption: "Created At",
            render: p => p?.createdAt && <Text>{ new Date(p.createdAt).toLocaleDateString() }</Text>,
            grow: 0,
            shrink: 0,
            width: 120,
            isSortable: true,
        },
        {
            key: 'updatedAt',
            caption: "Updated At",
            render: p => p?.updatedAt && <Text>{ new Date(p.updatedAt).toLocaleDateString() }</Text>,
            grow: 0,
            shrink: 0,
            width: 120,
            isSortable: true,
        },
        {
            key: 'detailed',
            render: (p) => <IconButton
                cx={ css.detailedIcon }
                icon={ ViewIcon }
            />,
            width: 54,
            alignSelf: 'center',
            fix: 'right',
        },
    ];
}