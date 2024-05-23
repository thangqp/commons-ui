/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
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
