/**
 * Define Ruby code generator for I2C_UART Blocks
 * @param {RubyGenerator} Generator The RubyGenerator
 * @return {RubyGenerator} same as param.
 */
export default function (Generator) {
    Generator.i2cuart_command0 = function (block) {
        return `I2C_UART.command0`;
    };

    return Generator;
}
