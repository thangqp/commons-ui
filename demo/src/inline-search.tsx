import { useState } from 'react';
import { ElementSearchInput } from '../../src/components/ElementSearchDialog/element-search-input';
import { EquipmentItem, EquipmentType, equipmentStyles } from '../../src';
import { TextField } from '@mui/material';
import { Search } from '@mui/icons-material';
import { useIntl } from 'react-intl';

export const InlineSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const updateSearchTerm = (newSearchTerm: string) => {
        setIsLoading(true);
        setSearchTerm(newSearchTerm);
        setTimeout(() => setIsLoading(false), 1000);
    };

    const intl = useIntl();

    return (
        <ElementSearchInput
            searchingLabel={'testInlineSearch'}
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
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option1, option2) =>
                option1.id === option2.id
            }
            renderInput={(displayedValue, params) => (
                <TextField
                    {...params}
                    label={intl.formatMessage({
                        id: 'element_search/label',
                    })}
                    InputProps={{
                        ...params.InputProps,
                        startAdornment: <Search color="disabled" />,
                    }}
                    value={displayedValue}
                />
            )}
        />
    );
};
