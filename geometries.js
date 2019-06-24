"use strict";


var pyramid_vertices = [
    vec4(  1.0,  0.0,  1.0, 1.0 ),
    vec4(  1.0,  0.0, -1.0, 1.0 ),
    vec4( -1.0,  0.0, -1.0, 1.0 ),
    vec4( -1.0,  0.0,  1.0, 1.0 ),
    vec4(  0.0,  1.0,  0.0, 1.0 )
];
// gl.TRIANGLES
var pyramidArray =
[pyramid_vertices[0], pyramid_vertices[1], pyramid_vertices[2],
 pyramid_vertices[0], pyramid_vertices[2], pyramid_vertices[3],
 pyramid_vertices[0], pyramid_vertices[1], pyramid_vertices[4],
 pyramid_vertices[0], pyramid_vertices[4], pyramid_vertices[3],
 pyramid_vertices[3], pyramid_vertices[4], pyramid_vertices[2],
 pyramid_vertices[2], pyramid_vertices[4], pyramid_vertices[1]];
var lenPyramidArray = 18;

var pyramidNormalsArray = [];
for (var i=0; i<lenPyramidArray/3; i++) {
    var t1 = subtract(pyramidArray[i*3+1], pyramidArray[i*3+0]);
    var t2 = subtract(pyramidArray[i*3+2], pyramidArray[i*3+1]);
    for (var j=0; j<3; j++)
      pyramidNormalsArray.push(vec4(normalize(cross(t1,t2)), 0.0));
}

var pyramid_scalematrix = scalem(0.11,0.20,0.11);

var pyramidTexCoordsArray = [
    texCoords[3], texCoords[2], texCoords[1],
    texCoords[3], texCoords[1], texCoords[0],
    texCoords[0], texCoords[1], texCoords[3],
    texCoords[0], texCoords[1], texCoords[3],
    texCoords[0], texCoords[1], texCoords[3],
    texCoords[0], texCoords[1], texCoords[3]
];


// ###################################################################

var square_vertices = [
    vec4( -0.5, 0.0,  0.5, 1.0 ),
    vec4( -0.5, 0.0, -0.5, 1.0 ),
    vec4(  0.5, 0.0, -0.5, 1.0 ),
    vec4(  0.5, 0.0,  0.5, 1.0 )
];
//gl.TRIANGLE_FAN
var squareArray = square_vertices;
var lenSquareArray = 4;

var squareNormalsArray = [
    vec4( 0.0, 1.0, 0.0, 0.0),
    vec4( 0.0, 1.0, 0.0, 0.0),
    vec4( 0.0, 1.0, 0.0, 0.0),
    vec4( 0.0, 1.0, 0.0, 0.0)
];

var square_scalematrix = scalem(tile_size_min,1.0,tile_size_min);

var squareTexCoordsArray = [
    texCoords[3], texCoords[3],
    texCoords[1], texCoords[2]
];

// ###################################################################

var parallelogram_vertices = [
    vec4( -0.5, 0.0,  0.5, 1.0 ),
    vec4( -0.5, 0.0, -0.5, 1.0 ),
    vec4(  0.5, 0.0, -0.5, 1.0 ),
    vec4(  0.5, 0.0,  0.5, 1.0 ),
    vec4( -0.5, 1.0,  0.5, 1.0 ),
    vec4( -0.5, 1.0, -0.5, 1.0 ),
    vec4(  0.5, 1.0, -0.5, 1.0 ),
    vec4(  0.5, 1.0,  0.5, 1.0 )
];
// gl.TRIANGLES
var parallelogramArray =
[ parallelogram_vertices[0], parallelogram_vertices[3], parallelogram_vertices[1],
  parallelogram_vertices[1], parallelogram_vertices[3], parallelogram_vertices[2],
  parallelogram_vertices[0], parallelogram_vertices[3], parallelogram_vertices[4],
  parallelogram_vertices[3], parallelogram_vertices[7], parallelogram_vertices[4],
  parallelogram_vertices[3], parallelogram_vertices[2], parallelogram_vertices[7],
  parallelogram_vertices[7], parallelogram_vertices[2], parallelogram_vertices[6],
  parallelogram_vertices[7], parallelogram_vertices[5], parallelogram_vertices[4],
  parallelogram_vertices[7], parallelogram_vertices[6], parallelogram_vertices[5],
  parallelogram_vertices[0], parallelogram_vertices[5], parallelogram_vertices[1],
  parallelogram_vertices[0], parallelogram_vertices[4], parallelogram_vertices[5],
  parallelogram_vertices[1], parallelogram_vertices[6], parallelogram_vertices[2],
  parallelogram_vertices[1], parallelogram_vertices[5], parallelogram_vertices[6]];
var lenParallelogramArray = 36;

var parallelogramNormalsArray = [];
for (var i=0; i<lenParallelogramArray/3; i++) {
    var t1 = subtract(parallelogramArray[i*3+1], parallelogramArray[i*3+0]);
    var t2 = subtract(parallelogramArray[i*3+2], parallelogramArray[i*3+1]);
    for (var j=0; j<3; j++)
      parallelogramNormalsArray.push(vec4(normalize(cross(t1,t2)), 0.0));
}

var parallelogramTexCoordsArray = [
    texCoords[0], texCoords[3], texCoords[1],
    texCoords[1], texCoords[3], texCoords[2],
    texCoords[0], texCoords[3], texCoords[1],
    texCoords[3], texCoords[2], texCoords[1],
    texCoords[0], texCoords[3], texCoords[1],
    texCoords[1], texCoords[3], texCoords[2],
    texCoords[3], texCoords[1], texCoords[0],
    texCoords[3], texCoords[2], texCoords[1],
    texCoords[0], texCoords[2], texCoords[3],
    texCoords[0], texCoords[1], texCoords[2],
    texCoords[0], texCoords[2], texCoords[3],
    texCoords[0], texCoords[1], texCoords[2]
];

var parallelogram_scalematrix = scalem(0.11,0.11,0.03);

// ###################################################################

var crocodilehead_vertices = [
    vec4( 0.0 , 0.0 , 0.35 ),
    vec4( 0.2 , 0.0 ,-0.05 ),
    vec4( 0.0 , 0.2 ,-0.05 ),
    vec4(-0.2 , 0.0 ,-0.05 ),
    vec4(-0.15, 0.0 ,-0.35 ),
    vec4(-0.08, 0.14,-0.35 ),
    vec4( 0.08, 0.14,-0.35 ),
    vec4( 0.15, 0.0 ,-0.35 )
];


// gl.TRIANGLES
var crocodileheadArray =
[
  crocodilehead_vertices[0], crocodilehead_vertices[2], crocodilehead_vertices[3],
  crocodilehead_vertices[0], crocodilehead_vertices[1], crocodilehead_vertices[2],
  crocodilehead_vertices[0], crocodilehead_vertices[3], crocodilehead_vertices[1],
  crocodilehead_vertices[1], crocodilehead_vertices[4], crocodilehead_vertices[7],
  crocodilehead_vertices[4], crocodilehead_vertices[1], crocodilehead_vertices[3],
  crocodilehead_vertices[4], crocodilehead_vertices[5], crocodilehead_vertices[7],
  crocodilehead_vertices[6], crocodilehead_vertices[7], crocodilehead_vertices[5],
  crocodilehead_vertices[5], crocodilehead_vertices[3], crocodilehead_vertices[4],
  crocodilehead_vertices[3], crocodilehead_vertices[2], crocodilehead_vertices[5],
  crocodilehead_vertices[2], crocodilehead_vertices[6], crocodilehead_vertices[5],
  crocodilehead_vertices[2], crocodilehead_vertices[1], crocodilehead_vertices[6],
  crocodilehead_vertices[1], crocodilehead_vertices[7], crocodilehead_vertices[6]
];
var lenCrocodileheadArray = 36;

var crocodileheadNormalsArray = [];
for (var i=0; i<lenCrocodileheadArray/3; i++) {
    var t1 = subtract(crocodileheadArray[i*3+1], crocodileheadArray[i*3+0]);
    var t2 = subtract(crocodileheadArray[i*3+2], crocodileheadArray[i*3+1]);
    for (var j=0; j<3; j++)
      crocodileheadNormalsArray.push(vec4(normalize(cross(t1,t2)), 0.0));
}

var crocodileheadTexCoordsArray = [
    texCoords[0], texCoords[1], texCoords[3],
    texCoords[0], texCoords[1], texCoords[3],
    texCoords[0], texCoords[1], texCoords[3],
    texCoords[4], texCoords[5], texCoords[0],
    texCoords[4], texCoords[5], texCoords[0],
    texCoords[0], texCoords[4], texCoords[5],
    texCoords[0], texCoords[4], texCoords[5],
    texCoords[0], texCoords[1], texCoords[3],
    texCoords[0], texCoords[1], texCoords[3],
    texCoords[0], texCoords[1], texCoords[3],
    texCoords[0], texCoords[1], texCoords[3],
    texCoords[0], texCoords[1], texCoords[3]
];

var crocodilehead_scalematrix = scalem(0.43,0.55,0.25);

// ###################################################################

var crocodilebody_vertices = [
    vec4(-0.18, 0.0 , 0.1 ),
    vec4(-0.11, 0.14, 0.1 ),
    vec4( 0.11, 0.14, 0.1 ),
    vec4( 0.18, 0.0 , 0.1 ),
    vec4(-0.18, 0.0 ,-0.1 ),
    vec4(-0.11, 0.14,-0.1 ),
    vec4( 0.11, 0.14,-0.1 ),
    vec4( 0.18, 0.0 ,-0.1 )
];

var crocodilebodyArray =
[
  crocodilebody_vertices[0], crocodilebody_vertices[3], crocodilebody_vertices[1],
  crocodilebody_vertices[1], crocodilebody_vertices[3], crocodilebody_vertices[2],
  crocodilebody_vertices[4], crocodilebody_vertices[7], crocodilebody_vertices[5],
  crocodilebody_vertices[6], crocodilebody_vertices[5], crocodilebody_vertices[7],
  crocodilebody_vertices[0], crocodilebody_vertices[1], crocodilebody_vertices[4],
  crocodilebody_vertices[4], crocodilebody_vertices[1], crocodilebody_vertices[5],
  crocodilebody_vertices[5], crocodilebody_vertices[1], crocodilebody_vertices[2],
  crocodilebody_vertices[2], crocodilebody_vertices[6], crocodilebody_vertices[5],
  crocodilebody_vertices[6], crocodilebody_vertices[2], crocodilebody_vertices[3],
  crocodilebody_vertices[3], crocodilebody_vertices[7], crocodilebody_vertices[6],
  crocodilebody_vertices[0], crocodilebody_vertices[7], crocodilebody_vertices[3],
  crocodilebody_vertices[4], crocodilebody_vertices[0], crocodilebody_vertices[7]];
var lenCrocodilebodyArray = 36;

var crocodilebodyNormalsArray = [];
for (var i=0; i<lenCrocodilebodyArray/3; i++) {
    var t1 = subtract(crocodilebodyArray[i*3+1], crocodilebodyArray[i*3+0]);
    var t2 = subtract(crocodilebodyArray[i*3+2], crocodilebodyArray[i*3+1]);
    for (var j=0; j<3; j++)
      crocodilebodyNormalsArray.push(vec4(normalize(cross(t1,t2)), 0.0));
}





var crocodilebodyTexCoordsArray = [
    texCoords1[0], texCoords1[3], texCoords1[1],
    texCoords1[1], texCoords1[3], texCoords1[2],
    texCoords1[0], texCoords1[3], texCoords1[1],
    texCoords1[2], texCoords1[1], texCoords1[3],
    texCoords1[0], texCoords1[1], texCoords1[3],
    texCoords1[1], texCoords1[3], texCoords1[2],
    texCoords1[1], texCoords1[0], texCoords1[3],
    texCoords1[3], texCoords1[2], texCoords1[1],
    texCoords1[1], texCoords1[0], texCoords1[3],
    texCoords1[3], texCoords1[2], texCoords1[1],
    texCoords1[0], texCoords1[2], texCoords1[3],
    texCoords1[1], texCoords1[0], texCoords1[2],
];

//var crocodilebody_scalematrix = scalem(0.5,0.5,0.90);
var crocodilebody_scalematrix = scalem(0.5,0.5,0.90);



// ###################################################################

var crocodiletail_vertices = [
    vec4(-0.18, 0.0 , 0.2 ),
    vec4(-0.11, 0.14, 0.2 ),
    vec4( 0.11, 0.14, 0.2 ),
    vec4( 0.18, 0.0 , 0.2 ),
    vec4( 0.0 , 0.0 ,-0.2 )
];
// gl.TRIANGLES
var crocodiletailArray =
[ crocodiletail_vertices[0], crocodiletail_vertices[1], crocodiletail_vertices[3],
  crocodiletail_vertices[3], crocodiletail_vertices[1], crocodiletail_vertices[2],
  crocodiletail_vertices[0], crocodiletail_vertices[3], crocodiletail_vertices[4],
  crocodiletail_vertices[0], crocodiletail_vertices[1], crocodiletail_vertices[4],
  crocodiletail_vertices[1], crocodiletail_vertices[2], crocodiletail_vertices[4],
  crocodiletail_vertices[2], crocodiletail_vertices[3], crocodiletail_vertices[4]];
var lenCrocodiletailArray = 18;

var crocodiletailNormalsArray = [];
for (var i=0; i<lenCrocodiletailArray/3; i++) {
    var t1 = subtract(crocodiletailArray[i*3+1], crocodiletailArray[i*3+0]);
    var t2 = subtract(crocodiletailArray[i*3+2], crocodiletailArray[i*3+1]);
    for (var j=0; j<3; j++)
      crocodiletailNormalsArray.push(vec4(normalize(cross(t1,t2)), 0.0));
}

var crocodiletailTexCoordsArray = [
    texCoords[0], texCoords[1], texCoords[5],
    texCoords[4], texCoords[5], texCoords[0],
    texCoords[3], texCoords[0], texCoords[1],
    texCoords[3], texCoords[0], texCoords[1],
    texCoords[3], texCoords[0], texCoords[1],
    texCoords[3], texCoords[0], texCoords[1]
];



//var crocodiletail_scalematrix = scalem(0.5,0.5,1.0);
var crocodiletail_scalematrix = scalem(0.5,0.5,0.8);
