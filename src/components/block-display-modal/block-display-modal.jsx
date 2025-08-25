import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import bindAll from 'lodash.bindall';
import {defineMessages, FormattedMessage, injectIntl, intlShape} from 'react-intl';

import Box from '../box/box.jsx';
import Modal from '../../containers/modal.jsx';

import styles from './block-display-modal.css';

const messages = defineMessages({
    title: {
        defaultMessage: 'Block Display Settings',
        description: 'Title for the block display settings modal',
        id: 'gui.blockDisplayModal.title'
    },
    selectAll: {
        defaultMessage: 'Select All',
        description: 'Button text to select all block categories',
        id: 'gui.blockDisplayModal.selectAll'
    },
    selectNone: {
        defaultMessage: 'Select None',
        description: 'Button text to deselect all block categories',
        id: 'gui.blockDisplayModal.selectNone'
    },
    close: {
        defaultMessage: 'Close',
        description: 'Button text to close the modal',
        id: 'gui.blockDisplayModal.close'
    },
    alwaysVisible: {
        defaultMessage: 'Always visible',
        description: 'Label for categories that are always visible',
        id: 'gui.blockDisplayModal.alwaysVisible'
    }
});

// Define block categories with their IDs and names
const BLOCK_CATEGORIES = [
    {id: 'motion', name: 'Motion'},
    {id: 'looks', name: 'Looks'},
    {id: 'sound', name: 'Sound'},
    {id: 'events', name: 'Events'},
    {id: 'control', name: 'Control'},
    {id: 'sensing', name: 'Sensing'},
    {id: 'operators', name: 'Operators'}
];

const ALWAYS_VISIBLE_CATEGORIES = [
    {id: 'variables', name: 'Variables'},
    {id: 'myBlocks', name: 'My Blocks'},
    {id: 'extensions', name: 'Extensions'}
];

class BlockDisplayModal extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleCategoryChange'
        ]);
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
            onSelectNone,
            ...props
        } = this.props;
        
        return (
            <Modal
                className={styles.modalContent}
                contentLabel={intl.formatMessage(messages.title)}
                id="blockDisplayModal"
                onRequestClose={onRequestClose}
                {...props}
            >
                <Box className={styles.body}>
                    <Box className={styles.header}>
                        <div className={styles.title}>
                            <FormattedMessage {...messages.title} />
                        </div>
                    </Box>
                    
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
                                        {category.name}
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
                                        {category.name}
                                        <span className={styles.alwaysVisibleLabel}>
                                            {'('}{intl.formatMessage(messages.alwaysVisible)}{')'}
                                        </span>
                                    </span>
                                </label>
                            </div>
                        ))}
                    </Box>

                    <Box className={styles.footer}>
                        <button
                            className={styles.closeButton}
                            onClick={onRequestClose}
                        >
                            <FormattedMessage {...messages.close} />
                        </button>
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
    onSelectNone: PropTypes.func.isRequired
};

export default injectIntl(BlockDisplayModal);