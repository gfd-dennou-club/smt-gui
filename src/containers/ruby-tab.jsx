import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage, injectIntl, intlShape} from 'react-intl';
import {connect} from 'react-redux';
import Editor from '@monaco-editor/react';
import {
    rubyCodeShape,
    updateRubyCode,
    updateRubyCodeTarget
} from '../reducers/ruby-code';
import VM from 'scratch-vm';
import {BLOCKS_TAB_INDEX} from '../reducers/editor-tab';

import RubyToBlocksConverterHOC from '../lib/ruby-to-blocks-converter-hoc.jsx';

import rubyIcon from './ruby-tab/icon--ruby.svg';
import RubyDownloader from './ruby-downloader.jsx';
import collectMetadata from '../lib/collect-metadata.js';
import {closeFileMenu} from '../reducers/menus.js';
import {setAiSaveStatus, clearAiSaveStatus} from '../reducers/koshien-file';
import styles from './ruby-tab/ruby-tab.css';
import ReactTooltip from 'react-tooltip';

class RubyTab extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleEditorDidMount',
            'handleEditorChange',
            'getSaveToComputerHandler',
            'getSaveAIHandler',
            'handleAISaveFinished',
            'handleAISaveError'
        ]);
        this.mainTooltipId = 'ruby-downloader-tooltip';
        this.editorRef = null;
    }

    componentDidUpdate (prevProps) {
        let modified = this.props.rubyCode.modified;
        if (modified) {
            const targetId = this.props.rubyCode.target ? this.props.rubyCode.target.id : null;
            const changedTarget =
                  this.props.vm.editingTarget && this.props.rubyCode.target &&
                  this.props.vm.editingTarget.id !== targetId;
            if (changedTarget || this.props.blocksTabVisible) {
                const converter = this.props.targetCodeToBlocks(this.props.intl);
                if (converter.result) {
                    converter.apply().then(() => {
                        modified = false;

                        if (!modified) {
                            if ((this.props.isVisible && !prevProps.isVisible) ||
                                (this.props.editingTarget && this.props.editingTarget !== prevProps.editingTarget)) {
                                this.props.updateRubyCodeTargetState(this.props.vm.editingTarget);
                            }
                        }

                        if (this.props.isVisible && !prevProps.isVisible) {
                            if (this.editorRef) {
                                this.editorRef.focus();
                            }
                        }
                    });
                    return;
                }
                const error = converter.errors[0];
                if (this.editorRef) {
                    this.editorRef.setPosition({lineNumber: error.row + 1, column: error.column + 1});
                    this.editorRef.focus();
                }
            }
        }

        if (!modified) {
            if ((this.props.isVisible && !prevProps.isVisible) ||
                (this.props.editingTarget && this.props.editingTarget !== prevProps.editingTarget)) {
                this.props.updateRubyCodeTargetState(this.props.vm.editingTarget);
            }
        }

        if (this.props.isVisible && !prevProps.isVisible) {
            if (this.editorRef) {
                this.editorRef.focus();
            }
        }
    }

    handleEditorDidMount (editor) {
        this.editorRef = editor;
    }

    handleEditorChange (value) {
        this.props.onChange(value);
    }

    getSaveToComputerHandler (downloadProjectCallback) {
        return () => {
            this.props.onRequestCloseFile();
            downloadProjectCallback();
            if (this.props.onProjectTelemetryEvent) {
                const metadata = collectMetadata(this.props.vm, this.props.projectTitle, this.props.locale);
                this.props.onProjectTelemetryEvent('projectDidSave', metadata);
            }
        };
    }

    getSaveAIHandler (downloadProjectCallback) {
        return () => {
            // Set AI save status to 'saving'
            this.props.onSetAiSaveStatus('saving');
            // Call download callback
            downloadProjectCallback();
        };
    }

    handleAISaveFinished () {
        // Set AI save status to 'saved'
        this.props.onSetAiSaveStatus('saved');
        // Clear status after 3 seconds
        setTimeout(() => {
            this.props.onClearAiSaveStatus();
        }, 3000);
    }

    handleAISaveError () {
        // Clear AI save status
        this.props.onClearAiSaveStatus();
    }

    render () {
        const {
            rubyCode
        } = this.props;
        const {
            code
        } = rubyCode;

        return (
            <>
                <div
                    style={{
                        border: '1px solid hsla(0, 0%, 0%, 0.15)',
                        borderBottomRightRadius: '0.5rem',
                        borderTopRightRadius: '0.5rem',
                        height: '100%',
                        width: '100%'
                    }}
                >
                    <Editor
                        height="100%"
                        language="ruby"
                        onMount={this.handleEditorDidMount}
                        onChange={this.handleEditorChange}
                        options={{
                            automaticLayout: true,
                            fontSize: 16,
                            fontFamily: 'Monaco, Menlo, Consolas, "source-code-pro", monospace',
                            minimap: {enabled: false},
                            renderWhitespace: 'all',
                            scrollBeyondLastLine: false,
                            tabSize: 2
                        }}
                        theme="vs"
                        value={code}
                        width="100%"
                    />
                </div>
                <div className={styles.wrapper}>
                    <RubyDownloader
                        onSaveError={this.handleAISaveError}
                        onSaveFinished={this.handleAISaveFinished}
                    >
                        {(_, downloadProjectCallback) => (
                            <button
                                className={styles.button}
                                onClick={this.getSaveAIHandler(downloadProjectCallback)}
                                data-tip
                                data-for={'ruby-downloader-tooltip'}
                            >
                                <img
                                    src={rubyIcon}
                                    alt="ruby download"
                                    className={styles.img}
                                />

                            </button>
                        )}
                    </RubyDownloader>
                    <ReactTooltip
                        id={this.mainTooltipId}
                        place="left"
                        effect="solid"
                        className={styles.tooltip}
                    >
                        <FormattedMessage
                            defaultMessage="Download Ruby code to your compute"
                            description="Menu bar item for downloading Ruby code to your computer"
                            id="gui.smalruby3.menuBar.downloadRubyCodeToComputer"
                        />
                    </ReactTooltip>
                </div>
            </>
        );
    }
}

RubyTab.propTypes = {
    blocksTabVisible: PropTypes.bool,
    editingTarget: PropTypes.string,
    intl: intlShape.isRequired,
    isVisible: PropTypes.bool,
    onChange: PropTypes.func,
    onRequestCloseFile: PropTypes.func,
    onProjectTelemetryEvent: PropTypes.func,
    onSetAiSaveStatus: PropTypes.func,
    onClearAiSaveStatus: PropTypes.func,
    rubyCode: rubyCodeShape,
    targetCodeToBlocks: PropTypes.func,
    updateRubyCodeTargetState: PropTypes.func,
    vm: PropTypes.instanceOf(VM).isRequired,
    projectTitle: PropTypes.string,
    locale: PropTypes.string
};

const mapStateToProps = state => ({
    blocksTabVisible: state.scratchGui.editorTab.activeTabIndex === BLOCKS_TAB_INDEX,
    editingTarget: state.scratchGui.targets.editingTarget,
    rubyCode: state.scratchGui.rubyCode,
    vm: state.scratchGui.vm,
    projectTitle: state.scratchGui.projectTitle,
    locale: state.locales.local
});

const mapDispatchToProps = dispatch => ({
    onChange: code => dispatch(updateRubyCode(code)),
    updateRubyCodeTargetState: target => dispatch(updateRubyCodeTarget(target)),
    onRequestCloseFile: () => dispatch(closeFileMenu()),
    onSetAiSaveStatus: status => dispatch(setAiSaveStatus(status)),
    onClearAiSaveStatus: () => dispatch(clearAiSaveStatus())
});

export default RubyToBlocksConverterHOC(injectIntl(connect(
    mapStateToProps,
    mapDispatchToProps
)(RubyTab)));
