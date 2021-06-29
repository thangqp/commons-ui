/* eslint-disable no-template-curly-in-string */
/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export const LOGS_JSON = {
    taskKey: '059c9481-fa04-4da8-8ab4-0601f6ec987d',
    defaultName: '059c9481-fa04-4da8-8ab4-0601f6ec987d',
    taskValues: {},
    subReporters: [
        {
            taskKey: 'FirstLoadflow',
            defaultName: 'FirstLoadflow',
            taskValues: {},
            subReporters: [
                {
                    taskKey: 'loadFlow',
                    defaultName: 'Load flow on network ${networkId}',
                    taskValues: {
                        networkId: {
                            value: 'merged',
                            type: 'UNTYPED',
                        },
                    },
                    subReporters: [
                        {
                            taskKey: 'createLfNetwork',
                            defaultName: 'Create network ${networkNum}',
                            taskValues: {
                                networkNum: {
                                    value: 0,
                                    type: 'UNTYPED',
                                },
                            },
                            subReporters: [],
                            reports: [
                                {
                                    reportKey: 'notStartedGenerators',
                                    defaultMessage:
                                        '${nbGenImpacted} generators have been discarded from voltage control because not started',
                                    values: {
                                        nbGenImpacted: {
                                            value: 8,
                                            type: 'UNTYPED',
                                        },
                                    },
                                },
                                {
                                    reportKey: 'smallReactiveRangeGenerators',
                                    defaultMessage:
                                        '${nbGenImpacted} generators have been discarded from voltage control because of a too small max reactive range',
                                    values: {
                                        nbGenImpacted: {
                                            value: 3,
                                            type: 'UNTYPED',
                                        },
                                    },
                                },
                            ],
                        },
                        {
                            taskKey: 'postLoading',
                            defaultName:
                                'Post loading process on network CC${numNetworkCc} SC${numNetworkSc}',
                            taskValues: {
                                numNetworkSc: {
                                    value: 0,
                                    type: 'UNTYPED',
                                },
                                numNetworkCc: {
                                    value: 0,
                                    type: 'UNTYPED',
                                },
                            },
                            subReporters: [],
                            reports: [
                                {
                                    reportKey: 'networkSize',
                                    defaultMessage:
                                        'Network CC${numNetworkCc} SC${numNetworkSc} has ${nbBuses} buses (voltage remote control: ${nbRemoteControllerBuses} controllers, ${nbRemoteControlledBuses} controlled) and ${nbBranches} branches',
                                    values: {
                                        nbBranches: {
                                            value: 4589,
                                            type: 'UNTYPED',
                                        },
                                        nbRemoteControlledBuses: {
                                            value: 0,
                                            type: 'UNTYPED',
                                        },
                                        nbRemoteControllerBuses: {
                                            value: 0,
                                            type: 'UNTYPED',
                                        },
                                        nbBuses: {
                                            value: 3145,
                                            type: 'UNTYPED',
                                        },
                                        numNetworkCc: {
                                            value: 0,
                                            type: 'UNTYPED',
                                        },
                                        numNetworkSc: {
                                            value: 0,
                                            type: 'UNTYPED',
                                        },
                                    },
                                },
                                {
                                    reportKey: 'networkBalance',
                                    defaultMessage:
                                        'Network CC${numNetworkCc} SC${numNetworkSc} balance: active generation=${activeGeneration} MW, active load=${activeLoad} MW, reactive generation=${reactiveGeneration} MVar, reactive load=${reactiveLoad} MVar',
                                    values: {
                                        reactiveLoad: {
                                            value: 932.0261173090017,
                                            type: 'UNTYPED',
                                        },
                                        activeLoad: {
                                            value: 51035.472964292974,
                                            type: 'UNTYPED',
                                        },
                                        numNetworkCc: {
                                            value: 0,
                                            type: 'UNTYPED',
                                        },
                                        numNetworkSc: {
                                            value: 0,
                                            type: 'UNTYPED',
                                        },
                                        activeGeneration: {
                                            value: 51974.960732000014,
                                            type: 'UNTYPED',
                                        },
                                        reactiveGeneration: {
                                            value: -1121.274081,
                                            type: 'UNTYPED',
                                        },
                                    },
                                },
                            ],
                        },
                    ],
                    reports: [
                        {
                            reportKey: 'loadFlowCompleted',
                            defaultMessage:
                                'DC load flow completed (status=${lfStatus})',
                            values: {
                                lfStatus: {
                                    value: 'CONVERGED',
                                    type: 'UNTYPED',
                                },
                                reportSeverity: {
                                    value: 'OLF_INFO',
                                    type: 'INFO_LOGLEVEL',
                                },
                            },
                        },
                    ],
                },
            ],
            reports: [],
        },
        {
            taskKey: 'SecondLoadflow',
            defaultName: 'SecondLoadflow',
            taskValues: {},
            subReporters: [
                {
                    taskKey: 'loadFlow',
                    defaultName: 'Load flow on network ${networkId}',
                    taskValues: {
                        networkId: {
                            value: 'merged',
                            type: 'UNTYPED',
                        },
                    },
                    subReporters: [
                        {
                            taskKey: 'createLfNetwork',
                            defaultName: 'Create network ${networkNum}',
                            taskValues: {
                                networkNum: {
                                    value: 0,
                                    type: 'UNTYPED',
                                },
                            },
                            subReporters: [],
                            reports: [
                                {
                                    reportKey: 'smallReactiveRangeGenerators',
                                    defaultMessage:
                                        '${nbGenImpacted} generators have been discarded from voltage control because of a too small max reactive range',
                                    values: {
                                        nbGenImpacted: {
                                            value: 3,
                                            type: 'UNTYPED',
                                        },
                                    },
                                },
                                {
                                    reportKey: 'notStartedGenerators',
                                    defaultMessage:
                                        '${nbGenImpacted} generators have been discarded from voltage control because not started',
                                    values: {
                                        nbGenImpacted: {
                                            value: 8,
                                            type: 'UNTYPED',
                                        },
                                    },
                                },
                            ],
                        },
                        {
                            taskKey: 'postLoading',
                            defaultName:
                                'Post loading process on network CC${numNetworkCc} SC${numNetworkSc}',
                            taskValues: {
                                numNetworkSc: {
                                    value: 0,
                                    type: 'UNTYPED',
                                },
                                numNetworkCc: {
                                    value: 0,
                                    type: 'UNTYPED',
                                },
                            },
                            subReporters: [],
                            reports: [
                                {
                                    reportKey: 'networkSize',
                                    defaultMessage:
                                        'Network CC${numNetworkCc} SC${numNetworkSc} has ${nbBuses} buses (voltage remote control: ${nbRemoteControllerBuses} controllers, ${nbRemoteControlledBuses} controlled) and ${nbBranches} branches',
                                    values: {
                                        nbBranches: {
                                            value: 4589,
                                            type: 'UNTYPED',
                                        },
                                        nbRemoteControlledBuses: {
                                            value: 0,
                                            type: 'UNTYPED',
                                        },
                                        nbRemoteControllerBuses: {
                                            value: 0,
                                            type: 'UNTYPED',
                                        },
                                        nbBuses: {
                                            value: 3145,
                                            type: 'UNTYPED',
                                        },
                                        numNetworkCc: {
                                            value: 0,
                                            type: 'UNTYPED',
                                        },
                                        numNetworkSc: {
                                            value: 0,
                                            type: 'UNTYPED',
                                        },
                                    },
                                },
                                {
                                    reportKey: 'networkBalance',
                                    defaultMessage:
                                        'Network CC${numNetworkCc} SC${numNetworkSc} balance: active generation=${activeGeneration} MW, active load=${activeLoad} MW, reactive generation=${reactiveGeneration} MVar, reactive load=${reactiveLoad} MVar',
                                    values: {
                                        reactiveLoad: {
                                            value: 932.0261173090017,
                                            type: 'UNTYPED',
                                        },
                                        activeLoad: {
                                            value: 51035.472964292974,
                                            type: 'UNTYPED',
                                        },
                                        numNetworkCc: {
                                            value: 0,
                                            type: 'UNTYPED',
                                        },
                                        numNetworkSc: {
                                            value: 0,
                                            type: 'UNTYPED',
                                        },
                                        activeGeneration: {
                                            value: 51974.960732000014,
                                            type: 'UNTYPED',
                                        },
                                        reactiveGeneration: {
                                            value: -1121.274081,
                                            type: 'UNTYPED',
                                        },
                                    },
                                },
                            ],
                        },
                        {
                            taskKey: 'OuterLoop',
                            defaultName: 'Outer loop ${outerLoopType}',
                            taskValues: {
                                outerLoopType: {
                                    value: 'Distributed slack on load',
                                    type: 'UNTYPED',
                                },
                            },
                            subReporters: [],
                            reports: [
                                {
                                    reportKey: 'mismatchDistributionSuccess',
                                    defaultMessage:
                                        'Iteration ${iteration}: slack bus active power (${initialMismatch} MW) distributed in ${nbIterations} iterations',
                                    values: {
                                        reportSeverity: {
                                            value: 'OLF_INFO',
                                            type: 'INFO_LOGLEVEL',
                                        },
                                        nbIterations: {
                                            value: 1,
                                            type: 'UNTYPED',
                                        },
                                        iteration: {
                                            value: 0,
                                            type: 'UNTYPED',
                                        },
                                        initialMismatch: {
                                            value: 9.521163897948878,
                                            type: 'Mismatch',
                                        },
                                    },
                                },
                                {
                                    reportKey: 'NoMismatchDistribution',
                                    defaultMessage:
                                        'Iteration ${iteration}: already balanced',
                                    values: {
                                        reportSeverity: {
                                            value: 'OLF_INFO',
                                            type: 'INFO_LOGLEVEL',
                                        },
                                        iteration: {
                                            value: 1,
                                            type: 'UNTYPED',
                                        },
                                    },
                                },
                            ],
                        },
                        {
                            taskKey: 'OuterLoop',
                            defaultName: 'Outer loop ${outerLoopType}',
                            taskValues: {
                                outerLoopType: {
                                    value: 'Reactive limits',
                                    type: 'UNTYPED',
                                },
                            },
                            subReporters: [],
                            reports: [
                                {
                                    reportKey: 'switchPqPv',
                                    defaultMessage:
                                        '${pqToPvBuses} buses switched PQ -> PV ({blockedPqBuses} buses blocked PQ because have reach max number of switch)',
                                    values: {
                                        reportSeverity: {
                                            value: 'OLF_INFO',
                                            type: 'INFO_LOGLEVEL',
                                        },
                                        pqToPvBuses: {
                                            value: 1,
                                            type: 'UNTYPED',
                                        },
                                        blockedPqBuses: {
                                            value: 0,
                                            type: 'UNTYPED',
                                        },
                                    },
                                },
                                {
                                    reportKey: 'switchPvPq',
                                    defaultMessage:
                                        '${pvToPqBuses} buses switched PV -> PQ ({remainingPvBuses} bus remains PV}',
                                    values: {
                                        remainingPvBuses: {
                                            value: 279,
                                            type: 'UNTYPED',
                                        },
                                        pvToPqBuses: {
                                            value: 12,
                                            type: 'UNTYPED',
                                        },
                                        reportSeverity: {
                                            value: 'OLF_INFO',
                                            type: 'INFO_LOGLEVEL',
                                        },
                                    },
                                },
                                {
                                    reportKey: 'switchPvPq',
                                    defaultMessage:
                                        '${pvToPqBuses} buses switched PV -> PQ ({remainingPvBuses} bus remains PV}',
                                    values: {
                                        remainingPvBuses: {
                                            value: 280,
                                            type: 'UNTYPED',
                                        },
                                        pvToPqBuses: {
                                            value: 2,
                                            type: 'UNTYPED',
                                        },
                                        reportSeverity: {
                                            value: 'OLF_INFO',
                                            type: 'INFO_LOGLEVEL',
                                        },
                                    },
                                },
                                {
                                    reportKey: 'switchPqPv',
                                    defaultMessage:
                                        '${pqToPvBuses} buses switched PQ -> PV ({blockedPqBuses} buses blocked PQ because have reach max number of switch)',
                                    values: {
                                        reportSeverity: {
                                            value: 'OLF_INFO',
                                            type: 'INFO_LOGLEVEL',
                                        },
                                        pqToPvBuses: {
                                            value: 1,
                                            type: 'UNTYPED',
                                        },
                                        blockedPqBuses: {
                                            value: 0,
                                            type: 'UNTYPED',
                                        },
                                    },
                                },
                                {
                                    reportKey: 'switchPqPv',
                                    defaultMessage:
                                        '${pqToPvBuses} buses switched PQ -> PV ({blockedPqBuses} buses blocked PQ because have reach max number of switch)',
                                    values: {
                                        reportSeverity: {
                                            value: 'OLF_INFO',
                                            type: 'INFO_LOGLEVEL',
                                        },
                                        pqToPvBuses: {
                                            value: 3,
                                            type: 'UNTYPED',
                                        },
                                        blockedPqBuses: {
                                            value: 0,
                                            type: 'UNTYPED',
                                        },
                                    },
                                },
                                {
                                    reportKey: 'switchPvPq',
                                    defaultMessage:
                                        '${pvToPqBuses} buses switched PV -> PQ ({remainingPvBuses} bus remains PV}',
                                    values: {
                                        remainingPvBuses: {
                                            value: 291,
                                            type: 'UNTYPED',
                                        },
                                        pvToPqBuses: {
                                            value: 47,
                                            type: 'UNTYPED',
                                        },
                                        reportSeverity: {
                                            value: 'OLF_INFO',
                                            type: 'INFO_LOGLEVEL',
                                        },
                                    },
                                },
                            ],
                        },
                        {
                            taskKey: 'OuterLoop',
                            defaultName: 'Outer loop ${outerLoopType}',
                            taskValues: {
                                outerLoopType: {
                                    value: 'Distributed slack on load',
                                    type: 'UNTYPED',
                                },
                            },
                            subReporters: [],
                            reports: [
                                {
                                    reportKey: 'mismatchDistributionSuccess',
                                    defaultMessage:
                                        'Iteration ${iteration}: slack bus active power (${initialMismatch} MW) distributed in ${nbIterations} iterations',
                                    values: {
                                        reportSeverity: {
                                            value: 'OLF_INFO',
                                            type: 'INFO_LOGLEVEL',
                                        },
                                        nbIterations: {
                                            value: 1,
                                            type: 'UNTYPED',
                                        },
                                        iteration: {
                                            value: 1,
                                            type: 'UNTYPED',
                                        },
                                        initialMismatch: {
                                            value: -12.0966260307637,
                                            type: 'Mismatch',
                                        },
                                    },
                                },
                                {
                                    reportKey: 'NoMismatchDistribution',
                                    defaultMessage:
                                        'Iteration ${iteration}: already balanced',
                                    values: {
                                        reportSeverity: {
                                            value: 'OLF_INFO',
                                            type: 'INFO_LOGLEVEL',
                                        },
                                        iteration: {
                                            value: 2,
                                            type: 'UNTYPED',
                                        },
                                    },
                                },
                            ],
                        },
                        {
                            taskKey: 'OuterLoop',
                            defaultName: 'Outer loop ${outerLoopType}',
                            taskValues: {
                                outerLoopType: {
                                    value: 'Reactive limits',
                                    type: 'UNTYPED',
                                },
                            },
                            subReporters: [],
                            reports: [
                                {
                                    reportKey: 'switchPqPv',
                                    defaultMessage:
                                        '${pqToPvBuses} buses switched PQ -> PV ({blockedPqBuses} buses blocked PQ because have reach max number of switch)',
                                    values: {
                                        reportSeverity: {
                                            value: 'OLF_INFO',
                                            type: 'INFO_LOGLEVEL',
                                        },
                                        pqToPvBuses: {
                                            value: 1,
                                            type: 'UNTYPED',
                                        },
                                        blockedPqBuses: {
                                            value: 0,
                                            type: 'UNTYPED',
                                        },
                                    },
                                },
                            ],
                        },
                        {
                            taskKey: 'OuterLoop',
                            defaultName: 'Outer loop ${outerLoopType}',
                            taskValues: {
                                outerLoopType: {
                                    value: 'Distributed slack on load',
                                    type: 'UNTYPED',
                                },
                            },
                            subReporters: [],
                            reports: [
                                {
                                    reportKey: 'NoMismatchDistribution',
                                    defaultMessage:
                                        'Iteration ${iteration}: already balanced',
                                    values: {
                                        reportSeverity: {
                                            value: 'OLF_INFO',
                                            type: 'INFO_LOGLEVEL',
                                        },
                                        iteration: {
                                            value: 2,
                                            type: 'UNTYPED',
                                        },
                                    },
                                },
                            ],
                        },
                        {
                            taskKey: 'OuterLoop',
                            defaultName: 'Outer loop ${outerLoopType}',
                            taskValues: {
                                outerLoopType: {
                                    value: 'Reactive limits',
                                    type: 'UNTYPED',
                                },
                            },
                            subReporters: [],
                            reports: [],
                        },
                    ],
                    reports: [
                        {
                            reportKey: 'loadFlowCompleted',
                            defaultMessage:
                                'DC load flow completed (status=${lfStatus})',
                            values: {
                                lfStatus: {
                                    value: 'CONVERGED',
                                    type: 'UNTYPED',
                                },
                                reportSeverity: {
                                    value: 'OLF_INFO',
                                    type: 'INFO_LOGLEVEL',
                                },
                            },
                        },
                    ],
                },
            ],
            reports: [],
        },
    ],
    reports: [],
};
