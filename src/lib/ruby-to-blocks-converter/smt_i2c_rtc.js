/*
 * I2C sensor 
 */

//sensors including RTC
const I2C_SENSORS = ['PCF85063','RX8035SA'];
const I2C_SENSORS_L = I2C_SENSORS.map(sensor => sensor.toLowerCase()); 
const I2C_SENSORS_TARGET = ['read', 'write', 'str_datetime', 'str_date', 'str_time', 'year', 'mon', 'mday', 'wday', 'hour', 'min', 'sec']

const SmT_I2C_RTC_Converter = {
    register: function (converter) {
	
	I2C_SENSORS.forEach((sensorName) => {
	    const className = `::${sensorName}`;       
	    const varName = sensorName.toLowerCase();  
	    
	    // --- クラスの .new の変換 ---
	    converter.registerOnSend(className, "new", 1, (params) => {
		const { node } = params;
		const expression = `${sensorName}.new( i2c )`;
		return converter.createRubyExpressionBlock(expression, node);
	    });

	    // --- レシーバの登録 ---
	    converter.registerOnSend("self", varName, 0, (params) => {
		const { node } = params;
		return converter.createRubyExpressionBlock(varName, node);
	    });
	});

	// --- varName = sensorName.new( i2c ) の一括処理 ---
	converter.registerOnVasgn((scope, variable, rh) => {
	    const expression = converter.getRubyExpression(rh);
	    if (!expression) return null;
	    
	    // 正規表現で「センサー名.new(引数)」にマッチするかチェック
	    const sensorPattern = new RegExp(`^(${I2C_SENSORS.join('|')})\\.new\\(\\s*(.+?)\\s*\\)$`);
	    const match = expression.match(sensorPattern);
	    
	    if (!match) return null;
	    const matchedSensor = match[1]; // クラス名
	    
	    // 変数名がクラス名の小文字と一致するか確認
	    if (variable.name !== matchedSensor.toLowerCase()) return null;
	    
	    // ブロックに変換
	    const block = converter.changeRubyExpressionBlock(
		rh, "peripherals_rtc_init", "statement"
	    );
	    // ドロップダウンのフィールドにセンサー名をセット
	    converter.addField(block, "SENSOR", matchedSensor);
	    
	    return block;
	});
    },
    
    onSend: function (receiver, name, args, rubyBlockArgs, rubyBlock, node) {

//	console.log( name );
//	console.log( receiver );
//	console.log( args );
//	console.log( node );

	
        const receiverName = receiver.fields.VALUE.value;
        if (!receiverName) return null;

	// 正規表現で「センサー名」にマッチするかチェック
	const sensorPattern = new RegExp(`^(${I2C_SENSORS_L.join('|')})`);
	const match = receiverName.match(sensorPattern);
	if (!match) return null;

	// 「センサー名.引数」の引数の正当性を確認
	const targetPattern = new RegExp(`^(${I2C_SENSORS_TARGET.join('|')})`);
	const match2 = name.match(targetPattern);
	if (!match2) return null;	

	const matchedSensor = match[1]; // クラス名 (例: SHT35)

	switch (name) {
	
	    case "read": {
		if (args.length != 0) return null;
		
		const block = this._changeBlock(
                    receiver, "peripherals_rtc_read", "statement"
		);
		this._addField(block, "SENSOR", matchedSensor);
		return block;
		break;
	    }
	    case "write": {
		if (args.length != 1) return null;
	    
		const block = this._changeBlock(
                    receiver, "peripherals_rtc_write", "statement"
		);
		this._addField(block, "SENSOR", matchedSensor);
		this._addNumberInput(block, "YEAR", "math_integer", args[0].value[0].value, 2025);
		this._addNumberInput(block, "MON",  "math_integer", args[0].value[1].value, 12);
		this._addNumberInput(block, "DAY",  "math_integer", args[0].value[2].value, 24);
		this._addNumberInput(block, "WDAY", "math_integer", args[0].value[3].value, 4);
		this._addNumberInput(block, "HOUR", "math_integer", args[0].value[4].value, 23);
		this._addNumberInput(block, "MIN",  "math_integer", args[0].value[5].value, 59);
		this._addNumberInput(block, "SEC",  "math_integer", args[0].value[6].value, 30);
		return block;
		break;
	    }
	    default: {

		if (args.length != 0) return null;
		const block = this._changeBlock(
                    receiver, "peripherals_rtc_value", "value"
		);
		this._addField(block, "SENSOR", matchedSensor);
		this._addField(block, "TARGET", name);
		return block;
		break;
	    }
	}
        return null;
    },

};

export default SmT_I2C_RTC_Converter;
