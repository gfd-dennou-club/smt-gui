const SET_SELECTED_CATEGORIES = 'scratch-gui/block-display/SET_SELECTED_CATEGORIES';
const SET_SELECTED_BLOCKS = 'scratch-gui/block-display/SET_SELECTED_BLOCKS';
const SET_MODAL_VISIBLE = 'scratch-gui/block-display/SET_MODAL_VISIBLE';

const initialState = {
    selectedCategories: ['motion', 'looks', 'sound', 'event', 'control', 'sensing', 'operator'],
    selectedBlocks: {
        motion: [
            'motion_movesteps', 'motion_turnright', 'motion_turnleft', 'motion_goto', 'motion_gotoxy',
            'motion_glideto', 'motion_glidesecstoxy', 'motion_pointindirection', 'motion_pointtowards',
            'motion_changexby', 'motion_setx', 'motion_changeyby', 'motion_sety', 'motion_ifonedgebounce',
            'motion_setrotationstyle'
        ],
        looks: [
            'looks_sayforsecs', 'looks_say', 'looks_thinkforsecs', 'looks_think', 'looks_switchbackdropto',
            'looks_switchbackdroptoandwait', 'looks_nextbackdrop', 'looks_switchcostumeto',
            'looks_nextcostume', 'looks_changesizeby', 'looks_setsizeto', 'looks_changeeffectby',
            'looks_seteffectto', 'looks_cleargraphiceffects', 'looks_show', 'looks_hide',
            'looks_gotofrontback', 'looks_goforwardbackwardlayers'
        ],
        sound: [
            'sound_playuntildone', 'sound_play', 'sound_stopallsounds', 'sound_changeeffectby',
            'sound_seteffectto', 'sound_cleareffects', 'sound_changevolumeby', 'sound_setvolumeto'
        ],
        event: [
            'event_whenflagclicked', 'event_whenkeypressed', 'event_whenthisspriteclicked',
            'event_whenbackdropswitchesto', 'event_whengreaterthan', 'event_whenbroadcastreceived',
            'event_broadcast', 'event_broadcastandwait'
        ],
        control: [
            'control_wait', 'control_repeat', 'control_forever', 'control_if', 'control_if_else',
            'control_wait_until', 'control_repeat_until', 'control_stop', 'control_start_as_clone',
            'control_create_clone_of', 'control_delete_this_clone'
        ],
        sensing: [
            'sensing_touchingobject', 'sensing_touchingcolor', 'sensing_coloristouchingcolor',
            'sensing_distanceto', 'sensing_askandwait', 'sensing_answer', 'sensing_keypressed',
            'sensing_mousedown', 'sensing_mousex', 'sensing_mousey', 'sensing_setdragmode',
            'sensing_loudness', 'sensing_timer', 'sensing_resettimer', 'sensing_of',
            'sensing_current', 'sensing_dayssince2000', 'sensing_username'
        ],
        operator: [
            'operator_add', 'operator_subtract', 'operator_multiply', 'operator_divide',
            'operator_random', 'operator_gt', 'operator_lt', 'operator_equals', 'operator_and',
            'operator_or', 'operator_not', 'operator_join', 'operator_letter_of',
            'operator_length', 'operator_contains', 'operator_mod', 'operator_round',
            'operator_mathop'
        ]
    },
    modalVisible: false
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case SET_SELECTED_CATEGORIES:
        return Object.assign({}, state, {
            selectedCategories: action.categories
        });
    case SET_SELECTED_BLOCKS:
        return Object.assign({}, state, {
            selectedBlocks: action.blocks
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

const setSelectedBlocks = function (blocks) {
    return {
        type: SET_SELECTED_BLOCKS,
        blocks: blocks
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
    setSelectedBlocks,
    openBlockDisplayModal,
    closeBlockDisplayModal
};
