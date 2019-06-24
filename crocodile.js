"use strict";

function* genForward() {
    var inc = linear_interpolation(speed, 0, cur_maximum, 0, 1);
    var tot=0;
    for (var i=0; i<cur_maximum/speed ; i++) {
        yield [tot, 0];
        tot+=inc;
    }
    yield [1, 0];
    yield [1, 0];
}
var forwardArray = [];

var delta = 0.26; var delta_angle = 45;
function* genForwardRotation() {
    var inc_x = linear_interpolation(speed, 0, cur_maximum, 0, 1-delta);
    var inc_y = linear_interpolation(speed, 0, cur_maximum, 0, delta);
    var inc_angle = linear_interpolation(speed, 0, cur_maximum, 0, delta_angle);
    var tot = [0, 0]; var tot_angle = 0;
    for (var i=0; i<cur_maximum/speed ; i++) {
        yield [[tot[0], tot[1]], tot_angle];
        tot[0] += inc_x;
        tot[1] += inc_y;
        tot_angle += inc_angle;
    }
    yield [[1-delta, delta], delta_angle];
    yield [[1-delta, delta], delta_angle];
}
var forwardRotationArray = [];

function* genStraigthen() {
    var inc_x = linear_interpolation(speed, 0, cur_maximum, 0, 1-delta);
    var inc_y = linear_interpolation(speed, 0, cur_maximum, 0, delta);
    var inc_angle = linear_interpolation(speed, 0, cur_maximum, 0, 90-delta_angle);
    var tot = [0, 0]; var tot_angle = 0;
    for (var i=0; i<cur_maximum/speed ; i++) {
        yield [[tot[0], tot[1]], tot_angle];
        tot[0] += inc_x;
        tot[1] += inc_y;
        tot_angle += inc_angle;
    }
    yield [[1-delta, delta], 90-delta_angle];
    yield [[1-delta, delta], 90-delta_angle];
}
var straigthenArray = [];

function* genFurtherRotation() {
    var inc_x = linear_interpolation(speed, 0, cur_maximum, 0, 1-2*delta);
    var inc_angle = linear_interpolation(speed, 0, cur_maximum, 0, 90);
    var tot = [0, 0]; var tot_angle = 0;
    for (var i=0; i<cur_maximum/speed ; i++) {
        yield [[tot[0], 0], tot_angle];
        tot[0] += inc_x;
        tot_angle += inc_angle;
    }
    yield [[1-2*delta, 0], 90];
    yield [[1-2*delta, 0], 90];
}
var furtherRotationArray = [];

function* genFurtherRotation2() {
    var inc_x = linear_interpolation(speed, 0, cur_maximum, 0, 1-2*delta);
    var inc_y = linear_interpolation(speed, 0, cur_maximum, 0, 2*delta);
    var inc_angle = linear_interpolation(speed, 0, cur_maximum, 0, 2*delta_angle-90);
    var tot = [0, 0]; var tot_angle = 0;
    for (var i=0; i<cur_maximum/speed ; i++) {
        yield [[tot[0], tot[1]], tot_angle];
        tot[0] += inc_x;
        tot[1] += inc_y;
        tot_angle += inc_angle;
    }
    yield [[1-2*delta, 2*delta], 2*delta_angle-90];
    yield [[1-2*delta, 2*delta], 2*delta_angle-90];
}
var furtherRotation2Array = [];

var gFor; var gForRot; var gStr; var gFurRot; var gFur2Rot;

function initializePositionUpdater() {
    gFor = genForward();
    gForRot = genForwardRotation();
    gStr = genStraigthen();
    gFurRot = genFurtherRotation();
    gFur2Rot = genFurtherRotation2();

    forwardRotationArray = []; forwardArray = []; straigthenArray = []; furtherRotationArray = []; furtherRotation2Array = [];

    for (var i=0; i<cur_maximum + speed + 1; i+=speed) {
        forwardRotationArray[i] = gForRot.next().value;
        forwardArray[i] = gFor.next().value;
        straigthenArray[i] = gStr.next().value;
        furtherRotationArray[i] = gFurRot.next().value;
        furtherRotation2Array[i] = gFur2Rot.next().value;

    }
}


function initializeOldPos(croco) {

    if(counter == 2){

      counter = 0;
      croco.data.tail.old_pos = croco.data.tail.pos.slice();
      console.log("for slice"+ croco.data.tail.old_pos);
      //console.log("croco type " + croco.type);
      console.log(typeof(croco.data.tail.pos.slice()));
      croco.data.tail.old_angle = croco.data.tail.angle;
      croco.data.tail.old_anim = croco.data.tail.anim;
      croco.data.tail.old_direction = croco.data.tail.direction;



      if (croco.next != null ){
        console.log("croco.next "  + croco.next);
          initializeOldPos(croco.next);
        }

    }else{
    croco.data.old_pos = croco.data.pos.slice();
    console.log("for slice"+  croco.data.old_pos);
    console.log("croco type " + croco.type);
    console.log(typeof(croco.data.pos.slice()));
    croco.data.old_angle = croco.data.angle;
    croco.data.old_anim = croco.data.anim;
    croco.data.old_direction = croco.data.direction;

    counter++;
    if (croco.next != null ){
      console.log("counter1 is "+ counter1);
      console.log("croco.next "  + croco.next);
        initializeOldPos(croco.next);
      }
      else{
        counter = 0;
      }

    }

  }





function updateCrocoWorld(world, croco) {
    if(counter==2){
      counter = 0;
      var posx = Math.round(croco.data.tail.pos[0]); var posy = Math.round(croco.data.tail.pos[1]);
      var oldposx = Math.round(croco.data.tail.old_pos[0]); var oldposy = Math.round(croco.data.tail.old_pos[1]);
      if (world[posx][posy].element != PYRAMID) {
          world[posx][posy].element = croco.data.tail.type;
          world[oldposx][oldposy].element = VOID;
      }
      croco.data.tail.copyied = false;


      if (croco.next != null )
          updateCrocoWorld(world, croco.next);
    }else{
      var posx = Math.round(croco.data.pos[0]); var posy = Math.round(croco.data.pos[1]);
      var oldposx = Math.round(croco.data.old_pos[0]); var oldposy = Math.round(croco.data.old_pos[1]);
      if (world[posx][posy].element != PYRAMID) {
          world[posx][posy].element = croco.data.type;
          world[oldposx][oldposy].element = VOID;
      }
      counter++;
      croco.data.copyied = false;
      if (croco.next != null )
          updateCrocoWorld(world, croco.next);
      else counter = 0;
    }

}

function updateFirstBodyPosition(croco_node, i) {
    switch (croco_node.prev.data.anim) {
        case FORWARD:
            switch(croco_node.prev.data.direction) {
                case NORTH:
                    if (croco_node.data.old_anim == FORWARD || croco_node.data.old_anim == COMPLETING_LEFT_ROTATION_BODY || croco_node.data.old_anim ==     COMPLETING_RIGHT_ROTATION_BODY) {
                        croco_node.data.anim = FORWARD;
                        croco_node.data.direction = NORTH;
                        croco_node.data.pos[1] = croco_node.data.old_pos[1] + forwardArray[i][0];
                        croco_node.data.pos[0] = croco_node.data.old_pos[0];
                    } else if (croco_node.data.old_anim == LEFT_ROTATION_BODY || croco_node.data.old_anim == FURTHER_LEFT_ROTATION ||
                                croco_node.data.old_anim == FURTHER_LEFT_ROTATION2) {
                        croco_node.data.anim = COMPLETING_LEFT_ROTATION_BODY;
                        croco_node.data.direction = NORTH;
                        croco_node.data.pos[0] = croco_node.data.old_pos[0] - straigthenArray[i][0][1];
                        croco_node.data.pos[1] = croco_node.data.old_pos[1] + straigthenArray[i][0][0];
                        croco_node.data.angle = croco_node.data.old_angle + straigthenArray[i][1];
                    } else if (croco_node.data.old_anim == RIGHT_ROTATION_BODY || croco_node.data.old_anim == FURTHER_RIGHT_ROTATION ||
                                croco_node.data.old_anim == FURTHER_RIGHT_ROTATION2) {
                        croco_node.data.anim = COMPLETING_RIGHT_ROTATION_BODY;
                        croco_node.data.direction = NORTH;
                        croco_node.data.pos[0] = croco_node.data.old_pos[0] + straigthenArray[i][0][1];
                        croco_node.data.pos[1] = croco_node.data.old_pos[1] + straigthenArray[i][0][0];
                        croco_node.data.angle = croco_node.data.old_angle - straigthenArray[i][1];
                    } else {
                        throw "updateFirstBodyPosition(): invalid old_anim";
                    }
                    break;
                case SOUTH:
                    if (croco_node.data.old_anim == FORWARD || croco_node.data.old_anim == COMPLETING_LEFT_ROTATION_BODY || croco_node.data.old_anim ==     COMPLETING_RIGHT_ROTATION_BODY) {
                        croco_node.data.anim = FORWARD;
                        croco_node.data.direction = SOUTH;
                        croco_node.data.pos[1] = croco_node.data.old_pos[1] - forwardArray[i][0];
                        croco_node.data.pos[0] = croco_node.data.old_pos[0];
                    } else if (croco_node.data.old_anim == LEFT_ROTATION_BODY || croco_node.data.old_anim == FURTHER_LEFT_ROTATION ||
                                croco_node.data.old_anim == FURTHER_LEFT_ROTATION2) {
                        croco_node.data.anim = COMPLETING_LEFT_ROTATION_BODY;
                        croco_node.data.direction = SOUTH;
                        croco_node.data.pos[0] = croco_node.data.old_pos[0] + straigthenArray[i][0][1];
                        croco_node.data.pos[1] = croco_node.data.old_pos[1] - straigthenArray[i][0][0];
                        croco_node.data.angle = croco_node.data.old_angle + straigthenArray[i][1];
                    } else if (croco_node.data.old_anim == RIGHT_ROTATION_BODY || croco_node.data.old_anim == FURTHER_RIGHT_ROTATION ||
                                croco_node.data.old_anim == FURTHER_RIGHT_ROTATION2) {
                        croco_node.data.anim = COMPLETING_RIGHT_ROTATION_BODY;
                        croco_node.data.direction = SOUTH;
                        croco_node.data.pos[0] = croco_node.data.old_pos[0] - straigthenArray[i][0][1];
                        croco_node.data.pos[1] = croco_node.data.old_pos[1] - straigthenArray[i][0][0];
                        croco_node.data.angle = croco_node.data.old_angle - straigthenArray[i][1];
                    } else {
                        throw "updateFirstBodyPosition(): invalid old_anim";
                    }
                    break;
                case EAST:
                    if (croco_node.data.old_anim == FORWARD || croco_node.data.old_anim == COMPLETING_LEFT_ROTATION_BODY || croco_node.data.old_anim ==     COMPLETING_RIGHT_ROTATION_BODY) {
                        croco_node.data.anim = FORWARD;
                        croco_node.data.direction = EAST;
                        croco_node.data.pos[0] = croco_node.data.old_pos[0] - forwardArray[i][0];
                        croco_node.data.pos[1] = croco_node.data.old_pos[1];
                    } else if (croco_node.data.old_anim == LEFT_ROTATION_BODY || croco_node.data.old_anim == FURTHER_LEFT_ROTATION ||
                                croco_node.data.old_anim == FURTHER_LEFT_ROTATION2) {
                        croco_node.data.anim = COMPLETING_LEFT_ROTATION_BODY;
                        croco_node.data.direction = EAST;
                        croco_node.data.pos[0] = croco_node.data.old_pos[0] - straigthenArray[i][0][0];
                        croco_node.data.pos[1] = croco_node.data.old_pos[1] - straigthenArray[i][0][1];
                        croco_node.data.angle = croco_node.data.old_angle + straigthenArray[i][1];
                    } else if (croco_node.data.old_anim == RIGHT_ROTATION_BODY || croco_node.data.old_anim == FURTHER_RIGHT_ROTATION ||
                                croco_node.data.old_anim == FURTHER_RIGHT_ROTATION2) {
                        croco_node.data.anim = COMPLETING_RIGHT_ROTATION_BODY;
                        croco_node.data.direction = EAST;
                        croco_node.data.pos[0] = croco_node.data.old_pos[0] - straigthenArray[i][0][0];
                        croco_node.data.pos[1] = croco_node.data.old_pos[1] + straigthenArray[i][0][1];
                        croco_node.data.angle = croco_node.data.old_angle - straigthenArray[i][1];
                    } else {
                        throw "updateFirstBodyPosition(): invalid old_anim";
                    }
                    break;
                case WEST:
                    if (croco_node.data.old_anim == FORWARD || croco_node.data.old_anim == COMPLETING_LEFT_ROTATION_BODY || croco_node.data.old_anim ==     COMPLETING_RIGHT_ROTATION_BODY) {
                        croco_node.data.anim = FORWARD;
                        croco_node.data.direction = WEST;
                        croco_node.data.pos[0] = croco_node.data.old_pos[0] + forwardArray[i][0];
                        croco_node.data.pos[1] = croco_node.data.old_pos[1];
                    } else if (croco_node.data.old_anim == LEFT_ROTATION_BODY || croco_node.data.old_anim == FURTHER_LEFT_ROTATION ||
                                croco_node.data.old_anim == FURTHER_LEFT_ROTATION2) {
                        croco_node.data.anim = COMPLETING_LEFT_ROTATION_BODY;
                        croco_node.data.direction = WEST;
                        croco_node.data.pos[0] = croco_node.data.old_pos[0] + straigthenArray[i][0][0];
                        croco_node.data.pos[1] = croco_node.data.old_pos[1] + straigthenArray[i][0][1];
                        croco_node.data.angle = croco_node.data.old_angle + straigthenArray[i][1];
                    } else if (croco_node.data.old_anim == RIGHT_ROTATION_BODY || croco_node.data.old_anim == FURTHER_RIGHT_ROTATION ||
                                croco_node.data.old_anim == FURTHER_RIGHT_ROTATION2) {
                        croco_node.data.anim = COMPLETING_RIGHT_ROTATION_BODY;
                        croco_node.data.direction = WEST;
                        croco_node.data.pos[0] = croco_node.data.old_pos[0] + straigthenArray[i][0][0];
                        croco_node.data.pos[1] = croco_node.data.old_pos[1] - straigthenArray[i][0][1];
                        croco_node.data.angle = croco_node.data.old_angle - straigthenArray[i][1];
                    } else {
                        throw "updateFirstBodyPosition(): invalid old_anim";
                    }
                    break;
                default:
                    throw "updateFirstBodyPosition(): invalid prev.data.direction";
            }
            break;
        case LEFT_ROTATION:
            switch (croco_node.prev.data.direction) {
                case NORTH:
                    croco_node.data.direction = EAST;
                    if (croco_node.data.old_anim == LEFT_ROTATION_BODY || croco_node.data.old_anim == FURTHER_LEFT_ROTATION || croco_node.data.old_anim ==
                                 FURTHER_LEFT_ROTATION2) {
                        croco_node.data.anim = FURTHER_LEFT_ROTATION;
                        croco_node.data.pos[0] = croco_node.data.old_pos[0] - furtherRotationArray[i][0][0];
                        croco_node.data.pos[1] = croco_node.data.old_pos[1] + furtherRotationArray[i][0][1];
                        croco_node.data.angle = croco_node.data.old_angle + furtherRotationArray[i][1];
                    } else if (croco_node.data.old_anim == RIGHT_ROTATION_BODY || croco_node.data.old_anim == FURTHER_RIGHT_ROTATION || croco_node.data.
                                old_anim == FURTHER_RIGHT_ROTATION2) {
                        croco_node.data.anim = FURTHER_LEFT_ROTATION2;
                        croco_node.data.pos[0] = croco_node.data.old_pos[0] - furtherRotation2Array[i][0][0];
                        croco_node.data.pos[1] = croco_node.data.old_pos[1] + furtherRotation2Array[i][0][1];
                        croco_node.data.angle = croco_node.data.old_angle + furtherRotation2Array[i][1];
                    } else {
                        croco_node.data.anim = LEFT_ROTATION_BODY;
                        croco_node.data.pos[0] = croco_node.data.old_pos[0] - forwardRotationArray[i][0][0];
                        croco_node.data.pos[1] = croco_node.data.old_pos[1] + forwardRotationArray[i][0][1];
                        croco_node.data.angle = croco_node.data.old_angle + forwardRotationArray[i][1];
                    }
                    break;
                case WEST:
                    croco_node.data.direction = NORTH;
                    if (croco_node.data.old_anim == LEFT_ROTATION_BODY || croco_node.data.old_anim == FURTHER_LEFT_ROTATION || croco_node.data.old_anim ==
                                 FURTHER_LEFT_ROTATION2) {
                        croco_node.data.anim = FURTHER_LEFT_ROTATION;
                        croco_node.data.pos[0] = croco_node.data.old_pos[0] + furtherRotationArray[i][0][1];
                        croco_node.data.pos[1] = croco_node.data.old_pos[1] + furtherRotationArray[i][0][0];
                        croco_node.data.angle = croco_node.data.old_angle + furtherRotationArray[i][1];
                    } else if (croco_node.data.old_anim == RIGHT_ROTATION_BODY || croco_node.data.old_anim == FURTHER_RIGHT_ROTATION || croco_node.data.
                                old_anim == FURTHER_RIGHT_ROTATION2) {
                        croco_node.data.anim = FURTHER_LEFT_ROTATION2;
                        croco_node.data.pos[0] = croco_node.data.old_pos[0] + furtherRotation2Array[i][0][1];
                        croco_node.data.pos[1] = croco_node.data.old_pos[1] + furtherRotation2Array[i][0][0];
                        croco_node.data.angle = croco_node.data.old_angle + furtherRotation2Array[i][1];
                    } else {
                        croco_node.data.anim = LEFT_ROTATION_BODY;
                        croco_node.data.pos[0] = croco_node.data.old_pos[0] + forwardRotationArray[i][0][1];
                        croco_node.data.pos[1] = croco_node.data.old_pos[1] + forwardRotationArray[i][0][0];
                        croco_node.data.angle = croco_node.data.old_angle + forwardRotationArray[i][1];
                    }
                    break;
                case EAST:
                    croco_node.data.direction = SOUTH;
                    if (croco_node.data.old_anim == LEFT_ROTATION_BODY || croco_node.data.old_anim == FURTHER_LEFT_ROTATION || croco_node.data.old_anim ==
                                    FURTHER_LEFT_ROTATION2) {
                        croco_node.data.anim = FURTHER_LEFT_ROTATION;
                        croco_node.data.pos[0] = croco_node.data.old_pos[0] - furtherRotationArray[i][0][1];
                        croco_node.data.pos[1] = croco_node.data.old_pos[1] - furtherRotationArray[i][0][0];
                        croco_node.data.angle = croco_node.data.old_angle + furtherRotationArray[i][1];
                    } else if (croco_node.data.old_anim == RIGHT_ROTATION_BODY || croco_node.data.old_anim == FURTHER_RIGHT_ROTATION || croco_node.data.
                                old_anim == FURTHER_RIGHT_ROTATION2) {
                        croco_node.data.anim = FURTHER_LEFT_ROTATION2;
                        croco_node.data.pos[0] = croco_node.data.old_pos[0] - furtherRotation2Array[i][0][1];
                        croco_node.data.pos[1] = croco_node.data.old_pos[1] - furtherRotation2Array[i][0][0];
                        croco_node.data.angle = croco_node.data.old_angle + furtherRotation2Array[i][1];
                    } else {
                        croco_node.data.anim = LEFT_ROTATION_BODY;
                        croco_node.data.pos[0] = croco_node.data.old_pos[0] - forwardRotationArray[i][0][1];
                        croco_node.data.pos[1] = croco_node.data.old_pos[1] - forwardRotationArray[i][0][0];
                        croco_node.data.angle = croco_node.data.old_angle + forwardRotationArray[i][1];
                    }
                    break;
                case SOUTH:
                    croco_node.data.direction = WEST;
                    if (croco_node.data.old_anim == LEFT_ROTATION_BODY || croco_node.data.old_anim == FURTHER_LEFT_ROTATION || croco_node.data.old_anim ==
                                    FURTHER_LEFT_ROTATION2) {
                        croco_node.data.anim = FURTHER_LEFT_ROTATION;
                        croco_node.data.pos[0] = croco_node.data.old_pos[0] + furtherRotationArray[i][0][0];
                        croco_node.data.pos[1] = croco_node.data.old_pos[1] - furtherRotationArray[i][0][1];
                        croco_node.data.angle = croco_node.data.old_angle + furtherRotationArray[i][1];
                    } else if (croco_node.data.old_anim == RIGHT_ROTATION_BODY || croco_node.data.old_anim == FURTHER_RIGHT_ROTATION || croco_node.data.
                                old_anim == FURTHER_RIGHT_ROTATION2) {
                        croco_node.data.anim = FURTHER_LEFT_ROTATION2;
                        croco_node.data.pos[0] = croco_node.data.old_pos[0] + furtherRotation2Array[i][0][0];
                        croco_node.data.pos[1] = croco_node.data.old_pos[1] - furtherRotation2Array[i][0][1];
                        croco_node.data.angle = croco_node.data.old_angle + furtherRotation2Array[i][1];
                    } else {
                        croco_node.data.anim = LEFT_ROTATION_BODY;
                        croco_node.data.pos[0] = croco_node.data.old_pos[0] + forwardRotationArray[i][0][0];
                        croco_node.data.pos[1] = croco_node.data.old_pos[1] - forwardRotationArray[i][0][1];
                        croco_node.data.angle = croco_node.data.old_angle + forwardRotationArray[i][1];
                    }
                    break;
            }
            break;
        case RIGHT_ROTATION:
            switch (croco_node.prev.data.direction) {
                case NORTH:
                    croco_node.data.direction = WEST;
                    if (croco_node.data.old_anim == RIGHT_ROTATION_BODY || croco_node.data.old_anim == FURTHER_RIGHT_ROTATION || croco_node.data.old_anim == FURTHER_RIGHT_ROTATION2) {
                        croco_node.data.anim = FURTHER_RIGHT_ROTATION;
                        croco_node.data.pos[0] = croco_node.data.old_pos[0] + furtherRotationArray[i][0][0];
                        croco_node.data.pos[1] = croco_node.data.old_pos[1] + furtherRotationArray[i][0][1];
                        croco_node.data.angle = croco_node.data.old_angle - furtherRotationArray[i][1];
                    } else if (croco_node.data.old_anim == LEFT_ROTATION_BODY || croco_node.data.old_anim == FURTHER_LEFT_ROTATION || croco_node.data.
                                old_anim == FURTHER_LEFT_ROTATION2) {
                        croco_node.data.anim = FURTHER_RIGHT_ROTATION2;
                        croco_node.data.pos[0] = croco_node.data.old_pos[0] + furtherRotation2Array[i][0][0];
                        croco_node.data.pos[1] = croco_node.data.old_pos[1] + furtherRotation2Array[i][0][1];
                        croco_node.data.angle = croco_node.data.old_angle - furtherRotation2Array[i][1];
                    } else {
                        croco_node.data.anim = RIGHT_ROTATION_BODY;
                        croco_node.data.pos[0] = croco_node.data.old_pos[0] + forwardRotationArray[i][0][0];
                        croco_node.data.pos[1] = croco_node.data.old_pos[1] + forwardRotationArray[i][0][1];
                        croco_node.data.angle = croco_node.data.old_angle - forwardRotationArray[i][1];
                    }
                    break;
                case WEST:
                    croco_node.data.direction = SOUTH;
                    if (croco_node.data.old_anim == RIGHT_ROTATION_BODY || croco_node.data.old_anim == FURTHER_RIGHT_ROTATION || croco_node.data.old_anim == FURTHER_RIGHT_ROTATION2) {
                        croco_node.data.anim = FURTHER_RIGHT_ROTATION;
                        croco_node.data.pos[0] = croco_node.data.old_pos[0] + furtherRotationArray[i][0][1];
                        croco_node.data.pos[1] = croco_node.data.old_pos[1] - furtherRotationArray[i][0][0];
                        croco_node.data.angle = croco_node.data.old_angle - furtherRotationArray[i][1];
                    } else if (croco_node.data.old_anim == LEFT_ROTATION_BODY || croco_node.data.old_anim == FURTHER_LEFT_ROTATION || croco_node.data.
                                old_anim == FURTHER_LEFT_ROTATION2) {
                        croco_node.data.anim = FURTHER_RIGHT_ROTATION2;
                        croco_node.data.pos[0] = croco_node.data.old_pos[0] + furtherRotation2Array[i][0][1];
                        croco_node.data.pos[1] = croco_node.data.old_pos[1] - furtherRotation2Array[i][0][0];
                        croco_node.data.angle = croco_node.data.old_angle - furtherRotation2Array[i][1];
                    } else {
                        croco_node.data.anim = RIGHT_ROTATION_BODY;
                        croco_node.data.pos[0] = croco_node.data.old_pos[0] + forwardRotationArray[i][0][1];
                        croco_node.data.pos[1] = croco_node.data.old_pos[1] - forwardRotationArray[i][0][0];
                        croco_node.data.angle = croco_node.data.old_angle - forwardRotationArray[i][1];
                    }
                    break;
                case EAST:
                    croco_node.data.direction = NORTH;
                    if (croco_node.data.old_anim == RIGHT_ROTATION_BODY || croco_node.data.old_anim == FURTHER_RIGHT_ROTATION || croco_node.data.old_anim == FURTHER_RIGHT_ROTATION2) {
                        croco_node.data.anim = FURTHER_RIGHT_ROTATION;
                        croco_node.data.pos[0] = croco_node.data.old_pos[0] - furtherRotationArray[i][0][1];
                        croco_node.data.pos[1] = croco_node.data.old_pos[1] + furtherRotationArray[i][0][0];
                        croco_node.data.angle = croco_node.data.old_angle - furtherRotationArray[i][1];
                    } else if (croco_node.data.old_anim == LEFT_ROTATION_BODY || croco_node.data.old_anim == FURTHER_LEFT_ROTATION || croco_node.data.
                                old_anim == FURTHER_LEFT_ROTATION2) {
                        croco_node.data.anim = FURTHER_RIGHT_ROTATION2;
                        croco_node.data.pos[0] = croco_node.data.old_pos[0] - furtherRotation2Array[i][0][1];
                        croco_node.data.pos[1] = croco_node.data.old_pos[1] + furtherRotation2Array[i][0][0];
                        croco_node.data.angle = croco_node.data.old_angle - furtherRotation2Array[i][1];
                    } else {
                        croco_node.data.anim = RIGHT_ROTATION_BODY;
                        croco_node.data.pos[0] = croco_node.data.old_pos[0] - forwardRotationArray[i][0][1];
                        croco_node.data.pos[1] = croco_node.data.old_pos[1] + forwardRotationArray[i][0][0];
                        croco_node.data.angle = croco_node.data.old_angle - forwardRotationArray[i][1];
                    }
                    break;
                case SOUTH:
                    croco_node.data.direction = EAST;
                    if (croco_node.data.old_anim == RIGHT_ROTATION_BODY || croco_node.data.old_anim == FURTHER_RIGHT_ROTATION || croco_node.data.old_anim == FURTHER_RIGHT_ROTATION2) {
                        croco_node.data.anim = FURTHER_RIGHT_ROTATION;
                        croco_node.data.pos[0] = croco_node.data.old_pos[0] - furtherRotationArray[i][0][0];
                        croco_node.data.pos[1] = croco_node.data.old_pos[1] - furtherRotationArray[i][0][1];
                        croco_node.data.angle = croco_node.data.old_angle - furtherRotationArray[i][1];
                    } else if (croco_node.data.old_anim == LEFT_ROTATION_BODY || croco_node.data.old_anim == FURTHER_LEFT_ROTATION || croco_node.data.
                                old_anim == FURTHER_LEFT_ROTATION2) {
                        croco_node.data.anim = FURTHER_RIGHT_ROTATION2;
                        croco_node.data.pos[0] = croco_node.data.old_pos[0] - furtherRotation2Array[i][0][0];
                        croco_node.data.pos[1] = croco_node.data.old_pos[1] - furtherRotation2Array[i][0][1];
                        croco_node.data.angle = croco_node.data.old_angle - furtherRotation2Array[i][1];
                    } else {
                        croco_node.data.anim = RIGHT_ROTATION_BODY;
                        croco_node.data.pos[0] = croco_node.data.old_pos[0] - forwardRotationArray[i][0][0];
                        croco_node.data.pos[1] = croco_node.data.old_pos[1] - forwardRotationArray[i][0][1];
                        croco_node.data.angle = croco_node.data.old_angle - forwardRotationArray[i][1];
                    }
                    break;
            }
            break;
        default:
            throw "updateFirstBodyPosition(): invalid croco_node.prev.data.anim";
    }
}

function updateCrocoPositions(croco_node, i) {

  //console.log("croco data type if " + croco_node.data.type);

    var prev = croco_node.prev;
    if (prev == null)
        throw "updateCrocoPositions(): it will not update the head position!";
    if (prev.data.type == CROCODILEHEAD) {
        updateFirstBodyPosition(croco_node, i);
    }

    else {

      console.log("croco data type else " + croco_node.data.tail.type);


        if (croco_node.data.tail.copyied)
            return;


        switch (prev.data.old_anim) {
            case FORWARD:
                switch (prev.data.old_direction) {
                    case NORTH:
                        croco_node.data.tail.anim = FORWARD;
                        croco_node.data.tail.direction = NORTH;
                        croco_node.data.tail.pos[1] = croco_node.data.tail.old_pos[1] + forwardArray[i][0];
                        break;
                    case SOUTH:
                        croco_node.data.tail.anim = FORWARD;
                        croco_node.data.tail.direction = SOUTH;
                        croco_node.data.tail.pos[1] = croco_node.data.tail.old_pos[1] - forwardArray[i][0];
                        break;
                    case EAST:
                        croco_node.data.tail.anim = FORWARD;
                        croco_node.data.tail.direction = EAST;
                        croco_node.data.tail.pos[0] = croco_node.data.tail.old_pos[0] - forwardArray[i][0];
                        break;
                    case WEST:
                        croco_node.data.tail.anim = FORWARD;
                        croco_node.data.tail.direction = WEST;
                        croco_node.data.tail.pos[0] = croco_node.data.tail.old_pos[0] + forwardArray[i][0];
                        break;
                    default:
                        throw "updateCrocoPositions(): invalid prev.data.direction";
                }
                break;
            case LEFT_ROTATION_BODY:
                switch (prev.data.old_direction) {
                    case EAST:
                        croco_node.data.tail.direction = EAST;
                        croco_node.data.tail.anim = LEFT_ROTATION_BODY;
                        croco_node.data.tail.pos[0] = croco_node.data.tail.old_pos[0] - forwardRotationArray[i][0][0];
                        croco_node.data.tail.pos[1] = croco_node.data.tail.old_pos[1] + forwardRotationArray[i][0][1];
                        croco_node.data.tail.angle = croco_node.data.tail.old_angle + forwardRotationArray[i][1];
                        break;
                    case NORTH:
                        croco_node.data.tail.direction = NORTH;
                        croco_node.data.tail.anim = LEFT_ROTATION_BODY;
                        croco_node.data.tail.pos[0] = croco_node.data.tail.old_pos[0] + forwardRotationArray[i][0][1];
                        croco_node.data.tail.pos[1] = croco_node.data.tail.old_pos[1] + forwardRotationArray[i][0][0];
                        croco_node.data.tail.angle = croco_node.data.tail.old_angle + forwardRotationArray[i][1];
                        break;
                    case SOUTH:
                        croco_node.data.tail.direction = SOUTH;
                        croco_node.data.tail.anim = LEFT_ROTATION_BODY;
                        croco_node.data.tail.pos[0] = croco_node.data.tail.old_pos[0] - forwardRotationArray[i][0][1];
                        croco_node.data.tail.pos[1] = croco_node.data.tail.old_pos[1] - forwardRotationArray[i][0][0];
                        croco_node.data.tail.angle = croco_node.data.tail.old_angle + forwardRotationArray[i][1];
                        break;
                    case WEST:
                        croco_node.data.tail.direction = WEST;
                        croco_node.data.tail.anim = LEFT_ROTATION_BODY;
                        croco_node.data.tail.pos[0] = croco_node.data.tail.old_pos[0] + forwardRotationArray[i][0][0];
                        croco_node.data.tail.pos[1] = croco_node.data.tail.old_pos[1] - forwardRotationArray[i][0][1];
                        croco_node.data.tail.angle = croco_node.data.tail.old_angle + forwardRotationArray[i][1];
                        break;
                }
                break;
            case RIGHT_ROTATION_BODY:
                switch (prev.data.old_direction) {
                    case WEST:
                        croco_node.data.tail.direction = WEST;
                        croco_node.data.tail.anim = RIGHT_ROTATION_BODY;
                        croco_node.data.tail.pos[0] = croco_node.data.tail.old_pos[0] + forwardRotationArray[i][0][0];
                        croco_node.data.tail.pos[1] = croco_node.data.tail.old_pos[1] + forwardRotationArray[i][0][1];
                        croco_node.data.tail.angle = croco_node.data.tail.old_angle - forwardRotationArray[i][1];
                        break;
                    case SOUTH:
                        croco_node.data.tail.direction = SOUTH;
                        croco_node.data.tail.anim = RIGHT_ROTATION_BODY;
                        croco_node.data.tail.pos[0] = croco_node.data.tail.old_pos[0] + forwardRotationArray[i][0][1];
                        croco_node.data.tail.pos[1] = croco_node.data.tail.old_pos[1] - forwardRotationArray[i][0][0];
                        croco_node.data.tail.angle = croco_node.data.tail.old_angle - forwardRotationArray[i][1];
                        break;
                    case NORTH:
                        croco_node.data.tail.direction = NORTH;
                        croco_node.data.tail.anim = RIGHT_ROTATION_BODY;
                        croco_node.data.tail.pos[0] = croco_node.data.tail.old_pos[0] - forwardRotationArray[i][0][1];
                        croco_node.data.tail.pos[1] = croco_node.data.tail.old_pos[1] + forwardRotationArray[i][0][0];
                        croco_node.data.tail.angle = croco_node.data.tail.old_angle - forwardRotationArray[i][1];
                        break;
                    case EAST:
                        croco_node.data.tail.direction = EAST;
                        croco_node.data.tail.anim = RIGHT_ROTATION_BODY;
                        croco_node.data.tail.pos[0] = croco_node.data.tail.old_pos[0] - forwardRotationArray[i][0][0];
                        croco_node.data.tail.pos[1] = croco_node.data.tail.old_pos[1] - forwardRotationArray[i][0][1];
                        croco_node.data.tail.angle = croco_node.data.tail.old_angle - forwardRotationArray[i][1];
                        break;
                }
                break;
            case COMPLETING_LEFT_ROTATION_BODY:
                switch (prev.data.old_direction) {
                    case NORTH:
                        croco_node.data.tail.anim = COMPLETING_LEFT_ROTATION_BODY;
                        croco_node.data.tail.direction = NORTH;
                        croco_node.data.tail.pos[0] = croco_node.data.tail.old_pos[0] - straigthenArray[i][0][1];
                        croco_node.data.tail.pos[1] = croco_node.data.tail.old_pos[1] + straigthenArray[i][0][0];
                        croco_node.data.tail.angle = croco_node.data.tail.old_angle + straigthenArray[i][1];
                        break;
                    case SOUTH:
                        croco_node.data.tail.anim = COMPLETING_LEFT_ROTATION_BODY;
                        croco_node.data.tail.direction = SOUTH;
                        croco_node.data.tail.pos[0] = croco_node.data.tail.old_pos[0] + straigthenArray[i][0][1];
                        croco_node.data.tail.pos[1] = croco_node.data.tail.old_pos[1] - straigthenArray[i][0][0];
                        croco_node.data.tail.angle = croco_node.data.tail.old_angle + straigthenArray[i][1];
                        break;
                    case EAST:
                        croco_node.data.tail.anim = COMPLETING_LEFT_ROTATION_BODY;
                        croco_node.data.tail.direction = EAST;
                        croco_node.data.tail.pos[0] = croco_node.data.tail.old_pos[0] - straigthenArray[i][0][0];
                        croco_node.data.tail.pos[1] = croco_node.data.tail.old_pos[1] - straigthenArray[i][0][1];
                        croco_node.data.tail.angle = croco_node.data.tail.old_angle + straigthenArray[i][1];
                        break;
                    case WEST:
                        croco_node.data.tail.anim = COMPLETING_LEFT_ROTATION_BODY;
                        croco_node.data.tail.direction = WEST;
                        croco_node.data.tail.pos[0] = croco_node.data.tail.old_pos[0] + straigthenArray[i][0][0];
                        croco_node.data.tail.pos[1] = croco_node.data.tail.old_pos[1] + straigthenArray[i][0][1];
                        croco_node.data.tail.angle = croco_node.data.tail.old_angle + straigthenArray[i][1];
                        break;
                    default:
                        throw "updateCrocoPositions(): invalid prev.data.direction";
                }
                break;
            case FURTHER_LEFT_ROTATION:
                switch (prev.data.old_direction) {
                    case SOUTH:
                        croco_node.data.tail.direction = SOUTH;
                        croco_node.data.tail.anim = FURTHER_LEFT_ROTATION;
                        croco_node.data.tail.pos[0] = croco_node.data.tail.old_pos[0] - furtherRotationArray[i][0][1];
                        croco_node.data.tail.pos[1] = croco_node.data.tail.old_pos[1] - furtherRotationArray[i][0][0];
                        croco_node.data.tail.angle = croco_node.data.tail.old_angle + furtherRotationArray[i][1];
                        break;
                    case WEST:
                        croco_node.data.tail.direction = WEST;
                        croco_node.data.tail.anim = FURTHER_LEFT_ROTATION;
                        croco_node.data.tail.pos[0] = croco_node.data.tail.old_pos[0] + furtherRotationArray[i][0][0];
                        croco_node.data.tail.pos[1] = croco_node.data.tail.old_pos[1] - furtherRotationArray[i][0][1];
                        croco_node.data.tail.angle = croco_node.data.tail.old_angle + furtherRotationArray[i][1];
                        break;
                    case EAST:
                        croco_node.data.tail.direction = EAST;
                        croco_node.data.tail.anim = FURTHER_LEFT_ROTATION;
                        croco_node.data.tail.pos[0] = croco_node.data.tail.old_pos[0] - furtherRotationArray[i][0][0];
                        croco_node.data.tail.pos[1] = croco_node.data.tail.old_pos[1] + furtherRotationArray[i][0][1];
                        croco_node.data.tail.angle = croco_node.data.tail.old_angle + furtherRotationArray[i][1];
                        break;
                    case NORTH:
                        croco_node.data.tail.direction = NORTH;
                        croco_node.data.tail.anim = FURTHER_LEFT_ROTATION;
                        croco_node.data.tail.pos[0] = croco_node.data.tail.old_pos[0] + furtherRotationArray[i][0][1];
                        croco_node.data.tail.pos[1] = croco_node.data.tail.old_pos[1] + furtherRotationArray[i][0][0];
                        croco_node.data.tail.angle = croco_node.data.tail.old_angle + furtherRotationArray[i][1];
                        break;
                }
                break;
            case COMPLETING_RIGHT_ROTATION_BODY:
                switch (prev.data.old_direction) {
                    case NORTH:
                        croco_node.data.tail.anim = COMPLETING_RIGHT_ROTATION_BODY;
                        croco_node.data.tail.direction = NORTH;
                        croco_node.data.tail.pos[0] = croco_node.data.tail.old_pos[0] + straigthenArray[i][0][1];
                        croco_node.data.tail.pos[1] = croco_node.data.tail.old_pos[1] + straigthenArray[i][0][0];
                        croco_node.data.tail.angle = croco_node.data.tail.old_angle - straigthenArray[i][1];
                        break;
                    case SOUTH:
                        croco_node.data.tail.anim = COMPLETING_RIGHT_ROTATION_BODY;
                        croco_node.data.tail.direction = SOUTH;
                        croco_node.data.tail.pos[0] = croco_node.data.tail.old_pos[0] - straigthenArray[i][0][1];
                        croco_node.data.tail.pos[1] = croco_node.data.tail.old_pos[1] - straigthenArray[i][0][0];
                        croco_node.data.tail.angle = croco_node.data.tail.old_angle - straigthenArray[i][1];
                        break;
                    case EAST:
                        croco_node.data.tail.anim = COMPLETING_RIGHT_ROTATION_BODY;
                        croco_node.data.tail.direction = EAST;
                        croco_node.data.tail.pos[0] = croco_node.data.tail.old_pos[0] - straigthenArray[i][0][0];
                        croco_node.data.tail.pos[1] = croco_node.data.tail.old_pos[1] + straigthenArray[i][0][1];
                        croco_node.data.tail.angle = croco_node.data.tail.old_angle - straigthenArray[i][1];
                        break;
                    case WEST:
                        croco_node.data.tail.anim = COMPLETING_RIGHT_ROTATION_BODY;
                        croco_node.data.tail.direction = WEST;
                        croco_node.data.tail.pos[0] = croco_node.data.tail.old_pos[0] + straigthenArray[i][0][0];
                        croco_node.data.tail.pos[1] = croco_node.data.tail.old_pos[1] - straigthenArray[i][0][1];
                        croco_node.data.tail.angle = croco_node.data.tail.old_angle - straigthenArray[i][1];
                        break;
                    default:
                        throw "updateCrocoPositions(): invalid prev.data.direction";
                }
                break;
            case FURTHER_RIGHT_ROTATION:
                switch (prev.data.old_direction) {
                    case WEST:
                        croco_node.data.tail.direction = WEST;
                        croco_node.data.tail.anim = FURTHER_RIGHT_ROTATION;
                        croco_node.data.tail.pos[0] = croco_node.data.tail.old_pos[0] + furtherRotationArray[i][0][0];
                        croco_node.data.tail.pos[1] = croco_node.data.tail.old_pos[1] + furtherRotationArray[i][0][1];
                        croco_node.data.tail.angle = croco_node.data.tail.old_angle - furtherRotationArray[i][1];
                        break;
                    case SOUTH:
                        croco_node.data.tail.direction = SOUTH;
                        croco_node.data.tail.anim = FURTHER_RIGHT_ROTATION;
                        croco_node.data.tail.pos[0] = croco_node.data.tail.old_pos[0] + furtherRotationArray[i][0][1];
                        croco_node.data.tail.pos[1] = croco_node.data.tail.old_pos[1] - furtherRotationArray[i][0][0];
                        croco_node.data.tail.angle = croco_node.data.tail.old_angle - furtherRotationArray[i][1];
                        break;
                    case NORTH:
                        croco_node.data.tail.direction = NORTH;
                        croco_node.data.tail.anim = FURTHER_RIGHT_ROTATION;
                        croco_node.data.tail.pos[0] = croco_node.data.tail.old_pos[0] - furtherRotationArray[i][0][1];
                        croco_node.data.tail.pos[1] = croco_node.data.tail.old_pos[1] + furtherRotationArray[i][0][0];
                        croco_node.data.tail.angle = croco_node.data.tail.old_angle - furtherRotationArray[i][1];
                        break;
                    case EAST:
                        croco_node.data.tail.direction = EAST;
                        croco_node.data.tail.anim = FURTHER_RIGHT_ROTATION;
                        croco_node.data.tail.pos[0] = croco_node.data.tail.old_pos[0] - furtherRotationArray[i][0][0];
                        croco_node.data.tail.pos[1] = croco_node.data.tail.old_pos[1] - furtherRotationArray[i][0][1];
                        croco_node.data.tail.angle = croco_node.data.tail.old_angle - furtherRotationArray[i][1];
                        break;
                }
                break;
            case FURTHER_LEFT_ROTATION2:
                switch (prev.data.old_direction) {
                    case SOUTH:
                        croco_node.data.tail.direction = SOUTH;
                        croco_node.data.tail.anim = FURTHER_LEFT_ROTATION2;
                        croco_node.data.tail.pos[0] = croco_node.data.tail.old_pos[0] - furtherRotation2Array[i][0][1];
                        croco_node.data.tail.pos[1] = croco_node.data.tail.old_pos[1] - furtherRotation2Array[i][0][0];
                        croco_node.data.tail.angle = croco_node.data.tail.old_angle + furtherRotation2Array[i][1];
                        break;
                    case WEST:
                        croco_node.data.tail.direction = WEST;
                        croco_node.data.tail.anim = FURTHER_LEFT_ROTATION2;
                        croco_node.data.tail.pos[0] = croco_node.data.tail.old_pos[0] + furtherRotation2Array[i][0][0];
                        croco_node.data.tail.pos[1] = croco_node.data.tail.old_pos[1] - furtherRotation2Array[i][0][1];
                        croco_node.data.tail.angle = croco_node.data.tail.old_angle + furtherRotation2Array[i][1];
                        break;
                    case EAST:
                        croco_node.data.tail.direction = EAST;
                        croco_node.data.tail.anim = FURTHER_LEFT_ROTATION2;
                        croco_node.data.tail.pos[0] = croco_node.data.tail.old_pos[0] - furtherRotation2Array[i][0][0];
                        croco_node.data.tail.pos[1] = croco_node.data.tail.old_pos[1] + furtherRotation2Array[i][0][1];
                        croco_node.data.tail.angle = croco_node.data.tail.old_angle + furtherRotation2Array[i][1];
                        break;
                    case NORTH:
                        croco_node.data.tail.direction = NORTH;
                        croco_node.data.tail.anim = FURTHER_LEFT_ROTATION2;
                        croco_node.data.tail.pos[0] = croco_node.data.tail.old_pos[0] + furtherRotation2Array[i][0][1];
                        croco_node.data.tail.pos[1] = croco_node.data.tail.old_pos[1] + furtherRotation2Array[i][0][0];
                        croco_node.data.tail.angle = croco_node.data.tail.old_angle + furtherRotation2Array[i][1];
                        break;
                }
                break;
            case FURTHER_RIGHT_ROTATION2:
                switch (prev.data.old_direction) {
                    case SOUTH:
                        croco_node.data.tail.direction = SOUTH;
                        croco_node.data.tail.anim = FURTHER_RIGHT_ROTATION2;
                        croco_node.data.tail.pos[0] = croco_node.data.tail.old_pos[0] + furtherRotation2Array[i][0][1];
                        croco_node.data.tail.pos[1] = croco_node.data.tail.old_pos[1] - furtherRotation2Array[i][0][0];
                        croco_node.data.tail.angle = croco_node.data.tail.old_angle - furtherRotation2Array[i][1];
                        break;
                    case WEST:
                        croco_node.data.tail.direction = WEST;
                        croco_node.data.tail.anim = FURTHER_RIGHT_ROTATION2;
                        croco_node.data.tail.pos[0] = croco_node.data.tail.old_pos[0] + furtherRotation2Array[i][0][0];
                        croco_node.data.tail.pos[1] = croco_node.data.tail.old_pos[1] + furtherRotation2Array[i][0][1];
                        croco_node.data.tail.angle = croco_node.data.tail.old_angle - furtherRotation2Array[i][1];
                        break;
                    case EAST:
                        croco_node.data.tail.direction = EAST;
                        croco_node.data.tail.anim = FURTHER_RIGHT_ROTATION2;
                        croco_node.data.tail.pos[0] = croco_node.data.tail.old_pos[0] - furtherRotation2Array[i][0][0];
                        croco_node.data.tail.pos[1] = croco_node.data.tail.old_pos[1] - furtherRotation2Array[i][0][1];
                        croco_node.data.tail.angle = croco_node.data.tail.old_angle - furtherRotation2Array[i][1];
                        break;
                    case NORTH:
                        croco_node.data.tail.direction = NORTH;
                        croco_node.data.tail.anim = FURTHER_RIGHT_ROTATION2;
                        croco_node.data.tail.pos[0] = croco_node.data.tail.old_pos[0] - furtherRotation2Array[i][0][1];
                        croco_node.data.tail.pos[1] = croco_node.data.tail.old_pos[1] + furtherRotation2Array[i][0][0];
                        croco_node.data.tail.angle = croco_node.data.tail.old_angle - furtherRotation2Array[i][1];
                        break;
                }
                break;
            default:
                break;
        }




  }
    if (croco_node.next != null)
        updateCrocoPositions(croco_node.next, i);
}
