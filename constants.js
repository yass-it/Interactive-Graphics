"use strict";

var gl;
var world;
var world_size_w = 16;
var world_size_h = 16;

var square_size = 1.0;
var tile_size_max = 0.25;
var tile_size_min = 0.25;


var cur_maximum=150; var speed=20;

var counter = 0;
var counter1 = 0;
var counter2 = 0;
var shiftVal = 1;
var value = 1;
var counterUpdater = 0;
var counterUpdaterVal = 0.3;

// colors
var BLACK       = vec4( 0.0, 0.0, 0.0, 1.0 );
var WHITE       = vec4( 1.0, 1.0, 1.0, 1.0 );
var MAROON      = vec4( 0.5, 0.2, 0.0, 1.0 );
var RED         = vec4( 1.0, 0.0, 0.0, 1.0 );
var BLUE        = vec4( 0.0, 0.0, 1.0, 1.0 );
var GREEN       = vec4( 0.1, 0.8, 0.1, 1.0 );
var LIGHT_GREY  = vec4( 0.4, 0.4, 0.4, 1.0 );
var PURPLE      = vec4( 0.5, 0.0, 0.5, 1.0 );


// objects
var PYRAMID         = 0;
var PARALLELOGRAM   = 1;
var VOID            = 2;
var CROCODILEHEAD   = 3;
var CROCODILEBODY   = 4;
var CROCODILETAIL   = 5;
var SQUARE          = 6;
var KANGAROO        = 7;


// buffer indexes
var buffer_indexes = {};
buffer_indexes[SQUARE] = 0; buffer_indexes[PYRAMID] = 4; buffer_indexes[PARALLELOGRAM] = 22;
buffer_indexes[CROCODILEHEAD] = 58; buffer_indexes[CROCODILEBODY] = 94; buffer_indexes[CROCODILETAIL] = 130;

// animations
var LEFT_ROTATION                  = 50;
var RIGHT_ROTATION                 = 51;
var FORWARD                        = 52;
var LEFT_ROTATION_BODY             = 53;
var RIGHT_ROTATION_BODY            = 54;
var COMPLETING_LEFT_ROTATION_BODY  = 55;
var COMPLETING_RIGHT_ROTATION_BODY = 56;
var FURTHER_LEFT_ROTATION          = 57;
var FURTHER_RIGHT_ROTATION         = 58;
var FURTHER_LEFT_ROTATION2         = 59;
var FURTHER_RIGHT_ROTATION2        = 60;
var KANGAROO_FORWARD = 0;
var KANGAROO_LEFT = 1;
var KANGAROO_RIGHT = 2;

// facing directions
var NORTH = 20;
var SOUTH = 21;
var EAST  = 22;
var WEST  = 23;

// light parameters
var lightDiffuse  = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );


var squareDiffuseParameter  = vec4( 0.8, 0.8, 0.8, 1.0 );
var squareSpecularParameter = vec4( 0.5, 0.5, 0.5, 1.0 );
var squareShininess = 20.0;
var squareDiffuseProduct  = mult(squareDiffuseParameter,  lightDiffuse);
var squareSpecularProduct = mult(squareSpecularParameter, lightSpecular);

var parallelogramDiffuseParameter  = vec4( 0.8, 0.8, 0.6, 1.0 );
var parallelogramSpecularParameter = vec4( 0.6, 0.6, 0.2, 1.0 );
var parallelogramShininess = 500.0;
var parallelogramDiffuseProduct  = mult(parallelogramDiffuseParameter,  lightSpecular);
var parallelogramSpecularProduct = mult(parallelogramSpecularParameter, lightSpecular);

var pyramidDiffuseParameter  = vec4( 0.5, 0.5, 0.5, 1.0 );
var pyramidSpecularParameter = vec4( 0.8, 0.8, 0.8, 1.0 );
var pyramidShininess = 20.0;
var pyramidDiffuseProduct  = mult(pyramidDiffuseParameter,  lightDiffuse);
var pyramidSpecularProduct = mult(pyramidSpecularParameter, lightSpecular);


var crocodileDiffuseParameter = vec4( 0.5, 0.3, 0.5, 1.0 );
var crocodileSpecularParameter = vec4( 0.1, 0.1, 0.1, 1.0 );
var crocodileShininess = 700.0;
var crocodileDiffuseProduct = mult(crocodileDiffuseParameter, lightDiffuse);
var crocodileSpecularProduct = mult(crocodileSpecularParameter, lightSpecular);

// textures
var WHITE_SQUARE_TEXTURES       = 0;
var GREEN_SQUARE_TEXTURES       = 1;
var BLUE_SQUARE_TEXTURES        = 3;
var RED_TRIANGLE_TEXTURES       = 2;
var WHITE_TRIANGLE_TEXTURES     = 4;

// kangaroo nodes
var KANGAROO_BODY         = 0;
var KANGAROO_LEG_UP_L     = 1;
var KANGAROO_LEG_DOWN_L   = 2;
var KANGAROO_LEG_UP_R     = 3;
var KANGAROO_LEG_DOWN_R   = 4;
var KANGAROO_ARM_L        = 5;
var KANGAROO_ARM_R        = 6;
var KANGAROO_HEAD         = 7;
var KANGAROO_EAR_L        = 8;
var KANGAROO_EAR_R        = 9;
var KANGAROO_NOSE         = 10;
var KANGAROO_TAIL         = 11;
var KANGAROO_NECK         = 12;

var scale = 0.15;


var kangaroo_leg_up_dim = {};
kangaroo_leg_up_dim.x = scale*0.2; kangaroo_leg_up_dim.y = scale*1.5; kangaroo_leg_up_dim.z = scale*0.25;

var kangaroo_leg_down_dim = {};
kangaroo_leg_down_dim.x = scale*0.2; kangaroo_leg_down_dim.y = scale*0.1; kangaroo_leg_down_dim.z = scale*0.95;

var kangaroo_nose_dim = {};
kangaroo_nose_dim.x = scale*0.05; kangaroo_nose_dim.y = scale*0.05; kangaroo_nose_dim.z = scale*0.05;

var kangaroo_tail_dim = {};
kangaroo_tail_dim.x = scale*0.3; kangaroo_tail_dim.y = scale*0.2; kangaroo_tail_dim.z = scale*2.0;

var kangaroo_neck_dim = {};
kangaroo_neck_dim.x = scale*0.4; kangaroo_neck_dim.y = scale*0.4; kangaroo_neck_dim.z = scale*1.0;

var kangaroo_head_dim = {};
kangaroo_head_dim.x = scale*0.4; kangaroo_head_dim.y = scale*0.4; kangaroo_head_dim.z = scale*0.9;

var kangaroo_ear_dim = {};
kangaroo_ear_dim.x = scale*0.15; kangaroo_ear_dim.y = scale*0.35; kangaroo_ear_dim.z = scale*0.1;

var kangaroo_body_dim = {};
kangaroo_body_dim.x = scale*0.7; kangaroo_body_dim.y = scale*1.0; kangaroo_body_dim.z = scale*2.0;

var kangaroo_arm_dim = {};
kangaroo_arm_dim.x = scale*0.15; kangaroo_arm_dim.y = scale*0.8; kangaroo_arm_dim.z = scale*0.15;



var kangaroo_eated = false;
