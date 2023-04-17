/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import React, { memo, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import withStyles from '@mui/styles/withStyles';
import TableCell from '@mui/material/TableCell';
import MuiVirtualizedTable from '../MuiVirtualizedTable';
import { useTheme } from '@mui/material/styles';

const SEVERITY_COLUMN_FIXED_WIDTH = 100;

const styles = (theme) => ({
    flexContainer: {
        display: 'flex',
        alignItems: 'center',
        boxSizing: 'border-box',
    },
    table: {
        // temporary right-to-left patch, waiting for
        // https://github.com/bvaughn/react-virtualized/issues/454
        '& .ReactVirtualized__Table__headerRow': {
            flip: false,
            paddingRight:
                theme.direction === 'rtl' ? '0 !important' : undefined,
        },
    },
    header: { variant: 'header' },
});

const VirtualizedTable = withStyles(styles)(MuiVirtualizedTable);

const LogTable = ({ logs, onRowClick }) => {
    const intl = useIntl();

    const theme = useTheme();

    const [selectedRowIndex, setSelectedRowIndex] = useState(-1);

    const severityCellRender = (cellData) => {
        return (
            <TableCell
                component="div"
                variant="body"
                style={{
                    display: 'flex',
                    flex: '1',
                    backgroundColor: cellData.rowData.backgroundColor,
                }}
                align="center"
            >
                {cellData.rowData.severity}
            </TableCell>
        );
    };

    const COLUMNS_DEFINITIONS = [
        {
            label: intl
                .formatMessage({ id: 'report_viewer/severity' })
                .toUpperCase(),
            id: 'severity',
            dataKey: 'severity',
            maxWidth: SEVERITY_COLUMN_FIXED_WIDTH,
            minWidth: SEVERITY_COLUMN_FIXED_WIDTH,
            cellRenderer: severityCellRender,
        },
        {
            label: intl
                .formatMessage({ id: 'report_viewer/message' })
                .toUpperCase(),
            id: 'message',
            dataKey: 'message',
        },
    ];

    const generateTableColumns = () => {
        return Object.values(COLUMNS_DEFINITIONS).map((c) => {
            return c;
        });
    };

    const generateTableRows = () => {
        return logs.map((log) => {
            return {
                severity: log.getSeverityName(),
                message: log.getLog(),
                backgroundColor: log.getColorName(),
                reportId: log.getReportId(),
            };
        });
    };

    const handleRowClick = (event) => {
        setSelectedRowIndex(event.index);
        onRowClick(event.rowData);
    };

    const rowStyleFormat = (row) => {
        if (row.index < 0) {
            return;
        }
        if (selectedRowIndex === row.index) {
            return {
                backgroundColor: theme.palette.action.selected,
            };
        }
    };

    useEffect(() => {
        setSelectedRowIndex(-1);
    }, [logs]);

    return (
        //TODO do we need to useMemo/useCallback these props to avoid rerenders ?
        <VirtualizedTable
            columns={generateTableColumns()}
            rows={generateTableRows()}
            sortable={false}
            onRowClick={handleRowClick}
            rowStyle={rowStyleFormat}
        />
    );
};

export default memo(LogTable);
