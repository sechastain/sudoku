
var board = [];

var range = function(max, min) {
    var arr = [];
    var i = min ? min : 0;
    for(; i < max; i++) {
        arr.push(i);
    }
    return arr;
};

var cell = function(r, c) {
    return {
        row : r,
        col : c,
        val : null,
        possible : range(10, 1)
    };
};

range(9).forEach(function(r) {
    range(9).forEach(function(c) {
        board.push(cell(r, c));
    });
});

var rows = [];
range(9).forEach(function(r) {
    var row = board.filter(function(cell) {
        return cell.row === r;
    });
    rows.push(row);
});

var cols = [];
range(9).forEach(function(c) {
    var col = board.filter(function(cell) {
        return cell.col === c;
    });
    cols.push(col);
});

var sqrs = [];
range(9).forEach(function(s) {
    sqrs.push([]);
});
board.forEach(function(cell) {
    var s = Math.floor(cell.row / 3) * 3 + Math.floor(cell.col / 3);
    sqrs[s].push(cell);
});

var remove = function(grp, val) {
    grp.forEach(function(cell) {
        var i = cell.possible.indexOf(val);
        if(i >= 0) {
            cell.possible.splice(i, 1);
        }
    });
};

var solo = function(grp) {
    grp.forEach(function(cell) {
        if(cell.val) { // && cell.possible.length > 0) {
            cell.possible = [];
            remove(grp, cell.val);
        } else if(cell.possible.length === 1) {
            cell.val = cell.possible[0];
            cell.possible.splice(0, 1);
            remove(grp, cell.val);
        }
    });
};

var uniq = function(grp) {
    var uni = {};
    var non = {};
    var unsolved = [];
    grp.forEach(function(c) {
        if(c.val === null) {
            unsolved.push(c);
        } else {
            non[c.val] = c;
        }
    });
    unsolved.forEach(function(c) {
        c.possible.forEach(function(v) {
            if(!non[v]) {
                if(!uni[v]) {
                    uni[v] = c;
                } else {
                    delete uni[v];
                    non[v] = c;
                }
            }
        });
    });
    var keys = Object.keys(uni).map(function(v) {
        return parseInt(v);
    });
    keys.forEach(function(u) {
        uni[u].pot = [];
    });
    keys.forEach(function(u) {
        uni[u].pot.push(u);
    });
    keys.forEach(function(u) {
        if(uni[u].pot) {
            uni[u].possible = uni[u].pot;
            delete uni[u].pot;
        }
    });
    solo(grp);
};

var solved = function(grp) {
    return grp.every(function(cell) {
        return cell.val !== null;
    });
};

var print = function() {
    console.log('-----------------');
    rows.forEach(function(r) {
        var p = r.map(function(c) {
            return c.val ? '' + c.val : ' ';
        });
        console.log(p);
    });
}

/*
board[0].val = 7;
board[1].val = 9;
board[6].val = 3;
board[14].val = 6;
board[15].val = 9;
board[18].val = 8;
board[22].val = 3;
board[25].val = 7;
board[26].val = 6;
board[32].val = 5;
board[35].val = 2;
board[38].val = 5;
board[39].val = 4;
board[40].val = 1;
board[41].val = 8;
board[42].val = 7;
board[45].val = 4;
board[48].val = 7;
board[54].val = 6;
board[55].val = 1;
board[58].val = 9;
board[62].val = 8;
board[65].val = 2;
board[66].val = 3;
board[74].val = 9;
board[79].val = 5;
board[80].val = 4;
*/

/*
board[5].val = 7;
board[11].val = 2;
board[12].val = 4;
board[14].val = 6;
board[15].val = 3;
board[19].val = 1;
board[20].val = 7;
board[24].val = 9;
board[25].val = 6;
board[27].val = 5;
board[28].val = 8;
board[34].val = 3;
board[40].val = 9;
board[46].val = 7;
board[52].val = 4;
board[53].val = 2;
board[55].val = 9;
board[56].val = 4;
board[60].val = 6;
board[61].val = 5;
board[65].val = 5;
board[66].val = 2;
board[68].val = 8;
board[69].val = 1;
board[75].val = 5;
*/

board[0].val = 2;
board[3].val = 5;
board[7].val = 8;
board[11].val = 1;
board[13].val = 2;
board[28].val = 7;
board[32].val = 8;
board[38].val = 3;
board[43].val = 2;
board[49].val = 7;
board[51].val = 6;
board[54].val = 6;
board[57].val = 2;
board[62].val = 1;
board[64].val = 4;
board[69].val = 7;
board[75].val = 3;

while(!solved(board)) {
//    rows.forEach(solo);
//    cols.forEach(solo);
//    sqrs.forEach(solo);
    rows.forEach(uniq);
    cols.forEach(uniq);
    sqrs.forEach(uniq);

    print();
}
