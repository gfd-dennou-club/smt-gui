import PropTypes from 'prop-types';
import React from 'react';
import {defineMessages, injectIntl, intlShape} from 'react-intl';

import Box from '../box/box.jsx';
import Modal from '../../containers/modal.jsx';

import styles from './koshien-test-modal.css';

const messages = defineMessages({
    title: {
        defaultMessage: 'Test AI',
        description: 'Title for the Koshien test modal',
        id: 'gui.koshienTestModal.title'
    }
});

const KoshienTestModal = props => {
    const {intl, onRequestClose} = props;

    return (
        <Modal
            className={styles.modalContent}
            contentLabel={intl.formatMessage(messages.title)}
            fullScreen
            headerClassName={styles.header}
            id="koshienTestModal"
            onRequestClose={onRequestClose}
        >
            <Box className={styles.body}>
                <iframe
                    className={styles.iframe}
                    src="https://smalruby-koshien-web.netlab.jp/"
                    title={intl.formatMessage(messages.title)}
                />
            </Box>
        </Modal>
    );
};

KoshienTestModal.propTypes = {
    intl: intlShape.isRequired,
    onRequestClose: PropTypes.func.isRequired
};

export default injectIntl(KoshienTestModal);
