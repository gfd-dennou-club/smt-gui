/**
 * Define Ruby code generator for I2C_UART Blocks
 * @param {RubyGenerator} Generator The RubyGenerator
 * @return {RubyGenerator} same as param.
 */
export default function (Generator) {
    Generator.rboard_led_init = function (block){
        return (
	    `led0 = GPIO.new( 0, GPIO::OUT )\n` +
	    `led1 = GPIO.new( 1, GPIO::OUT )\n` +
	    `led5 = GPIO.new( 5, GPIO::OUT )\n` +
	    `led6 = GPIO.new( 6, GPIO::OUT )\n` 
	);
    };

    Generator.rboard_sw_init = function (block){
        return (
	    `sw12 = GPIO.new( 12, GPIO::IN|GPIO::PULL_UP ) \n`
	);
    };

    Generator.rboard_pwm_init = function (block){
        return (
	    `pwm0 = PWM.new( 0, timer: 0, channel: 0, frequency:440 )\n` +
	    `pwm1 = PWM.new( 1, timer: 0, channel: 1, frequency:440 )\n` +
	    `pwm5 = PWM.new( 5, timer: 0, channel: 2, frequency:440 )\n` +
	    `pwm6 = PWM.new( 6, timer: 0, channel: 3, frequency:440 )\n` 
	);
    };

    Generator.rboard_adc_init = function (block) {
        return (
	    `adc20 = ADC.new( 20 )\n` +
	    `adc19 = ADC.new( 19 )\n`
	);
    };

    Generator.rboard_led_all = function (block) {
	Generator.prepares_.led = Generator.rboard_led_init(null);
        const onoff1  = Generator.getFieldValue(block, 'ONOFF1', Generator.ORDER_NONE);
        const onoff2  = Generator.getFieldValue(block, 'ONOFF2', Generator.ORDER_NONE);
        const onoff3  = Generator.getFieldValue(block, 'ONOFF3', Generator.ORDER_NONE);
        const onoff4  = Generator.getFieldValue(block, 'ONOFF4', Generator.ORDER_NONE);
        return (
	    `led0.write(${onoff1})\n` +
	    `led1.write(${onoff2})\n` +
	    `led5.write(${onoff3})\n` +
	    `led6.write(${onoff4})\n` 
	);
    };

    Generator.rboard_led = function (block) {
	Generator.prepares_.led = Generator.rboard_led_init(null);
        const pin   = Generator.getFieldValue(block, 'PIN',   Generator.ORDER_NONE);
        const onoff = Generator.getFieldValue(block, 'ONOFF', Generator.ORDER_NONE);
        return (
	    `led${pin}.write(${onoff})\n`
	);
    };

    Generator.rboard_sw = function (block) {
	Generator.prepares_.sw = Generator.rboard_sw_init(null);
        const onoff = Generator.getFieldValue(block, 'ONOFF', Generator.ORDER_NONE);
        return [`sw12.read == ${onoff}`, Generator.ORDER_ATOMIC];
    };

    Generator.rboard_pwm_duty = function (block) {
	Generator.prepares_.pwm = Generator.rboard_pwm_init(null);
        const pin  = Generator.getFieldValue(block, 'PIN',  Generator.ORDER_NONE);
	const duty = Generator.valueToCode(block, 'DUTY', Generator.ORDER_NONE) || 0;
        return `pwm${pin}.duty( ${duty} % 101 )\n`;
    };

    Generator.rboard_adc_volt = function (block) {
	Generator.prepares_.adc = Generator.rboard_adc_init(null);
        const pin = Generator.getFieldValue(block, 'PIN',  Generator.ORDER_NONE);
        return [`adc${pin}.read`, Generator.ORDER_ATOMIC];
    };

    Generator.rboard_puts = function (block) {
        const text = Generator.valueToCode(block, 'TEXT', Generator.ORDER_NONE) || null;
        return `puts( ${text} )\n`;
    };
    
}
