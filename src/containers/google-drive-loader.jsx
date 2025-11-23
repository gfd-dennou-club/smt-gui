import bindAll from 'lodash.bindall';
import React from 'react';
import PropTypes from 'prop-types';
import {defineMessages, intlShape, injectIntl} from 'react-intl';
import {connect} from 'react-redux';
import log from '../lib/log';

import googleDriveAPI from '../lib/google-drive-api';
import {
    LoadingStates,
    getIsLoadingUpload,
    onLoadedProject,
    requestProjectUpload
} from '../reducers/project-state';
import {setProjectTitle} from '../reducers/project-title';
import {
    openLoadingProject,
    closeLoadingProject
} from '../reducers/modals';

const messages = defineMessages({
    loadError: {
        id: 'gui.googleDriveLoader.loadError',
        defaultMessage: 'Failed to load project from Google Drive.',
        description: 'An error that displays when a Google Drive project file fails to load.'
    },
    authError: {
        id: 'gui.googleDriveLoader.authError',
        defaultMessage: 'Failed to authenticate with Google Drive. Please try again.',
        description: 'An error that displays when Google Drive authentication fails.'
    },
    configError: {
        id: 'gui.googleDriveLoader.configError',
        defaultMessage: 'Google Drive is not configured. Please contact the administrator.',
        description: 'An error that displays when Google Drive API is not configured.'
    }
});

/**
 * Higher Order Component to provide behavior for loading projects from Google Drive.
 * @param {React.Component} WrappedComponent the component to add Google Drive loading functionality to
 * @returns {React.Component} WrappedComponent with Google Drive loading functionality added
 *
 * <GoogleDriveLoaderHOC>
 *     <WrappedComponent />
 * </GoogleDriveLoaderHOC>
 */
const GoogleDriveLoaderHOC = function (WrappedComponent) {
    class GoogleDriveLoaderComponent extends React.Component {
        constructor (props) {
            super(props);
            bindAll(this, [
                'handleStartSelectingGoogleDrive',
                'handlePickerCallback',
                'handleFinishedLoadingUpload',
                'getProjectTitleFromFilename'
            ]);
        }

        componentDidUpdate (prevProps) {
            if (this.props.isLoadingUpload && !prevProps.isLoadingUpload) {
                this.handleFinishedLoadingUpload();
            }
        }

        /**
         * Start Google Drive file selection process
         */
        handleStartSelectingGoogleDrive () {
            // Check if Google Drive is configured
            if (!googleDriveAPI.constructor.isConfigured()) {
                alert(this.props.intl.formatMessage(messages.configError)); // eslint-disable-line no-alert
                log.warn('Google Drive API is not configured');
                return;
            }

            // Show loading modal while initializing
            this.props.onShowLoadingProject();

            // Initialize and show Google Picker
            googleDriveAPI.showPicker(this.handlePickerCallback)
                .catch(error => {
                    log.error('Failed to show Google Picker:', error);
                    this.props.onCloseLoadingProject();
                    alert(this.props.intl.formatMessage(messages.authError)); // eslint-disable-line no-alert
                });
        }

        /**
         * Handle Google Picker callback
         * @param {object} result - Picker result
         */
        handlePickerCallback (result) {
            if (result.cancelled) {
                // User cancelled picker
                this.props.onCloseLoadingProject();
                return;
            }

            if (result.error) {
                // Error occurred
                log.error('Google Drive picker error:', result.error);
                this.props.onCloseLoadingProject();
                alert(result.error); // eslint-disable-line no-alert
                return;
            }

            if (result.success) {
                // File selected and downloaded successfully
                const {fileName, fileData} = result;

                // Update project title
                const projectTitle = this.getProjectTitleFromFilename(fileName);
                this.props.onSetProjectTitle(projectTitle);

                // Convert ArrayBuffer to Uint8Array
                const content = new Uint8Array(fileData);

                // Load the project
                this.props.onLoadingStarted();
                this.props.vm.loadProject(content)
                    .then(() => {
                        this.props.onLoadingFinished(this.props.loadingState, true);
                        this.props.onCloseLoadingProject();
                    })
                    .catch(error => {
                        log.error('Failed to load project from Google Drive:', error);
                        this.props.onCloseLoadingProject();
                        alert(this.props.intl.formatMessage(messages.loadError)); // eslint-disable-line no-alert
                    });
            }
        }

        /**
         * Extract project title from filename
         * @param {string} filename - File name
         * @returns {string} Project title
         */
        getProjectTitleFromFilename (filename) {
            return filename.replace(/\.sb3$/, '');
        }

        /**
         * Handle finished loading upload
         */
        handleFinishedLoadingUpload () {
            this.props.onLoadingFinished(this.props.loadingState, true);
        }

        render () {
            const {
                /* eslint-disable no-unused-vars */
                intl,
                isLoadingUpload,
                loadingState,
                onCloseLoadingProject,
                onLoadingFinished,
                onLoadingStarted,
                onSetProjectTitle,
                onShowLoadingProject,
                vm,
                /* eslint-enable no-unused-vars */
                ...componentProps
            } = this.props;

            return (
                <WrappedComponent
                    onStartSelectingGoogleDrive={this.handleStartSelectingGoogleDrive}
                    {...componentProps}
                />
            );
        }
    }

    GoogleDriveLoaderComponent.propTypes = {
        intl: intlShape.isRequired,
        isLoadingUpload: PropTypes.bool,
        loadingState: PropTypes.oneOf(LoadingStates),
        onCloseLoadingProject: PropTypes.func,
        onLoadingFinished: PropTypes.func,
        onLoadingStarted: PropTypes.func,
        onSetProjectTitle: PropTypes.func,
        onShowLoadingProject: PropTypes.func,
        vm: PropTypes.shape({
            loadProject: PropTypes.func
        })
    };

    const mapStateToProps = state => ({
        isLoadingUpload: getIsLoadingUpload(state.scratchGui.projectState.loadingState),
        loadingState: state.scratchGui.projectState.loadingState,
        vm: state.scratchGui.vm
    });

    const mapDispatchToProps = dispatch => ({
        onCloseLoadingProject: () => dispatch(closeLoadingProject()),
        onLoadingFinished: (loadingState, success) => {
            dispatch(onLoadedProject(loadingState, false, success));
            dispatch(closeLoadingProject());
        },
        onLoadingStarted: () => dispatch(requestProjectUpload(LoadingStates.LOADING_VM_FILE_UPLOAD)),
        onSetProjectTitle: title => dispatch(setProjectTitle(title)),
        onShowLoadingProject: () => dispatch(openLoadingProject())
    });

    return injectIntl(connect(
        mapStateToProps,
        mapDispatchToProps
    )(GoogleDriveLoaderComponent));
};

export {
    GoogleDriveLoaderHOC as default
};
