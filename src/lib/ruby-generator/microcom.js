/**
 * Define Ruby code generator for I2C_UART Blocks
 * @param {RubyGenerator} Generator The RubyGenerator
 * @return {RubyGenerator} same as param.
 */
export default function (Generator) {
    Generator.microcom_gpio_init = function (block) {
        const pin =
              Generator.valueToCode(block, "PIN", Generator.ORDER_NONE) || null;
        const direction =
	      Generator.getFieldValue(block, "DIRECTION",  Generator.ORDER_NONE) || null;
        return `gpio${pin} = GPIO.new( ${pin}, ${direction} )\n`;
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
        const freq =
            Generator.valueToCode(block, "FREQ", Generator.ORDER_NONE) || null;
        return `pwm${pin} = PWM.new( ${pin}, timer:${timer}, frequency:${freq} )\n`;
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
            Generator.valueToCode(block, "SCL", Generator.ORDER_NONE) || 22;
        const sda =
            Generator.valueToCode(block, "SDA", Generator.ORDER_NONE) || 21;
        return `i2c = I2C.new( scl_pin:${scl}, sda_pin:${sda} )\n`;
    };

    Generator.microcom_i2c_write = function (block) {
	const addr1 =
            Generator.getFieldValue(block, "ADDR1", Generator.ORDER_NONE) || null;
        const addr2 =
            Generator.getFieldValue(block, "ADDR2", Generator.ORDER_NONE) || null;
	const addr3 =
            Generator.getFieldValue(block, "ADDR3", Generator.ORDER_NONE) || null;
        const addr4 =
            Generator.getFieldValue(block, "ADDR4", Generator.ORDER_NONE) || null;	
	const addr5 =
            Generator.getFieldValue(block, "ADDR5", Generator.ORDER_NONE) || null;
        const addr6 =
            Generator.getFieldValue(block, "ADDR6", Generator.ORDER_NONE) || null;	
	if (addr5 === '-' || addr6 == '-') {
	    return `i2c.write( 0x${addr1}${addr2}, 0x${addr3}${addr4} )\n`;
	}else{
	    return `i2c.write( 0x${addr1}${addr2}, 0x${addr3}${addr4}, 0x${addr5}${addr6} )\n`;
	}
    };

    Generator.microcom_i2c_write2 = function (block) {
	const addr1 =
            Generator.getFieldValue(block, "ADDR1", Generator.ORDER_NONE) || null;
        const addr2 =
            Generator.getFieldValue(block, "ADDR2", Generator.ORDER_NONE) || null;
	const addr3 =
            Generator.getFieldValue(block, "ADDR3", Generator.ORDER_NONE) || null;
        const addr4 =
            Generator.getFieldValue(block, "ADDR4", Generator.ORDER_NONE) || null;	
        const hex =
            Generator.valueToCode(block, "HEX", Generator.ORDER_NONE) || null;
	return `i2c.write( 0x${addr1}${addr2}, 0x${addr3}${addr4}, ${hex} )\n`;
    };
    
    Generator.microcom_i2c_read = function (block) {
	const addr1 =
            Generator.getFieldValue(block, "ADDR1", Generator.ORDER_NONE) || null;
        const addr2 =
            Generator.getFieldValue(block, "ADDR2", Generator.ORDER_NONE) || null;
        const bytes =
            Generator.valueToCode(block, "BYTES", Generator.ORDER_NONE) || 1;
	const addr3 =
            Generator.getFieldValue(block, "ADDR3", Generator.ORDER_NONE) || null;
        const addr4 =
            Generator.getFieldValue(block, "ADDR4", Generator.ORDER_NONE) || null;	
	if (addr3 === '-' || addr4 == '-') {
	    return [`i2c.read( 0x${addr1}${addr2}, ${bytes} )`, Generator.ORDER_ATOMIC];
	}else{
	    return [`i2c.read( 0x${addr1}${addr2}, ${bytes}, 0x${addr3}${addr4} )`, Generator.ORDER_ATOMIC];
	}
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
        return `uart${uart}.clear_tx_buffer()\n`;
    };

    Generator.microcom_uart_rxclear = function (block) {
        const uart =
            Generator.valueToCode(block, "UART", Generator.ORDER_NONE) || null;
        return `uart${uart}.clear_rx_buffer()\n`;
    };

    Generator.microcom_num16 = function (block) {
        const num = Generator.valueToCode(block, 'NUM', Generator.ORDER_NONE) || null;
        return [`${num}.to_i(16)`, Generator.ORDER_ATOMIC];
    };
/*
    Generator.microcom_str16 = function (block) {
        const str = Generator.valueToCode(block, 'STR', Generator.ORDER_NONE) || null;
        return [`${str}.to_s(16)`, Generator.ORDER_ATOMIC];
    };

    Generator.microcom_ord = function (block) {
        const str = Generator.valueToCode(block, 'STR', Generator.ORDER_NONE) || null;
        return [`${str}.ord`, Generator.ORDER_ATOMIC];
    };

    Generator.microcom_bytes = function (block) {
        const str = Generator.valueToCode(block, 'STR', Generator.ORDER_NONE) || null;
        return [`${str}.bytes`, Generator.ORDER_ATOMIC];
    };

    Generator.microcom_split = function (block) {
        const str = Generator.valueToCode(block, 'STR', Generator.ORDER_NONE) || null;
        return [`${str}.split(',')`, Generator.ORDER_ATOMIC];
    };
*/
    Generator.microcom_tools = function (block) {
        const str = Generator.valueToCode(block, 'STR', Generator.ORDER_NONE) || null;
        const tool =
	      Generator.getFieldValue(block, "TOOL",  Generator.ORDER_NONE) || null;
        return [`${str}.${tool}`, Generator.ORDER_ATOMIC];
    };
    
    Generator.microcom_puts = function (block) {
        const text =
            Generator.valueToCode(block, "TEXT", Generator.ORDER_NONE) || null;
        return `puts( ${text} )\n`;
    };
}
