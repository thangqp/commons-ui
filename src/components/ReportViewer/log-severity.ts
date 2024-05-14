export type LogSeverity = {
    name: 'UNKNOWN' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL';
    level: number;
    colorName: string;
    colorHexCode: string;
};

export const LogSeverities: Record<string, LogSeverity> = {
    UNKNOWN: {
        name: 'UNKNOWN',
        level: 0,
        colorName: 'cornflowerblue',
        colorHexCode: '#6495ED',
    },
    INFO: {
        name: 'INFO',
        level: 1,
        colorName: 'mediumseagreen',
        colorHexCode: '#3CB371',
    },
    WARN: {
        name: 'WARN',
        level: 2,
        colorName: 'orange',
        colorHexCode: '#FFA500',
    },
    ERROR: {
        name: 'ERROR',
        level: 3,
        colorName: 'crimson',
        colorHexCode: '#DC143C',
    },
    FATAL: {
        name: 'FATAL',
        level: 4,
        colorName: 'mediumorchid',
        colorHexCode: '#BA55D3',
    },
};
