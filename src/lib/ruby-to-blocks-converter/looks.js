import _ from 'lodash';
import {RubyToBlocksConverterError} from './errors';

/* eslint-disable no-invalid-this */
const createBlockWithMessage = function (opcode, message, defaultMessage) {
    const block = this._createBlock(opcode, 'statement');
    this._addTextInput(block, 'MESSAGE', this._isNumber(message) ? message.toString() : message, defaultMessage);
    return block;
};

const Effects = [
    'COLOR',
    'FISHEYE',
    'WHIRL',
    'PIXELATE',
    'MOSAIC',
    'BRIGHTNESS',
    'GHOST'
];

const FrontBack = [
    'front',
    'back'
];

const ForwardBackward = [
    'forward',
    'backward'
];

/* eslint-disable no-invalid-this */
const validateCostume = function (costumeName, args) {
    // Skip validation if no target context (e.g., in tests)
    if (!this._context.target || !this._context.target.getCostumes) {
        return;
    }
    
    const costumes = this._context.target.getCostumes();
    const costumeExists = costumes.some(costume => costume.name === costumeName);
    if (!costumeExists) {
        throw new RubyToBlocksConverterError(
            args[0].node,
            `costume "${costumeName}" does not exist`
        );
    }
};

const validateBackdrop = function (backdropName, args) {
    // Allow special backdrop values
    const specialBackdrops = ['next backdrop', 'previous backdrop', 'random backdrop'];
    if (specialBackdrops.includes(backdropName)) {
        return;
    }
    
    // Skip validation if no VM context (e.g., in tests)
    if (!this.vm || !this.vm.runtime || !this.vm.runtime.getTargetForStage) {
        return;
    }
    
    const stage = this.vm.runtime.getTargetForStage();
    if (!stage || !stage.getCostumes) {
        return;
    }
    
    const backdrops = stage.getCostumes();
    const backdropExists = backdrops.some(backdrop => backdrop.name === backdropName);
    if (!backdropExists) {
        throw new RubyToBlocksConverterError(
            args[0].node,
            `backdrop "${backdropName}" does not exist`
        );
    }
};
/* eslint-enable no-invalid-this */

/**
 * Looks converter
 */
const LooksConverter = {
    register: function (converter) {
        // say and think methods - 1 argument version
        ['say', 'think'].forEach(methodName => {
            converter.registerCallMethod('self', methodName, 1, params => {
                const {args, node} = params;
                if (!converter._isNumberOrStringOrBlock(args[0])) return null;
                
                if (converter._isStage()) {
                    throw new RubyToBlocksConverterError(node, 'Stage selected: no say/think blocks');
                }
                
                let opcode;
                let defaultMessage;
                if (methodName === 'say') {
                    opcode = 'looks_say';
                    defaultMessage = 'Hello!';
                } else {
                    opcode = 'looks_think';
                    defaultMessage = 'Hmm...';
                }
                
                return createBlockWithMessage.call(converter, opcode, args[0], defaultMessage);
            });
        });

        // say and think methods - 2 argument version
        ['say', 'think'].forEach(methodName => {
            converter.registerCallMethod('self', methodName, 2, params => {
                const {args, node} = params;
                if (!converter._isNumberOrStringOrBlock(args[0]) || !converter._isNumberOrBlock(args[1])) return null;
                
                if (converter._isStage()) {
                    throw new RubyToBlocksConverterError(node, 'Stage selected: no say/think blocks');
                }
                
                let opcode;
                let defaultMessage;
                if (methodName === 'say') {
                    opcode = 'looks_sayforsecs';
                    defaultMessage = 'Hello!';
                } else {
                    opcode = 'looks_thinkforsecs';
                    defaultMessage = 'Hmm...';
                }
                
                const block = createBlockWithMessage.call(converter, opcode, args[0], defaultMessage);
                converter._addNumberInput(block, 'SECS', 'math_number', args[1], 2);
                return block;
            });
        });

        // switch_costume method
        converter.registerCallMethod('self', 'switch_costume', 1, params => {
            const {args, node} = params;
            if (!converter._isString(args[0])) return null;
            
            if (converter._isStage()) {
                throw new RubyToBlocksConverterError(node, 'Stage selected: no costume blocks');
            }
            
            validateCostume.call(converter, args[0].toString(), args);
            const block = converter._createBlock('looks_switchcostumeto', 'statement');
            converter._addInput(block, 'COSTUME', converter._createFieldBlock('looks_costume', 'COSTUME', args[0]));
            return block;
        });

        // switch_backdrop method
        converter.registerCallMethod('self', 'switch_backdrop', 1, params => {
            const {args} = params;
            if (!converter._isString(args[0])) return null;
            
            validateBackdrop.call(converter, args[0].toString(), args);
            const block = converter._createBlock('looks_switchbackdropto', 'statement');
            converter._addInput(block, 'BACKDROP', converter._createFieldBlock('looks_backdrops', 'BACKDROP', args[0]));
            return block;
        });

        // switch_backdrop_and_wait method
        converter.registerCallMethod('self', 'switch_backdrop_and_wait', 1, params => {
            const {args} = params;
            if (!converter._isString(args[0])) return null;
            
            validateBackdrop.call(converter, args[0].toString(), args);
            const block = converter._createBlock('looks_switchbackdroptoandwait', 'statement');
            converter._addInput(block, 'BACKDROP', converter._createFieldBlock('looks_backdrops', 'BACKDROP', args[0]));
            return block;
        });

        // size= method
        converter.registerCallMethod('self', 'size=', 1, params => {
            const {args, node} = params;
            if (!converter._isNumberOrBlock(args[0])) return null;
            
            if (converter._isStage()) {
                throw new RubyToBlocksConverterError(node, 'Stage selected: no size blocks');
            }
            
            const block = converter._createBlock('looks_setsizeto', 'statement');
            converter._addNumberInput(block, 'SIZE', 'math_number', args[0], 100);
            return block;
        });

        // change_effect_by method
        converter.registerCallMethod('self', 'change_effect_by', 2, params => {
            const {args} = params;
            if (!converter._isString(args[0]) || Effects.indexOf(args[0].toString().toUpperCase()) < 0) return null;
            if (!converter._isNumberOrBlock(args[1])) return null;
            
            const block = converter._createBlock('looks_changeeffectby', 'statement');
            converter._addField(block, 'EFFECT', args[0].toString().toUpperCase());
            converter._addNumberInput(block, 'CHANGE', 'math_number', args[1], 25);
            return block;
        });

        // set_effect method
        converter.registerCallMethod('self', 'set_effect', 2, params => {
            const {args} = params;
            if (!converter._isString(args[0]) || Effects.indexOf(args[0].toString().toUpperCase()) < 0) return null;
            if (!converter._isNumberOrBlock(args[1])) return null;
            
            const block = converter._createBlock('looks_seteffectto', 'statement');
            converter._addField(block, 'EFFECT', args[0].toString().toUpperCase());
            converter._addNumberInput(block, 'VALUE', 'math_number', args[1], 25);
            return block;
        });

        // go_to_layer method
        converter.registerCallMethod('self', 'go_to_layer', 1, params => {
            const {args, node} = params;
            if (!converter._isString(args[0]) || FrontBack.indexOf(args[0].toString()) < 0) return null;
            
            if (converter._isStage()) {
                throw new RubyToBlocksConverterError(node, 'Stage selected: no layer blocks');
            }
            
            const block = converter._createBlock('looks_gotofrontback', 'statement');
            converter._addField(block, 'FRONT_BACK', args[0]);
            return block;
        });

        // go_layers method
        converter.registerCallMethod('self', 'go_layers', 2, params => {
            const {args, node} = params;
            if (!converter._isNumberOrBlock(args[0]) || ForwardBackward.indexOf(args[1].toString()) < 0) return null;
            
            if (converter._isStage()) {
                throw new RubyToBlocksConverterError(node, 'Stage selected: no layer blocks');
            }
            
            const block = converter._createBlock('looks_goforwardbackwardlayers', 'statement');
            converter._addNumberInput(block, 'NUM', 'math_integer', args[0], 1);
            converter._addField(block, 'FORWARD_BACKWARD', args[1]);
            return block;
        });

        // costume_number and costume_name methods
        ['costume_number', 'costume_name'].forEach(methodName => {
            converter.registerCallMethod('self', methodName, 0, params => {
                const {node} = params;
                if (converter._isStage()) {
                    throw new RubyToBlocksConverterError(node, 'Stage selected: no costume blocks');
                }
                
                const a = methodName.split('_');
                const block = converter._createBlock(`looks_${a[0]}numbername`, 'value');
                converter._addField(block, 'NUMBER_NAME', a[1]);
                return block;
            });
        });

        // backdrop_number and backdrop_name methods
        ['backdrop_number', 'backdrop_name'].forEach(methodName => {
            converter.registerCallMethod('self', methodName, 0, () => {
                const a = methodName.split('_');
                const block = converter._createBlock(`looks_${a[0]}numbername`, 'value');
                converter._addField(block, 'NUMBER_NAME', a[1]);
                return block;
            });
        });

        // Zero-argument methods
        const zeroArgMethods = {
            next_costume: {opcode: 'looks_nextcostume', type: 'statement', stageCheck: true},
            next_backdrop: {opcode: 'looks_nextbackdrop', type: 'statement', stageCheck: false},
            clear_graphic_effects: {opcode: 'looks_cleargraphiceffects', type: 'statement', stageCheck: false},
            show: {opcode: 'looks_show', type: 'statement', stageCheck: true},
            hide: {opcode: 'looks_hide', type: 'statement', stageCheck: true},
            size: {opcode: 'looks_size', type: 'value', stageCheck: true}
        };

        Object.keys(zeroArgMethods).forEach(methodName => {
            const config = zeroArgMethods[methodName];
            converter.registerCallMethod('self', methodName, 0, params => {
                const {node} = params;
                
                if (config.stageCheck && converter._isStage()) {
                    let errorMessage;
                    if (methodName.includes('costume')) {
                        errorMessage = 'Stage selected: no costume blocks';
                    } else if (methodName === 'show' || methodName === 'hide') {
                        errorMessage = 'Stage selected: no show/hide blocks';
                    } else if (methodName === 'size') {
                        errorMessage = 'Stage selected: no size blocks';
                    }
                    throw new RubyToBlocksConverterError(node, errorMessage);
                }
                
                return converter._createBlock(config.opcode, config.type);
            });
        });
    },

    onSend: function () {
        return null;
    },

    // eslint-disable-next-line no-unused-vars
    onOpAsgn: function (lh, operator, rh) {
        let block;
        if (this._isBlock(lh) && lh.opcode === 'looks_size' && operator === '+' && this._isNumberOrBlock(rh)) {
            block = this._changeBlock(lh, 'looks_changesizeby', 'statement');
            this._addNumberInput(block, 'CHANGE', 'math_number', rh, 10);
        }
        return block;
    }
};

export default LooksConverter;
