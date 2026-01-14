const getClassConstant = (block) => {
  const value = block?.value;
  if (!value) return null;

    const scope = value.scope;
  const name  = value.name;
  return `${scope}::${name}`;
};

// センサーリスト
const I2C_SENSORS = ['BME688', 'BMP280', 'DPS310', 'SCD30', 'SCD41', 'SHT30', 'SHT35', 'SHT40', 'VL53L0X'];
const I2C_SENSORS_L = I2C_SENSORS.map(sensor => sensor.toLowerCase()); // ['bme688','bmp280',...]
const I2C_SENSORS_TARGET = ['read', 'pressure', 'temperature', 'humidity', 'co2', 'distance'];

const SmT_I2C_Sensors_Converter = {
    register: function (converter) {
	
	I2C_SENSORS.forEach((sensorName) => {
	    const className = `::${sensorName}`;       // 例: ::SHT35
	    const varName = sensorName.toLowerCase();  // 例: sht35

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
	    // 例: /^ (BME688|BMP280|...) \.new\( \s*(.+?)\s* \) $/
	    const sensorPattern = new RegExp(`^(${I2C_SENSORS.join('|')})\\.new\\(\\s*(.+?)\\s*\\)$`);
	    const match = expression.match(sensorPattern);
	    
	    if (!match) return null;
	    const matchedSensor = match[1]; // クラス名 (例: SHT35)
	    
	    // 変数名がクラス名の小文字と一致するか確認
	    if (variable.name !== matchedSensor.toLowerCase()) return null;
	    
	    // ブロックに変換
	    const block = converter.changeRubyExpressionBlock(
		rh, "peripherals_i2c_sensor_init", "statement"
	    );
	    // ドロップダウンのフィールドにセンサー名をセット
	    converter.addField(block, "SENSOR", matchedSensor);
	    
	    return block;
	});
    },
    
    onSend: function (receiver, name, args, rubyBlockArgs, rubyBlock, node) {
	console.log("---xxx---");
        const receiverName = (() => {
            if (this._isRubyExpression(receiver)) {
                return this._getRubyExpression(receiver);
            } else if (this._isRubyArgument(receiver)) {
                return receiver.fields.VALUE.value;
            } else {
                return null;
            }
        })();
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

	if (args.length != 0) return null;
	
	if (name === "read") {
	    const block = (() => {
                if (this._isRubyExpression(receiver)) {
                    return this._changeRubyExpressionBlock(
                        receiver, "peripherals_i2c_sensor_read", "statement"
                    );
                } else {
                    return this._changeBlock(
                        receiver, "peripherals_i2c_sensor_read", "statement"
                    );
                }
	    })();
	    this._addField(block, "SENSOR", matchedSensor);
	    return block;

        } else {
	    const block = (() => {
                if (this._isRubyExpression(receiver)) {
                    return this._changeRubyExpressionBlock(
                        receiver, "peripherals_i2c_sensor_value", "value"
                    );
                } else {
                    return this._changeBlock(
                        receiver, "peripherals_i2c_sensor_value", "value"
                    );
                }
	    })();
	    this._addField(block, "SENSOR", matchedSensor);
	    this._addField(block, "TARGET", name);
	    return block;

	}
        return null;
    },

};

export default SmT_I2C_Sensors_Converter;
