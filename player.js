l = console.log;

function toNum(c) {
    switch(c) {
        case 'J':
            return 11;
            break;
        case 'Q':
            return 12;
            break;
        case 'K':
            return 13;
            break;
        case 'A':
            return 14;
            break;

        default:
            return card
    }
}

function compute_avg_stack(players) {
    var sum = 0;
    for (var i in players) {
        sum += players[i].stack;
    }
    return sum / players.length;
}

function compute_chip_factor(g) {
    var average_stack = compute_avg_stack(g.players);
    var myself = g.players[g.in_action];

    var strength = (myself.stack > average_stack) ? (myself.stack / average_stack) : 0.5;

    if (g.current_buy_in < g.pot) {
        return strength;
    }
    else {
        return strength * g.pot / g.current_buy_in;
    }
}

function lameCards(cards) {
    // return TRUE if the cards are LAME
    if (
        toNum(cards[0].rank) < 9 &&
        toNum(cards[1].rank) < 9 &&
        cards[0].rank != cards[1].rank
       ) {
        return true
    } else {
        return false
    }
}

module.exports = {

    VERSION: "Jofogas's Zsozsobot v4",

  bet_request: function(g) {
    l("----", VERSION);
    l(new Date());
    var myself = g.players[g.in_action];
    var call = g.current_buy_in - myself["bet"];
    var min_raise = call + g.minimum_raise;

    // just in case!!!
    if (myself.status != "active") {
        return "OK";
    }

    // don't bet before flop if our hand is crap
    if (g.community_cards.length < 1) {
        // we're before flop
        if (lameCards(myself.hole_cards)) {
            // fold
            return 0;
        } else
            // call
            return call;
        }
    }

    if (myself.hole_cards[0].rank == myself.hole_cards[1].rank) {
        l("Go all in");
        return myself.stack;
    }
    var average_stack = compute_avg_stack(g.players);
    l("Average stack is: ", average_stack); 
    l("My stack is : ", myself.stack);
    l("chip_factor returns: ", compute_chip_factor(g));

    if (myself.stack > average_stack * 0.7) {
        /* brave */
        var bet = min_raise * 2;
        l("fearlessly raising: ", bet);
        return bet;
    }
    else {
        /* tight */
        l("fearfully not raising: ", 0);
        return 0;
    }
  },

    showdown: function(g) {
        return 'what is this for?';
    }
};
