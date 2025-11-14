/**
 * Define Ruby code generator for Sample Blocks
 * @param {RubyGenerator} Generator The RubyGenerator
 * @return {RubyGenerator} same as param.
 */
export default function (Generator) {
    Generator.kanirobo1v2_motor_init = function (block) {
        return (
            `motor1 = GPIO.new(25, GPIO::OUT)\n` +
            `motor1_pwm = PWM.new(26, timer:1, channel:1)\n` +
            `motor2 = GPIO.new(32, GPIO::OUT)\n` +
            `motor2_pwm = PWM.new(33, timer:1, channel:2)\n`
        );
    };

    Generator.kanirobo1v2_lux_init = function (block) {
        return (
            `lux36 = ADC.new(36)\n` +
            `lux34 = ADC.new(34)\n` +
            `lux35 = ADC.new(35)\n` +
            `lux2  = ADC.new(2)\n`
        );
    };

    Generator.kanirobo1v2_servo_init = function (block) {
        return (
            `servo27 = PWM.new(27, timer:2, channel:3, frequency:50)\n` +
            `servo14 = PWM.new(14, timer:2, channel:4, frequency:50)\n`
        );
    };

    Generator.kanirobo1v2_motor = function (block) {
        Generator.prepares_[`motor`] = Generator.kanirobo1v2_motor_init(null);
        const text1 =
            Generator.valueToCode(block, "TEXT1", Generator.ORDER_NONE) || null;
        const text2 =
            Generator.valueToCode(block, "TEXT2", Generator.ORDER_NONE) || null;
        const text3 =
            Generator.valueToCode(block, "TEXT3", Generator.ORDER_NONE) || null;
        return (
            `motor${text1}_pwm.duty( ( 100 - 2 * ${text3} ) * ${text2} + ${text3} ) \n` +
            `motor${text1}.write(${text2})\n` +
            `sleep( 0.01 )\n`
        );
    };
    Generator.kanirobo1v2_value0 = function (block) {
        const text =
            Generator.valueToCode(block, "TEXT", Generator.ORDER_NONE) || null;
        Generator.prepares_[`lux`] += Generator.kanirobo1v2_lux_init(null);
        return [`lux${text}.read_raw`, Generator.ORDER_ATOMIC];
    };

    Generator.kanirobo1v2_command9 = function (block) {
        Generator.prepares_[`servo`] = Generator.kanirobo1v2_servo_init(null);
        const text =
            Generator.valueToCode(block, "TEXT", Generator.ORDER_NONE) || null;
        const num =
            Generator.valueToCode(block, "NUM", Generator.ORDER_NONE) || 0;
        return `servo${text}.pulse_width_us( ${num} )\n`;
    };

    // メニューについては Ruby 側でも定義が必要のようだ
    Generator.kanirobo1v2_menu_menu1 = function (block) {
        const menu1 = Generator.getFieldValue(block, "menu1") || null;
        return [menu1, Generator.ORDER_ATOMIC];
    };

    Generator.kanirobo1v2_menu_menu2 = function (block) {
        const menu2 = Generator.getFieldValue(block, "menu2") || null;
        return [menu2, Generator.ORDER_ATOMIC];
    };
    Generator.kanirobo1v2_menu_menu3 = function (block) {
        const menu3 = Generator.getFieldValue(block, "menu3") || null;
        return [menu3, Generator.ORDER_ATOMIC];
    };

    Generator.kanirobo1v2_menu_menu4 = function (block) {
        const menu4 = Generator.getFieldValue(block, "menu4") || null;
        return [menu4, Generator.ORDER_ATOMIC];
    };

    Generator.kanirobo1v2_menu_menu5 = function (block) {
        const menu5 = Generator.getFieldValue(block, "menu5") || null;
        return [menu5, Generator.ORDER_ATOMIC];
    };

    Generator.kanirobo1v2_menu_menu6 = function (block) {
        const menu6 = Generator.getFieldValue(block, "menu6") || null;
        return [menu6, Generator.ORDER_ATOMIC];
    };

    Generator.kanirobo1v2_menu_menu7 = function (block) {
        const menu7 = Generator.getFieldValue(block, "menu7") || null;
        return [menu7, Generator.ORDER_ATOMIC];
    };

    Generator.kanirobo1v2_menu_menu8 = function (block) {
        const menu8 = Generator.getFieldValue(block, "menu8") || null;
        return [menu8, Generator.ORDER_ATOMIC];
    };

    return Generator;
}
