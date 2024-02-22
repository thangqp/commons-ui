import { Button, ButtonProps } from '@mui/material';
import { UUID } from 'crypto';
import { FunctionComponent } from 'react';

interface TestProps {
    studyUuid: UUID;
    openVoltageLevelDiagram: (voltageLevelId: string) => string;
    disabled: boolean;
    view: string;
    formProps: ButtonProps;
}

//TODO FM to remove (for the review)
export const Test: FunctionComponent<TestProps> = (props) => {
    return <Button {...props.formProps} />;
};
