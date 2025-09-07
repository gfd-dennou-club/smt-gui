import _ from 'lodash';

const Math = '::Math';
const MathE = '::Math::E';

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

        // Not operator: !
        converter.registerCallMethod('any', '!', 0, params => {
            const {receiver} = params;
            if (!converter._isFalseOrBooleanBlock(receiver)) return null;

            const block = converter._createBlock('operator_not', 'value_boolean');
            if (!converter._isFalse(receiver)) {
                converter._addInput(
                    block,
                    'OPERAND',
                    converter._createTextBlock(converter._isNumber(receiver) ? receiver.toString() : receiver)
                );
            }
            return block;
        });

        // Round method
        converter.registerCallMethod('any', 'round', 0, params => {
            const {receiver} = params;
            if (!converter._isNumberOrBlock(receiver)) return null;

            const block = converter._createBlock('operator_round', 'value');
            converter._addNumberInput(block, 'NUM', 'math_number', receiver, '');
            return block;
        });

        // Math operations: abs, floor, ceil
        ['abs', 'floor', 'ceil'].forEach(methodName => {
            converter.registerCallMethod('any', methodName, 0, params => {
                const {receiver} = params;
                if (!converter._isNumberOrBlock(receiver)) return null;

                let operator = methodName;
                if (methodName === 'ceil') {
                    operator = 'ceiling';
                }
                const block = converter._createBlock('operator_mathop', 'value');
                converter._addField(block, 'OPERATOR', operator);
                converter._addNumberInput(block, 'NUM', 'math_number', receiver, '');
                return block;
            });
        });

        // Math functions: sqrt, sin, cos, tan, asin, acos, atan, log, log10
        ['sqrt', 'sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'log', 'log10'].forEach(methodName => {
            converter.registerCallMethod(Math, methodName, 1, params => {
                const {args} = params;
                if (!converter._isNumberOrBlock(args[0])) return null;

                let operator;
                switch (methodName) {
                case 'log':
                    operator = 'ln';
                    break;
                case 'log10':
                    operator = 'log';
                    break;
                default:
                    operator = methodName;
                }
                const block = converter._createBlock('operator_mathop', 'value');
                converter._addField(block, 'OPERATOR', operator);
                converter._addNumberInput(block, 'NUM', 'math_number', args[0], '');
                return block;
            });
        });

        // Power operator: ** for Math::E
        converter.registerCallMethod(MathE, '**', 1, params => {
            const {args} = params;
            if (!converter._isNumberOrBlock(args[0])) return null;

            const block = converter._createBlock('operator_mathop', 'value');
            converter._addField(block, 'OPERATOR', 'e ^');
            converter._addNumberInput(block, 'NUM', 'math_number', args[0], '');
            return block;
        });

        // Power operator for base 10
        converter.registerCallMethod('any', '**', 1, params => {
            const {receiver, args} = params;
            if (!converter._isNumberOrBlock(args[0])) return null;
            if (!(receiver.type === 'int' && receiver.value === 10)) return null;

            const block = converter._createBlock('operator_mathop', 'value');
            converter._addField(block, 'OPERATOR', '10 ^');
            converter._addNumberInput(block, 'NUM', 'math_number', args[0], '');
            return block;
        });
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
