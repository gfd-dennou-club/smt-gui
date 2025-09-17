import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import bindAll from 'lodash.bindall';
import {defineMessages, FormattedMessage, injectIntl, intlShape} from 'react-intl';

import Box from '../box/box.jsx';
import Modal from '../../containers/modal.jsx';
import urlLoaderIcon from './url-loader-icon.svg';

import styles from './url-loader-modal.css';

const messages = defineMessages({
    title: {
        defaultMessage: 'Load from URL',
        description: 'Title for the URL loader modal',
        id: 'gui.urlLoader.title'
    },
    prompt: {
        defaultMessage: 'Enter a Scratch project URL (e.g., https://scratch.mit.edu/projects/1209008277/):',
        description: 'Prompt message for URL input',
        id: 'gui.urlLoader.urlPrompt'
    },
    urlPlaceholder: {
        defaultMessage: 'https://scratch.mit.edu/projects/1234567890/',
        description: 'Placeholder text for URL input field',
        id: 'gui.urlLoader.urlPlaceholder'
    },
    openButton: {
        defaultMessage: 'Open',
        description: 'Label for open button',
        id: 'gui.urlLoader.openButton'
    },
    cancelButton: {
        defaultMessage: 'Cancel',
        description: 'Label for cancel button',
        id: 'gui.urlLoader.cancelButton'
    }
});

class URLLoaderModal extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleUrlChange',
            'handleOpenClick',
            'handleCancelClick',
            'handleKeyPress'
        ]);

        this.state = {
            url: ''
        };
    }

    handleUrlChange (event) {
        this.setState({url: event.target.value});
    }

    handleOpenClick () {
        const {url} = this.state;
        if (url.trim()) {
            this.props.onLoadUrl(url.trim());
        }
    }

    handleCancelClick () {
        this.props.onRequestClose();
    }

    handleKeyPress (event) {
        if (event.key === 'Enter') {
            this.handleOpenClick();
        }
    }

    render () {
        const {intl, onRequestClose} = this.props;
        const {url} = this.state;

        return (
            <Modal
                className={styles.modalContent}
                contentLabel={intl.formatMessage(messages.title)}
                headerClassName={styles.header}
                headerImage={urlLoaderIcon}
                id="urlLoaderModal"
                onRequestClose={onRequestClose}
            >
                <Box className={styles.body}>
                    <Box className={styles.promptSection}>
                        <div className={styles.promptText}>
                            <FormattedMessage
                                {...messages.prompt}
                            />
                        </div>
                    </Box>

                    <Box className={styles.inputSection}>
                        <input
                            className={styles.urlInput}
                            type="text"
                            value={url}
                            placeholder={intl.formatMessage(messages.urlPlaceholder)}
                            onChange={this.handleUrlChange}
                            onKeyPress={this.handleKeyPress}
                            autoFocus
                        />
                    </Box>

                    <Box className={styles.buttonSection}>
                        <button
                            className={styles.cancelButton}
                            onClick={this.handleCancelClick}
                        >
                            <FormattedMessage
                                {...messages.cancelButton}
                            />
                        </button>
                        <button
                            className={classNames(styles.openButton, {
                                [styles.disabled]: !url.trim()
                            })}
                            onClick={this.handleOpenClick}
                            disabled={!url.trim()}
                        >
                            <FormattedMessage
                                {...messages.openButton}
                            />
                        </button>
                    </Box>
                </Box>
            </Modal>
        );
    }
}

URLLoaderModal.propTypes = {
    intl: intlShape.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    onLoadUrl: PropTypes.func.isRequired
};

export default injectIntl(URLLoaderModal);
