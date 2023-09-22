/**
 * Define Ruby code generator for I2C_UART Blocks
 * @param {RubyGenerator} Generator The RubyGenerator
 * @return {RubyGenerator} same as param.
 */
export default function (Generator) {
    Generator.i2cuart_menu_i2c_pin_menu = function (block) {
        const i2c_pin_menu = Generator.getFieldValue(block, 'i2c_pin_menu') || null;
        return [i2c_pin_menu, Generator.ORDER_ATOMIC];
    };

    Generator.i2cuart_menu_uart_pin_menu = function (block) {
        const uart_pin_menu = Generator.getFieldValue(block, 'uart_pin_menu') || null;
        return [uart_pin_menu, Generator.ORDER_ATOMIC];
    };

    Generator.i2cuart_i2c_init = function (block) {
	    const text = Generator.valueToCode(block, 'TEXT', Generator.ORDER_NONE) || null;
	    const num1 = Generator.valueToCode(block, 'NUM1', Generator.ORDER_NONE) || 23;
	    const num2 = Generator.valueToCode(block, 'NUM2', Generator.ORDER_NONE) || 22;
        return `i2c${text} = I2C.new( ${num1}, ${num2} )\n`;
    };

    Generator.i2cuart_i2c_write = function (block) {
	    const text = Generator.valueToCode(block, 'TEXT', Generator.ORDER_NONE) || null;
	    const num1 = Generator.valueToCode(block, 'NUM1', Generator.ORDER_NONE) || null;
	    const num2 = Generator.valueToCode(block, 'NUM2', Generator.ORDER_NONE) || null;
	    const num3 = Generator.valueToCode(block, 'NUM3', Generator.ORDER_NONE) || null;
        return `i2c${text}.write( ${num1}, [${num2}, ${num3}] )\n`;
    };

    Generator.i2cuart_i2c_read = function (block) {
	    const text = Generator.valueToCode(block, 'TEXT', Generator.ORDER_NONE) || null;
	    const num1 = Generator.valueToCode(block, 'NUM1', Generator.ORDER_NONE) || null;
	    const num2 = Generator.valueToCode(block, 'NUM2', Generator.ORDER_NONE) || 1;
        return [`i2c${text}.read( ${num1}, ${num2} )\n`, Generator.ORDER_ATOMIC];
    };

    Generator.i2cuart_uart_init = function (block) {
	    const text = Generator.valueToCode(block, 'TEXT', Generator.ORDER_NONE) || null;
        return `uart${text} = UART.new( ${text} )\n`;
    };

    Generator.i2cuart_uart_write = function (block) {
	    const text1 = Generator.valueToCode(block, 'TEXT1', Generator.ORDER_NONE) || null;
	    const text2 = Generator.valueToCode(block, 'TEXT2', Generator.ORDER_NONE) || null;
        return `uart${text1}.write( ${text2} )\n`;
    };

    Generator.i2cuart_uart_read = function (block) {
	    const text = Generator.valueToCode(block, 'TEXT', Generator.ORDER_NONE) || null;
        return [`uart${text}.gets()\n`, Generator.ORDER_ATOMIC];
    };

    return Generator;
}
