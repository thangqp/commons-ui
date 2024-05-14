export interface Report {
    taskKey: string;
    defaultName: string;
    taskValues: Record<string, unknown>;
    subReporters: Report[];
}
