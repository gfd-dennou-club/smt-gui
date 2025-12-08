/**
 * Define Ruby code generator for I2C_UART Blocks
 * @param {RubyGenerator} Generator The RubyGenerator
 * @return {RubyGenerator} same as param.
 */
export default function (Generator) {
    Generator.microcom_gpio_output_init = function (block) {
        const pin =
            Generator.valueToCode(block, "PIN", Generator.ORDER_NONE) || null;
        return `gpio${pin} = GPIO.new( ${pin}, GPIO::OUT )\n`;
    };

    Generator.microcom_gpio_write = function (block) {
        const pin =
            Generator.valueToCode(block, "PIN", Generator.ORDER_NONE) || null;
        const value = Generator.valueToCode(
            block,
            "VALUE",
            Generator.ORDER_NONE
        );
        return `gpio${pin}.write( ${value} )\n`;
    };

    Generator.microcom_gpio_input_init = function (block) {
        const pin =
            Generator.valueToCode(block, "PIN", Generator.ORDER_NONE) || null;
        return `gpio${pin} = GPIO.new( ${pin}, GPIO::IN|GPIO::PULL_UP )\n`;
    };

    Generator.microcom_gpio_read = function (block) {
        const pin =
            Generator.valueToCode(block, "PIN", Generator.ORDER_NONE) || null;
        return [`gpio${pin}.read`, Generator.ORDER_ATOMIC];
    };

    Generator.microcom_pwm_init = function (block) {
        const pin =
            Generator.valueToCode(block, "PIN", Generator.ORDER_NONE) || null;
        const timer =
            Generator.valueToCode(block, "TIMER", Generator.ORDER_NONE) || null;
        const chan =
            Generator.valueToCode(block, "CHAN", Generator.ORDER_NONE) || null;
        const freq =
            Generator.valueToCode(block, "FREQ", Generator.ORDER_NONE) || null;
        return `pwm${pin} = PWM.new( ${pin}, timer:${timer}, channel:${chan}, frequency:${freq} )\n`;
    };

    Generator.microcom_pwm_duty = function (block) {
        const pin =
            Generator.valueToCode(block, "PIN", Generator.ORDER_NONE) || null;
        const duty =
            Generator.valueToCode(block, "DUTY", Generator.ORDER_NONE) || null;
        return `pwm${pin}.duty( ${duty} )\n`;
    };

    Generator.microcom_pwm_frequency = function (block) {
        const pin =
            Generator.valueToCode(block, "PIN", Generator.ORDER_NONE) || null;
        const freq =
            Generator.valueToCode(block, "FREQ", Generator.ORDER_NONE) || null;
        return `pwm${pin}.frequency( ${freq} )\n`;
    };

    Generator.microcom_pwm_pulse = function (block) {
        const pin =
            Generator.valueToCode(block, "PIN", Generator.ORDER_NONE) || null;
        const pulse =
            Generator.valueToCode(block, "PULSE", Generator.ORDER_NONE) || null;
        return `pwm${pin}.pulse_width_us( ${pulse} )\n`;
    };

    Generator.microcom_adc_init = function (block) {
        const pin =
            Generator.valueToCode(block, "PIN", Generator.ORDER_NONE) || null;
        return `adc${pin} = ADC.new( ${pin} )\n`;
    };

    Generator.microcom_adc_raw = function (block) {
        const pin =
            Generator.valueToCode(block, "PIN", Generator.ORDER_NONE) || null;
        return [`adc${pin}.read_raw`, Generator.ORDER_ATOMIC];
    };

    Generator.microcom_adc_volt = function (block) {
        const pin =
            Generator.valueToCode(block, "PIN", Generator.ORDER_NONE) || null;
        return [`adc${pin}.read`, Generator.ORDER_ATOMIC];
    };

    Generator.microcom_i2c_init = function (block) {
        const scl =
            Generator.valueToCode(block, "SCL", Generator.ORDER_NONE) || 23;
        const sda =
            Generator.valueToCode(block, "SDA", Generator.ORDER_NONE) || 22;
        return `i2c = I2C.new( scl_pin:${scl}, sda_pin:${sda} )\n`;
    };

    Generator.microcom_i2c_write = function (block) {
        const addr =
            Generator.valueToCode(block, "ADDR", Generator.ORDER_NONE) || null;
        const comm =
            Generator.valueToCode(block, "COMM", Generator.ORDER_NONE) || null;
        console.log(comm);
        return `i2c.write( ${addr}, ${comm} )\n`;
    };

    Generator.microcom_i2c_read = function (block) {
        const addr =
            Generator.valueToCode(block, "ADDR", Generator.ORDER_NONE) || null;
        const bytes =
            Generator.valueToCode(block, "BYTES", Generator.ORDER_NONE) || 1;
        return [`i2c.read( ${addr}, ${bytes} )`, Generator.ORDER_ATOMIC];
    };

    Generator.microcom_uart_init = function (block) {
        const uart =
            Generator.valueToCode(block, "UART", Generator.ORDER_NONE) || null;
        const rate =
            Generator.valueToCode(block, "RATE", Generator.ORDER_NONE) || null;
        return `uart${uart} = UART.new( ${uart}, baudrate:${rate} )\n`;
    };

    Generator.microcom_uart_puts = function (block) {
        const uart =
            Generator.valueToCode(block, "UART", Generator.ORDER_NONE) || null;
        const comm =
            Generator.valueToCode(block, "COMM", Generator.ORDER_NONE) || null;
        return `uart${uart}.puts( ${comm} )\n`;
    };

    Generator.microcom_uart_gets = function (block) {
        const uart =
            Generator.valueToCode(block, "UART", Generator.ORDER_NONE) || null;
        return [`uart${uart}.gets()`, Generator.ORDER_ATOMIC];
    };

    Generator.microcom_uart_txclear = function (block) {
        const uart =
            Generator.valueToCode(block, "UART", Generator.ORDER_NONE) || null;
        return `uart${uart}.tx_clear()\n`;
    };

    Generator.microcom_uart_rxclear = function (block) {
        const uart =
            Generator.valueToCode(block, "UART", Generator.ORDER_NONE) || null;
        return `uart${uart}.rx_clear()\n`;
    };

    Generator.microcom_puts = function (block) {
        const text =
            Generator.valueToCode(block, "TEXT", Generator.ORDER_NONE) || null;
        return `puts(${text})\n`;
    };
}
