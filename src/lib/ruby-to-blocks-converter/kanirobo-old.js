/* global Opal */
import _ from "lodash";

const matchField = (field) => {
    if (/motorEn/.test(field)) return "motorEn";
    if (/motor25/.test(field)) return "motor25";
    if (/motor32/.test(field)) return "motor32";
    if (/motor26_pwm/.test(field)) return "motor26_pwm";
    if (/motor33_pwm/.test(field)) return "motor33_pwm";
    if (/lux36/.test(field)) return "lux36";
    if (/lux34/.test(field)) return "lux34";
    if (/lux35/.test(field)) return "lux35";
    if (/lux2/.test(field)) return "lux2";
    if (/servo27/.test(field)) return "servo27";
    if (/servo14/.test(field)) return "servo14";
    let regexp =
        /(\d+).*to_f.*-.*90\).*\*.*0\.95.*\/.*90.*\+.*1\.45\).*\/.*20.*\*.*1024\)/s;
    if (regexp.test(field)) {
        let res = regexp.exec(field);
        // console.log("res[1]: " + res[1]);

        return parseInt(res[1]);
    }
};
/**
 * Kani Blocks Ruby converter
 */
const KaniOldBlocksConverter = {
    // eslint-disable-next-line no-unused-vars
    onSend: function (
        receiver,
        name,
        args,
        rubyBlockArgs,
        rubyBlock,
        variable
    ) {
        let block;
        //if ((this._isSelf(receiver) || receiver === Opal.nil) && !rubyBlock) {}
        let field = matchField(variable.name);
        switch (field) {
            case "motorEn":
                if (name != "on" && name != "off") break;
                block = this._createBlock(
                    "kani_motor_enable_set_n",
                    "statement",
                    {
                        fields: {
                            enable: {
                                name: "enable",
                                id: variable.id,
                                value: name,
                                variableType: "",
                            },
                        },
                    }
                );
                break;
            case "motor25":
            case "motor32":
                if (name != "on" && name != "off") break;
                block = this._createBlock("kani_motor_direct_n", "statement", {
                    fields: {
                        ch: {
                            name: "ch",
                            id: variable.id,
                            value: parseInt(field.substring(field.length - 2)),
                            variableType: "",
                        },
                        direction: {
                            name: "direction",
                            id: variable.id,
                            value: name,
                            variableType: "",
                        },
                    },
                });
                break;
            case "motor26_pwm":
            case "motor33_pwm":
                if (name != "duty") break;
                block = this._createBlock(
                    "kani_motor_speed_set_n",
                    "statement",
                    {
                        fields: {
                            ch: {
                                name: "ch",
                                id: variable.id,
                                value: parseInt(
                                    field.substring(
                                        field.length - 6,
                                        field.length - 4
                                    )
                                ),
                                variableType: "",
                            },
                        },
                    }
                );
                this._addTextInput(
                    block,
                    "speed",
                    this._isNumber(args[0]) ? args[0].toString() : args[0],
                    "500"
                );
                break;
            case "lux36":
            case "lux34":
            case "lux35":
            case "lux2":
                if (name != "rawread") break;
                block = this._createBlock("kani_lux_get_n", "value", {
                    fields: {
                        number: {
                            name: "number",
                            id: variable.id,
                            value: parseInt(field.substring(3, field.length)),
                            variableType: "",
                        },
                    },
                });
                break;
            case "servo27":
            case "servo14":
                switch (name) {
                    case "freq":
                        block = this._createBlock(
                            "kani_servo_freq_n",
                            "statement",
                            {
                                fields: {
                                    number: {
                                        name: "number",
                                        id: variable.id,
                                        value: parseInt(
                                            field.substring(
                                                field.length - 2,
                                                field.length
                                            )
                                        ),
                                        variableType: "",
                                    },
                                },
                            }
                        );
                        this._addTextInput(
                            block,
                            "freq",
                            this._isNumber(args[0])
                                ? args[0].toString()
                                : args[0],
                            "50"
                        );
                        break;
                    case "duty":
                        block = this._createBlock(
                            "kani_servo_duty_n",
                            "statement",
                            {
                                fields: {
                                    number: {
                                        name: "number",
                                        id: variable.id,
                                        value: parseInt(
                                            field.substring(
                                                field.length - 2,
                                                field.length
                                            )
                                        ),
                                        variableType: "",
                                    },
                                },
                            }
                        );
                        this._addTextInput(
                            block,
                            "duty",
                            this._isNumber(args[0])
                                ? args[0].toString()
                                : args[0],
                            "0"
                        );
                        break;
                }
                break;
            default:
                if (name != "to_i" || !this._isNumber(field)) break;
                block = this._createBlock("kani_servo_deg_calc_n", "value");
                this._addTextInput(block, "degree", field.toString(), "0");
                break;
        }

        return block;
    },
    onVasgn: function (scope, variable, rh, code) {
        let block;
        let pat, pin;
        switch (variable.name) {
            case "motorEn":
                pat = /motorEn\s*=\s*GPIO.new\(12,\s*GPIO::OUT\)/;
                if (pat.test(code)) {
                    block = this._createBlock(
                        "kani_motor_enable_init_n",
                        "statement"
                    );
                }
                break;
            case "motor25":
            case "motor32":
                pin = parseInt(
                    variable.name.substring(
                        variable.name.length - 2,
                        variable.name.length
                    )
                );
                pat = new RegExp(
                    variable.name +
                        "\\s*=\\s*GPIO.new\\(" +
                        pin +
                        ",\\s*GPIO::OUT\\)"
                );
                if (pat.test(code)) {
                    block = this._createBlock(
                        "kani_motor_init_n",
                        "statement",
                        {
                            fields: {
                                ch: {
                                    name: "ch",
                                    id: variable.id,
                                    value: pin,
                                    variableType: "",
                                },
                            },
                        }
                    );
                }
                break;
            case "motor26_pwm":
            case "motor33_pwm":
                pin = parseInt(
                    variable.name.substring(
                        variable.name.length - 6,
                        variable.name.length - 4
                    )
                );
                pat = new RegExp(
                    variable.name +
                        "\\s*=\\s*PWM.new\\(" +
                        pin +
                        ",\\s*ch=" +
                        (pin % 2) +
                        "\\)"
                );
                if (pat.test(code)) {
                    block = this._createBlock(
                        "kani_motor_speed_init_n",
                        "statement",
                        {
                            fields: {
                                ch: {
                                    name: "ch",
                                    id: variable.id,
                                    value: pin,
                                    variableType: "",
                                },
                            },
                        }
                    );
                }
                break;
            case "lux36":
            case "lux34":
            case "lux35":
            case "lux2":
                pin = parseInt(
                    variable.name.substring(3, variable.name.length)
                );
                pat = new RegExp(
                    variable.name +
                        "\\s*=\\s*ADC.new\\(" +
                        pin +
                        ",\\s*ADC::ATTEN_11DB,\\s*ADC::WIDTH_12BIT\\)"
                );
                if (pat.test(code)) {
                    block = this._createBlock("kani_lux_init_n", "statement", {
                        fields: {
                            number: {
                                name: "number",
                                id: variable.id,
                                value: pin,
                                variableType: "",
                            },
                        },
                    });
                }
                break;
            case "servo27":
            case "servo14":
                pin = parseInt(
                    variable.name.substring(
                        variable.name.length - 2,
                        variable.name.length
                    )
                );
                pat = new RegExp(
                    variable.name +
                        "\\s*=\\s*PWM.new\\(" +
                        pin +
                        ",\\s*ch=" +
                        ((pin % 2) + 2) +
                        "\\)"
                );
                if (pat.test(code)) {
                    block = this._createBlock(
                        "kani_servo_init_n",
                        "statement",
                        {
                            fields: {
                                number: {
                                    name: "number",
                                    id: variable.id,
                                    value: pin,
                                    variableType: "",
                                },
                            },
                        }
                    );
                }
                break;
        }
        return block;
    },
    // onOpAsgn: function (lh, operator, rh) {},
    // onVar: function (scope, variable) {},
    // onAnd: function (operands) {},
    // onOr: function (operands) {},
    // onUntil: function (cond, statement) {},
    // onIf: function (cond, statement, elseStatement) {},
    // onDefs: function (node, saved) {},
};

export default KaniOldBlocksConverter;
