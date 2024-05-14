export interface Report {
    taskKey: string;
    defaultName: string;
    taskValues: Record<string, ReportValue>;
    subReporters: Report[];
    reports: SubReport[];
}

export interface SubReport {
    reportKey: string;
    defaultMessage: string;
    values: Record<string, ReportValue>;
}

export interface ReportValue {
    value: string | number;
    type: unknown;
}
