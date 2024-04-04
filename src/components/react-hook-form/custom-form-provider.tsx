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
