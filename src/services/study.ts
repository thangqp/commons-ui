import { UUID } from 'crypto';
import { backendFetchJson } from './utils.ts';

const PREFIX_STUDY_QUERIES = import.meta.env.VITE_API_GATEWAY + '/study';

export function exportFilter(
    studyUuid: UUID,
    filterUuid?: UUID,
    token?: string
) {
    console.info('get filter export on study root node');
    return backendFetchJson(
        PREFIX_STUDY_QUERIES +
            '/v1/studies/' +
            studyUuid +
            '/filters/' +
            filterUuid +
            '/elements',
        {
            method: 'get',
            headers: { 'Content-Type': 'application/json' },
        },
        token
    );
}
