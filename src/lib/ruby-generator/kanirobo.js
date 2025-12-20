/**
 * Define Ruby code generator for Sample Blocks
 * @param {RubyGenerator} Generator The RubyGenerator
 * @return {RubyGenerator} same as param.
 */
export default function (Generator) {

    Generator.kanirobo_motor_init = function (block) {
        return (
	    `motor1 = GPIO.new(25, GPIO::OUT)\n` +
	    `motor2 = GPIO.new(32, GPIO::OUT)\n` +
  	    `motor1_pwm = PWM.new(26, timer:0, channel:0)\n` +
 	    `motor2_pwm = PWM.new(33, timer:0, channel:1)\n`
	);
    };

    Generator.kanirobo_sensor_init = function (block) {
	return (
	    `sensor1 = ADC.new(36)\n` +
	    `sensor2 = ADC.new(34)\n` + 
	    `sensor3 = ADC.new(35)\n` + 
  	    `sensor4  = ADC.new(2)\n`
	);
    };

    Generator.kanirobo_servo_init = function (block) {
	return (
	    `servo1 = PWM.new(27, timer:1, channel:0, frequency:50)\n` +
  	    `servo2 = PWM.new(14, timer:1, channel:1, frequency:50)\n`
	);
    };
    
    Generator.kanirobo_motor = function (block) {
	Generator.prepares_[`motor`] = Generator.kanirobo_motor_init(null);
        const id  = Generator.getFieldValue(block, 'ID',  Generator.ORDER_NONE) || null;
        const dir = Generator.getFieldValue(block, 'DIR', Generator.ORDER_NONE) || null;
        const pwr = Generator.getFieldValue(block, 'PWR', Generator.ORDER_NONE) || null;
        return (
	    `motor${id}.write(${dir})\n` +
	    `motor${id}_pwm.duty( ( 100 - 2 * ${pwr} ) * ${dir} + ${pwr} ) \n`
	);
    };
    Generator.kanirobo_sensor = function (block) {
	Generator.prepares_[`sensor`] = Generator.kanirobo_sensor_init(null);
        const id = Generator.getFieldValue(block, 'ID', Generator.ORDER_NONE) || null;
	return [`sensor${id}.read_raw`, Generator.ORDER_ATOMIC];
    };

    Generator.kanirobo_servo = function (block) {
	Generator.prepares_[`servo`] = Generator.kanirobo_servo_init(null);
        const id  = Generator.getFieldValue(block, 'ID',  Generator.ORDER_NONE) || null;
        const agl = Generator.getFieldValue(block, 'AGL', Generator.ORDER_NONE)  || 0;
	return (
	    `servo${id}.pulse_width_us( ${agl} )\n`
	);
    };

    Generator.kanirobo_puts = function (block) {
        const text = Generator.valueToCode(block, 'TEXT',  Generator.ORDER_NONE) || null;
	return (
	    `puts((${text}).to_s)\n`
	);
    };

}
