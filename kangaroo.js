"use strict";

var gl;

var modelViewMatrix; var instanceMatrix;
var modelViewMatrixLoc;

var move = 1;

var theta = [];

var pos_body = [0, 0.05, 0];
var kangaroo_pos;
var kangaroo_facing_direction = NORTH;


theta[KANGAROO_LEG_DOWN_L] = 20; theta[KANGAROO_LEG_DOWN_R] = 20;
theta[KANGAROO_EAR_L] = 15; theta[KANGAROO_EAR_R] = -15
theta[KANGAROO_BODY] = -30; theta[KANGAROO_LEG_UP_L] = 0; theta[KANGAROO_LEG_UP_R] = 0;
theta[KANGAROO_ARM_L] = 20; theta[KANGAROO_ARM_R] = 20;
theta[KANGAROO_TAIL] = -10;
theta[KANGAROO_NECK] = -90;
theta[KANGAROO_HEAD] = 100;


var facing_angle = 0;



var kangaroo = [];

function render_head() {
    instanceMatrix = mult(modelViewMatrix, scalem(kangaroo_head_dim.x, kangaroo_head_dim.y, kangaroo_head_dim.z));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.drawArrays(gl.TRIANGLES, buffer_indexes[PARALLELOGRAM], lenParallelogramArray);
}


function render_body() {
    instanceMatrix =mult(modelViewMatrix, scalem(kangaroo_body_dim.x, kangaroo_body_dim.y, kangaroo_body_dim.z));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.drawArrays(gl.TRIANGLES, buffer_indexes[PARALLELOGRAM], lenParallelogramArray);
}

function render_leg_up() {
    instanceMatrix = mult(modelViewMatrix, scalem(kangaroo_leg_up_dim.x, kangaroo_leg_up_dim.y, kangaroo_leg_up_dim.z));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.drawArrays(gl.TRIANGLES, buffer_indexes[PARALLELOGRAM], lenParallelogramArray);
}

function reder_leg_down() {
    instanceMatrix = mult(translate(0, 0, kangaroo_leg_down_dim.z/2), scalem(kangaroo_leg_down_dim.x, kangaroo_leg_down_dim.y, kangaroo_leg_down_dim.z));
    instanceMatrix = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.drawArrays(gl.TRIANGLES, buffer_indexes[PARALLELOGRAM], lenParallelogramArray);
}

function render_tail() {
    instanceMatrix = mult(modelViewMatrix, scalem(kangaroo_tail_dim.x, kangaroo_tail_dim.y, kangaroo_tail_dim.z));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.drawArrays(gl.TRIANGLES, buffer_indexes[PARALLELOGRAM], lenParallelogramArray);
}

function render_neck() {
    instanceMatrix = mult(modelViewMatrix, scalem(kangaroo_neck_dim.x, kangaroo_neck_dim.y, kangaroo_neck_dim.z));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.drawArrays(gl.TRIANGLES, buffer_indexes[PARALLELOGRAM], lenParallelogramArray);
}


function render_arm() {
    instanceMatrix = mult(translate(0, -kangaroo_arm_dim.y/2, 0), scalem(kangaroo_arm_dim.x, kangaroo_arm_dim.y, kangaroo_arm_dim.z));
    instanceMatrix = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.drawArrays(gl.TRIANGLES, buffer_indexes[PARALLELOGRAM], lenParallelogramArray);
}

function render_ear() {
    instanceMatrix = mult(translate(0, kangaroo_ear_dim.y/2, 0), scalem(kangaroo_ear_dim.x, kangaroo_ear_dim.y, kangaroo_ear_dim.z));
    instanceMatrix = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.drawArrays(gl.TRIANGLES, buffer_indexes[PARALLELOGRAM], lenParallelogramArray);
}

function render_nose() {
    instanceMatrix = mult(modelViewMatrix, scalem(kangaroo_nose_dim.x, kangaroo_nose_dim.y, kangaroo_nose_dim.z));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.drawArrays(gl.TRIANGLES, buffer_indexes[PARALLELOGRAM], lenParallelogramArray);
}


function initNode(id) {
    var m = mat4();
    switch(id) {
        case KANGAROO_BODY:
            m = mult( translate(
                        pos_body[0],
                        pos_body[1],
                        pos_body[2]),
                      rotate(facing_angle, [0,1,0]));
            m = mult( m, rotate(theta[KANGAROO_BODY], [1,0,0]));
            kangaroo[KANGAROO_BODY] = createNode(m, render_body, null, KANGAROO_LEG_UP_L);
            break;

            case KANGAROO_ARM_L:
                m = mult( translate(
                            kangaroo_body_dim.x/2,
                            -kangaroo_body_dim.y/2 + kangaroo_arm_dim.y-0.05 ,
                            kangaroo_body_dim.z/2 - kangaroo_arm_dim.z),
                          rotate(theta[KANGAROO_ARM_L], [1,0,0]));
                kangaroo[KANGAROO_ARM_L] = createNode(m, render_arm, KANGAROO_ARM_R, null);
                break;
            case KANGAROO_ARM_R:
                m = mult( translate(
                            -kangaroo_body_dim.x/2,
                            -kangaroo_body_dim.y/2 + kangaroo_arm_dim.y-0.05,
                            kangaroo_body_dim.z/2 - kangaroo_arm_dim.z),
                          rotate(theta[KANGAROO_ARM_R], [1,0,0]));
                kangaroo[KANGAROO_ARM_R] = createNode(m, render_arm, KANGAROO_NECK, null);
                break;


        case KANGAROO_LEG_UP_L:
            m = mult( translate(
                        kangaroo_body_dim.x/2,
                        -kangaroo_body_dim.y/2 + kangaroo_body_dim.y-0.15,
                        -kangaroo_body_dim.z/2+0.2*kangaroo_body_dim.z),
                      rotate(theta[KANGAROO_LEG_UP_L], [1,0,0]));
            kangaroo[KANGAROO_LEG_UP_L] = createNode(m, render_leg_up, KANGAROO_LEG_UP_R, KANGAROO_LEG_DOWN_L);
            break;
        case KANGAROO_LEG_UP_R:
            m = mult( translate(
                        -kangaroo_body_dim.x/2,
                        -kangaroo_body_dim.y/2 + kangaroo_body_dim.y-0.15,
                        -kangaroo_body_dim.z/2+0.2*kangaroo_body_dim.z),
                      rotate(theta[KANGAROO_LEG_UP_R], [1,0,0]));
            kangaroo[KANGAROO_LEG_UP_R] = createNode(m, render_leg_up, KANGAROO_ARM_L, KANGAROO_LEG_DOWN_R);
            break;

            case KANGAROO_NECK:
                m = mult( translate(
                            0,
                            kangaroo_body_dim.y,
                            kangaroo_body_dim.z-0.15),
                          rotate(theta[KANGAROO_NECK], [1,0,0]));
                kangaroo[KANGAROO_NECK] = createNode(m, render_neck, KANGAROO_TAIL, KANGAROO_HEAD);
                break;

        case KANGAROO_HEAD:
            m = mult( translate(
                        0,
                        kangaroo_neck_dim.y-kangaroo_head_dim.z/2,
                        kangaroo_neck_dim.z/2),
                      rotate(theta[KANGAROO_HEAD], [1,0,0]));
            kangaroo[KANGAROO_HEAD] = createNode(m, render_head, null, KANGAROO_EAR_L);
            break;
        case KANGAROO_LEG_DOWN_L:
            m = mult( translate(
                        0,
                        - kangaroo_leg_down_dim.y/2,
                        - kangaroo_leg_down_dim.z/2+0.05),
                      rotate(theta[KANGAROO_LEG_DOWN_L], [1,0,0]));
            kangaroo[KANGAROO_LEG_DOWN_L] = createNode(m, reder_leg_down, null, null);
            break;
        case KANGAROO_LEG_DOWN_R:
            m = mult( translate(
                        0,
                        - kangaroo_leg_down_dim.y/2,
                        - kangaroo_leg_down_dim.z/2+0.05 ),
                      rotate(theta[KANGAROO_LEG_DOWN_R], [1,0,0]));
            kangaroo[KANGAROO_LEG_DOWN_R] = createNode(m, reder_leg_down, null, null);
            break;

        case KANGAROO_NOSE:
            m = translate(
                        0,
                        0,
                        kangaroo_head_dim.z/2 + kangaroo_nose_dim.z/2);
            kangaroo[KANGAROO_NOSE] = createNode(m, render_nose, null, null);
            break;

        case KANGAROO_TAIL:
            m = mult( translate(
                    -0.01,
                    kangaroo_body_dim.y-0.05,
                  -0.2),
                  rotate(theta[KANGAROO_TAIL], [1,0,0]));
            kangaroo[KANGAROO_TAIL] = createNode(m, render_tail, null, null);
            break;

            case KANGAROO_EAR_L:
                m = mult( translate(
                            - kangaroo_head_dim.x/2 + kangaroo_ear_dim.x/2 ,
                            kangaroo_ear_dim.y/2,
                            - kangaroo_head_dim.z/2 + kangaroo_ear_dim.z/2),
                          rotate(theta[KANGAROO_EAR_L], [0,1,0]));
                kangaroo[KANGAROO_EAR_L] = createNode(m, render_ear, KANGAROO_EAR_R, null);
                break;
            case KANGAROO_EAR_R:
                m = mult( translate(
                            + kangaroo_head_dim.x/2 - kangaroo_ear_dim.x/2 ,
                            kangaroo_ear_dim.y/2,
                            - kangaroo_head_dim.z/2 + kangaroo_ear_dim.z/2),
                          rotate(theta[KANGAROO_EAR_R], [0,1,0]));
                kangaroo[KANGAROO_EAR_R] = createNode(m, render_ear, KANGAROO_NOSE, null);
                break;

        default:
            console.log("something wrong");
    }
}

var stack = []
function traverse(Id) {
   if(Id == null) return;
   stack.push(modelViewMatrix);
   modelViewMatrix = mult(modelViewMatrix, kangaroo[Id].transform);
   kangaroo[Id].render();
   if(kangaroo[Id].child != null) traverse(kangaroo[Id].child);
    modelViewMatrix = stack.pop();
   if(kangaroo[Id].sibling != null) traverse(kangaroo[Id].sibling);
}

function initKangarooStuff(_modelViewMatrixLoc, _gl) {
    modelViewMatrixLoc = _modelViewMatrixLoc;
    modelViewMatrix = mat4();
    instanceMatrix = mat4();
    gl = _gl;
    pos_body[0] = tile_size_min/2 + kangaroo_pos[0][0] * tile_size_max;
    pos_body[1] = 0.15;
    pos_body[2] = tile_size_min/2 + kangaroo_pos[0][1] * tile_size_max;
}

function renderKangaroo() {
    for (var i=0; i<=12; i++)
        initNode(i);
    traverse(KANGAROO_BODY);
}

var inc_pos_x; var inc_pos_y; var inc_body_1;
var inc_feet_1; var inc_arm_1; var inc_head_1;
var inc_body_2; var inc_feet_2; var inc_arm_2; var inc_head_2;
var inc_body_3; var inc_feet_3; var inc_arm_3;
var inc_facing_angle;

function initializeKangarooIncs() {
    inc_pos_x = linear_interpolation(speed, 0, cur_maximum, 0, tile_size_max);
    inc_pos_y = linear_interpolation(speed, 0, 2*cur_maximum, 0, tile_size_max);

    inc_body_1 = linear_interpolation(speed, 0, cur_maximum/3, -20, -5);
    inc_feet_1 = linear_interpolation(speed, 0, cur_maximum/3, 20, 5);
    inc_arm_1  = linear_interpolation(speed, 0, cur_maximum/3, 20, -40);
    inc_head_1 = linear_interpolation(speed, 0, cur_maximum/3, 20, 5);

    inc_body_2 = linear_interpolation(speed, 0, cur_maximum/3, -5, -40);
    inc_feet_2 = linear_interpolation(speed, 0, cur_maximum/3, 5, 60);
    inc_arm_2  = linear_interpolation(speed, 0, cur_maximum/3, -40, 40);
    inc_head_2 = linear_interpolation(speed, 0, cur_maximum/3, 5, 20);

    inc_body_3 = linear_interpolation(speed, 0, cur_maximum/3, -40, -20);
    inc_feet_3 = linear_interpolation(speed, 0, cur_maximum/3, 60, 20);
    inc_arm_3  = linear_interpolation(speed, 0, cur_maximum/3, 40, 20);

    inc_facing_angle = linear_interpolation(speed, 0, cur_maximum, 0, 90);
} initializeKangarooIncs();


function kangaroo_future_position() {
    var onward_position = [-1, -1];
    switch (kangaroo_facing_direction) {
        case NORTH:
            onward_position[0] = kangaroo_pos[0][0] + 0;
            onward_position[1] = kangaroo_pos[0][1] + move;
            break;
        case SOUTH:
            onward_position[0] = kangaroo_pos[0][0] + 0;
            onward_position[1] = kangaroo_pos[0][1] - move;
            break;
        case EAST:
            onward_position[0] = kangaroo_pos[0][0] - move;
            onward_position[1] = kangaroo_pos[0][1] + 0;
            break;
        case WEST:
            onward_position[0] = kangaroo_pos[0][0] + move;
            onward_position[1] = kangaroo_pos[0][1] + 0;
            break;
        default:
            throw "animateKangaroo(): something wrong";
    }
    return onward_position;
}


function forwardAnimation(i) {
    if (i==0) {
        switch (kangaroo_facing_direction) {
            case NORTH:
                kangaroo_pos[0][0] += 0;
                kangaroo_pos[0][1] += move;
                break;
            case SOUTH:
                kangaroo_pos[0][0] += 0;
                kangaroo_pos[0][1] -= move;
                break;
            case EAST:
                kangaroo_pos[0][0] -= move;
                kangaroo_pos[0][1] += 0;
                break;
            case WEST:
                kangaroo_pos[0][0] += move;
                kangaroo_pos[0][1] += 0;
                break;
        }
    } else if (i >= cur_maximum) {
        pos_body[0] = tile_size_min/2 + kangaroo_pos[0][0] * tile_size_max;
        pos_body[1] = 0.15;
        pos_body[2] = tile_size_min/2 + kangaroo_pos[0][1] * tile_size_max;
        theta[KANGAROO_BODY] = -20;
        theta[KANGAROO_LEG_DOWN_L] = 20;
        theta[KANGAROO_LEG_DOWN_R] = 20;
        theta[KANGAROO_ARM_L] = 20;
        theta[KANGAROO_ARM_R] = 20;
        theta[KANGAROO_HEAD] = 100;
    } else {
       if (i < 2*cur_maximum/3 && i >= cur_maximum/3) {
        //pos_body[1] = 0.25;
          theta[KANGAROO_BODY] += cur_anim == FORWARD?inc_body_2:inc_body_2;
          theta[KANGAROO_LEG_DOWN_L] += cur_anim == FORWARD?2*inc_feet_2:inc_feet_2;
          theta[KANGAROO_LEG_DOWN_R] += cur_anim == FORWARD?2*inc_feet_2:inc_feet_2;
          theta[KANGAROO_ARM_L] += cur_anim == FORWARD?2*inc_arm_2:inc_arm_2;
          theta[KANGAROO_ARM_R] += cur_anim == FORWARD?2*inc_arm_2:inc_arm_2;
        //  pos_body[1] = 0.15;
        //  theta[KANGAROO_HEAD] += cur_anim == FORWARD?2*inc_head_2:inc_head_2;
      }
        else if (i < cur_maximum/3) {
          //  pos_body[1] = 0.25;
            theta[KANGAROO_BODY] += cur_anim == FORWARD?inc_body_1:inc_body_1;
            theta[KANGAROO_LEG_DOWN_L] += cur_anim == FORWARD?2*inc_feet_1:inc_feet_1;
            theta[KANGAROO_LEG_DOWN_R] += cur_anim == FORWARD?2*inc_feet_1:inc_feet_1;
            theta[KANGAROO_ARM_L] += cur_anim == FORWARD?2*inc_arm_1:inc_arm_1;
            theta[KANGAROO_ARM_R] += cur_anim == FORWARD?2*inc_arm_1:inc_arm_1;
            //theta[KANGAROO_HEAD] += cur_anim == FORWARD?2*inc_head_1:inc_head_1;
          //  pos_body[1] = 0.15;
        }  else {
        //  pos_body[1] = 0.25;
            theta[KANGAROO_BODY] += cur_anim == FORWARD?inc_body_3:inc_body_3;
            theta[KANGAROO_LEG_DOWN_L] += cur_anim == FORWARD?2*inc_feet_3:inc_feet_3;
            theta[KANGAROO_LEG_DOWN_R] += cur_anim == FORWARD?2*inc_feet_3:inc_feet_3;
            theta[KANGAROO_ARM_L] += cur_anim == FORWARD?2*inc_arm_3:inc_arm_3;
            theta[KANGAROO_ARM_R] += cur_anim == FORWARD?2*inc_arm_3:inc_arm_3;
            //pos_body[1] = 0.15;
        }
        switch (kangaroo_facing_direction) {
            case NORTH:
                pos_body[2] += cur_anim == FORWARD?2*inc_pos_x:inc_pos_x;
                break;
            case SOUTH:
                pos_body[2] -= cur_anim == FORWARD?2*inc_pos_x:inc_pos_x;
                break;
            case EAST:
                pos_body[0] -= cur_anim == FORWARD?2*inc_pos_x:inc_pos_x;
                break;
            case WEST:
                pos_body[0] += cur_anim == FORWARD?2*inc_pos_x:inc_pos_x;
                break;
        }
        if (i<cur_maximum)
            pos_body[1] += cur_anim == FORWARD?4*inc_pos_y:inc_pos_y;
        else
            pos_body[1] -= cur_anim == FORWARD?2*inc_pos_y:inc_pos_y;
    }
}

function rotationLeftAnimation(i) {
    if (i==0) {
        switch (kangaroo_facing_direction) {
            case NORTH:
                kangaroo_facing_direction = WEST;
                break;
            case SOUTH:
                kangaroo_facing_direction = EAST;
                break;
            case EAST:
                kangaroo_facing_direction = NORTH;
                break;
            case WEST:
                kangaroo_facing_direction = SOUTH;
                break;
        }
    } else if (i>= cur_maximum) {
        facing_angle = fix_round_error(facing_angle, 90);
    } else {
        facing_angle += cur_anim == FORWARD?2*inc_facing_angle:inc_facing_angle;
    }
}

function rotationRightAnimation(i) {
    if (i==0) {
        switch (kangaroo_facing_direction) {
            case NORTH:
                kangaroo_facing_direction = EAST;
                break;
            case SOUTH:
                kangaroo_facing_direction = WEST;
                break;
            case EAST:
                kangaroo_facing_direction = SOUTH;
                break;
            case WEST:
                kangaroo_facing_direction = NORTH;
                break;
        }
    } else if (i>= cur_maximum) {
        facing_angle = fix_round_error(facing_angle, 90);
    } else {
        facing_angle -= cur_anim == FORWARD?2*inc_facing_angle:inc_facing_angle;
    }
}


var currentAnim = null;

function reinitializeKangaroo() {
    kangaroo_pos = [genFood(world_size_w, world_size_h, world, true)];
    facing_angle = 0;
    pos_body[0] = tile_size_min/2 + kangaroo_pos[0][0] * tile_size_max;
    pos_body[1] = 0.15;
    pos_body[2] = tile_size_min/2 + kangaroo_pos[0][1] * tile_size_max;
    kangaroo_facing_direction = NORTH;
}

function animateKangaroo(i) {
    // if (kangaroo_eated)
    //     return;
    if (i==0) {
        var val = Math.round(Math.random()*10000) % 100;
        var onward_position = kangaroo_future_position();
        if (    onward_position[0]>=world_size_w   ||
                onward_position[0]<0             ||
                onward_position[1]>=world_size_h   ||
                onward_position[1]<0             ||
                world[onward_position[0]][onward_position[1]].element != VOID) {
            currentAnim = val<50?KANGAROO_LEFT:KANGAROO_RIGHT;
        } else if (currentAnim == KANGAROO_LEFT || currentAnim == KANGAROO_RIGHT) {
            currentAnim = KANGAROO_FORWARD;
        } else if (val<50) {
            currentAnim = KANGAROO_FORWARD;
        } else if (val<75) {
            currentAnim = KANGAROO_RIGHT;
        } else {
            currentAnim = KANGAROO_LEFT;
        }
    }
    switch (currentAnim) {

        case KANGAROO_RIGHT:
            rotationRightAnimation(i);
            break;
        case KANGAROO_LEFT:
            rotationLeftAnimation(i);
            break;

        case KANGAROO_FORWARD:
            forwardAnimation(i);
            break;
    }
}
