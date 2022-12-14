import React, { useMemo, useState } from 'react';
import { KeyedColumnsRowIndexer } from '../../src';
import withStyles from '@mui/styles/withStyles';
//import MuiVirtualizedTable from "../../src/components/MuiVirtualizedTable/MuiVirtualizedTable";

import MuiVirtualizedTable from '../../src/components/MuiVirtualizedTable';
import Box from '@mui/material/Box';

export const TableTab = ({ styles }) => {
    const VirtualizedTable = withStyles(styles)(MuiVirtualizedTable);

    const [version, setVersion] = useState(0);

    const columns = useMemo(
        () => [
            {
                label: 'header1',
                dataKey: 'key1',
            },
            {
                label: 'header2',
                dataKey: 'key2',
            },
            {
                label: 'header3 and some integers',
                dataKey: 'key3',
                numeric: true,
            },
            {
                label: 'floats',
                dataKey: 'key4',
                numeric: true,
                fractionDigits: 1,
            },
        ],
        []
    );

    const rows = useMemo(
        () => [
            { key1: 'group2', key2: 'val2', key3: 1, key4: 2.35 },
            { key1: 'group1', key2: 'val1', key3: 2, key4: 5.32 },
            { key1: 'group2', key2: 'val4', key3: 3, key4: 23.5 },
            { key1: 'group1', key2: 'val3', key3: 4, key4: 52.3 },
            { key1: 'group3', key2: 'val3', key3: 5, key4: 2.53 },
            { key1: 'group3', key2: 'val2', key3: 6, key4: 25.3 },
            { key1: 'group4', key2: 'val3', key3: 5, key4: 53.2 },
            { key1: 'group4', key2: 'val4', key3: 2, key4: 3.25 },
            { key1: 'group4', key2: 'val4', key3: 1, key4: 3.52 },
        ],
        []
    );

    const indexer = useMemo(() => {
        const ret = new KeyedColumnsRowIndexer(true, false, null, setVersion);
        ret.setColFilterOuterParams('key2', ['val9']);
        return ret;
    }, []);

    return (
        <Box style={{ height: '20rem' }}>
            <VirtualizedTable
                name="Demo Virtualized Table"
                rows={rows}
                sortable={true}
                columns={columns}
                enableExportCSV={true}
                exportCSVDataKeys={['key2', 'key3']}
                // onRowClick={(...args) => console.log('onRowClick', args)}
                // onClick={(...args) => console.log('onClick', args)}
                // onCellClick={(...args) => console.log('onCellClick', args)}
                indexer={indexer}
                version={version}
            />
        </Box>
    );
};
