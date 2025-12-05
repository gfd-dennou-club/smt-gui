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
/*
        classNames.forEach((className) => {
	    const createMicroBlock = node => converter.createRubyExpressionBlock(className, node);
            converter.registerOnSend('self', className, 0, (params) => {
		console.log('ClassName start')
                const { node } = params;		
                return createMicroBlock(node);
            });
	});
*/
	const str = "ADC";
	const createMicroBlock = node => converter.createRubyExpressionBlock(str, node);
        converter.registerOnSend('self', str, 0, params => {
	    const {node} = params;
	    return createMicroBlock(node);
        });

	converter.registerOnSend('ADC', 'new', 1, params => {
            const { reciever, args, node } = params;
	    console.log('ADC.new start')
	    console.log("args");
	    console.log(args);
	    console.log("node");
	    console.log(node);
	    console.log("reciever");
	    console.log(reciever);

	    if (!converter.isNumber(args[0])) return null;

            const expression = `ADC.new( ${args[0].value} )`;
	    //未解決のブロックがあるという意味でいったん保留
            //return converter.createRubyExpressionBlock(expression, node);

	    const block = converter.changeRubyExpressionBlock(receiver, 'microcom_gpio_write', 'statement');
	    converter._addNumberInput(block, 'PIN',  'math_integer', pin, 10);
	    return block;
        });
	// 以前の registerCallMethod と現在の registerOnSend は同じ？！

	// ADC.new
/*        converter.registerOnSend('ADC', 'new', 1, params => {
	    const {receiver, args, node} = params;
	    if (!converter._isNumberOrBlock(args[0])) return null;
	    console.log( 'ADC.new LOG start' );
	    console.log( receiver );
	    console.log( args );
	    console.log( node );
	    console.log( 'ADC.new LOG end' );
	    const expression = `ADC.new(${args[0].value})`;
	    return converter.createRubyExpressionBlock(expression, node);
        });
*/
/*
        converter.CallMethod('ADC', 'new', 1, (params) => {
            const { args, node } = params;
            if (!converter.isNumber(args[0])) return null;

            const expression = `ADC.new(${args[0].value})`;
            return converter.createRubyExpressionBlock(expression, node);  //未解決のブロックがあるという意味でいったん保留
        });
*/		
	
	
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

	converter.registerOnVasgn((scope, variable, rh) => {
            const expression = converter.getRubyExpression(rh);
	    console.log( expression );
//	    if (!expression) return null;
	    
	    console.log( 'START Vasgn' );
	    console.log( "scope" );
	    console.log( scope );
	    console.log( "variable" );
	    console.log( variable );
	    console.log( 'variable.name' );
	    console.log( variable.name );
	    console.log( 'variable.id' );
	    console.log( variable.id );
	    console.log( 'variable.type' );
	    console.log( variable.type );
	    console.log( 'rh' );
	    console.log( rh );

	    const block = converter.changeRubyExpressionBlock(rh, 'microcom_adc_init', 'statement');
	    converter._addNumberInput(block, 'PIN', 'math_integer', 3, 10);
	    return block;
/*	    
	    const tokens = rh.node.hash.split(',');
	    console.log('tokens');
	    console.log(tokens);
	    
	    for (let i = 0; i < tokens.length-2; i++) {
		if (tokens[i] === 'int') {
		    // 次の次のトークンが引数（例：21 → 10）
		    tokens[i + 2] = Math.floor((tokens[i + 2] - 1) / 2);
		}
	    }

	    // 除外したい値のリスト
	    const excludeValues = ["hash", "const", "send", "lvar", "int", "A", "4", "7260", "7262"];
	    
	    // フィルターで除外
	    const tokens2 = tokens.filter(token => !excludeValues.includes(token));
	    console.log('tokens2');
	    console.log(tokens2);


	    for (let i = 1; i < tokens2.length - 3; i++) {
		if (tokens2[i] === 'pair' && tokens2[i+1] === 'sym') {
		    tokens2[i+2] = tokens2[i+2] + ":" + tokens2[i+3];
		    tokens2[i+3] = "DEL";
		}
	    }
	    for (let i = 3; i < tokens2.length - 1; i++) {	    
		if (/GPIO$/.test(tokens2[i])) {
		    tokens2[i+1] = tokens2[i] + "::" + tokens2[i+1];
		    tokens2[i] = "DEL";
		}else if (tokens2[i] === '|') {
		    tokens2[i+1] = tokens2[i-1] + tokens2[i] + tokens2[i+1];
		    tokens2[i-1] = "DEL";
		    tokens2[i] = "DEL";
		}
	    }

	    // 除外したい値のリスト
	    const excludeValues2 = ["DEL", "pair", "sym"];
	    
	    // フィルターで除外
	    const tokens3 = tokens2.filter(token2 => !excludeValues2.includes(token2));
	    console.log('tokens3');
	    console.log(tokens3);

	    if ( /^servo/.test(variable.name) ) {
		console.log("+++");
		console.log(tokens3[2]);

//		const block = converter._createBlock('kanirobo_servo2', 'statement');
//		converter._addNumberInput(block, 'AGL', 'math_integer', tokens3[2], 1000);
		const block = converter._createBlock('kanirobo_servo2', 'statement');
		converter._addNumberInput(block, 'PIN', 'math_integer', tokens3[2], 1);
		return block;
	    }

	    //change でななく create にすべき．
	    //change にするとそのブロック内で解決を図ろうとする
	    const block = converter.createRubyExpressionBlock(receiver, 'microcom_adc_init', 'statement');
	    converter._addNumberInput(block, 'PIN',   'math_integer', pin, 10);
	    return block;
*/
        });

    }

};

export default KaniroboConverter;


	

/*
        converter.registerCallMethod(PIN, "new", 2, (params) => {
	    const { args, node } = params;
	    if (!converter.isNumberOrBlock(args[0])) return null;
	    if (args[0].value !== 25 && args[0].value !== 32) return null;
	    // ToDo: GPIO::OUTについてもチェックができるといい
	    
	    const expression = `GPIO.new(${args[0].value}, GPIO::OUT)`;
	    return converter.createRubyExpressionBlock(expression, node);
        });	    

	for (let i = 0; i <= 40; i++) {
	    let pinNum = PIN + i;
            converter.registerCallMethod("self", pinNum, 0, (params) => {
		const { node } = params;		
		return converter.createRubyExpressionBlock(pinNum, node);
            });	    
	}

        converter.registerOnSend('sprite', 'pin', 1, params => {
            const {args} = params;
            if (!converter.isNumber(args[0])) return null;
	    
            const block = converter._createBlock('kanirobo_instance', 'value');
	    converter._addNumberInput(block, 'GPIO', 'math_integer', args[0], 1000); 
            return block;
        });

*/
