function bfs_search_for_all_unlit(initial_state, count) {
    var checked_states = [];
    var upper_limit = initial_state['candles'];
    var bfs_queue = [initial_state];

    while (bfs_queue.length > 0) {
        var current_state = bfs_queue.shift();
        var candles = current_state['candles'];
        checked_states.push(candles);

        if (current_state.blows > 100) {
            return null;
        }

        var blow_area = 7; // 111 in binary
        for (let i = 1; i <= count; i++) {
            var updated_candles = candles ^ blow_area;
            if (!checked_states.includes(updated_candles)) {
                var _prev_states = current_state['previous_states'].slice(0);
                _prev_states.push(candles);
                var new_state = {
                    'candles': updated_candles,
                    'blows': current_state['blows'] + 1,
                    'previous_states': _prev_states,
                    'blow_on': (i < count) ? i : 0
                };
                bfs_queue.push(new_state);
                if (updated_candles === 0) {
                    return new_state;
                }
            }
            blow_area = blow_area << 1;
            if (blow_area > upper_limit) {
                blow_area = (blow_area & upper_limit) | 1;
            }
        }
    }
    return null;
}

function candle_puzzle(count) {
    var candles = 1;
    for (let i = 1; i < count; i++) {
        candles = (candles << 1) | 1;
    }
    var initial_state = {
        'candles': candles,
        'blows': 0,
        'previous_states': [],
        'blow_on': null
    };

    return bfs_search_for_all_unlit(initial_state, count);
}

function getCandlesString(value, n) {
    var multiplier = 1;
    let str = "";
    for (let i = 0; i < n; i++) {
        if (value & multiplier) {
            str += "* ";
        } else {
            str += ". ";
        }
        multiplier = multiplier << 1;
    }
    return str;
}

function handle_user_input() {
    $("#submit").on("click", function () {
        var count = $("#count").val();

        if (count < 3 || count > 30) {
            $("#content").html("Please enter a number between 3 and 30");
        } else {
            $("#content").html("Calculating for " + count + " candles.");

            var result = candle_puzzle(count);
            if (result === null) {
                $("#content").html("No solution found for " + count + " candles");
            } else {
                var str = "All candles can be eliminated with <strong>" + result['blows'] + "</strong> blows.<br>";
                for (var i = 0; i < result['previous_states'].length; i++) {
                    str += "Blow #" + i + ": ";
                    str += getCandlesString(result['previous_states'][i], count) + "<br>";
                }
                str += "Blow #" + i + ": " + getCandlesString(0, count);
                $("#content").html(str);
            }
        }
        return false;
    });
};

handle_user_input();
