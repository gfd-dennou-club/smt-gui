import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import bindAll from 'lodash.bindall';
import {defineMessages, FormattedMessage, injectIntl, intlShape} from 'react-intl';
import VMScratchBlocks from '../../lib/blocks';

import Box from '../box/box.jsx';
import Modal from '../../containers/modal.jsx';

import styles from './block-display-modal.css';

const messages = defineMessages({
    title: {
        defaultMessage: 'Block Display Settings',
        description: 'Title for the block display settings modal',
        id: 'gui.smalruby3.blockDisplayModal.title'
    },
    alwaysVisible: {
        defaultMessage: 'Always visible',
        description: 'Label for categories that are always visible',
        id: 'gui.smalruby3.blockDisplayModal.alwaysVisible'
    }
});

// Define block categories with their IDs and ScratchBlocks.Msg keys
const BLOCK_CATEGORIES = [
    {id: 'motion', messageKey: 'CATEGORY_MOTION'},
    {id: 'looks', messageKey: 'CATEGORY_LOOKS'},
    {id: 'sound', messageKey: 'CATEGORY_SOUND'},
    {id: 'events', messageKey: 'CATEGORY_EVENTS'},
    {id: 'control', messageKey: 'CATEGORY_CONTROL'},
    {id: 'sensing', messageKey: 'CATEGORY_SENSING'},
    {id: 'operators', messageKey: 'CATEGORY_OPERATORS'}
];

const ALWAYS_VISIBLE_CATEGORIES = [
    {id: 'variables', messageKey: 'CATEGORY_VARIABLES'},
    {id: 'myBlocks', messageKey: 'CATEGORY_MYBLOCKS'},
    {id: 'extensions', messageId: 'gui.smalruby3.blockDisplayModal.extensions'}
];

// Define blocks for each category based on make-toolbox-xml.js
const CATEGORY_BLOCKS = {
    motion: [
        'motion_movesteps',
        'motion_turnright',
        'motion_turnleft',
        'motion_goto',
        'motion_gotoxy',
        'motion_glideto',
        'motion_glidesecstoxy',
        'motion_pointindirection',
        'motion_pointtowards',
        'motion_changexby',
        'motion_setx',
        'motion_changeyby',
        'motion_sety',
        'motion_ifonedgebounce',
        'motion_setrotationstyle'
    ],
    looks: [
        'looks_sayforsecs',
        'looks_say',
        'looks_thinkforsecs',
        'looks_think',
        'looks_switchbackdropto',
        'looks_switchbackdroptoandwait',
        'looks_nextbackdrop',
        'looks_switchcostumeto',
        'looks_nextcostume',
        'looks_changesizeby',
        'looks_setsizeto',
        'looks_changeeffectby',
        'looks_seteffectto',
        'looks_cleargraphiceffects',
        'looks_show',
        'looks_hide',
        'looks_gotofrontback',
        'looks_goforwardbackwardlayers'
    ],
    sound: [
        'sound_playuntildone',
        'sound_play',
        'sound_stopallsounds',
        'sound_changeeffectby',
        'sound_seteffectto',
        'sound_cleareffects',
        'sound_changevolumeby',
        'sound_setvolumeto'
    ],
    events: [
        'event_whenflagclicked',
        'event_whenkeypressed',
        'event_whenthisspriteclicked',
        'event_whenbackdropswitchesto',
        'event_whengreaterthan',
        'event_whenbroadcastreceived',
        'event_broadcast',
        'event_broadcastandwait'
    ],
    control: [
        'control_wait',
        'control_repeat',
        'control_forever',
        'control_if',
        'control_if_else',
        'control_wait_until',
        'control_repeat_until',
        'control_stop',
        'control_start_as_clone',
        'control_create_clone_of',
        'control_delete_this_clone'
    ],
    sensing: [
        'sensing_touchingobject',
        'sensing_touchingcolor',
        'sensing_coloristouchingcolor',
        'sensing_distanceto',
        'sensing_askandwait',
        'sensing_answer',
        'sensing_keypressed',
        'sensing_mousedown',
        'sensing_mousex',
        'sensing_mousey',
        'sensing_setdragmode',
        'sensing_loudness',
        'sensing_timer',
        'sensing_resettimer',
        'sensing_of',
        'sensing_current',
        'sensing_dayssince2000',
        'sensing_username'
    ],
    operators: [
        'operator_add',
        'operator_subtract',
        'operator_multiply',
        'operator_divide',
        'operator_random',
        'operator_gt',
        'operator_lt',
        'operator_equals',
        'operator_and',
        'operator_or',
        'operator_not',
        'operator_join',
        'operator_letter_of',
        'operator_length',
        'operator_contains',
        'operator_mod',
        'operator_round',
        'operator_mathop'
    ]
};

// Convert block type to ScratchBlocks.Msg key
const getBlockMessageKey = blockType => blockType.toUpperCase();

class BlockDisplayModal extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleCategoryChange',
            'handleBlockChange',
            'handleCategorySelect',
            'handlePrevious',
            'handleNext'
        ]);
        
        this.state = {
            selectedCategoryIndex: 0
        };
        
        // Initialize ScratchBlocks if not already done
        if (!this.ScratchBlocks && props.vm) {
            this.ScratchBlocks = VMScratchBlocks(props.vm, false);
        }
    }

    handleCategoryChange (event) {
        const categoryId = event.target.getAttribute('data-category');
        const isChecked = event.target.checked;
        
        // Find the category index for the clicked category
        const categoryIndex = BLOCK_CATEGORIES.findIndex(category => category.id === categoryId);
        
        // Update the selected category to sync the right pane
        if (categoryIndex !== -1) {
            this.setState({selectedCategoryIndex: categoryIndex});
        }
        
        this.props.onCategoryChange(categoryId, isChecked);
    }
    
    handleBlockChange (event) {
        const blockId = event.target.getAttribute('data-block');
        const categoryId = event.target.getAttribute('data-category');
        const isChecked = event.target.checked;
        this.props.onBlockChange(categoryId, blockId, isChecked);
    }
    
    handleCategorySelect (event) {
        const categoryIndex = parseInt(event.currentTarget.getAttribute('data-category-index'), 10);
        this.setState({selectedCategoryIndex: categoryIndex});
    }
    
    handlePrevious () {
        const {selectedCategoryIndex} = this.state;
        if (selectedCategoryIndex > 0) {
            this.setState({selectedCategoryIndex: selectedCategoryIndex - 1});
        }
    }
    
    handleNext () {
        const {selectedCategoryIndex} = this.state;
        if (selectedCategoryIndex < BLOCK_CATEGORIES.length - 1) {
            this.setState({selectedCategoryIndex: selectedCategoryIndex + 1});
        }
    }
    
    getCategoryCheckboxState (categoryId) {
        const {selectedBlocks} = this.props;
        const allBlocksInCategory = CATEGORY_BLOCKS[categoryId] || [];
        const selectedBlocksInCategory = selectedBlocks[categoryId] || [];
        
        if (selectedBlocksInCategory.length === 0) {
            return {checked: false, indeterminate: false};
        }
        if (selectedBlocksInCategory.length === allBlocksInCategory.length) {
            return {checked: true, indeterminate: false};
        }
        return {checked: false, indeterminate: true};
    }

    render () {
        const {
            intl,
            onRequestClose,
            selectedBlocks
        } = this.props;
        
        const {selectedCategoryIndex} = this.state;
        const selectedCategory = BLOCK_CATEGORIES[selectedCategoryIndex];
        const categoryBlocks = CATEGORY_BLOCKS[selectedCategory.id] || [];
        
        return (
            <Modal
                className={styles.modalContent}
                contentLabel={intl.formatMessage(messages.title)}
                headerClassName={styles.header}
                id="blockDisplayModal"
                onRequestClose={onRequestClose}
            >
                <Box className={styles.body}>
                    <Box className={styles.leftPane}>
                        <Box className={styles.categorySection}>
                            <div className={styles.sectionTitle}>
                                <FormattedMessage
                                    defaultMessage="Categories:"
                                    description="Title for block categories section"
                                    id="gui.smalruby3.blockDisplayModal.categoriesTitle"
                                />
                            </div>
                            {BLOCK_CATEGORIES.map((category, index) => {
                                const checkboxState = this.getCategoryCheckboxState(category.id);
                                return (
                                    <div
                                        key={category.id}
                                        className={classNames(styles.categoryItem, {
                                            [styles.selectedCategory]: selectedCategoryIndex === index
                                        })}
                                        data-category={category.id}
                                    >
                                        <input
                                            type="checkbox"
                                            className={styles.checkbox}
                                            data-category={category.id}
                                            checked={checkboxState.checked}
                                            ref={checkbox => {
                                                if (checkbox) {
                                                    checkbox.indeterminate = checkboxState.indeterminate;
                                                }
                                            }}
                                            onChange={this.handleCategoryChange}
                                        />
                                        <span
                                            className={styles.categoryName}
                                            data-category-index={index}
                                            onClick={this.handleCategorySelect}
                                        >
                                            {this.ScratchBlocks && this.ScratchBlocks.Msg &&
                                                this.ScratchBlocks.Msg[category.messageKey] ?
                                                this.ScratchBlocks.Msg[category.messageKey] :
                                                category.messageKey}
                                        </span>
                                    </div>
                                );
                            })}
                        </Box>

                        <Box className={styles.alwaysVisibleSection}>
                            <div className={styles.sectionTitle}>
                                <FormattedMessage
                                    defaultMessage="Always Visible:"
                                    description="Title for always visible categories section"
                                    id="gui.smalruby3.blockDisplayModal.alwaysVisibleTitle"
                                />
                            </div>
                            {ALWAYS_VISIBLE_CATEGORIES.map(category => (
                                <div
                                    key={category.id}
                                    className={styles.categoryItem}
                                >
                                    <label className={styles.categoryLabel}>
                                        <input
                                            type="checkbox"
                                            className={styles.checkbox}
                                            checked
                                            disabled
                                        />
                                        <span className={classNames(styles.categoryName, styles.alwaysVisibleText)}>
                                            {category.messageKey ?
                                                (this.ScratchBlocks && this.ScratchBlocks.Msg &&
                                                    this.ScratchBlocks.Msg[category.messageKey] ?
                                                    this.ScratchBlocks.Msg[category.messageKey] :
                                                    category.messageKey) :
                                                intl.formatMessage({id: category.messageId})}
                                        </span>
                                    </label>
                                </div>
                            ))}
                        </Box>
                    </Box>
                    
                    <Box className={styles.rightPane}>
                        <div className={styles.blockListHeader}>
                            <div className={styles.blockListTitle}>
                                {this.ScratchBlocks && this.ScratchBlocks.Msg &&
                                    this.ScratchBlocks.Msg[selectedCategory.messageKey] ?
                                    this.ScratchBlocks.Msg[selectedCategory.messageKey] :
                                    selectedCategory.messageKey}
                                <span className={styles.blockListSubtitle}>
                                    <FormattedMessage
                                        defaultMessage=" Blocks"
                                        description="Subtitle for blocks list"
                                        id="gui.smalruby3.blockDisplayModal.blocksSubtitle"
                                    />
                                </span>
                            </div>
                            <div className={styles.navigationButtons}>
                                <button
                                    className={classNames(styles.navButton, {
                                        [styles.disabled]: selectedCategoryIndex === 0
                                    })}
                                    onClick={this.handlePrevious}
                                    disabled={selectedCategoryIndex === 0}
                                >
                                    {'←'}
                                </button>
                                <button
                                    className={classNames(styles.navButton, {
                                        [styles.disabled]: selectedCategoryIndex === BLOCK_CATEGORIES.length - 1
                                    })}
                                    onClick={this.handleNext}
                                    disabled={selectedCategoryIndex === BLOCK_CATEGORIES.length - 1}
                                >
                                    {'→'}
                                </button>
                            </div>
                        </div>
                        
                        <Box className={styles.blockList}>
                            {categoryBlocks.map(blockType => {
                                const messageKey = getBlockMessageKey(blockType);
                                const blockName = this.ScratchBlocks && this.ScratchBlocks.Msg &&
                                    this.ScratchBlocks.Msg[messageKey] ?
                                    this.ScratchBlocks.Msg[messageKey] :
                                    blockType;
                                
                                const selectedBlocksInCategory = selectedBlocks[selectedCategory.id] || [];
                                const isBlockSelected = selectedBlocksInCategory.includes(blockType);
                                
                                return (
                                    <div
                                        key={blockType}
                                        className={styles.blockItem}
                                    >
                                        <label className={styles.blockLabel}>
                                            <input
                                                type="checkbox"
                                                checked={isBlockSelected}
                                                className={styles.blockCheckbox}
                                                data-block={blockType}
                                                data-category={selectedCategory.id}
                                                onChange={this.handleBlockChange}
                                            />
                                            <span className={styles.blockName}>
                                                {blockName}
                                            </span>
                                        </label>
                                    </div>
                                );
                            })}
                        </Box>
                    </Box>
                </Box>
            </Modal>
        );
    }
}

BlockDisplayModal.propTypes = {
    intl: intlShape.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    selectedBlocks: PropTypes.object.isRequired,
    onCategoryChange: PropTypes.func.isRequired,
    onBlockChange: PropTypes.func.isRequired,
    vm: PropTypes.object
};

export default injectIntl(BlockDisplayModal);
