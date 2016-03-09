const EMPTY = -1;
const BOMB = 9;
const DEMINED = 10;
const WIDTH = 10;
const HEIGHT = 10;

export default {

    /**
     * Generate init map
     */
    init() {
        var _map = [];
        for(var i = 0; i < HEIGHT; i++) {
            var row = [];
            for(var j = 0; j < WIDTH; j++) {
                row.push(Math.round(Math.random() * 10) == 1 ? BOMB : EMPTY);
            }
            _map.push(row);
        }
        return _map;
    },

    /**
     * Apply set of updates on map,
     */
    applyUpdate(map, updates) {
        for (var i in updates) {
            var update = updates[i];
            map[update.y][update.x] = update.v;
        }
        return map;
    },

    /**
     * Retrieve updates for shoot,
     */
    getUpdatesForShoot(map, x, y) {
        if (
            x < 0 ||
            y < 0 ||
            x >= WIDTH ||
            y >= HEIGHT ||
            map[y][x] != -1
        ) {
            return [];
        }

        var self = this;
        var updates = [];
        var around = this.howManyAround(BOMB, map, x, y);

        updates.push({x: x, y: y, v: around});
        map = this.applyUpdate(map, updates);

        if (around === 0) {
            // calculate deeper
            [-1, 0, 1].map(function (delta_y) {
                [-1, 0, 1].map(function (delta_x) {
                    var u = self.getUpdatesForShoot(map, x + delta_x, y + delta_y);
                    map = self.applyUpdate(map, u);
                    updates.concat(u);
                });
            });
        }

        return updates;
    },

    howManyAround(type, map, x, y) {
        var result = 0;

        if (y > 0 && map[y - 1][x] == type) result++;
        if (y < HEIGHT - 1 && map[y + 1][x] == type) result++;

        if (x < WIDTH - 1 && map[y][x + 1] == type) result++;
        if (x > 0 && map[y][x - 1] == type) result++;

        if (y > 0 && x > 0 && map[y - 1][x - 1] == type) result++;
        if (y > 0 && x < HEIGHT - 1 && map[y - 1][x + 1] == type) result++;

        if (y < HEIGHT - 1 && x > 0 && map[y + 1][x - 1] == type) result++;
        if (y < HEIGHT - 1 && x < WIDTH - 1 && map[y + 1][x + 1] == type) result++;

        return result;
    },

    openDemined(map) {
        return map.map((row, i) => {
            return row.map((col, j) => {
                if (map[i][j] == BOMB && this.howManyAround(EMPTY, map, j, i) == 0) {
                    return DEMINED;
                } else {
                    return map[i][j];
                }
            }, 0);
        }, 0);
    },

    shoot(map, x, y) {
        if (y >= map.length || x >= map[0].length) return ['none', map];
        //console.log(x, y, this.howManyAround([EMPTY, ], map, x, y));
        if (y < 0 || x < 0) return ['none', map];

        switch(map[y][x]) {
            case BOMB: return ['fail', map];
            case EMPTY:
                var updates = this.getUpdatesForShoot(map, x, y);
                var result_map = this.applyUpdate(map, updates);

                // open demined mines
                result_map = this.openDemined(result_map);

                return [this.checkWin(map) === 0 ? 'win' : result_map[y][x], result_map];
            default: return ['none', map];
        }
    },

    showMines(map) {
        for (var i in map) {
            for (var j in map[i]) {
                map[i][j] = map[i][j] == 9 ? DEMINED : map[i][j];
            }
        }
        return map;
    },

    checkWin(map) {
        return map.reduce(function (res, row, i) {
            return res + row.reduce(function (res, col, j) {
                // if (map[i][j] == BOMB) {
                //     console.log(i, j, Game.howManyClosed(EMPTY, map, j, i))
                // }
                return res + (map[i][j] == -1 ? 1 : 0);
            }, 0);
        }, 0);
    }
}

