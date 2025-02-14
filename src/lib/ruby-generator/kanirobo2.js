/**
 * Define Ruby code generator for Sample Blocks
 * @param {RubyGenerator} Generator The RubyGenerator
 * @return {RubyGenerator} same as param.
 */
export default function (Generator) {

    // 各ブロックに対応する Ruby コードを書く
    Generator.kanirobo2_command2 = function (block) {
        const text = Generator.valueToCode(block, 'TEXT', Generator.ORDER_NONE) || null;
        return `gpio${text} = GPIO.new( ${text}, GPIO::OUT )\n`;
    };
    
    Generator.kanirobo2_command3 = function (block) {
        const text = Generator.valueToCode(block, 'TEXT', Generator.ORDER_NONE) || null;
        return `pwm${text} = PWM.new( ${text}, timer:1, channel:${text % 2 + 1}, frequency:1000 )\n`;
    };
    
    Generator.kanirobo2_command4 = function (block) {
        const text1 = Generator.valueToCode(block, 'TEXT1', Generator.ORDER_NONE) || null;
        const text2 = Generator.valueToCode(block, 'TEXT2', Generator.ORDER_NONE) || null;
        return `gpio${text1}.write( ${text2} )\n`;
    };

    Generator.kanirobo2_command5 = function (block) {
        const text = Generator.valueToCode(block, 'TEXT', Generator.ORDER_NONE) || null;
        const num = Generator.valueToCode(block, 'NUM', Generator.ORDER_NONE) || 0;
        return `pwm${text}.duty( ( ${num} % 101 ).to_i )\n`;
    };

    Generator.kanirobo2_command6 = function (block) {
        const text = Generator.valueToCode(block, 'TEXT', Generator.ORDER_NONE) || null;
        return `adc${text} = ADC.new( ${text} )\n`;
    };

    Generator.kanirobo2_value0 = function (block) {
        const text = Generator.valueToCode(block, 'TEXT', Generator.ORDER_NONE) || null;
        return [`adc${text}.read_raw`, Generator.ORDER_ATOMIC];
    };

    Generator.kanirobo2_command7 = function (block) {
        const text = Generator.valueToCode(block, 'TEXT', Generator.ORDER_NONE) || null;
        const num = Generator.valueToCode(block, 'NUM', Generator.ORDER_NONE) || 0;	
        return `pwm${text} = PWM.new( ${text}, timer:2, channel:${(text % 2) + 2}, frequency:(1000 / ${num}.to_i) )\n`;
    };

    Generator.kanirobo2_command8 = function (block) {
        const text = Generator.valueToCode(block, 'TEXT', Generator.ORDER_NONE) || null;
        const num = Generator.valueToCode(block, 'NUM', Generator.ORDER_NONE) || 0;
        return `pwm${text}.pulse_with_us( ${num}.to_i * 1000 )\n`;
    };

    // メニューについては Ruby 側でも定義が必要のようだ
    Generator.kanirobo2_menu_menu1 = function (block){
        const menu1 = Generator.getFieldValue(block, 'menu1') || null;
        return [menu1, Generator.ORDER_ATOMIC];
    };

    Generator.kanirobo2_menu_menu2 = function (block){
        const menu2 = Generator.getFieldValue(block, 'menu2') || null;
        return [menu2, Generator.ORDER_ATOMIC];
    };
    Generator.kanirobo2_menu_menu3 = function (block){
        const menu3 = Generator.getFieldValue(block, 'menu3') || null;
        return [menu3, Generator.ORDER_ATOMIC];
    };

    Generator.kanirobo2_menu_menu4 = function (block){
        const menu4 = Generator.getFieldValue(block, 'menu4') || null;
        return [menu4, Generator.ORDER_ATOMIC];
    };

    Generator.kanirobo2_menu_menu5 = function (block){
        const menu5 = Generator.getFieldValue(block, 'menu5') || null;
        return [menu5, Generator.ORDER_ATOMIC];
    };

    Generator.kanirobo2_menu_menu6 = function (block){
        const menu6 = Generator.getFieldValue(block, 'menu6') || null;
        return [menu6, Generator.ORDER_ATOMIC];
    };
    
    return Generator;
}
