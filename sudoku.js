
var fs = require('fs');

var board = [];

// create a list of values from min (inclusive) to upper (exclusive)
var range = function(upper, min) {
    var arr = [];
    var i = min ? min : 0;
    for(; i < upper; i++) {
        arr.push(i);
    }
    return arr;
};

// build a new cell
var cell = function(r, c) {
    return {
        row : r,
        col : c,
        val : null,
        possible : range(10, 1),
    };
};

// build the board
range(9).forEach(function(r) {
    range(9).forEach(function(c) {
        board.push(cell(r, c));
    });
});

var rows = [];
var cols = [];
var sqrs = [];
range(9).forEach(function(s) {
    rows.push([]);
    cols.push([]);
    sqrs.push([]);
});
board.forEach(function(cell) {
    var s = Math.floor(cell.row / 3) * 3 + Math.floor(cell.col / 3);
    rows[cell.row].push(cell);
    cols[cell.col].push(cell);
    sqrs[s].push(cell);
    cell.groups = [rows[cell.row], cols[cell.col], sqrs[s]];
});

var removed = false;

// remove val from the possible list of each cell in the group
var remove = function(grp, val) {
    removed = true;
    grp.forEach(function(cell) {
        var i = cell.possible.indexOf(val);
        if(i >= 0) {
            cell.possible.splice(i, 1);
        }
    });
};

// look to see if the list of possibilities for any cell in a group is 1
// if so, set the value of the cell and remove the value from the 
// list of possible values in the cells in groups related to the cell
var found = function(grp) {
    grp.forEach(function(cell) {
        if(cell.possible.length === 1) {
            cell.val = cell.possible[0];
            cell.possible.splice(0, 1);
            cell.groups.forEach(function(g) {
                remove(g, cell.val);
            });
        }
    });
};

// look for possible values unique to a cell
var unique_possibilities = function(grp) {
    var unique = {};
    var non = {};
    var unsolved = [];

    // build our list of unsolved cells and
    // our map of non-unique (found) values
    grp.forEach(function(c) {
        if(c.val === null) {
            unsolved.push(c);
        } else {
            non[c.val] = c;
        }
    });

    unsolved.forEach(function(c) {
        //for each possible value in each unsolved cell
        c.possible.forEach(function(v) {
            // if the value is already non-unique ignore it
            // however, if it's not flagged non-unique yet
            if(!non[v]) {
                // if the value is not flagged as unique yet, flag it
                if(!unique[v]) {
                    unique[v] = c;
                // else remove it from the list of flagged unique 
                // possible values
                } else {
                    delete unique[v];
                    non[v] = c;
                }
            }
        });
    });

    // so now unique is a map of possible values unique to a particular cell
    // we need to get the values
    var keys = Object.keys(unique).map(function(v) {
        return parseInt(v);
    });

    // for any unique value, we create a temporary list in the affected cell.
    // the temporary list could end up holding multiple unique values
    keys.forEach(function(u) {
        if(unique[u].potential) {
            unique[u].potential.push(u);
        } else {
            unique[u].potential = [u];
        }
    });

    // make the temporary list the new list of possible values for 
    // affected cells.  delete the temporary list
    keys.forEach(function(u) {
        if(unique[u].potential) {
            unique[u].possible = unique[u].potential;
            delete unique[u].potential;
        }
    });
};

var solved = function(grp) {
    return grp.every(function(cell) {
        return cell.val !== null;
    });
};

var print = function(poss) {
    console.log('-----------------');
    rows.forEach(function(r) {
        var p = r.map(function(c) {
            return c.val ? '' + c.val : ' ';
        });
        console.log(p);
    });
    if(poss) {
        board.forEach(function(c) {
            if(!c.val) {
                delete c.groups;
                console.log(c);
            }
        });
    }
}

var file = fs.readFileSync(process.argv[2], 'utf8');

console.log(file);

file.split('\n').forEach(function(l, r) {
    l.split('').forEach(function(v, c) {
        v = parseInt(v);
        if(v > 0 && v < 10 && r >=0 && r < 9 && c >= 0 && c < 9) {
            var cell = board[r * 9 + c];
            cell.val = v;
            cell.possible = [];
            cell.groups.forEach(function(g) {
                remove(g, cell.val);
            });
        }
    });
});

var colls = [rows, cols, sqrs];

print();
while(!solved(board)) {
    removed = false;
    colls.forEach(function(coll) {
        coll.forEach(function(group) {
            unique_possibilities(group);
        });
    });
    found(board);
    print(!removed);
    if(!removed) {
        break;
    }
}
