import Primitive from './primitive';

const Kanirobo = 'pwm';
//const PIN = 'pin';

const classNames = ['GPIO', 'PWM', 'ADC', 'UART', 'I2C'];

/**
 * KaniRobo converter
 */
const KaniroboConverter = {
    register: function (converter) {

	//Class
        classNames.forEach((className) => {
	    const createMicroBlock = node => converter.createRubyExpressionBlock(className, node);
            converter.registerOnSend('self', className, 0, (params) => {
		console.log('ClassName start')
                const { node } = params;		
                return createMicroBlock(node);
            });
	});

	// GPIO.new
	converter.registerOnSend('::GPIO', 'new', 2, params => {
            const { args, node } = params;
	    console.log('GPIO.new');
	    console.log(args[0]);
	    console.log(args[1]);
	    if (!converter.isNumber(args[0])) return null;
	    if (!converter.isString(args[1])) return null;

            const expression = `GPIO.new( ${args[0].value}, ${args[1].value} )`;
            return converter.createRubyExpressionBlock(expression, node);
        });

	// PWM.new
	converter.registerOnSend('::PWM', 'new', 2, params => {
            const { args, node } = params;
	    if (!converter.isNumber(args[0])) return null;
	    console.log( args[0] );
	    console.log( args[1] );

	    
            const timer = args[1].get('sym:timer');
            const channel = args[1].get('sym:channel');
            const frequency = args[1].get('sym:frequency');

            if (!converter.isNumber(args[0])) return null;
            if (!converter.isNumber(timer)) return null;
            if (!converter.isNumber(channel)) return null;
            if (!converter.isNumber(frequency)) return null;

            const expression = `PWM.new(${args[0].value}, timer:${timer.value}, channel:${channel.value}, frequency:${frequency.value})`;
            return converter.createRubyExpressionBlock(expression, node);
	});

	// ADC.new
	converter.registerOnSend('::ADC', 'new', 1, params => {
            const { args, node } = params;
	    if (!converter.isNumber(args[0])) return null;

            const expression = `ADC.new( ${args[0].value} )`;
            return converter.createRubyExpressionBlock(expression, node);
        });

	//GPIO
	for (let pin = 0; pin <= 40; pin++) {

	    let str = 'gpio' + pin;

            const createMicroBlock = node => converter.createRubyExpressionBlock(str, node);
            converter.registerOnSend('self', str, 0, params => {
		const {node} = params;
		return createMicroBlock(node);
            });
	    
            converter.registerOnSend(str, 'write', 1, params => {
		const {receiver, args} = params;
		if (!converter._isNumberOrBlock(args[0])) return null;

		console.log( "gpio.write receiver" );
		console.log( receiver );
		
		const block = converter.changeRubyExpressionBlock(receiver, 'microcom_gpio_write', 'statement');
		converter._addNumberInput(block, 'VALUE', 'math_integer', args[0], 0);
		converter._addNumberInput(block, 'PIN',   'math_integer', pin, 10);
		return block;
            });

	    converter.registerOnSend(str, 'read', 0, params => {
		const {receiver, args} = params;
		const block = converter.changeRubyExpressionBlock(receiver, 'microcom_gpio_read', 'value');
		converter._addNumberInput(block, 'PIN',  'math_integer', pin, 10);
		return block;
            });
	}

	//PWM
	for (let pin = 0; pin <= 40; pin++) {

	    let str = 'pwm' + pin;

            const createMicroBlock = node => converter.createRubyExpressionBlock(str, node);
            converter.registerOnSend('self', str, 0, params => {
		const {node} = params;
		return createMicroBlock(node);
            });
	    
            converter.registerOnSend(str, 'duty', 1, params => {
		const {receiver, args} = params;
		if (!converter._isNumberOrBlock(args[0])) return null;
		
		const block = converter.changeRubyExpressionBlock(receiver, 'microcom_pwm_duty', 'statement');
		converter._addNumberInput(block, 'DUTY', 'math_integer', args[0], 0);
		converter._addNumberInput(block, 'PIN',  'math_integer', pin, 10);
		return block;
            });

	    converter.registerOnSend(str, 'frequency', 1, params => {
		const {receiver, args} = params;
		if (!converter._isNumberOrBlock(args[0])) return null;
		
		const block = converter.changeRubyExpressionBlock(receiver, 'microcom_pwm_frequency', 'statement');
		converter._addNumberInput(block, 'FREQ', 'math_integer', args[0], 1000);
		converter._addNumberInput(block, 'PIN',  'math_integer', pin, 10);
		return block;
            });

	    converter.registerOnSend(str, 'pulse_width_us', 1, params => {
		const {receiver, args} = params;
		if (!converter._isNumberOrBlock(args[0])) return null;
		
		const block = converter.changeRubyExpressionBlock(receiver, 'microcom_pwm_pulse', 'statement');
		converter._addNumberInput(block, 'PULSE', 'math_integer', args[0], 10);
		converter._addNumberInput(block, 'PIN', 'math_integer',  pin, 10);
		return block;
            });
	}

	//ADC
	for (let pin = 0; pin <= 40; pin++) {

	    let str = 'adc' + pin;

            const createMicroBlock = node => converter.createRubyExpressionBlock(str, node);
            converter.registerOnSend('self', str, 0, params => {
		const {node} = params;
		return createMicroBlock(node);
            });
	    
	    converter.registerOnSend(str, 'read_raw', 0, params => {
		const {receiver, args} = params;
		const block = converter.changeRubyExpressionBlock(receiver, 'microcom_adc_raw', 'value');
		converter._addNumberInput(block, 'PIN',  'math_integer', pin, 10);
		return block;
            });

	    converter.registerOnSend(str, 'read', 0, params => {
		const {receiver, args} = params;
		const block = converter.changeRubyExpressionBlock(receiver, 'microcom_adc_volt', 'value');
		converter._addNumberInput(block, 'PIN', 'math_integer',  pin, 10);
		return block;
            });
	}

	
	const createMicrobitBlock = node => converter.createRubyExpressionBlock(Kanirobo, node);
	converter.registerOnSend('self', Kanirobo, 0, params => {
	    const {node} = params;
	    return createMicrobitBlock(node);
        });

        converter.registerOnSend('sprite', 'puts', 1, params => {
            const {args} = params;
            if (!converter._isNumberOrStringOrBlock(args[0])) return null;
		
	    const block = converter._createBlock('kanirobo_puts', 'statement');
	    converter._addTextInput(block, 'TEXT', args[0], 'test');
            return block;
        });	

        converter.registerOnSend('sprite', 'servo_pulse_width_us', 1, params => {
            const {args} = params;
            if (!converter.isNumberOrBlock(args[0])) return null;
	   
            const block = converter._createBlock('kanirobo_servo2', 'statement');
	    converter._addNumberInput(block, 'AGL', 'math_integer', args[0], 1000); 
            return block;
        });

        converter.registerOnSend(Kanirobo, 'pulse_width_us', 1, params => {
            const {receiver, args} = params;  //params には他にも変数があり，node に構文木の内容が入っている．
	    if (!converter._isNumberOrBlock(args[0])) return null;

            const block = converter.changeRubyExpressionBlock(receiver, 'kanirobo_servo3', 'statement');
            converter._addNumberInput(block, 'AGL', 'math_integer', args[0], 10);
            return block;
        });

	//
	converter.registerOnVasgn((scope, variable, rh) => {
            const expression = converter.getRubyExpression(rh);
	    console.log( expression ); // expression には右辺の値が入る
	    if (!expression) return null;

	    //クラス名の取り出し
	    const className = expression.substring(0, expression.indexOf('.'));

            switch (className) {
		
	    // GPIO.new
            case 'GPIO': {
                const match = expression.match(
                    /^GPIO\.new\(\s*(\d+),\s*(\S+)\s*\)/
                );
		console.log( match[1] );
		console.log( match[2] );
		console.log( match[3] );
		console.log( match[4] );
		if (variable.name !== `pwm${match[1]}`) return null;
		
                const block = converter.changeRubyExpressionBlock(
                    rh, 'microcom_gpio_init', 'statement'
                );
		converter._addNumberInput(block, 'PIN',   'math_integer', Number(match[1]), 10);
		converter.addTextInput(block, 'DIRECTION', match[2], "GPIO::OUT");
                return block;
	    }

	    // PWM.new
            case 'PWM': {
                const match = expression.match(
                    /^PWM\.new\(\s*(\d+),\s*timer:\s*(\d+),\s*channel:\s*(\d+),\s*frequency:\s*(\d+)\s*\)/
                );
		console.log( match[1] );
		console.log( match[2] );
		console.log( match[3] );
		console.log( match[4] );
		if (variable.name !== `pwm${match[1]}`) return null;

                const block = converter.changeRubyExpressionBlock(
                    rh, 'microcom_pwm_init', 'statement'
                );
		converter._addNumberInput(block, 'PIN',   'math_integer', Number(match[1]), 10);
		converter._addNumberInput(block, 'TIMER', 'math_integer', Number(match[2]), 0);
		converter._addNumberInput(block, 'CHAN',  'math_integer', Number(match[3]), 0);
		converter._addNumberInput(block, 'FREQ',  'math_integer', Number(match[4]), 1000);
                return block;
	    }
		
		
	    // ADC.new
	    case 'ADC': {
		const match = expression.match(
		    /^ADC\.new\(\s*(\d+)\s*\)/
		);

		//左辺 (variable.name) と右辺 (expression) から得たピン番号が等しいことをチェック
		if (variable.name !== `adc${match[1]}`) return null; 
		const block = converter.changeRubyExpressionBlock(
		    rh, 'microcom_adc_init', 'statement'
		);
		converter._addNumberInput(block, 'PIN', 'math_integer', Number(match[1]), 10);
		return block;
	    }
	    }
        });    
    }
};

export default KaniroboConverter;
