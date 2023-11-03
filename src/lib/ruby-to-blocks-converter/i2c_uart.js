/* global Opal */
import _ from "lodash";

/**
 * I2C_UART converter
 */
const I2C_UARTConverter = {
    // eslint-disable-next-line no-unused-vars
    onSend: function (receiver, name, args, rubyBlockArgs, rubyBlock) {
        let block;
        console.log(name)
        if ((this._isSelf(receiver) || receiver === Opal.nil) && !rubyBlock) {
            switch (name) {
                case "i2cuart_command0":
                    block = this._createBlock("i2c_uart_command0", "value");
                    break;
            }
        }
        return block;
    },
};

export default I2C_UARTConverter;
