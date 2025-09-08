/* global Opal */
import _ from 'lodash';
import {KeyOptions} from './constants';
import {RubyToBlocksConverterError} from './errors';

const DragMode = [
    'draggable',
    'not draggable'
];

const TimeNow = 'Time.now';
const TimeNowWday = 'Time.now.wday';

const spriteCall = function (name) {
    return `sprite("${name.toString()}")`;
};
const SpriteCallRe = /^sprite\("(.*)"\)$/;
const getSpriteName = function (code) {
    if (code !== null) {
        return SpriteCallRe.exec(code)[1];
    }
    return null;
};

const Stage = 'stage';
/* eslint-enable no-invalid-this */

/**
 * Sensing converter
 */
const SensingConverter = {
    // eslint-disable-next-line no-unused-vars
    onSend: function (receiver, name, args, rubyBlockArgs, rubyBlock, node) {
        let block;
        if ((this._isSelf(receiver) || receiver === Opal.nil) && !rubyBlock) {
            switch (name) {
            case 'touching?':
                if (args.length === 1 && this._isStringOrBlock(args[0])) {
                    if (this._isStage()) {
                        throw new RubyToBlocksConverterError(node, 'Stage selected: no touching blocks');
                    }
                    block = this._createBlock('sensing_touchingobject', 'value_boolean');
                    this._addFieldInput(
                        block, 'TOUCHINGOBJECTMENU', 'sensing_touchingobjectmenu', 'TOUCHINGOBJECTMENU',
                        args[0], '_mouse_'
                    );
                }
                break;
            case 'touching_color?':
                if (args.length === 1 && this._isColorOrBlock(args[0])) {
                    if (this._isStage()) {
                        throw new RubyToBlocksConverterError(node, 'Stage selected: no touching blocks');
                    }
                    block = this._createBlock('sensing_touchingcolor', 'value_boolean');
                    this._addFieldInput(block, 'COLOR', 'colour_picker', 'COLOUR', args[0], '#43066f');
                }
                break;
            case 'color_is_touching_color?':
                if (args.length === 2 && this._isColorOrBlock(args[0]) && this._isColorOrBlock(args[1])) {
                    if (this._isStage()) {
                        throw new RubyToBlocksConverterError(node, 'Stage selected: no touching blocks');
                    }
                    block = this._createBlock('sensing_coloristouchingcolor', 'value_boolean');
                    this._addFieldInput(block, 'COLOR', 'colour_picker', 'COLOUR', args[0], '#aad315');
                    this._addFieldInput(block, 'COLOR2', 'colour_picker', 'COLOUR', args[1], '#fca3bf');
                }
                break;
            case 'distance':
                if (args.length === 1 && this._isStringOrBlock(args[0])) {
                    if (this._isStage()) {
                        throw new RubyToBlocksConverterError(node, 'Stage selected: no distance blocks');
                    }
                    block = this._createBlock('sensing_distanceto', 'value');
                    this._addFieldInput(
                        block, 'DISTANCETOMENU', 'sensing_distancetomenu', 'DISTANCETOMENU', args[0], '_mouse_'
                    );
                }
                break;
            case 'ask':
                if (args.length === 1 && this._isStringOrBlock(args[0])) {
                    block = this._createBlock('sensing_askandwait', 'statement');
                    this._addTextInput(block, 'QUESTION', args[0], 'What\'s your name?');
                }
                break;
            case 'drag_mode=':
                if (args.length === 1 &&
                    ((this._isString(args[0]) && DragMode.indexOf(args[0].toString()) >= 0) ||
                     (args[0] && (args[0].type === 'true' || args[0].type === 'false')))) {
                    if (this._isStage()) {
                        throw new RubyToBlocksConverterError(node, 'Stage selected: no drag mode blocks');
                    }
                    block = this._createBlock('sensing_setdragmode', 'statement');
                    let dragMode = args[0];
                    if (dragMode.type === 'true') {
                        dragMode = 'draggable';
                    } else if (dragMode.type === 'false') {
                        dragMode = 'not draggable';
                    }
                    this._addField(block, 'DRAG_MODE', dragMode);
                }
                break;
            case 'sprite':
                if (args.length === 1 && this._isString(args[0])) {
                    block = this._createRubyExpressionBlock(spriteCall(args[0]), node);
                }
                break;
            }
        } else if (this._isConst(receiver)) {
            switch (receiver.toString()) {
            case '::Keyboard':
                if (name === 'pressed?' && args.length === 1 &&
                    (this._isBlock(args[0]) ||
                     (this._isString(args[0]) && KeyOptions.indexOf(args[0].toString()) >= 0))) {
                    block = this._createBlock('sensing_keypressed', 'value_boolean');
                    this._addFieldInput(block, 'KEY_OPTION', 'sensing_keyoptions', 'KEY_OPTION', args[0], 'space');
                }
                break;
            case '::Time':
                if (name === 'now' && args.length === 0) {
                    block = this._createRubyExpressionBlock(TimeNow, node);
                }
                break;
            }
        } else if (args.length === 0 && this._equalRubyExpression(receiver, TimeNow)) {
            let currentMenu;
            switch (name) {
            case 'year':
                currentMenu = 'YEAR';
                break;
            case 'month':
                currentMenu = 'MONTH';
                break;
            case 'day':
                currentMenu = 'DATE';
                break;
            case 'wday': {
                block = receiver;
                const textBlock = this._context.blocks[block.inputs.EXPRESSION.block];
                textBlock.fields.TEXT.value = TimeNowWday;
                break;
            }
            case 'hour':
                currentMenu = 'HOUR';
                break;
            case 'min':
                currentMenu = 'MINUTE';
                break;
            case 'sec':
                currentMenu = 'SECOND';
                break;
            }
            if (currentMenu) {
                block = this._changeBlock(receiver, 'sensing_current', 'value');
                delete this._context.blocks[receiver.inputs.EXPRESSION.block];
                delete receiver.inputs.EXPRESSION;

                this._addField(block, 'CURRENTMENU', currentMenu);
            }
        } else if (name === '+' && args.length === 1 && this._isNumber(args[0]) && args[0].toString() === '1' &&
                   this._equalRubyExpression(receiver, TimeNowWday)) {
            block = this._changeBlock(receiver, 'sensing_current', 'value');
            delete this._context.blocks[receiver.inputs.EXPRESSION.block];
            delete receiver.inputs.EXPRESSION;

            this._addField(block, 'CURRENTMENU', 'DAYOFWEEK');
        } else if (this._matchRubyExpression(receiver, SpriteCallRe)) {
            if (args.length === 0) {
                let property;
                switch (name) {
                case 'x':
                    property = 'x position';
                    break;
                case 'y':
                    property = 'y position';
                    break;
                case 'direction':
                    property = 'direction';
                    break;
                case 'costume_number':
                    property = 'costume #';
                    break;
                case 'costume_name':
                    property = 'costume name';
                    break;
                case 'size':
                    property = 'size';
                    break;
                case 'volume':
                    property = 'volume';
                    break;
                }
                if (property) {
                    const spriteName = getSpriteName(this._getRubyExpression(receiver));

                    block = this._changeBlock(receiver, 'sensing_of', 'value');
                    delete this._context.blocks[receiver.inputs.EXPRESSION.block];
                    delete receiver.inputs.EXPRESSION;

                    this._addField(block, 'PROPERTY', property);
                    this._addFieldInput(block, 'OBJECT', 'sensing_of_object_menu', 'OBJECT', spriteName);
                }
            } else if (args.length === 1 && name === 'variable' && this._isString(args[0])) {
                const spriteName = getSpriteName(this._getRubyExpression(receiver));

                block = this._changeBlock(receiver, 'sensing_of', 'value');
                delete this._context.blocks[receiver.inputs.EXPRESSION.block];
                delete receiver.inputs.EXPRESSION;

                this._addField(block, 'PROPERTY', args[0]);
                this._addFieldInput(block, 'OBJECT', 'sensing_of_object_menu', 'OBJECT', spriteName);
            }
        }

        return block;
    },

    register: function (converter) {
        // Simple getters with no arguments
        const simpleGetters = [
            {method: 'answer', opcode: 'sensing_answer'},
            {method: 'loudness', opcode: 'sensing_loudness'},
            {method: 'days_since_2000', opcode: 'sensing_dayssince2000'},
            {method: 'user_name', opcode: 'sensing_username'}
        ];

        simpleGetters.forEach(({method, opcode}) => {
            converter.registerCallMethod('self', method, 0, () =>
                converter.createBlock(opcode, 'value')
            );
        });

        // Mouse methods
        const mouseGetters = [
            {method: 'down?', opcode: 'sensing_mousedown', blockType: 'value_boolean'},
            {method: 'x', opcode: 'sensing_mousex', blockType: 'value'},
            {method: 'y', opcode: 'sensing_mousey', blockType: 'value'}
        ];

        mouseGetters.forEach(({method, opcode, blockType}) => {
            converter.registerCallMethod('::Mouse', method, 0, () =>
                converter.createBlock(opcode, blockType)
            );
        });

        // Timer methods
        const timerMethods = [
            {method: 'value', opcode: 'sensing_timer', blockType: 'value'},
            {method: 'reset', opcode: 'sensing_resettimer', blockType: 'statement'}
        ];

        timerMethods.forEach(({method, opcode, blockType}) => {
            converter.registerCallMethod('::Timer', method, 0, () =>
                converter.createBlock(opcode, blockType)
            );
        });

        // stage - returns Ruby expression
        converter.registerCallMethod('self', Stage, 0, params => {
            const {node} = params;
            return converter.createRubyExpressionBlock(Stage, node);
        });

        const stageGetters = [
            {method: 'backdrop_number', property: 'backdrop #'},
            {method: 'backdrop_name', property: 'backdrop name'},
            {method: 'volume', property: 'volume'}
        ];
        stageGetters.forEach(({method, property}) => {
            converter.registerCallMethod(Stage, method, 0, params => {
                const {receiver} = params;

                const block = converter.changeRubyExpressionBlock(receiver, 'sensing_of', 'value');
                converter.addField(block, 'PROPERTY', property);
                converter.addFieldInput(block, 'OBJECT', 'sensing_of_object_menu', 'OBJECT', '_stage_');
                return block;
            });
        });

        converter.registerCallMethod(Stage, 'variable', 1, params => {
            const {receiver, args} = params;

            if (!converter.isString(args[0])) return null;

            const block = converter.changeRubyExpressionBlock(receiver, 'sensing_of', 'value');
            converter.addField(block, 'PROPERTY', args[0]);
            converter.addFieldInput(block, 'OBJECT', 'sensing_of_object_menu', 'OBJECT', '_stage_');
            return block;
        });
    }
};

export default SensingConverter;
