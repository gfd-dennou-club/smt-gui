import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';

import {
    setSelectedCategories,
    closeBlockDisplayModal
} from '../reducers/block-display.js';

import BlockDisplayModalComponent from '../components/block-display-modal/block-display-modal.jsx';

class BlockDisplayModal extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleCategoryChange',
            'handleSelectAll',
            'handleSelectNone',
            'handleClose'
        ]);
    }

    handleCategoryChange (categoryId, isSelected) {
        const currentCategories = [...this.props.selectedCategories];
        
        if (isSelected && !currentCategories.includes(categoryId)) {
            currentCategories.push(categoryId);
        } else if (!isSelected && currentCategories.includes(categoryId)) {
            const index = currentCategories.indexOf(categoryId);
            currentCategories.splice(index, 1);
        }
        
        this.props.onSetSelectedCategories(currentCategories);
    }

    handleSelectAll () {
        const allCategories = ['motion', 'looks', 'sound', 'event', 'control', 'sensing', 'operator'];
        this.props.onSetSelectedCategories(allCategories);
    }

    handleSelectNone () {
        this.props.onSetSelectedCategories([]);
    }

    handleClose () {
        this.props.onRequestClose();
    }

    render () {
        return (
            <BlockDisplayModalComponent
                selectedCategories={this.props.selectedCategories}
                onCategoryChange={this.handleCategoryChange}
                onSelectAll={this.handleSelectAll}
                onSelectNone={this.handleSelectNone}
                onRequestClose={this.handleClose}
                {...this.props}
            />
        );
    }
}

BlockDisplayModal.propTypes = {
    selectedCategories: PropTypes.arrayOf(PropTypes.string),
    onSetSelectedCategories: PropTypes.func.isRequired,
    onRequestClose: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    selectedCategories: state.scratchGui.blockDisplay.selectedCategories
});

const mapDispatchToProps = dispatch => ({
    onSetSelectedCategories: categories => dispatch(setSelectedCategories(categories)),
    onRequestClose: () => dispatch(closeBlockDisplayModal())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(BlockDisplayModal);
