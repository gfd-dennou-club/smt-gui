import _ from 'lodash';

/**
 * Operators converter
 */
const OperatorsConverter = {
    register: function (converter) {
        converter.registerCallMethod('self', 'rand', 1, params => {
            const {args} = params;
            if (!converter._isBlock(args[0]) || args[0].opcode !== 'ruby_range') return null;

            return converter._changeBlock(args[0], 'operator_random', 'value');
        });

        converter.registerCallMethod('any', '[]', 1, params => {
            const {receiver, args} = params;
            if (converter.isVariableBlockType(receiver)) return null;
            if (!converter._isStringOrBlock(receiver) || !converter._isNumberOrBlock(args[0])) return null;

            const block = converter._createBlock('operator_letter_of', 'value');
            converter._addTextInput(block, 'STRING', receiver, 'apple');
            let letter = args[0];
            if (converter._isNumber(args[0]) && !_.isNumber(args[0]) && args[0].type === 'int') {
                letter = letter.value + 1;
            }
            converter._addNumberInput(block, 'LETTER', 'math_number', letter, 1);
            return block;
        });

        converter.registerCallMethod('any', 'length', 0, params => {
            const {receiver} = params;
            if (converter.isVariableBlockType(receiver)) return null;
            if (!converter._isStringOrBlock(receiver)) return null;

            const block = converter._createBlock('operator_length', 'value');
            converter._addTextInput(block, 'STRING', receiver, 'apple');
            return block;
        });

        converter.registerCallMethod('any', 'include?', 1, params => {
            const {receiver, args} = params;
            if (converter.isVariableBlockType(receiver) || !converter._isStringOrBlock(receiver)) return null;
            if (!converter._isStringOrBlock(args[0])) return null;

            const block = converter._createBlock('operator_contains', 'value');
            converter._addTextInput(block, 'STRING1', receiver, 'apple');
            converter._addTextInput(block, 'STRING2', args[0], 'a');
            return block;
        });

        ['+', '-', '*', '/', '%'].forEach(operator => {
            converter.registerCallMethod('any', operator, 1, params => {
                const {receiver, args} = params;
                let rh = args[0];
                if (_.isArray(rh)) {
                    if (rh.length !== 1) return null;
                    rh = rh[0];
                }

                if (!converter._isNumberOrBlock(receiver) || !converter._isNumberOrBlock(rh)) return null;

                let opcode;
                if (operator === '+') {
                    opcode = 'operator_add';
                } else if (operator === '-') {
                    opcode = 'operator_subtract';
                } else if (operator === '*') {
                    opcode = 'operator_multiply';
                } else if (operator === '/') {
                    opcode = 'operator_divide';
                } else {
                    opcode = 'operator_mod';
                }

                const block = converter._createBlock(opcode, 'value');
                converter._addNumberInput(block, 'NUM1', 'math_number', receiver, '');
                converter._addNumberInput(block, 'NUM2', 'math_number', rh, '');
                return block;
            });
        });

        converter.registerCallMethod('any', '+', 1, params => {
            const {receiver, args} = params;
            let rh = args[0];
            if (_.isArray(rh)) {
                if (rh.length !== 1) return null;
                rh = rh[0];
            }

            if (!converter._isStringOrBlock(receiver)) return null;
            if (!converter._isStringOrBlock(rh)) return null;

            const block = converter._createBlock('operator_join', 'value');
            converter._addTextInput(
                block, 'STRING1', converter._isNumber(receiver) ? receiver.toString() : receiver, 'apple'
            );
            converter._addTextInput(block, 'STRING2', converter._isNumber(rh) ? rh.toString() : rh, 'banana');
            return block;
        });

        // Comparison operators: >, <, ==
        ['>', '<', '=='].forEach(operator => {
            converter.registerCallMethod('any', operator, 1, params => {
                const {receiver, args} = params;
                let rh = args[0];
                if (_.isArray(rh)) {
                    if (rh.length !== 1) return null;
                    rh = rh[0];
                }

                let opcode;
                if (operator === '>') {
                    opcode = 'operator_gt';
                } else if (operator === '<') {
                    opcode = 'operator_lt';
                } else {
                    opcode = 'operator_equals';
                }

                const block = converter._createBlock(opcode, 'value_boolean');
                converter._addTextInput(
                    block, 'OPERAND1', converter._isNumber(receiver) ? receiver.toString() : receiver, ''
                );
                converter._addTextInput(block, 'OPERAND2', converter._isNumber(rh) ? rh.toString() : rh, '50');
                return block;
            });
        });
    },

    // eslint-disable-next-line no-unused-vars
    onSend: function (receiver, name, args, rubyBlockArgs, rubyBlock) {
        let block;
        // rand, [], length, include? have been moved to register pattern

        let rh;
        if (args.length === 1) {
            if (_.isArray(args[0]) && args[0].length === 1) {
                rh = args[0][0];
            } else {
                rh = args[0];
            }
        }

        switch (name) {
        // +, -, *, /, %, >, <, == have been moved to register pattern
        case '!':
            if (args.length === 0 && this._isFalseOrBooleanBlock(receiver)) {
                block = this._createBlock('operator_not', 'value_boolean');
                if (!this._isFalse(receiver)) {
                    this._addInput(
                        block,
                        'OPERAND',
                        this._createTextBlock(this._isNumber(receiver) ? receiver.toString() : receiver)
                    );
                }
                return block;
            }
            break;
        case 'round':
            if (args.length === 0 && this._isNumberOrBlock(receiver)) {
                block = this._createBlock('operator_round', 'value');
                this._addNumberInput(block, 'NUM', 'math_number', receiver, '');
                return block;
            }
            break;
        case 'abs':
        case 'floor':
        case 'ceil':
            if (args.length === 0 && this._isNumberOrBlock(receiver)) {
                let operator = name;
                if (name === 'ceil') {
                    operator = 'ceiling';
                }
                block = this._createBlock('operator_mathop', 'value');
                this._addField(block, 'OPERATOR', operator);
                this._addNumberInput(block, 'NUM', 'math_number', receiver, '');
                return block;
            }
            break;
        case 'sqrt':
        case 'sin':
        case 'cos':
        case 'tan':
        case 'asin':
        case 'acos':
        case 'atan':
        case 'log':
        case 'log10':
            if (rh &&
                this._isConst(receiver) && receiver.toString() === '::Math' &&
                this._isNumberOrBlock(rh)) {
                let operator;
                switch (name) {
                case 'log':
                    operator = 'ln';
                    break;
                case 'log10':
                    operator = 'log';
                    break;
                default:
                    operator = name;
                }
                block = this._createBlock('operator_mathop', 'value');
                this._addField(block, 'OPERATOR', operator);
                this._addNumberInput(block, 'NUM', 'math_number', rh, '');
                return block;
            }
            break;
        case '**':
            if (rh && this._isNumberOrBlock(rh)) {
                let operator;
                if (this._isConst(receiver) && receiver.toString() === '::Math::E') {
                    operator = 'e ^';
                } else if (receiver.type === 'int' && receiver.value === 10) {
                    operator = '10 ^';
                }
                if (operator) {
                    block = this._createBlock('operator_mathop', 'value');
                    this._addField(block, 'OPERATOR', operator);
                    this._addNumberInput(block, 'NUM', 'math_number', rh, '');
                    return block;
                }
            }
            break;
        }

        return null;
    },

    // eslint-disable-next-line no-unused-vars
    onAnd: function (operands) {
        const block = this._createBlock('operator_and', 'value_boolean');
        operands.forEach(o => {
            if (o) {
                o.parent = block.id;
            }
        });
        if (!this._isFalse(operands[0])) {
            this._addInput(block, 'OPERAND1', this._createTextBlock(operands[0]));
        }
        if (!this._isFalse(operands[1])) {
            this._addInput(block, 'OPERAND2', this._createTextBlock(operands[1]));
        }
        return block;
    },

    // eslint-disable-next-line no-unused-vars
    onOr: function (operands) {
        const block = this._createBlock('operator_or', 'value_boolean');
        operands.forEach(o => {
            if (o) {
                o.parent = block.id;
            }
        });
        if (!this._isFalse(operands[0])) {
            this._addInput(block, 'OPERAND1', this._createTextBlock(operands[0]));
        }
        if (!this._isFalse(operands[1])) {
            this._addInput(block, 'OPERAND2', this._createTextBlock(operands[1]));
        }
        return block;
    }
};

export default OperatorsConverter;
