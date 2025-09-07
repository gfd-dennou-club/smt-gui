import _ from 'lodash';

const Ev3MotorMenu = ['A', 'B', 'C', 'D'];
const Ev3SensorMenu = ['1', '2', '3', '4'];

/**
 * EV3 converter
 */
const EV3Converter = {
    register: function (converter) {
        // Regular method calls
        converter.registerCallMethod('self', 'ev3_motor_turn_this_way_for', 2, params => {
            const {args} = params;
            
            if (!converter.isString(args[0]) || !converter.isNumberOrBlock(args[1])) return null;
            
            const block = converter.createBlock('ev3_motorTurnClockwise', 'statement');
            const motor = Ev3MotorMenu.indexOf(args[0].toString());
            converter.addInput(
                block,
                'PORT',
                converter.createFieldBlock('ev3_menu_motorPorts', 'motorPorts', motor.toString())
            );
            converter.addNumberInput(block, 'TIME', 'math_number', args[1], 1);
            return block;
        });

        converter.registerCallMethod('self', 'ev3_motor_turn_that_way_for', 2, params => {
            const {args} = params;
            
            if (!converter.isString(args[0]) || !converter.isNumberOrBlock(args[1])) return null;
            
            const block = converter.createBlock('ev3_motorTurnCounterClockwise', 'statement');
            const motor = Ev3MotorMenu.indexOf(args[0].toString());
            converter.addInput(
                block,
                'PORT',
                converter.createFieldBlock('ev3_menu_motorPorts', 'motorPorts', motor.toString())
            );
            converter.addNumberInput(block, 'TIME', 'math_number', args[1], 1);
            return block;
        });

        converter.registerCallMethod('self', 'ev3_motor_set_power', 2, params => {
            const {args} = params;
            
            if (!converter.isString(args[0]) || !converter.isNumberOrBlock(args[1])) return null;
            
            const block = converter.createBlock('ev3_motorSetPower', 'statement');
            const motor = Ev3MotorMenu.indexOf(args[0].toString());
            converter.addInput(
                block,
                'PORT',
                converter.createFieldBlock('ev3_menu_motorPorts', 'motorPorts', motor.toString())
            );
            converter.addNumberInput(block, 'POWER', 'math_number', args[1], 100);
            return block;
        });

        converter.registerCallMethod('self', 'ev3_motor_position', 1, params => {
            const {args} = params;
            
            if (!converter.isString(args[0])) return null;
            
            const block = converter.createBlock('ev3_getMotorPosition', 'value');
            const motor = Ev3MotorMenu.indexOf(args[0].toString());
            converter.addInput(
                block,
                'PORT',
                converter.createFieldBlock('ev3_menu_motorPorts', 'motorPorts', motor.toString())
            );
            return block;
        });

        converter.registerCallMethod('self', 'ev3_button_pressed?', 1, params => {
            const {args} = params;
            
            if (!converter.isString(args[0])) return null;
            
            const block = converter.createBlock('ev3_buttonPressed', 'value_boolean');
            const sensor = Ev3SensorMenu.indexOf(args[0].toString());
            converter.addInput(
                block,
                'PORT',
                converter.createFieldBlock('ev3_menu_sensorPorts', 'sensorPorts', sensor.toString())
            );
            return block;
        });

        converter.registerCallMethod('self', 'ev3_distance', 0, () =>
            converter.createBlock('ev3_getDistance', 'value')
        );

        converter.registerCallMethod('self', 'ev3_brightness', 0, () =>
            converter.createBlock('ev3_getBrightness', 'value')
        );

        converter.registerCallMethod('self', 'ev3_beep_note', 2, params => {
            const {args} = params;
            
            if (!converter.isNumberOrBlock(args[0]) || !converter.isNumberOrBlock(args[1])) return null;
            
            const block = converter.createBlock('ev3_beep', 'statement');
            converter.addNoteInput(block, 'NOTE', args[0], 60);
            converter.addNumberInput(block, 'TIME', 'math_number', args[1], 0.5);
            return block;
        });

        // Event methods with blocks
        converter.registerCallMethodWithBlock('self', 'when', 2, 0, params => {
            const {args, rubyBlock} = params;
            
            if (args[0].type !== 'sym') return null;
            
            let block;
            switch (args[0].value) {
            case 'ev3_button_pressed': {
                if (!converter.isStringOrBlock(args[1])) return null;
                
                block = converter.createBlock('ev3_whenButtonPressed', 'hat');
                const sensor = Ev3SensorMenu.indexOf(args[1].toString());
                converter.addInput(
                    block,
                    'PORT',
                    converter.createFieldBlock('ev3_menu_sensorPorts', 'sensorPorts', sensor.toString())
                );
                converter.setParent(rubyBlock, block);
                break;
            }
                
            case 'ev3_distance_gt':
                if (!converter.isNumberOrBlock(args[1])) return null;
                
                block = converter.createBlock('ev3_whenDistanceLessThan', 'hat');
                converter.addNumberInput(block, 'DISTANCE', 'math_number', args[1], 5);
                converter.setParent(rubyBlock, block);
                break;
                
            case 'ev3_brightness_gt':
                if (!converter.isNumberOrBlock(args[1])) return null;
                
                block = converter.createBlock('ev3_whenBrightnessLessThan', 'hat');
                converter.addNumberInput(block, 'DISTANCE', 'math_number', args[1], 50);
                converter.setParent(rubyBlock, block);
                break;
            }
            
            return block;
        });
    }
};

export default EV3Converter;
