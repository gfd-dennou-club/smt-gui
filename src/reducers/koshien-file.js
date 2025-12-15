const SET_KOSHIEN_FILE_HANDLE = 'scratch-gui/koshien-file/SET_FILE_HANDLE';
const CLEAR_KOSHIEN_FILE_HANDLE = 'scratch-gui/koshien-file/CLEAR_FILE_HANDLE';
const INCREMENT_EXTENSION_LOAD = 'scratch-gui/koshien-file/INCREMENT_EXTENSION_LOAD';

const initialState = {
    fileHandle: null,
    extensionLoadCounter: 0
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case SET_KOSHIEN_FILE_HANDLE:
        return Object.assign({}, state, {
            fileHandle: action.fileHandle
        });
    case CLEAR_KOSHIEN_FILE_HANDLE:
        return Object.assign({}, state, {
            fileHandle: null
        });
    case INCREMENT_EXTENSION_LOAD:
        return Object.assign({}, state, {
            extensionLoadCounter: state.extensionLoadCounter + 1
        });
    default:
        return state;
    }
};

const setKoshienFileHandle = function (fileHandle) {
    return {
        type: SET_KOSHIEN_FILE_HANDLE,
        fileHandle: fileHandle
    };
};

const clearKoshienFileHandle = function () {
    return {
        type: CLEAR_KOSHIEN_FILE_HANDLE
    };
};

const incrementExtensionLoad = function () {
    return {
        type: INCREMENT_EXTENSION_LOAD
    };
};

export {
    reducer as default,
    initialState as koshienFileInitialState,
    setKoshienFileHandle,
    clearKoshienFileHandle,
    incrementExtensionLoad
};
