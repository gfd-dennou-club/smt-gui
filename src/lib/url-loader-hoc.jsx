import bindAll from 'lodash.bindall';
import React from 'react';
import PropTypes from 'prop-types';
import {defineMessages, intlShape, injectIntl} from 'react-intl';
import {connect} from 'react-redux';
import log from '../lib/log';
import sharedMessages from './shared-messages';

import {extractScratchProjectId} from './url-parser';

import {
    LoadingStates,
    getIsLoadingUpload,
    getIsShowingWithoutId,
    onFetchedProjectData,
    projectError,
    setProjectId,
    requestProjectUpload
} from '../reducers/project-state';
import {setProjectTitle} from '../reducers/project-title';
import {
    openLoadingProject,
    closeLoadingProject
} from '../reducers/modals';
import {
    closeFileMenu
} from '../reducers/menus';

const messages = defineMessages({
    loadError: {
        id: 'gui.urlLoader.loadError',
        defaultMessage: 'The project URL that was entered failed to load.',
        description: 'An error that displays when a project URL fails to load.'
    },
    invalidUrl: {
        id: 'gui.urlLoader.invalidUrl',
        defaultMessage: 'Please enter a valid Scratch project URL.',
        description: 'An error that displays when an invalid URL is entered.'
    },
    urlPrompt: {
        id: 'gui.urlLoader.urlPrompt',
        defaultMessage: 'Enter a Scratch project URL (e.g., https://scratch.mit.edu/projects/1209008277/):',
        description: 'Prompt for entering a project URL.'
    }
});

/**
 * Higher Order Component to provide behavior for loading project from URL into editor.
 * @param {React.Component} WrappedComponent the component to add URL loading functionality to
 * @returns {React.Component} WrappedComponent with URL loading functionality added
 *
 * <URLLoaderHOC>
 *     <WrappedComponent />
 * </URLLoaderHOC>
 */
const URLLoaderHOC = function (WrappedComponent) {
    class URLLoaderComponent extends React.Component {
        constructor (props) {
            super(props);
            console.log('[URLLoaderHOC] Constructor called');
            bindAll(this, [
                'handleStartSelectingUrlLoad',
                'handleUrlInput',
                'loadProjectFromUrl',
                'handleFinishedLoadingUpload'
            ]);
        }
        componentDidUpdate (prevProps) {
            if (this.props.isLoadingUpload && !prevProps.isLoadingUpload) {
                this.handleFinishedLoadingUpload();
            }
        }

        // Step 1: Start the URL loading process
        handleStartSelectingUrlLoad () {
            console.log('[URLLoaderHOC] handleStartSelectingUrlLoad called');
            this.handleUrlInput();
        }

        // Step 2: Prompt user for URL input
        handleUrlInput () {
            const {
                intl,
                isShowingWithoutId,
                loadingState,
                projectChanged,
                userOwnsProject
            } = this.props;

            const url = prompt(intl.formatMessage(messages.urlPrompt)); // eslint-disable-line no-alert

            if (!url) {
                // User cancelled
                this.props.closeFileMenu();
                return;
            }

            const projectId = extractScratchProjectId(url);
            if (!projectId) {
                alert(intl.formatMessage(messages.invalidUrl)); // eslint-disable-line no-alert
                this.props.closeFileMenu();
                return;
            }

            this.projectIdToLoad = projectId;
            this.projectUrlToLoad = url;

            // If user owns the project, or user has changed the project,
            // we must confirm with the user that they really intend to
            // replace it.
            let uploadAllowed = true;
            if (userOwnsProject || (projectChanged && isShowingWithoutId)) {
                uploadAllowed = confirm( // eslint-disable-line no-alert
                    intl.formatMessage(sharedMessages.replaceProjectWarning)
                );
            }

            if (uploadAllowed) {
                // Start the loading process
                this.props.requestProjectUpload(loadingState);
            }

            this.props.closeFileMenu();
        }

        // Step 3: Load project from URL (called from componentDidUpdate)
        handleFinishedLoadingUpload () {
            if (this.projectIdToLoad) {
                this.loadProjectFromUrl(this.projectIdToLoad);
                return;
            }
            this.props.cancelFileUpload(this.props.loadingState);
        }

        // Step 4: Actually load the project data
        loadProjectFromUrl (projectId) {
            this.props.onLoadingStarted();

            // Set project ID in Redux state first (like project-fetcher-hoc.jsx)
            this.props.setProjectId(projectId.toString());

            // Use the same approach as project-fetcher-hoc.jsx
            // First get the project token via the proxy API
            const options = {
                method: 'GET',
                uri: `https://api.smalruby.app/scratch-api-proxy/projects/${projectId}`,
                json: true
            };

            fetch(options.uri, {
                method: options.method,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    const projectToken = data.project_token;

                    // Now load the project using storage system (like project-fetcher-hoc.jsx)
                    const storage = this.props.vm.runtime.storage;
                    storage.setProjectToken(projectToken);

                    return storage.load(storage.AssetType.Project, projectId, storage.DataFormat.JSON);
                })
                .then(projectAsset => {
                    if (projectAsset) {
                        // Use onFetchedProjectData instead of direct VM loading
                        this.props.onFetchedProjectData(projectAsset.data, this.props.loadingState);

                        // Set project title based on the project data or URL
                        const projectTitle = `Project ${this.projectIdToLoad}`;
                        this.props.onSetProjectTitle(projectTitle);
                    } else {
                        throw new Error('Could not find project');
                    }
                })
                .catch(error => {
                    log.warn('URL loader error:', error);
                    this.props.onError(error);
                    alert(this.props.intl.formatMessage(messages.loadError)); // eslint-disable-line no-alert
                })
                .then(() => {
                    this.props.onLoadingFinished();
                    // Clear the project reference
                    this.projectIdToLoad = null;
                    this.projectUrlToLoad = null;
                });
        }

        render () {
            const {
                /* eslint-disable no-unused-vars */
                cancelFileUpload,
                closeFileMenu: closeFileMenuProp,
                isLoadingUpload,
                isShowingWithoutId,
                loadingState,
                onLoadingFinished,
                onLoadingStarted,
                onSetProjectTitle,
                projectChanged,
                requestProjectUpload: requestProjectUploadProp,
                userOwnsProject,
                onStartSelectingUrlLoad: onStartSelectingUrlLoadProp,
                /* eslint-enable no-unused-vars */
                ...componentProps
            } = this.props;
            console.log('[URLLoaderHOC] Rendering with onStartSelectingUrlLoad:', this.handleStartSelectingUrlLoad);
            return (
                <React.Fragment>
                    <WrappedComponent
                        onStartSelectingUrlLoad={this.handleStartSelectingUrlLoad}
                        {...componentProps}
                    />
                </React.Fragment>
            );
        }
    }

    URLLoaderComponent.propTypes = {
        canSave: PropTypes.bool,
        cancelFileUpload: PropTypes.func,
        closeFileMenu: PropTypes.func,
        intl: intlShape.isRequired,
        isLoadingUpload: PropTypes.bool,
        isShowingWithoutId: PropTypes.bool,
        loadingState: PropTypes.oneOf(LoadingStates),
        onError: PropTypes.func,
        onFetchedProjectData: PropTypes.func,
        onLoadingFinished: PropTypes.func,
        onLoadingStarted: PropTypes.func,
        onSetProjectTitle: PropTypes.func,
        onStartSelectingUrlLoad: PropTypes.func,
        projectChanged: PropTypes.bool,
        requestProjectUpload: PropTypes.func,
        setProjectId: PropTypes.func,
        userOwnsProject: PropTypes.bool,
        vm: PropTypes.shape({
            loadProject: PropTypes.func,
            runtime: PropTypes.shape({
                storage: PropTypes.object
            })
        })
    };

    const mapStateToProps = (state, ownProps) => {
        const loadingState = state.scratchGui.projectState.loadingState;
        const user = state.session && state.session.session && state.session.session.user;
        return {
            isLoadingUpload: getIsLoadingUpload(loadingState),
            isShowingWithoutId: getIsShowingWithoutId(loadingState),
            loadingState: loadingState,
            projectChanged: state.scratchGui.projectChanged,
            userOwnsProject: ownProps.authorUsername && user &&
                (ownProps.authorUsername === user.username),
            vm: state.scratchGui.vm
        };
    };

    const mapDispatchToProps = dispatch => ({
        cancelFileUpload: loadingState => dispatch(onFetchedProjectData(null, loadingState)),
        closeFileMenu: () => dispatch(closeFileMenu()),
        onError: error => dispatch(projectError(error)),
        onFetchedProjectData: (projectData, loadingState) =>
            dispatch(onFetchedProjectData(projectData, loadingState)),
        onLoadingFinished: () => {
            dispatch(closeLoadingProject());
            dispatch(closeFileMenu());
        },
        onLoadingStarted: () => dispatch(openLoadingProject()),
        onSetProjectTitle: title => dispatch(setProjectTitle(title)),
        requestProjectUpload: loadingState => dispatch(requestProjectUpload(loadingState)),
        setProjectId: projectId => dispatch(setProjectId(projectId))
    });

    const mergeProps = (stateProps, dispatchProps, ownProps) => Object.assign(
        {}, stateProps, dispatchProps, ownProps
    );

    return injectIntl(connect(
        mapStateToProps,
        mapDispatchToProps,
        mergeProps
    )(URLLoaderComponent));
};

export {
    URLLoaderHOC as default
};
