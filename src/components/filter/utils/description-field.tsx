/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { useState } from 'react';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Divider,
    Grid,
    Theme,
    Typography,
} from '@mui/material';
import { ExpandCircleDown, ExpandMore } from '@mui/icons-material';
import { FormattedMessage } from 'react-intl';
import { FieldConstants } from '../../../utils/field-constants';
import ExpandingTextField from '../../inputs/react-hook-form/ExpandingTextField';

export const styles = {
    descriptionForm: (theme: Theme) => ({
        marginTop: theme.spacing(1),
    }),
    descriptionAccordion: (theme: Theme) => ({
        '&:before': {
            display: 'none',
        },
        background: 'none',
    }),
    descriptionAccordionSummary: (theme: Theme) => ({
        flexDirection: 'row-reverse',
        '& .MuiAccordionSummary-expandIconWrapper': {
            transform: 'rotate(-90deg)',
        },
        '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
            transform: 'rotate(0deg)',
        },
    }),
};

export const DescriptionField = () => {
    const [showDescription, setShowDescription] = useState(false);
    const [mouseHover, setMouseHover] = useState(false);

    return (
        <>
            <Grid item xs={12} sx={styles.descriptionForm}>
                <Accordion
                    sx={styles.descriptionAccordion}
                    disableGutters
                    elevation={0}
                    expanded={showDescription}
                    onChange={(event, showed) => setShowDescription(showed)}
                >
                    <AccordionSummary
                        sx={styles.descriptionAccordionSummary}
                        expandIcon={
                            mouseHover ? <ExpandCircleDown /> : <ExpandMore />
                        }
                        onMouseEnter={(event) => setMouseHover(true)}
                        onMouseLeave={(event) => setMouseHover(false)}
                    >
                        <Typography
                            sx={{
                                width: '50%',
                                flexShrink: 0,
                                marginLeft: '5px',
                            }}
                        >
                            <FormattedMessage id={'Description'} />
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <ExpandingTextField
                            name={FieldConstants.DESCRIPTION}
                            minRows={3}
                            rows={5}
                        />
                    </AccordionDetails>
                </Accordion>
            </Grid>
            {!showDescription && (
                <Grid item xs={12}>
                    <Divider />
                </Grid>
            )}
        </>
    );
};
