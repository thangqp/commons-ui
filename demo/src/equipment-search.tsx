import { useState } from 'react';
import { Button } from '@mui/material';
import {
    ElementSearchDialog,
    EquipmentItem,
    equipmentStyles,
    EquipmentType,
} from '../../src/index';

export const EquipmentSearchDialog = () => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const updateSearchTerm = (newSearchTerm: string) => {
        setIsLoading(true);
        setSearchTerm(newSearchTerm);
        setTimeout(() => setIsLoading(false), 1000);
    };

    return (
        <>
            <Button onClick={() => setIsSearchOpen(true)}>SEARCH</Button>
            <ElementSearchDialog
                open={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
                searchingLabel={'testSearch'}
                onSearchTermChange={updateSearchTerm}
                onSelectionChange={(element: any) => {
                    console.log(element);
                }}
                elementsFound={
                    searchTerm
                        ? [
                              {
                                  id: 'test1',
                                  key: 'test1',
                                  label: 'label1',
                                  type: EquipmentType.LINE,
                              },
                              {
                                  id: 'test2',
                                  key: 'test2',
                                  label: 'label2',
                                  type: EquipmentType.GENERATOR,
                              },
                          ]
                        : []
                }
                renderElement={(props: any) => (
                    <EquipmentItem
                        styles={equipmentStyles}
                        {...props}
                        key={props.element.key}
                    />
                )}
                searchTerm={searchTerm}
                isLoading={isLoading}
            />
        </>
    );
};
