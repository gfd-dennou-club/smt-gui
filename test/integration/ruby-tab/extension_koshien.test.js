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

describe('Ruby Tab: Koshien extension blocks', () => {
    beforeAll(() => {
        driver = getDriver();
    });

    afterAll(async () => {
        await driver.quit();
    });

    test('Ruby -> Code -> Ruby', async () => {
        await loadUri(urlFor('/'));

        const code = dedent`
            list("$通らない座標")

            list("$最短経路")

            list("$地形・アイテム")

            koshien.connect_game(name: "player1")
            koshien.get_map_area(0, 1)
            koshien.move_to(2, 3)
            koshien.calc_route(src: [4, 5], dst: [6, 7], except_cells: "通らない座標", result: "最短経路")
            koshien.set_dynamite(8, 9)
            koshien.set_bomb(10, 11)

            koshien.map(12, 13)

            koshien.load_map("map1", 14, 0)

            koshien.save_map_all("map1")
            koshien.locate_objects(sq_size: 3, cent: [1, 2], objects: "A B C D", result: "地形・アイテム")

            koshien.other_player_x

            koshien.turn_over

            koshien.coordinate_of_x("0:1")

            koshien.coordinate_of_y("2:3")

            koshien.player_y

            koshien.player_x

            koshien.goal_x

            koshien.goal_y

            koshien.enemy_x

            koshien.enemy_y

            koshien.other_player_y

        `;
        await expectInterconvertBetweenCodeAndRuby(code);
    });
});
