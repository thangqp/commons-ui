import { FormattedMessage } from 'react-intl';

const FieldLabel = ({ label, optional, values = undefined }) => {
    return (
        <>
            <FormattedMessage id={label} values={values} />
            {optional && <FormattedMessage id="Optional" />}
        </>
    );
};

export default FieldLabel;
