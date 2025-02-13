/**
 * Define Ruby code generator for I2C_UART Blocks
 * @param {RubyGenerator} Generator The RubyGenerator
 * @return {RubyGenerator} same as param.
 */
export default function (Generator) {
    Generator.rboard_gpio_output_init = function (block){
        const num1 = Generator.getFieldValue(block, 'NUM1', Generator.ORDER_NONE);
        return `led${num1} = GPIO.new( ${num1} )\n`;
    };

    Generator.rboard_gpio_output = function (block) {
        const num1  = Generator.getFieldValue(block, 'NUM1', Generator.ORDER_NONE);
        const value = Generator.getFieldValue(block, 'VALUE', Generator.ORDER_NONE);
        return `led${num1}.write(${value})\n`;
    };

    Generator.rboard_gpio_input_init = function (block){
        const num1 = Generator.getFieldValue(block, 'NUM1', Generator.ORDER_NONE);
        return `sw${num1} = GPIO.new( ${num1} ) \nsw${num1}.setmode(1)\n`;
    };

    Generator.rboard_gpio_input = function (block) {
        const num1 = Generator.getFieldValue(block, 'NUM1', Generator.ORDER_NONE);
        return [`sw${num1}.read`, Generator.ORDER_ATOMIC];
    };

    Generator.rboard_pwm_init = function (block){
        const num1 = Generator.getFieldValue(block, 'NUM1', Generator.ORDER_NONE);
        return `pwm${num1} = PWM.new( ${num1} )\n`;
    };

    Generator.rboard_pwm_duty = function (block) {
        const num1  = Generator.getFieldValue(block, 'NUM1', Generator.ORDER_NONE);
        const value = Generator.valueToCode(block, 'VALUE', Generator.ORDER_NONE) || null;
        return `pwm${num1}.duty( ( ${value} % 1024 ).to_i )\n`;
    };

    Generator.rboard_pwm_frequency = function (block) {
        const num1  = Generator.getFieldValue(block, 'NUM1', Generator.ORDER_NONE);
        const value = Generator.valueToCode(block, 'VALUE', Generator.ORDER_NONE) || null;
        return `pwm${num1}.freq( ${value}.to_i )\n`;
    };

    Generator.rboard_adc_init = function (block) {
        const num1 = Generator.getFieldValue(block, 'NUM1', Generator.ORDER_NONE);
        return `adc${num1} = ADC.new( ${num1} )\n`;
    };

    Generator.rboard_adc_volt = function (block) {
        const value = Generator.getFieldValue(block, 'VALUE', Generator.ORDER_NONE);
        return [`adc${value}.read`, Generator.ORDER_ATOMIC];
    };
/*
    Generator.rboard_i2c_init = function (block) {
        return `i2c = I2C.new()\n`;
    };
*/
    Generator.rboard_i2c_write = function (block) {
        const num1 = Generator.valueToCode(block, 'NUM1', Generator.ORDER_NONE) || null;
        const num2 = Generator.valueToCode(block, 'NUM2', Generator.ORDER_NONE) || null;
        const num3 = Generator.valueToCode(block, 'NUM3', Generator.ORDER_NONE) || null;
        return `i2c.write( 0x${num1}, 0x${num2}, ${num3} )\n`;
    };

    Generator.rboard_i2c_read = function (block) {
        const num1 = Generator.valueToCode(block, 'NUM1', Generator.ORDER_NONE) || null;
        const num2 = Generator.valueToCode(block, 'NUM2', Generator.ORDER_NONE) || 1;
	    const num3 = Generator.valueToCode(block, 'NUM3', Generator.ORDER_NONE) || null;
        return [`i2c.read( 0x${num1}, ${num2}, 0x${num3} )`, Generator.ORDER_ATOMIC];
    };

    Generator.rboard_uart_init = function (block) {
        const num = Generator.valueToCode(block, 'NUM', Generator.ORDER_NONE) || null;
        return `uart = UART.new( 2, ${num} )\n`;
    };

    Generator.rboard_uart_write = function (block) {
        const text2 = Generator.valueToCode(block, 'TEXT2', Generator.ORDER_NONE) || null;
        return `uart.puts( ${text2} )\n`;
    };

    Generator.rboard_uart_read = function (block) {
        return [`uart.gets()`, Generator.ORDER_ATOMIC];
    };

    Generator.rboard_puts = function (block) {
        const text = Generator.valueToCode(block, 'TEXT', Generator.ORDER_NONE) || null;
        return `puts( ${text} )\n`;
    };
    
    // メニューについては Ruby 側でも定義が必要のようだ
    Generator.rboard_menu_pin = function (block) {
        const menu_pin = Generator.getFieldValue(block, 'pinMenu') || null;
        return [menu_pin, Generator.ORDER_ATOMIC];
    };

    Generator.rboard_menu_onoff = function (block) {
        const menu_onoff = Generator.getFieldValue(block, 'onoffMenu') || null;
        return [menu_onoff, Generator.ORDER_ATOMIC];
    };

    Generator.rboard_menu_led = function (block) {
        const menu_led = Generator.getFieldValue(block, 'ledMenu') || null;
        return [menu_led, Generator.ORDER_ATOMIC];
    };

    Generator.rboard_menu_switch = function (block) {
        const menu_switch = Generator.getFieldValue(block, 'switchMenu') || null;
        return [menu_switch, Generator.ORDER_ATOMIC];
    };

    Generator.rboard_menu_adc = function (block) {
        const menu_adc = Generator.getFieldValue(block, 'adcMenu') || null;
        return [menu_adc, Generator.ORDER_ATOMIC];
    };

    return Generator;
}