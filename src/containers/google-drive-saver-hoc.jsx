import bindAll from 'lodash.bindall';
import React from 'react';
import PropTypes from 'prop-types';
import {defineMessages, intlShape, injectIntl} from 'react-intl';
import {connect} from 'react-redux';
import log from '../lib/log';

import googleDriveAPI from '../lib/google-drive-api';
import {projectTitleInitialState} from '../reducers/project-title';
import {
    closeFileMenu
} from '../reducers/menus';

import RubyToBlocksConverterHOC from '../lib/ruby-to-blocks-converter-hoc.jsx';

const messages = defineMessages({
    uploadError: {
        id: 'gui.googleDriveSaver.uploadError',
        defaultMessage: 'Failed to upload project to Google Drive.',
        description: 'An error that displays when a Google Drive project upload fails.'
    },
    authError: {
        id: 'gui.googleDriveSaver.authError',
        defaultMessage: 'Failed to authenticate with Google Drive. Please try again.',
        description: 'An error that displays when Google Drive authentication fails.'
    },
    configError: {
        id: 'gui.googleDriveSaver.configError',
        defaultMessage: 'Google Drive is not configured. Please contact the administrator.',
        description: 'An error that displays when Google Drive API is not configured.'
    },
    uploadSuccess: {
        id: 'gui.googleDriveSaver.uploadSuccess',
        defaultMessage: 'Project successfully uploaded to Google Drive!',
        description: 'A message that displays when a project is successfully uploaded to Google Drive.'
    }
});

/**
 * Higher Order Component to provide behavior for saving projects to Google Drive.
 * @param {React.Component} WrappedComponent the component to add Google Drive saving functionality to
 * @returns {React.Component} WrappedComponent with Google Drive saving functionality added
 *
 * <GoogleDriveSaverHOC>
 *     <WrappedComponent />
 * </GoogleDriveSaverHOC>
 */
const GoogleDriveSaverHOC = function (WrappedComponent) {
    class GoogleDriveSaverComponent extends React.Component {
        constructor (props) {
            super(props);
            bindAll(this, [
                'handleStartSavingToGoogleDrive',
                'handleSaveToGoogleDrive',
                'handleCancelGoogleDriveSave',
                'getProjectFilename'
            ]);
            this.state = {
                showSaveDialog: false,
                isUploading: false
            };
        }

        /**
         * Get project filename from title
         * @returns {string} Filename with .sb3 extension
         */
        getProjectFilename () {
            let filenameTitle = this.props.projectTitle;
            if (!filenameTitle || filenameTitle.length === 0) {
                filenameTitle = projectTitleInitialState;
            }
            return `${filenameTitle.substring(0, 100)}.sb3`;
        }

        /**
         * Start Google Drive save process
         */
        handleStartSavingToGoogleDrive () {
            // Check if Google Drive is configured
            if (!googleDriveAPI.constructor.isConfigured()) {
                alert(this.props.intl.formatMessage(messages.configError)); // eslint-disable-line no-alert
                log.warn('Google Drive API is not configured');
                return;
            }

            // Close file menu
            this.props.closeFileMenu();

            // Show save dialog
            this.setState({showSaveDialog: true});
        }

        /**
         * Handle cancel Google Drive save dialog
         */
        handleCancelGoogleDriveSave () {
            this.setState({showSaveDialog: false});
        }

        /**
         * Handle save to Google Drive
         * @param {string} filename - File name
         * @param {string} folderId - Google Drive folder ID (null for My Drive root)
         */
        async handleSaveToGoogleDrive (filename, folderId) {
            // Close dialog
            this.setState({showSaveDialog: false, isUploading: true});

            try {
                // Convert Ruby code to blocks
                const converter = this.props.targetCodeToBlocks(this.props.intl);
                if (!converter.result) {
                    this.setState({isUploading: false});
                    return;
                }

                await converter.apply();

                // Generate project data
                const content = await this.props.saveProjectSb3();

                // Upload to Google Drive
                await googleDriveAPI.uploadFile(filename, content, folderId);

                this.setState({isUploading: false});

                // Show success message
                alert(this.props.intl.formatMessage(messages.uploadSuccess)); // eslint-disable-line no-alert
            } catch (error) {
                console.error('[GoogleDriveSaver] Upload failed:', error);
                log.error('Failed to upload project to Google Drive:', error);
                this.setState({isUploading: false});

                // Show error message
                const errorMessage = error && error.message ?
                    error.message :
                    this.props.intl.formatMessage(messages.uploadError);
                alert(errorMessage); // eslint-disable-line no-alert
            }
        }

        render () {
            const {
                /* eslint-disable no-unused-vars */
                closeFileMenu: closeFileMenuProp,
                intl,
                locale,
                projectTitle,
                saveProjectSb3,
                targetCodeToBlocks,
                /* eslint-enable no-unused-vars */
                ...componentProps
            } = this.props;

            return (
                <WrappedComponent
                    googleDriveSaveDialogVisible={this.state.showSaveDialog}
                    googleDriveUploading={this.state.isUploading}
                    intl={intl}
                    projectFilename={this.getProjectFilename()}
                    onCancelGoogleDriveSave={this.handleCancelGoogleDriveSave}
                    onSaveToGoogleDrive={this.handleSaveToGoogleDrive}
                    onStartSavingToGoogleDrive={this.handleStartSavingToGoogleDrive}
                    {...componentProps}
                />
            );
        }
    }

    GoogleDriveSaverComponent.propTypes = {
        closeFileMenu: PropTypes.func,
        intl: intlShape.isRequired,
        locale: PropTypes.string,
        projectTitle: PropTypes.string,
        saveProjectSb3: PropTypes.func,
        targetCodeToBlocks: PropTypes.func
    };

    const mapStateToProps = state => ({
        locale: state.locales.locale,
        projectTitle: state.scratchGui.projectTitle,
        saveProjectSb3: state.scratchGui.vm.saveProjectSb3.bind(state.scratchGui.vm)
    });

    const mapDispatchToProps = dispatch => ({
        closeFileMenu: () => dispatch(closeFileMenu())
    });

    return RubyToBlocksConverterHOC(injectIntl(connect(
        mapStateToProps,
        mapDispatchToProps
    )(GoogleDriveSaverComponent)));
};

export {
    GoogleDriveSaverHOC as default
};
