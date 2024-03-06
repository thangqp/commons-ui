/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Grid, Theme, Chip, FormControl, IconButton } from '@mui/material';
import OverflowableText from '../OverflowableText';
import { useSnackMessage } from '../../hooks/useSnackMessage';
import FieldLabel from './utils/field-label';
import FolderIcon from '@mui/icons-material/Folder';
import React, {
    FunctionComponent,
    useCallback,
    useMemo,
    useState,
} from 'react';
import { useController, useFieldArray, useFormContext } from 'react-hook-form';
import { useIntl } from 'react-intl';
import ErrorInput from '../react-hook-form/error-management/error-input.jsx';
import MidFormError from '../react-hook-form/error-management/mid-form-error.jsx';
import { RawReadOnlyInput } from './raw-read-only-input';
import { Tooltip } from '@mui/material';
import { mergeSx } from '../../utils/styles.js';
import DirectoryItemSelector from '../DirectoryItemSelector/directory-item-selector.tsx';
import { isFieldFromContextRequired } from './utils/functions.jsx';
import { UUID } from 'crypto';

export const NAME = 'name';

const styles = {
    formDirectoryElements1: {
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap',
        flexDirection: 'row',
        border: '2px solid lightgray',
        padding: '4px',
        borderRadius: '4px',
        overflow: 'hidden',
    },
    formDirectoryElementsError: (theme: Theme) => ({
        borderColor: theme.palette.error.main,
    }),
    formDirectoryElements2: {
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap',
        flexDirection: 'row',
        marginTop: 0,
        padding: '4px',
        overflow: 'hidden',
    },
    addDirectoryElements: {
        marginTop: '-5px',
    },
};

interface DirectoryItemsInputProps {
    label: string | undefined;
    name: string;
    elementType: string;
    equipmentTypes?: string[];
    itemFilter?: any;
    titleId?: string;
    hideErrorMessage?: boolean;
    onRowChanged?: (a: boolean) => void;
    onChange?: (e: any) => void;
    disable?: boolean;
    fetchDirectoryContent: (
        directoryUuid: UUID,
        elementTypes: string[]
    ) => Promise<any>;
    fetchRootFolders: (types: string[]) => Promise<any>;
    fetchElementsInfos: (ids: UUID[], elementTypes: string[]) => Promise<any>;
    labelRequiredFromContext?: boolean;
}

const DirectoryItemsInput: FunctionComponent<DirectoryItemsInputProps> = ({
    label,
    name,
    elementType, // Used to specify type of element (Filter, Contingency list, ...)
    equipmentTypes, // Mostly used for filters, it allows the user to get elements of specific equipment only
    itemFilter, // Used to further filter the results displayed according to specific requirement
    titleId, // title of directory item selector dialogue
    hideErrorMessage,
    onRowChanged,
    onChange,
    disable = false,
    fetchDirectoryContent,
    fetchRootFolders,
    fetchElementsInfos,
    labelRequiredFromContext = true,
}) => {
    const { snackError } = useSnackMessage();
    const intl = useIntl();
    const types = useMemo(() => [elementType], [elementType]);
    const [directoryItemSelectorOpen, setDirectoryItemSelectorOpen] =
        useState(false);
    const {
        fields: elements,
        append,
        remove,
    } = useFieldArray({
        name,
    });

    const formContext = useFormContext();
    const { getValues } = formContext;
    const {
        fieldState: { error },
    } = useController({
        name,
    });

    const addElements = useCallback(
        (values: any[]) => {
            values.forEach((value) => {
                const { icon, children, ...otherElementAttributes } = value;

                // Check if the element is already present
                if (
                    getValues(name).find(
                        (v: any) => v?.id === otherElementAttributes.id
                    ) !== undefined
                ) {
                    snackError({
                        messageTxt: '',
                        headerId: 'ElementAlreadyUsed',
                    });
                } else {
                    append(otherElementAttributes);
                    onRowChanged && onRowChanged(true);
                    onChange && onChange(getValues(name));
                }
            });
            setDirectoryItemSelectorOpen(false);
        },
        [append, getValues, snackError, name, onRowChanged, onChange]
    );

    const removeElements = useCallback(
        (index: number) => {
            remove(index);
            onRowChanged && onRowChanged(true);
            onChange && onChange(getValues(name));
        },
        [onRowChanged, remove, getValues, name, onChange]
    );

    return (
        <>
            <FormControl
                sx={mergeSx(
                    styles.formDirectoryElements1,
                    error?.message && styles.formDirectoryElementsError
                )}
                error={!!error?.message}
            >
                {elements?.length === 0 && label && (
                    <FieldLabel
                        label={label}
                        optional={
                            labelRequiredFromContext &&
                            !isFieldFromContextRequired(
                                name,
                                formContext,
                                getValues()
                            )
                        }
                    />
                )}
                {elements?.length > 0 && (
                    <FormControl sx={styles.formDirectoryElements2}>
                        {elements.map((item, index) => (
                            <Chip
                                key={item.id}
                                size="small"
                                onDelete={() => removeElements(index)}
                                label={
                                    <OverflowableText
                                        text={
                                            <RawReadOnlyInput
                                                name={`${name}.${index}.${NAME}`}
                                            />
                                        }
                                        sx={{ width: '100%' }}
                                    />
                                }
                            />
                        ))}
                    </FormControl>
                )}
                <Grid item xs>
                    <Grid container direction="row-reverse">
                        <Tooltip title={intl.formatMessage({ id: titleId })}>
                            <IconButton
                                sx={styles.addDirectoryElements}
                                size={'small'}
                                disabled={disable}
                                onClick={() =>
                                    setDirectoryItemSelectorOpen(true)
                                }
                            >
                                <FolderIcon />
                            </IconButton>
                        </Tooltip>
                    </Grid>
                </Grid>
            </FormControl>
            {!hideErrorMessage && (
                <ErrorInput name={name} InputField={MidFormError} />
            )}
            <DirectoryItemSelector
                open={directoryItemSelectorOpen}
                onClose={addElements}
                types={types}
                equipmentTypes={equipmentTypes}
                title={intl.formatMessage({ id: titleId })}
                itemFilter={itemFilter}
                fetchDirectoryContent={fetchDirectoryContent}
                fetchRootFolders={fetchRootFolders}
                fetchElementsInfos={fetchElementsInfos}
            />
        </>
    );
};

export default DirectoryItemsInput;
