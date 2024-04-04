/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { createContext, PropsWithChildren, useContext } from 'react';
import { FormProvider, useFormContext, UseFormReturn } from 'react-hook-form';
import * as yup from 'yup';

type CustomFormContextProps = {
    removeOptional?: boolean;
    validationSchema: yup.AnySchema;
};

type MergedFormContextProps = UseFormReturn<any> & CustomFormContextProps;

type CustomFormProviderProps = PropsWithChildren<MergedFormContextProps>;

const CustomFormContext = createContext<CustomFormContextProps>({
    removeOptional: false,
    validationSchema: yup.object(),
});

const CustomFormProvider = (props: CustomFormProviderProps) => {
    const { validationSchema, removeOptional, children, ...formMethods } =
        props;

    return (
        <FormProvider {...formMethods}>
            <CustomFormContext.Provider
                value={{
                    validationSchema: validationSchema,
                    removeOptional: removeOptional,
                }}
            >
                {children}
            </CustomFormContext.Provider>
        </FormProvider>
    );
};

export default CustomFormProvider;

export const useCustomFormContext = (): MergedFormContextProps => {
    const formMethods = useFormContext();
    const customFormMethods = useContext(CustomFormContext);

    return { ...formMethods, ...customFormMethods };
};
