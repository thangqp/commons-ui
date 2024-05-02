/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { FunctionComponent, useContext, useEffect } from 'react';
import { validate as uuidValidate } from 'uuid';
import { DirectoryItemsInput, useCustomFormContext } from '../../index';
import { FilterContext } from '../filter/filter-context.ts';

interface ElementValueEditorProps {
    name: string;
    elementType: string;
    equipmentTypes?: string[];
    titleId: string;
    hideErrorMessage: boolean;
    onChange?: (e: any) => void;
    itemFilter?: any;
    defaultValue?: any;
}

const ElementValueEditor: FunctionComponent<ElementValueEditorProps> = (
    props
) => {
    const { setValue } = useCustomFormContext();
    const { fetchElementsInfos } = useContext(FilterContext);

    useEffect(() => {
        if (
            props.defaultValue &&
            Array.isArray(props.defaultValue) &&
            props.defaultValue.length > 0 &&
            props.defaultValue[0].length > 0 &&
            uuidValidate(props.defaultValue[0])
        ) {
            fetchElementsInfos &&
                fetchElementsInfos(props.defaultValue).then(
                    (childrenWithMetadata) => {
                        setValue(
                            props.name,
                            childrenWithMetadata.map((v: any) => {
                                return {
                                    id: v.elementUuid,
                                    name: v.elementName,
                                    specificMetadata: v.specificMetadata,
                                };
                            })
                        );
                    }
                );
        }
    }, [
        props.name,
        props.defaultValue,
        props.elementType,
        setValue,
        fetchElementsInfos,
    ]);

    return (
        <DirectoryItemsInput
            name={props.name}
            elementType={props.elementType}
            equipmentTypes={props.equipmentTypes}
            titleId={props.titleId}
            hideErrorMessage={props.hideErrorMessage}
            label={'filter'}
            itemFilter={props.itemFilter}
            onChange={props.onChange}
            labelRequiredFromContext={false}
        ></DirectoryItemsInput>
    );
};
export default ElementValueEditor;
