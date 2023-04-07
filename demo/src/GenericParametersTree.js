import { useImportExportParams } from '../../src/hooks/useImportExportParams';
import React, { useState } from 'react';
import TreePanelResizableBox from './tree-panel-resizable-box';
import FlatParameters from '../../src/components/FlatParameters';

const EXAMPLE_PARAMETERS = [
    {
        name: 'voltageRemoteControl',
        type: 'BOOLEAN',
        description: 'Generator voltage remote control',
        defaultValue: 'true',
        possibleValues: null,
    },
    {
        name: 'plausibleActivePowerLimit',
        type: 'DOUBLE',
        description: 'Plausible active power limit',
        defaultValue: '5000.0',
        possibleValues: null,
    },
    {
        name: 'slackBusSelectionMode',
        type: 'STRING',
        description: 'Slack bus selection mode',
        defaultValue: 'MOST_MESHED',
        possibleValues: ['FIRST', 'MOST_MESHED', 'NAME', 'LARGEST_GENERATOR'],
    },
    {
        name: 'limitReductions',
        type: 'STRING_LIST',
        description: 'Limit reductions (in JSON)',
        defaultValue: [],
        possibleValues: null,
    },
    {
        name: 'slackBusesIds',
        type: 'STRING',
        description: 'Slack bus IDs',
        defaultValue: 'null',
        possibleValues: null,
    },
    {
        name: 'maxIteration',
        type: 'INTEGER',
        description: 'Max iterations',
        defaultValue: '30',
        possibleValues: null,
    },
    {
        name: 'newtonRaphsonConvEpsPerEq',
        type: 'DOUBLE',
        description: 'Newton-Raphson convergence epsilon per equation',
        defaultValue: '1.0E-4',
        possibleValues: null,
    },
    {
        name: 'iidm.export.cgmes.base-name',
        type: 'STRING',
        description: 'Basename for output files',
        defaultValue: null,
        possibleValues: null,
    },
    {
        name: 'iidm.export.cgmes.cim-version',
        type: 'STRING',
        description: 'CIM version to export',
        defaultValue: null,
        possibleValues: ['14', '16', '100'],
    },
    {
        name: 'iidm.export.cgmes.export-boundary-power-flows',
        type: 'BOOLEAN',
        description: "Export boundaries' power flows",
        defaultValue: true,
        possibleValues: null,
    },
    {
        name: 'iidm.export.cgmes.export-power-flows-for-switches',
        type: 'BOOLEAN',
        description: 'Export power flows for switches',
        defaultValue: false,
        possibleValues: null,
    },
    {
        name: 'iidm.export.cgmes.naming-strategy',
        type: 'STRING',
        description: 'Configure what type of naming strategy you want',
        defaultValue: 'identity',
        possibleValues: ['identity', 'cgmes', 'cgmes-fix-all-invalid-ids'],
    },
    {
        name: 'iidm.export.cgmes.profiles',
        type: 'STRING_LIST',
        description: 'Profiles to export',
        defaultValue: ['EQ', 'TP', 'SSH', 'SV'],
        possibleValues: ['EQ', 'TP', 'SSH', 'SV'],
    },
];

export const GenericParametersTestPane = () => {
    const [commited, setCommited] = useState(null);
    const [currentParameters1, paramsComponent1] = useImportExportParams(
        EXAMPLE_PARAMETERS,
        commited,
        false
    );
    // const [currentParameters2, paramsComponent2, reset2] = useImportExportParams(
    //     exampleParameters,
    //     currentParameters1,
    //     true
    // );
    // useEffectDebug(() => {
    //     console.debug('GenericParametersTreePane.effect 1');
    //     setCommited(currentParameters2);
    //     reset1(true);
    // }, [currentParameters2, reset1]);
    //
    // console.debug('GenericParametersTreePane', currentParameters1, currentParameters2);
    return (
        <div style={{ display: 'flex'}}>
            <TreePanelResizableBox>{paramsComponent1}</TreePanelResizableBox>
            <TreePanelResizableBox>
                <FlatParameters
                    paramsAsArray={EXAMPLE_PARAMETERS}
                    initValues={currentParameters1}
                />
            </TreePanelResizableBox>
            {/*<TreePanelResizableBox>{paramsComponent2}</TreePanelResizableBox>*/}
        </div>
    );
    // return <div style={{display: 'flex'}}>{paramsComponent}</div>;
};
