/**
 * Define Ruby code generator for Sample Blocks
 * @param {RubyGenerator} Generator The RubyGenerator
 * @return {RubyGenerator} same as param.
 */
export default function (Generator) {

    Generator.kaniroboR_motor_init = function (block) {
        return (
	    `gpio11 = GPIO.new(11, GPIO::OUT)\n` +
	    `gpio16 = GPIO.new(16, GPIO::OUT)\n` +
  	    `pwm2 = PWM.new(2,  timer:0, frequency:1000)\n` +
	    `pwm10= PWM.new(10, timer:0, frequency:1000)\n`
	);
    };

    Generator.kaniroboR_sensor_init = function (block) {
	return (
	    `adc18 = ADC.new(18)\n` +
	    `adc17 = ADC.new(17)\n` + 
	    `adc19 = ADC.new(19)\n` + 
  	    `adc20 = ADC.new(20)\n`
	);
    };

    Generator.kaniroboR_servo_init = function (block) {
	return (
	    `pwm12 = PWM.new(12, timer:1, frequency:50)\n` +
 	    `pwm14 = PWM.new(14, timer:1, frequency:50)\n`
	);
    };
    
    Generator.kaniroboR_motor = function (block) {
	Generator.prepares_[`motor`] = Generator.kaniroboR_motor_init(null);
        const id  = Generator.getFieldValue(block, 'ID',  Generator.ORDER_NONE) || null;
        const dir = Generator.getFieldValue(block, 'DIR', Generator.ORDER_NONE) || null;
        const pwr = Generator.getFieldValue(block, 'PWR', Generator.ORDER_NONE) || null;
	const duty = ( 100 - 2 * Number(pwr) ) * Number(dir) + Number(pwr);
	let id2 = '2'
	if (id == '16'){
	    id2 = '10'
	}	
        return (
	    `gpio${id}.write(${dir})\n` +
	    `pwm${id2}.duty( ${duty} ) \n`
	);
    };
    Generator.kaniroboR_sensor = function (block) {
	Generator.prepares_[`sensor`] = Generator.kaniroboR_sensor_init(null);
        const id = Generator.getFieldValue(block, 'ID', Generator.ORDER_NONE) || null;
	return [`adc${id}.read_raw`, Generator.ORDER_ATOMIC];
    };

    Generator.kaniroboR_servo = function (block) {
	Generator.prepares_[`servo`] = Generator.kaniroboR_servo_init(null);
        const id  = Generator.getFieldValue(block, 'ID',  Generator.ORDER_NONE) || null;
        const agl = Generator.getFieldValue(block, 'AGL', Generator.ORDER_NONE)  || 0;
	return (
	    `pwm${id}.pulse_width_us( ${agl} )\n`
	);
    };

    Generator.kaniroboR_puts = function (block) {
        const text = Generator.valueToCode(block, 'TEXT',  Generator.ORDER_NONE) || null;
	return (
	    `puts( ${text}.to_s )\n`
	);
    };

}
