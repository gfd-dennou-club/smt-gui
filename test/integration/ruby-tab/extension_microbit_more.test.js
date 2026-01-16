import dedent from 'dedent';
import SeleniumHelper from '../../helpers/selenium-helper';
import RubyHelper from '../../helpers/ruby-helper';

const seleniumHelper = new SeleniumHelper();
const {
    getDriver,
    loadUri,
    urlFor
} = seleniumHelper;

const rubyHelper = new RubyHelper(seleniumHelper);
const {
    expectInterconvertBetweenCodeAndRuby
} = rubyHelper;

let driver;

describe('Ruby Tab: Microbit More v2 extension blocks', () => {
    beforeAll(() => {
        driver = getDriver();
    });

    afterAll(async () => {
        await driver.quit();
    });

    test('Ruby -> Code -> Ruby', async () => {
        await loadUri(urlFor('/'));

        const code = dedent`
            microbit_more.when_microbit("connected") do
            end

            microbit_more.when_microbit("disconnected") do
            end

            microbit_more.when_button_is("A", "down") do
            end

            microbit_more.when_button_is("B", "click") do
            end

            microbit_more.button_pressed?("A")

            microbit_more.button_pressed?("B")

            microbit_more.when_pin_is("LOGO", "touched") do
            end

            microbit_more.when_pin_is("P2", "tapped") do
            end

            microbit_more.when_pin_connected(0) do
            end

            microbit_more.when_pin_connected(1) do
            end

            microbit_more.when_pin_connected(2) do
            end

            microbit_more.pin_is_touched?("LOGO")

            microbit_more.pin_is_touched?("P2")

            microbit_more.when("shake") do
            end

            microbit_more.when("6G") do
            end

            microbit_more.when("moved") do
            end

            microbit_more.when("tilted_any") do
            end

            microbit_more.when("tilted_front") do
            end

            microbit_more.when("tilted_back") do
            end

            microbit_more.when("tilted_left") do
            end

            microbit_more.when("tilted_right") do
            end

            microbit_more.tilted?("any")

            microbit_more.tilted?("front")

            microbit_more.tilted?("back")

            microbit_more.tilted?("left")

            microbit_more.tilted?("right")

            microbit_more.display_pattern(
              ".1.1.",
              "1.1.1",
              "1...1",
              ".1.1.",
              "..1.."
            )
            microbit_more.display_pattern(
              "1...1",
              ".1.1.",
              "..1..",
              ".1.1.",
              "1...1"
            )
            microbit_more.display_text_delay("Hello!", 120)
            microbit_more.display_text_delay("Test", 60)
            microbit_more.clear_display

            microbit_more.light_intensity

            microbit_more.temperature

            microbit_more.angle_with_north

            microbit_more.pitch

            microbit_more.roll

            microbit_more.tilt_angle("front")

            microbit_more.tilt_angle("back")

            microbit_more.tilt_angle("left")

            microbit_more.tilt_angle("right")

            microbit_more.sound_level

            microbit_more.magnetic_force("absolute")

            microbit_more.magnetic_force("x")

            microbit_more.acceleration("x")

            microbit_more.acceleration("absolute")

            microbit_more.analog_value("P0")

            microbit_more.analog_value("P2")

            microbit_more.set_pin_to_input_pull("P0", "up")
            microbit_more.set_pin_to_input_pull("P16", "down")

            microbit_more.is_pin_high?("P0")

            microbit_more.is_pin_high?("P16")

            microbit_more.set_digital("P0", "Low")
            microbit_more.set_digital("P16", "High")
            microbit_more.set_analog("P0", 0)
            microbit_more.set_analog("P16", 100)
            microbit_more.set_servo("P0", 0)
            microbit_more.set_servo("P16", 100)
            microbit_more.play_tone(440, 100)
            microbit_more.play_tone(220, 50)
            microbit_more.stop_tone
            microbit_more.listen_event_on("none", "P0")
            microbit_more.listen_event_on("edge", "P16")

            microbit_more.when_catch_at_pin("low pulse", "P0") do
            end

            microbit_more.when_catch_at_pin("rise", "P16") do
            end

            microbit_more.value_of("low pulse", "P0")

            microbit_more.value_of("rise", "P16")

            microbit_more.when_data_received_from_microbit("label-01") do
            end

            microbit_more.when_data_received_from_microbit("label-02") do
            end

            microbit_more.data["label-01"]

            microbit_more.data["label-02"]

            microbit_more.send_data_to_microbit("data", "label-01")
            microbit_more.send_data_to_microbit("123456", "label-02")
        `;

        await expectInterconvertBetweenCodeAndRuby(code);
    });
});
