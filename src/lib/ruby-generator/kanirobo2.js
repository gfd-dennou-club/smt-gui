/**
 * Define Ruby code generator for Sample Blocks
 * @param {RubyGenerator} Generator The RubyGenerator
 * @return {RubyGenerator} same as param.
 */
export default function (Generator) {

    // 各ブロックに対応する Ruby コードを書く
    Generator.kanirobo2_ResetGpio = function (block) {
        const text = Generator.valueToCode(block, 'TEXT', Generator.ORDER_NONE) || null;
        return `gpio${text} = GPIO.new( ${text}, GPIO::OUT )\n`;
    };
    
    Generator.kanirobo2_ResetPwm = function (block) {
        const text = Generator.valueToCode(block, 'TEXT', Generator.ORDER_NONE) || null;
        return `pwm${text} = PWM.new( ${text}, timer:1, channel:${text % 2 + 1}, frequency:1000 )\n`;
    };
    
    Generator.kanirobo2_SetGpio = function (block) {
        const text1 = Generator.valueToCode(block, 'TEXT1', Generator.ORDER_NONE) || null;
        const text2 = Generator.valueToCode(block, 'TEXT2', Generator.ORDER_NONE) || null;
        return `gpio${text1}.write( ${text2} )\n`;
    };

    Generator.kanirobo2_SetPwm = function (block) {
        const text = Generator.valueToCode(block, 'TEXT', Generator.ORDER_NONE) || null;
        const num = Generator.valueToCode(block, 'NUM', Generator.ORDER_NONE) || 0;
        return `pwm${text}.duty( ( ${num} % 101 ).to_i )\n`;
    };

    Generator.kanirobo2_ResetLightSensor = function (block) {
        const text = Generator.valueToCode(block, 'TEXT', Generator.ORDER_NONE) || null;
        return `adc${text} = ADC.new( ${text} )\n`;
    };

    Generator.kanirobo2_LightSensorValue = function (block) {
        const text = Generator.valueToCode(block, 'TEXT', Generator.ORDER_NONE) || null;
        return [`adc${text}.read_raw`, Generator.ORDER_ATOMIC];
    };

    Generator.kanirobo2_ResetServoMotor = function (block) {
        const text = Generator.valueToCode(block, 'TEXT', Generator.ORDER_NONE) || null;
        const num = Generator.valueToCode(block, 'NUM', Generator.ORDER_NONE) || 0;	
        return `pwm${text} = PWM.new( ${text}, timer:2, channel:${(text % 2) + 2}, frequency:(1000 / ${num}.to_i) )\n`;
    };

    Generator.kanirobo2_SetServoMotorPluseWigth = function (block) {
        const text = Generator.valueToCode(block, 'TEXT', Generator.ORDER_NONE) || null;
        const num = Generator.valueToCode(block, 'NUM', Generator.ORDER_NONE) || 0;
        return `pwm${text}.pulse_with_us( ${num}.to_i * 1000 )\n`;
    };

    // メニューについては Ruby 側でも定義が必要のようだ
    Generator.kanirobo2_menu_menu_set_gpio = function (block){
        const menu_set_gpio = Generator.getFieldValue(block, 'menu_set_gpio') || null;
        return [menu_set_gpio, Generator.ORDER_ATOMIC];
    };

    Generator.kanirobo2_menu_menu_gpio = function (block){
        const menu_gpio = Generator.getFieldValue(block, 'menu_gpio') || null;
        return [menu_gpio, Generator.ORDER_ATOMIC];
    };
    Generator.kanirobo2_menu_menu3 = function (block){
        const menu3 = Generator.getFieldValue(block, 'menu3') || null;
        return [menu3, Generator.ORDER_ATOMIC];
    };

    Generator.kanirobo2_menu_menu_rihgt_sensor = function (block){
        const menu_rihgt_sensor = Generator.getFieldValue(block, 'menu_rihgt_sensor') || null;
        return [menu_rihgt_sensor, Generator.ORDER_ATOMIC];
    };

    Generator.kanirobo2_menu_menu_pwm = function (block){
        const menu_pwm = Generator.getFieldValue(block, 'menu_pwm') || null;
        return [menu_pwm, Generator.ORDER_ATOMIC];
    };

    Generator.kanirobo2_menu_menu_servo = function (block){
        const menu_servo = Generator.getFieldValue(block, 'menu_servo') || null;
        return [menu_servo, Generator.ORDER_ATOMIC];
    };
    
    return Generator;
}
