/**
 * Define Ruby code generator for Sample Blocks
 * @param {RubyGenerator} Generator The RubyGenerator
 * @return {RubyGenerator} same as param.
 */
export default function (Generator) {

    Generator.kanirobo_motor_init = function (block) {
        return (
	    `gpio25 = GPIO.new(25, GPIO::OUT)\n` +
	    `gpio32 = GPIO.new(32, GPIO::OUT)\n` +
  	    `pwm26  = PWM.new(26, timer:0, frequency:1000)\n` +
 	    `pwm33  = PWM.new(33, timer:0, frequency:1000)\n`
	);
    };

    Generator.kanirobo_sensor_init = function (block) {
	return (
	    `adc36 = ADC.new(36)\n` +
	    `adc34 = ADC.new(34)\n` + 
	    `adc35 = ADC.new(35)\n` + 
  	    `adc2  = ADC.new(2)\n`
	);
    };

    Generator.kanirobo_servo_init = function (block) {
	return (
	    `pwm27 = PWM.new(27, timer:1, frequency:50)\n` +
  	    `pwm14 = PWM.new(14, timer:1, frequency:50)\n`
	);
    };
    
    Generator.kanirobo_motor = function (block) {
	Generator.prepares_[`motor`] = Generator.kanirobo_motor_init(null);
        const id  = Generator.getFieldValue(block, 'ID',  Generator.ORDER_NONE) || null;
        const dir = Generator.getFieldValue(block, 'DIR', Generator.ORDER_NONE) || null;
        const pwr = Generator.getFieldValue(block, 'PWR', Generator.ORDER_NONE) || null;
	const id2 = Number(id) + 1;
	const duty = ( 100 - 2 * Number(pwr) ) * Number(dir) + Number(pwr);
        return (
	    `gpio${id}.write(${dir})\n` +
	    `pwm${id2}.duty( ${duty} ) \n`
	);
    };
    Generator.kanirobo_sensor = function (block) {
	Generator.prepares_[`sensor`] = Generator.kanirobo_sensor_init(null);
        const id = Generator.getFieldValue(block, 'ID', Generator.ORDER_NONE) || null;
	return [`adc${id}.read_raw`, Generator.ORDER_ATOMIC];
    };

    Generator.kanirobo_servo = function (block) {
	Generator.prepares_[`servo`] = Generator.kanirobo_servo_init(null);
        const id  = Generator.getFieldValue(block, 'ID',  Generator.ORDER_NONE) || null;
        const agl = Generator.getFieldValue(block, 'AGL', Generator.ORDER_NONE)  || 0;
	return (
	    `pwm${id}.pulse_width_us( ${agl} )\n`
	);
    };

    Generator.kanirobo_puts = function (block) {
        const text = Generator.valueToCode(block, 'TEXT',  Generator.ORDER_NONE) || null;
	return (
	    `puts((${text}).to_s)\n`
	);
    };

}
