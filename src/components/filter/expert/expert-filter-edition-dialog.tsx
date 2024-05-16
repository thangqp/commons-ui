/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { FieldConstants } from '../../../utils/field-constants';
import { noSelectionForCopy } from '../../../utils/equipment-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackMessage } from '../../../hooks/useSnackMessage';
import CustomMuiDialog from '../../dialogs/custom-mui-dialog';
import yup from '../../../utils/yup-config';
import { FilterForm } from '../filter-form';
import { EXPERT_FILTER_QUERY, expertFilterSchema } from './expert-filter-form';
import { saveExpertFilter } from '../utils/filter-api';
import { importExpertRules } from './expert-filter-utils';
import { UUID } from 'crypto';
import { elementExistsType } from '../criteria-based/criteria-based-filter-edition-dialog';
import { FilterContext } from '../filter-context';
import { FilterType } from '../constants/filter-constants';
import { FetchStatus } from '../../../utils/FetchStatus';
import { ElementAttributes } from '../../../utils/types.ts';

const formSchema = yup
    .object()
    .shape({
        [FieldConstants.NAME]: yup.string().trim().required('nameEmpty'),
        [FieldConstants.FILTER_TYPE]: yup.string().required(),
        [FieldConstants.EQUIPMENT_TYPE]: yup.string().required(),
        ...expertFilterSchema,
    })
    .required();

export interface ExpertFilterEditionDialogProps {
    id: string;
    name: string;
    titleId: string;
    open: boolean;
    onClose: () => void;
    broadcastChannel: BroadcastChannel;

    selectionForCopy: any;
    getFilterById: (id: string) => Promise<{ [prop: string]: any }>;
    setSelectionForCopy: (selection: any) => void;
    activeDirectory?: UUID;
    elementExists?: elementExistsType;
    language?: string;
    fetchDirectoryContent: (
        directoryUuid: UUID,
        elementTypes: string[]
    ) => Promise<ElementAttributes[]>;
    fetchRootFolders: (types: string[]) => Promise<ElementAttributes[]>;
    fetchElementsInfos: (
        ids: UUID[],
        elementTypes?: string[],
        equipmentTypes?: string[]
    ) => Promise<ElementAttributes[]>;
}

const ExpertFilterEditionDialog: FunctionComponent<
    ExpertFilterEditionDialogProps
> = ({
    id,
    name,
    titleId,
    open,
    onClose,
    broadcastChannel,
    selectionForCopy,
    getFilterById,
    setSelectionForCopy,
    activeDirectory,
    elementExists,
    language,
    fetchDirectoryContent,
    fetchRootFolders,
    fetchElementsInfos,
}) => {
    const { snackError } = useSnackMessage();
    const [dataFetchStatus, setDataFetchStatus] = useState(FetchStatus.IDLE);

    // default values are set via reset when we fetch data
    const formMethods = useForm({
        resolver: yupResolver(formSchema),
    });

    const {
        reset,
        formState: { errors },
    } = formMethods;

    const nameError = errors[FieldConstants.NAME];
    const isValidating = errors.root?.isValidating;

    // Fetch the filter data from back-end if necessary and fill the form with it
    useEffect(() => {
        if (id && open) {
            setDataFetchStatus(FetchStatus.FETCHING);
            getFilterById(id)
                .then((response: { [prop: string]: any }) => {
                    setDataFetchStatus(FetchStatus.FETCH_SUCCESS);
                    reset({
                        [FieldConstants.NAME]: name,
                        [FieldConstants.FILTER_TYPE]: FilterType.EXPERT.id,
                        [FieldConstants.EQUIPMENT_TYPE]:
                            response[FieldConstants.EQUIPMENT_TYPE],
                        [EXPERT_FILTER_QUERY]: importExpertRules(
                            response[EXPERT_FILTER_QUERY]
                        ),
                    });
                })
                .catch((error: { message: any }) => {
                    setDataFetchStatus(FetchStatus.FETCH_ERROR);
                    snackError({
                        messageTxt: error.message,
                        headerId: 'cannotRetrieveFilter',
                    });
                });
        }
    }, [id, name, open, reset, snackError, getFilterById]);

    const onSubmit = useCallback(
        (filterForm: { [prop: string]: any }) => {
            saveExpertFilter(
                id,
                filterForm[EXPERT_FILTER_QUERY],
                filterForm[FieldConstants.EQUIPMENT_TYPE],
                filterForm[FieldConstants.NAME],
                '', // The description can not be edited from this dialog
                false,
                null,
                onClose,
                (error: string) => {
                    snackError({
                        messageTxt: error,
                    });
                }
            );
            if (selectionForCopy.sourceItemUuid === id) {
                setSelectionForCopy(noSelectionForCopy);
                broadcastChannel.postMessage({
                    noSelectionForCopy,
                });
            }
        },
        [
            broadcastChannel,
            id,
            onClose,
            selectionForCopy.sourceItemUuid,
            snackError,
            setSelectionForCopy,
        ]
    );

    const isDataReady = dataFetchStatus === FetchStatus.FETCH_SUCCESS;

    return (
        <CustomMuiDialog
            open={open}
            onClose={onClose}
            onSave={onSubmit}
            formSchema={formSchema}
            formMethods={formMethods}
            titleId={titleId}
            removeOptional={true}
            disabledSave={!!nameError || !!isValidating}
            isDataFetching={dataFetchStatus === FetchStatus.FETCHING}
            language={language}
        >
            <FilterContext.Provider
                value={{
                    fetchDirectoryContent: fetchDirectoryContent,
                    fetchRootFolders: fetchRootFolders,
                    fetchElementsInfos: fetchElementsInfos,
                }}
            >
                {isDataReady && (
                    <FilterForm
                        activeDirectory={activeDirectory}
                        elementExists={elementExists}
                    />
                )}
            </FilterContext.Provider>
        </CustomMuiDialog>
    );
};

export default ExpertFilterEditionDialog;
