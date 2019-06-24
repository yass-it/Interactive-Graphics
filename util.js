"use strict";


function apply_matrix3(matrix, vector) {
    if (!matrix.matrix)
        throw "apply_matrix3(): the first argument is not a matrix";
    if (matrix[0].length < 3 || vector.length < 3)
        throw "mult_mat_vec(): wrong dimensions";

    var ris = Array.apply(null, Array(3)).map(Number.prototype.valueOf,0);

    for ( var i = 0; i < 3; ++i ) {
        for ( var j = 0; j < 3; ++j ) {
            ris[i] += matrix[i][j] * vector[j];
        }
    }

    return ris;
}

function apply_matrix4(matrix, vector) {
    if (!matrix.matrix)
        throw "apply_matrix3(): the first argument is not a matrix";
    if (matrix[0].length < 4 || vector.length < 4)
        throw "mult_mat_vec(): wrong dimensions";

    var ris = Array.apply(null, Array(4)).map(Number.prototype.valueOf,0);

    for ( var i = 0; i < 4; ++i ) {
        for ( var j = 0; j < 4; ++j ) {
            ris[i] += matrix[i][j] * vector[j];
        }
    }

    return ris;
}




function mult_mat_vec(matrix, vector) {
    if (!matrix.matrix)
        throw "mult_mat_vec(): the first argument is not a matrix";
    if (matrix[0].length != vector.length)
        throw "mult_mat_vec(): wrong dimensions";

    var ris = Array.apply(null, Array(matrix.length)).map(Number.prototype.valueOf,0);

    for ( var i = 0; i < matrix.length; ++i ) {
        for ( var j = 0; j < matrix[0].length; ++j ) {
            ris[i] += matrix[i][j] * vector[j];
        }
    }

    return ris;
}



function dump_matrix(matrix) {
    var ris = "";
    for ( var i = 0; i < matrix.length; ++i ) {
        for ( var j = 0; j < matrix[0].length; ++j ) {
            if (j < matrix[0].length - 1)
                ris += matrix[i][j].toString() + ", ";
            else ris += matrix[i][j].toString();
        }
        ris += "\n";
    }
    return ris;
}




function linear_interpolation(vec1, min, max, min2, max2) {
    var vec2;
    vec2 = vec1 * ((max2-min2) / (max - min));
    return vec2;
}

function sign(value) {
    if (value > 0) return +1;
    else if (value == 0) return 0;
    else return -1;
}

function min(vec1,vec2) {
    if (vec1<vec2) return vec1;
    else return vec2;
}


function fix_round_error(value, mult) {
    var temp = value/mult;
    temp = Math.round(temp);
    return mult*temp;
}

function abs(vec) {
    if (vec>0)
        return vec;
    else return -vec;
}

function genFood(world_w, world_h, world, kangaroo) {
    var food_pos = [];
    do {
        food_pos[0] = Math.round(Math.random()*100) % world_w;
        food_pos[1] = Math.round(Math.random()*100) % world_h;


        if(food_pos[1]==7 || (food_pos[0]==7 || food_pos[0] == 8)){
          food_pos[0]=9;
          food_pos[1]=8;
        }
        // console.log("ITERATION", fpos);
    } while (world[food_pos[0]][food_pos[1]].element != VOID);
    if (!kangaroo)
        world[food_pos[0]][food_pos[1]].element = PARALLELOGRAM;
    return food_pos;
}


function build_env_matrix(world_w, world_h, food, obstacles, kangaroo) {
    var ris = [];
    for (var i=0; i<world_w; i++) {
        ris.push([]);
        for (var j=0; j<world_h; j++) {
            var el = {};
            el.element = VOID;
            for (var k=0; k<food.length; k++) {
                if (food[k][0] == i && food[k][1] == j) {
                    el.element = PARALLELOGRAM;
                    break;
                }
            }
            for (var k=0; k<obstacles.length; k++) {
                if (obstacles[k][0] == i && obstacles[k][1] == j) {
                    el.element = PYRAMID;
                    break;
                }
            }
            for (var k=0; k<kangaroo.length; k++) {
                if (kangaroo[k][0] == i && kangaroo[k][1] == j) {
                    el.element = KANGAROO;
                    break;
                }
            }
            el.color = vec4( linear_interpolation(i, 0, world_w, 0.1, 0.9),
                             linear_interpolation(i+j, 0, world_w+world_h, 0.1, 0.9),
                             linear_interpolation(j, 0, world_h, 0.1, 0.9), 1.0);
            var square_scalematrix = scalem(tile_size_min,1.0,tile_size_min);
            el.modelView = mult(translate(tile_size_min/2 + tile_size_max*i , 0.0, tile_size_min/2 + tile_size_max*j), square_scalematrix);
            ris[i][j] = el;
        }

    }
    return ris;
}

// Converts from degrees to radians.
Math.radians = function(degrees) {
  return degrees * Math.PI / 180;
};


function updatePoints(points) {
    document.getElementById("points").innerHTML = "POINTS: "+points;
}

// Function for adding received score during the game to the storage
function addResult(result){

  if (typeof(Storage) !== "undefined") {

    if(localStorage.getItem("count")==null){
      parseInt(localStorage.setItem("count",0));
    }
    localStorage.setItem("result"+parseInt(localStorage.getItem("count")), result);
    count = parseInt(localStorage.getItem("count"))+1;
    parseInt(localStorage.setItem("count",count));

  }else {
  document.getElementById("results").innerHTML = "Sorry, your browser does not support Web Storage...";
  }

}

// UTIL FUNCTIONS

var stack = [];
var modelViewMatrix = mat4();
function traverse(figure, Id) {
    if(Id == null) return;
    stack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, figure[Id].transform);
    figure[Id].render(modelViewMatrix);
    if(figure[Id].child != null) traverse(figure[Id].child);
    modelViewMatrix = stack.pop();
    if(figure[Id].sibling != null) traverse(figure[Id].sibling);
}

function createNode(transform, render, sibling, child){
    var node = {
    transform: transform,
    render: render,
    sibling: sibling,
    child: child,
    }
    return node;
}
