const SET_SELECTED_CATEGORIES = 'scratch-gui/block-display/SET_SELECTED_CATEGORIES';
const SET_MODAL_VISIBLE = 'scratch-gui/block-display/SET_MODAL_VISIBLE';

const initialState = {
    selectedCategories: ['motion', 'looks', 'sound', 'event', 'control', 'sensing', 'operator'],
    modalVisible: false
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case SET_SELECTED_CATEGORIES:
        return Object.assign({}, state, {
            selectedCategories: action.categories
        });
    case SET_MODAL_VISIBLE:
        return Object.assign({}, state, {
            modalVisible: action.visible
        });
    default:
        return state;
    }
};

const setSelectedCategories = function (categories) {
    return {
        type: SET_SELECTED_CATEGORIES,
        categories: categories
    };
};

const setModalVisible = function (visible) {
    return {
        type: SET_MODAL_VISIBLE,
        visible: visible
    };
};

const openBlockDisplayModal = function () {
    return setModalVisible(true);
};

const closeBlockDisplayModal = function () {
    return setModalVisible(false);
};

export {
    reducer as default,
    initialState,
    setSelectedCategories,
    openBlockDisplayModal,
    closeBlockDisplayModal
};
