import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {defineMessages, FormattedMessage, injectIntl, intlShape} from 'react-intl';
import Modal from '../../containers/modal.jsx';
import Box from '../box/box.jsx';
import googleDriveAPI from '../../lib/google-drive-api';
import log from '../../lib/log';

import styles from './google-drive-save-dialog.css';

const messages = defineMessages({
    folderPickerTitle: {
        id: 'gui.googleDriveSaveDialog.folderPickerTitle',
        defaultMessage: 'Select a folder in Google Drive',
        description: 'Title for Google Drive folder picker dialog.'
    },
    folderPickerError: {
        id: 'gui.googleDriveSaveDialog.folderPickerError',
        defaultMessage: 'Failed to show folder picker. Please try again.',
        description: 'Error message when folder picker fails to show.'
    }
});

class GoogleDriveSaveDialog extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleFilenameChange',
            'handleLocationChange',
            'handleSelectFolder',
            'handleFolderPickerCallback',
            'handleReset',
            'handleSave',
            'handleCancel'
        ]);

        this.state = {
            filename: props.defaultFilename || '',
            saveLocation: 'my-drive', // 'my-drive' | 'select-folder'
            selectedFolderId: null,
            selectedFolderName: null
        };
    }

    componentDidUpdate (prevProps) {
        // Reset state when dialog is shown
        if (this.props.isVisible && !prevProps.isVisible) {
            this.setState({ // eslint-disable-line react/no-did-update-set-state
                filename: this.props.defaultFilename || '',
                saveLocation: 'my-drive',
                selectedFolderId: null,
                selectedFolderName: null
            });
        }
    }

    handleFilenameChange (e) {
        this.setState({filename: e.target.value});
    }

    handleLocationChange (e) {
        const value = e.target.value;
        this.setState({saveLocation: value});

        // If user selects "select-folder", show folder picker
        if (value === 'select-folder') {
            this.handleSelectFolder();
        }
    }

    async handleSelectFolder () {
        try {
            const title = this.props.intl.formatMessage(messages.folderPickerTitle);
            await googleDriveAPI.showFolderPicker(this.handleFolderPickerCallback, this.props.locale, title);
        } catch (error) {
            log.error('Failed to show folder picker:', error);
            alert(this.props.intl.formatMessage(messages.folderPickerError)); // eslint-disable-line no-alert
            // Reset to my-drive if folder picker fails
            this.setState({saveLocation: 'my-drive'});
        }
    }

    handleFolderPickerCallback (result) {
        if (result.cancelled) {
            // User cancelled folder picker, reset to my-drive
            this.setState({saveLocation: 'my-drive'});
            return;
        }

        if (result.error) {
            log.error('Folder picker error:', result.error);
            alert(result.error); // eslint-disable-line no-alert
            this.setState({saveLocation: 'my-drive'});
            return;
        }

        if (result.success) {
            const {folderId, folderName} = result;
            this.setState({
                selectedFolderId: folderId,
                selectedFolderName: folderName
            });
        }
    }

    handleReset () {
        this.setState({
            filename: this.props.defaultFilename || '',
            saveLocation: 'my-drive',
            selectedFolderId: null,
            selectedFolderName: null
        });
    }

    handleSave () {
        let filename = this.state.filename.trim();

        // Validate filename
        if (!filename) {
            alert(this.props.intl.formatMessage({ // eslint-disable-line no-alert
                id: 'gui.googleDriveSaveDialog.filenameRequired',
                defaultMessage: 'Please enter a filename.',
                description: 'Error message when filename is empty.'
            }));
            return;
        }

        // Ensure .sb3 extension
        if (!filename.endsWith('.sb3')) {
            filename = `${filename}.sb3`;
        }

        // Determine folder ID
        const folderId = this.state.saveLocation === 'select-folder' ?
            this.state.selectedFolderId :
            null;

        // Call save handler
        this.props.onSave(filename, folderId);
    }

    handleCancel () {
        this.props.onCancel();
    }

    render () {
        if (!this.props.isVisible) {
            return null;
        }

        const locationLabel = this.state.saveLocation === 'select-folder' && this.state.selectedFolderName ?
            this.state.selectedFolderName :
            null;

        return (
            <Modal
                className={styles.modalContent}
                contentLabel={this.props.intl.formatMessage({
                    id: 'gui.googleDriveSaveDialog.title',
                    defaultMessage: 'Save to Google Drive',
                    description: 'Title for save to Google Drive dialog.'
                })}
                onRequestClose={this.handleCancel}
            >
                <Box className={styles.body}>
                    <Box className={styles.header}>
                        <FormattedMessage
                            defaultMessage="Save to Google Drive"
                            description="Header for save to Google Drive dialog"
                            id="gui.googleDriveSaveDialog.header"
                        />
                    </Box>

                    <Box className={styles.content}>
                        <Box className={styles.formRow}>
                            <label
                                className={styles.label}
                                htmlFor="filename"
                            >
                                <FormattedMessage
                                    defaultMessage="名前を付けて保存:"
                                    description="Label for filename input"
                                    id="gui.googleDriveSaveDialog.filenameLabel"
                                />
                            </label>
                            <input
                                className={styles.input}
                                id="filename"
                                type="text"
                                value={this.state.filename}
                                onChange={this.handleFilenameChange}
                            />
                        </Box>

                        <Box className={styles.formRow}>
                            <label
                                className={styles.label}
                                htmlFor="filetype"
                            >
                                <FormattedMessage
                                    defaultMessage="タイプ:"
                                    description="Label for file type"
                                    id="gui.googleDriveSaveDialog.typeLabel"
                                />
                            </label>
                            <input
                                className={styles.input}
                                disabled
                                id="filetype"
                                readOnly
                                type="text"
                                value="Scratch 3.0 Project (.sb3)"
                            />
                        </Box>

                        <Box className={styles.formRow}>
                            <label
                                className={styles.label}
                                htmlFor="location"
                            >
                                <FormattedMessage
                                    defaultMessage="Where:"
                                    description="Label for save location"
                                    id="gui.googleDriveSaveDialog.whereLabel"
                                />
                            </label>
                            <select
                                className={styles.select}
                                id="location"
                                value={this.state.saveLocation}
                                onChange={this.handleLocationChange}
                            >
                                <option value="my-drive">
                                    <FormattedMessage
                                        defaultMessage="Google ドライブ – My Drive"
                                        description="Option for saving to My Drive root"
                                        id="gui.googleDriveSaveDialog.myDrive"
                                    />
                                </option>
                                <option value="select-folder">
                                    <FormattedMessage
                                        defaultMessage="Google ドライブ – フォルダを選択する..."
                                        description="Option for selecting a folder"
                                        id="gui.googleDriveSaveDialog.selectFolder"
                                    />
                                </option>
                            </select>
                            {locationLabel && (
                                <Box className={styles.selectedFolder}>
                                    <FormattedMessage
                                        defaultMessage="Selected: {folderName}"
                                        description="Shows selected folder name"
                                        id="gui.googleDriveSaveDialog.selectedFolder"
                                        values={{folderName: locationLabel}}
                                    />
                                </Box>
                            )}
                        </Box>
                    </Box>

                    <Box className={styles.footer}>
                        <button
                            className={styles.cancelButton}
                            onClick={this.handleCancel}
                        >
                            <FormattedMessage
                                defaultMessage="キャンセル"
                                description="Cancel button"
                                id="gui.googleDriveSaveDialog.cancel"
                            />
                        </button>
                        <button
                            className={styles.resetButton}
                            onClick={this.handleReset}
                        >
                            <FormattedMessage
                                defaultMessage="リセット"
                                description="Reset button"
                                id="gui.googleDriveSaveDialog.reset"
                            />
                        </button>
                        <button
                            className={styles.saveButton}
                            onClick={this.handleSave}
                        >
                            <FormattedMessage
                                defaultMessage="保存"
                                description="Save button"
                                id="gui.googleDriveSaveDialog.save"
                            />
                        </button>
                    </Box>
                </Box>
            </Modal>
        );
    }
}

GoogleDriveSaveDialog.propTypes = {
    defaultFilename: PropTypes.string,
    intl: intlShape.isRequired,
    isVisible: PropTypes.bool,
    locale: PropTypes.string,
    onCancel: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired
};

GoogleDriveSaveDialog.defaultProps = {
    defaultFilename: 'project.sb3',
    isVisible: false,
    locale: 'en'
};

export default injectIntl(GoogleDriveSaveDialog);
