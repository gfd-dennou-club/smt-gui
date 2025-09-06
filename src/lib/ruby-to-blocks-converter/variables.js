/* global Opal */
import _ from 'lodash';

/**
 * Variables converter
 */
const VariablesConverter = {
    register: function (converter) {
        converter.registerCallMethod('self', 'show_variable', 1, params => {
            const {args} = params;
            if (!converter._isString(args[0])) return null;

            const variable = converter._lookupOrCreateVariable(args[0]);
            if (variable.scope !== 'local') {
                return converter._createBlock('data_showvariable', 'statement', {
                    fields: {
                        VARIABLE: {
                            name: 'VARIABLE',
                            id: variable.id,
                            value: variable.name,
                            variableType: variable.type
                        }
                    }
                });
            }
            return null;
        });

        converter.registerCallMethod('self', 'hide_variable', 1, params => {
            const {args} = params;
            if (!converter._isString(args[0])) return null;

            const variable = converter._lookupOrCreateVariable(args[0]);
            if (variable.scope !== 'local') {
                return converter._createBlock('data_hidevariable', 'statement', {
                    fields: {
                        VARIABLE: {
                            name: 'VARIABLE',
                            id: variable.id,
                            value: variable.name,
                            variableType: variable.type
                        }
                    }
                });
            }
            return null;
        });

        converter.registerCallMethod('self', 'list', 1, params => {
            const {args} = params;
            if (!converter._isString(args[0])) return null;

            const variable = converter._lookupOrCreateList(args[0]);
            if (variable.scope !== 'local') {
                return converter._createBlock('data_listcontents', 'value_variable', {
                    fields: {
                        LIST: {
                            name: 'LIST',
                            id: variable.id,
                            value: variable.name,
                            variableType: variable.type
                        }
                    }
                });
            }
            return null;
        });

        converter.registerCallMethod('self', 'show_list', 1, params => {
            const {args} = params;
            if (!converter._isString(args[0])) return null;

            const variable = converter._lookupOrCreateList(args[0]);
            if (variable.scope !== 'local') {
                return converter._createBlock('data_showlist', 'statement', {
                    fields: {
                        LIST: {
                            name: 'LIST',
                            id: variable.id,
                            value: variable.name,
                            variableType: variable.type
                        }
                    }
                });
            }
            return null;
        });

        converter.registerCallMethod('self', 'hide_list', 1, params => {
            const {args} = params;
            if (!converter._isString(args[0])) return null;

            const variable = converter._lookupOrCreateList(args[0]);
            if (variable.scope !== 'local') {
                return converter._createBlock('data_hidelist', 'statement', {
                    fields: {
                        LIST: {
                            name: 'LIST',
                            id: variable.id,
                            value: variable.name,
                            variableType: variable.type
                        }
                    }
                });
            }
            return null;
        });

        converter.registerCallMethod('variable', 'push', 1, params => {
            const {receiver, args} = params;
            if (!converter._isStringOrBlock(args[0]) && !converter._isNumberOrBlock(args[0])) return null;

            const block = converter._changeBlock(receiver, 'data_addtolist', 'statement');
            converter._addTextInput(block, 'ITEM', converter._isNumber(args[0]) ? args[0].toString() : args[0], 'thing');
            return block;
        });
    },

    // PARTIAL IMPLEMENTATION - Still needs work on list method calls
    // eslint-disable-next-line no-unused-vars
    onSend: function (receiver, name, args, rubyBlockArgs, rubyBlock) {
        let block;
        if (this.isVariableBlockType(receiver)) {
            switch (name) {
            case 'delete_at':
                if (args.length === 1 &&
                    this._isNumberOrBlock(args[0])) {
                    block = this._changeBlock(receiver, 'data_deleteoflist', 'statement');
                    this._addNumberInput(block, 'INDEX', 'math_integer', args[0], 1);
                }
                break;
            case 'clear':
                if (args.length === 0) {
                    block = this._changeBlock(receiver, 'data_deletealloflist', 'statement');
                }
                break;
            case 'insert':
                if (args.length === 2 &&
                    this._isNumberOrBlock(args[0]) &&
                    (this._isStringOrBlock(args[1]) || this._isNumberOrBlock(args[1]))) {
                    block = this._changeBlock(receiver, 'data_insertatlist', 'statement');
                    this._addNumberInput(block, 'INDEX', 'math_integer', args[0], 1);
                    this._addTextInput(block, 'ITEM', this._isNumber(args[1]) ? args[1].toString() : args[1], 'thing');
                }
                break;
            case '[]=':
                if (args.length === 2 &&
                    this._isNumberOrBlock(args[0]) &&
                    (this._isStringOrBlock(args[1]) || this._isNumberOrBlock(args[1]))) {
                    block = this._changeBlock(receiver, 'data_replaceitemoflist', 'statement');
                    this._addNumberInput(block, 'INDEX', 'math_integer', args[0], 1);
                    this._addTextInput(block, 'ITEM', this._isNumber(args[1]) ? args[1].toString() : args[1], 'thing');
                }
                break;
            case '[]':
                if (args.length === 1 &&
                    this._isNumberOrBlock(args[0])) {
                    block = this._changeBlock(receiver, 'data_itemoflist', 'value');
                    this._addNumberInput(block, 'INDEX', 'math_integer', args[0], 1);
                }
                break;
            case 'index':
                if (args.length === 1 &&
                    (this._isStringOrBlock(args[0]) || this._isNumberOrBlock(args[0]))) {
                    block = this._changeBlock(receiver, 'data_itemnumoflist', 'value');
                    this._addTextInput(block, 'ITEM', this._isNumber(args[0]) ? args[0].toString() : args[0], 'thing');
                }
                break;
            case 'length':
                if (args.length === 0) {
                    block = this._changeBlock(receiver, 'data_lengthoflist', 'value');
                }
                break;
            case 'include?':
                if (args.length === 1 &&
                    (this._isStringOrBlock(args[0]) || this._isNumberOrBlock(args[0]))) {
                    block = this._changeBlock(receiver, 'data_listcontainsitem', 'value');
                    this._addTextInput(block, 'ITEM', this._isNumber(args[0]) ? args[0].toString() : args[0], 'thing');
                }
                break;
            }
        }
        return block;
    },

    // eslint-disable-next-line no-unused-vars
    onOpAsgn: function (lh, operator, rh) {
        let block;
        if (operator === '+' && this._isString(lh) && this._isNumberOrBlock(rh)) {
            const variable = this._lookupOrCreateVariable(lh);
            if (variable.scope !== 'local') {
                block = this._createBlock('data_changevariableby', 'statement', {
                    fields: {
                        VARIABLE: {
                            name: 'VARIABLE',
                            id: variable.id,
                            value: variable.name,
                            variableType: variable.type
                        }
                    }
                });
                this._addNumberInput(block, 'VALUE', 'math_number', rh, 1);
            }
        }
        return block;
    },

    // eslint-disable-next-line no-unused-vars
    onVar: function (scope, variable) {
        if (scope === 'global' || scope === 'instance') {
            return this._createBlock('data_variable', 'value_variable', {
                fields: {
                    VARIABLE: {
                        name: 'VARIABLE',
                        id: variable.id,
                        value: variable.name,
                        variableType: variable.type
                    }
                }
            });
        }
        return null;
    },

    // eslint-disable-next-line no-unused-vars
    onVasgn: function (scope, variable, rh) {
        if (scope === 'global' || scope === 'instance') {
            if (this._isNumberOrBlock(rh) || this._isStringOrBlock(rh)) {
                const block = this._createBlock('data_setvariableto', 'statement', {
                    fields: {
                        VARIABLE: {
                            name: 'VARIABLE',
                            id: variable.id,
                            value: variable.name,
                            variableType: variable.type
                        }
                    }
                });
                this._addTextInput(block, 'VALUE', this._isNumber(rh) ? rh.toString() : rh, '0');
                return block;
            }
        }
        return null;
    }
};

export default VariablesConverter;
