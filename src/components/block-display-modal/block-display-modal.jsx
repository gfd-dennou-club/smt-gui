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
    selectAll: {
        defaultMessage: 'Select All',
        description: 'Button text to select all block categories',
        id: 'gui.smalruby3.blockDisplayModal.selectAll'
    },
    selectNone: {
        defaultMessage: 'Select None',
        description: 'Button text to deselect all block categories',
        id: 'gui.smalruby3.blockDisplayModal.selectNone'
    },
    alwaysVisible: {
        defaultMessage: 'Always visible',
        description: 'Label for categories that are always visible',
        id: 'gui.smalruby3.blockDisplayModal.alwaysVisible'
    },
});

// Define block categories with their IDs and ScratchBlocks.Msg keys
const BLOCK_CATEGORIES = [
    {id: 'motion', messageKey: 'CATEGORY_MOTION'},
    {id: 'looks', messageKey: 'CATEGORY_LOOKS'},
    {id: 'sound', messageKey: 'CATEGORY_SOUND'},
    {id: 'event', messageKey: 'CATEGORY_EVENTS'},
    {id: 'control', messageKey: 'CATEGORY_CONTROL'},
    {id: 'sensing', messageKey: 'CATEGORY_SENSING'},
    {id: 'operator', messageKey: 'CATEGORY_OPERATORS'}
];

const ALWAYS_VISIBLE_CATEGORIES = [
    {id: 'variables', messageKey: 'CATEGORY_VARIABLES'},
    {id: 'myBlocks', messageKey: 'CATEGORY_MYBLOCKS'},
    {id: 'extensions', messageId: 'gui.smalruby3.blockDisplayModal.extensions'}
];

class BlockDisplayModal extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleCategoryChange'
        ]);
        
        // Initialize ScratchBlocks if not already done
        if (!this.ScratchBlocks && props.vm) {
            this.ScratchBlocks = VMScratchBlocks(props.vm, false);
        }
    }

    handleCategoryChange (event) {
        const categoryId = event.target.getAttribute('data-category');
        const isChecked = event.target.checked;
        this.props.onCategoryChange(categoryId, isChecked);
    }

    render () {
        const {
            intl,
            onRequestClose,
            selectedCategories,
            onSelectAll,
            onSelectNone
        } = this.props;
        
        return (
            <Modal
                className={styles.modalContent}
                contentLabel={intl.formatMessage(messages.title)}
                headerClassName={styles.header}
                id="blockDisplayModal"
                onRequestClose={onRequestClose}
            >
                <Box className={styles.body}>
                    
                    <Box className={styles.controls}>
                        <button
                            className={classNames(
                                styles.controlButton,
                                styles.selectAllButton
                            )}
                            onClick={onSelectAll}
                        >
                            <FormattedMessage {...messages.selectAll} />
                        </button>
                        <button
                            className={classNames(
                                styles.controlButton,
                                styles.selectNoneButton
                            )}
                            onClick={onSelectNone}
                        >
                            <FormattedMessage {...messages.selectNone} />
                        </button>
                    </Box>

                    <Box className={styles.categorySection}>
                        {BLOCK_CATEGORIES.map(category => (
                            <div
                                key={category.id}
                                className={styles.categoryItem}
                            >
                                <label className={styles.categoryLabel}>
                                    <input
                                        type="checkbox"
                                        className={styles.checkbox}
                                        data-category={category.id}
                                        checked={selectedCategories.includes(category.id)}
                                        onChange={this.handleCategoryChange}
                                    />
                                    <span className={styles.categoryName}>
                                        {this.ScratchBlocks && this.ScratchBlocks.Msg && this.ScratchBlocks.Msg[category.messageKey] 
                                            ? this.ScratchBlocks.Msg[category.messageKey] 
                                            : category.messageKey}
                                    </span>
                                </label>
                            </div>
                        ))}
                    </Box>

                    <Box className={styles.alwaysVisibleSection}>
                        <div className={styles.sectionDivider} />
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
                                        {category.messageKey ? (
                                            this.ScratchBlocks && this.ScratchBlocks.Msg && this.ScratchBlocks.Msg[category.messageKey] 
                                                ? this.ScratchBlocks.Msg[category.messageKey] 
                                                : category.messageKey
                                        ) : (
                                            intl.formatMessage({id: category.messageId})
                                        )}
                                        <span className={styles.alwaysVisibleLabel}>
                                            {'('}{intl.formatMessage(messages.alwaysVisible)}{')'}
                                        </span>
                                    </span>
                                </label>
                            </div>
                        ))}
                    </Box>

                </Box>
            </Modal>
        );
    }
}

BlockDisplayModal.propTypes = {
    intl: intlShape.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    selectedCategories: PropTypes.arrayOf(PropTypes.string).isRequired,
    onCategoryChange: PropTypes.func.isRequired,
    onSelectAll: PropTypes.func.isRequired,
    onSelectNone: PropTypes.func.isRequired,
    vm: PropTypes.object
};

export default injectIntl(BlockDisplayModal);
