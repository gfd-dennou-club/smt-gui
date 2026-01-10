import PropTypes from 'prop-types';
import React from 'react';
import bindAll from 'lodash.bindall';
import {defineMessages, FormattedMessage, injectIntl, intlShape} from 'react-intl';

import Box from '../box/box.jsx';
import Modal from '../../containers/modal.jsx';

import styles from './mesh-domain-modal.css';

const messages = defineMessages({
    title: {
        defaultMessage: 'Mesh V2 Domain Settings',
        description: 'Title for the Mesh V2 domain modal',
        id: 'mesh.domainModalTitle'
    },
    domainPlaceholder: {
        defaultMessage: 'Enter domain name...',
        description: 'Placeholder text for domain input field',
        id: 'mesh.domainPlaceholder'
    },
    saveButton: {
        defaultMessage: 'Save',
        description: 'Label for save button',
        id: 'mesh.domainSaveButton'
    },
    cancelButton: {
        defaultMessage: 'Cancel',
        description: 'Label for cancel button',
        id: 'mesh.domainCancelButton'
    }
});

class MeshDomainModal extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleDomainChange',
            'handleSaveClick',
            'handleCancelClick',
            'handleKeyPress'
        ]);

        this.state = {
            domain: props.initialDomain || ''
        };
    }

    handleDomainChange (event) {
        this.setState({
            domain: event.target.value
        });
    }

    handleSaveClick () {
        this.props.onSave(this.state.domain.trim());
    }

    handleCancelClick () {
        this.props.onRequestClose();
    }

    handleKeyPress (event) {
        if (event.key === 'Enter') {
            this.handleSaveClick();
        }
    }

    render () {
        const {intl, onRequestClose} = this.props;
        const {domain} = this.state;

        return (
            <Modal
                className={styles.modalContent}
                contentLabel={intl.formatMessage(messages.title)}
                headerClassName={styles.header}
                id="meshDomainModal"
                onRequestClose={onRequestClose}
            >
                <Box className={styles.body}>
                    <Box className={styles.inputSection}>
                        <input
                            className={styles.domainInput}
                            type="text"
                            value={domain}
                            placeholder={intl.formatMessage(messages.domainPlaceholder)}
                            onChange={this.handleDomainChange}
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
                            className={styles.saveButton}
                            onClick={this.handleSaveClick}
                        >
                            <FormattedMessage
                                {...messages.saveButton}
                            />
                        </button>
                    </Box>
                </Box>
            </Modal>
        );
    }
}

MeshDomainModal.propTypes = {
    intl: intlShape.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    initialDomain: PropTypes.string
};

export default injectIntl(MeshDomainModal);
