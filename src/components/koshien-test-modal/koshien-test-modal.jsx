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
    const [iframeKey, setIframeKey] = React.useState(0);
    const [loading, setLoading] = React.useState(true);

    const handleReload = React.useCallback(() => {
        setIframeKey(prevKey => prevKey + 1);
        setLoading(true);
    }, []);

    const handleStop = React.useCallback(() => {
        setLoading(false);
    }, []);

    const handleLoad = React.useCallback(() => {
        setLoading(false);
    }, []);

    return (
        <Modal
            className={styles.modalContent}
            contentLabel={intl.formatMessage(messages.title)}
            fullScreen
            headerClassName={styles.header}
            id="koshienTestModal"
            loading={loading}
            onReload={handleReload}
            onStop={handleStop}
            onRequestClose={onRequestClose}
        >
            <Box
                className={styles.body}
                grow={1}
            >
                <iframe
                    key={iframeKey}
                    className={styles.iframe}
                    src="https://smalruby-koshien-web.netlab.jp/"
                    title={intl.formatMessage(messages.title)}
                    onLoad={handleLoad}
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
