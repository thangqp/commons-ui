/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { createContext, PropsWithChildren } from 'react';
import { FormProvider, UseFormReturn } from 'react-hook-form';
import * as yup from 'yup';
import { getSystemLanguage } from '../../../utils/localized-countries-hook';
import { UUID } from 'crypto';

type CustomFormContextProps = {
    removeOptional?: boolean;
    validationSchema: yup.AnySchema;
    language: string;
    fetchDirectoryContent?: (
        directoryUuid: UUID,
        elementTypes: string[]
    ) => Promise<any>;
    fetchRootFolders?: (types: string[]) => Promise<any>;
    fetchElementsInfos?: (
        ids: UUID[],
        elementTypes?: string[],
        equipmentTypes?: string[]
    ) => Promise<any>;
};

export type MergedFormContextProps = UseFormReturn<any> &
    CustomFormContextProps;

type CustomFormProviderProps = PropsWithChildren<MergedFormContextProps>;

export const CustomFormContext = createContext<CustomFormContextProps>({
    removeOptional: false,
    validationSchema: yup.object(),
    language: getSystemLanguage(),
    fetchDirectoryContent: undefined,
    fetchRootFolders: undefined,
    fetchElementsInfos: undefined,
});

const CustomFormProvider = (props: CustomFormProviderProps) => {
    const {
        validationSchema,
        removeOptional,
        language,
        fetchDirectoryContent,
        fetchRootFolders,
        fetchElementsInfos,
        children,
        ...formMethods
    } = props;

    return (
        <FormProvider {...formMethods}>
            <CustomFormContext.Provider
                value={{
                    validationSchema: validationSchema,
                    removeOptional: removeOptional,
                    language: language,
                    fetchDirectoryContent: fetchDirectoryContent,
                    fetchRootFolders: fetchRootFolders,
                    fetchElementsInfos: fetchElementsInfos,
                }}
            >
                {children}
            </CustomFormContext.Provider>
        </FormProvider>
    );
};

export default CustomFormProvider;
