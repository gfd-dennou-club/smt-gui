import _ from "lodash";

export default function (Generator) {
    const getUnquoteText = function (block, fieldName, order) {
    const input = block.inputs[fieldName];
    if (input) {
    const targetBlock = Generator.getBlock(input.block);
    if (targetBlock && targetBlock.opcode === 'text') {
    return Generator.getFieldValue(targetBlock, 'TEXT') || '';
    }
    }
    return Generator.valueToCode(block, fieldName, order);
    };

    Generator.gpiohard_output_gpio = function (block){
        const num1 = getUnquoteText(block,'NUM1',Generator.ORDER_NONE);
        return  `led${num1} = GPIO.new( ${num1}, GPIO::OUT )\n` ;
    };
    Generator.gpiohard_input_gpio = function (block){
        const num1 = getUnquoteText(block,'NUM1',Generator.ORDER_NONE);
        return  `sw${num1} = GPIO.new( ${num1}, GPIO::IN, GPIO::PULL_UP )\n` ;
    };

    Generator.gpiohard_pwm_gpio = function (block){
        const num1 = getUnquoteText(block,'NUM1',Generator.ORDER_NONE);
        return  `pwm${num1} = PWM.new( ${num1} )\n` ;
    };

    Generator.gpiohard_adc_gpio = function (block) {
        const num1 = getUnquoteText(block,'NUM1',Generator.ORDER_NONE);
        return `adc${num1} = ADC.new( ${num1} , ADC::ATTEN_11DB, ADC::WIDTH_12BIT )\n`;
    };

    Generator.gpiohard_set_gpio_output_value = function (block) {
        const num1 = getUnquoteText(block,'NUM1',Generator.ORDER_NONE);
        const value = Generator.getFieldValue(block, 'SETVALUE',Generator.ORDER_NONE) || 1;

        return `led${num1}.write(${value})\n`;
    };
    Generator.gpiohard_input_gpio_value = function (block) {
        const num1 = getUnquoteText(block,'NUM1',Generator.ORDER_NONE);
        return `sw${num1}.read\n`;
    };
    Generator.gpiohard_set_gpio_duty = function (block) {
        const num1= getUnquoteText(block,'NUM1',Generator.ORDER_NONE);
        const value = getUnquoteText(block,'VALUE',Generator.ORDER_NONE);
        
        return `pwm${num1}.duty( (${value} * 1024).to_i )\n`;
    }
    Generator.gpiohard_set_gpio_frequency = function (block) {
        const num1 = getUnquoteText(block,'NUM1',Generator.ORDER_NONE);
        const value = getUnquoteText(block,'VALUE',Generator.ORDER_NONE);

        return `pwm${num1}.freq( ${value}.to_i )\n`;
    };
    Generator.gpiohard_set_gpio_volt = function (block) {
        const value = getUnquoteText(block,'VALUE',Generator.ORDER_NONE);
        
        return `adc${value}.read\n`;
    }
    return Generator;
}

