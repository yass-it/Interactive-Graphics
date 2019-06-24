"use strict";
var canvas; var program;
var stats;

var resultsStack = [];

var points = 0;

var result;
var count = 0;

var crocodile_head;
var crocodile_body;
var crocodile_ArmTail;
var armsLegs;
var crocodileList = new List();
var facing_direction = NORTH;

var obs_poss;
var food; var theta_food = 0;

var now_position = [1, 4];
var at_eye  = vec3(now_position[0]*tile_size_max + tile_size_min/2, 0.0 , now_position[1]*tile_size_max + tile_size_min/2);
var eye_pos = vec3(at_eye[0], 1.25, at_eye[2]-2.0);
var up_eye  = vec3(0.0, 1.0 , 0.0);

var cameraMatrix; var projectionMatrix;
var vBuffer; var vPosition;
var nBuffer; var vNormal;
var tBuffer; var vTexCoord;

var uColor;
var uModelViewMatrix; var uProjectionMatrix; var uCameraMatrix;
var uDiffuseProduct; var uSpecularProduct; var uShininess;
var uText0;

var pause = true;




function renderObject(type, positions, theta, val) {
    var len = positions.length;
    switch(type) {
        case PYRAMID:

            gl.uniform4fv( uColor, BLUE);
            gl.uniform4fv( uDiffuseProduct, flatten(pyramidDiffuseProduct));
            gl.uniform4fv( uSpecularProduct, flatten(pyramidSpecularProduct));
            gl.uniform1f( uShininess, pyramidShininess);

            gl.uniform1i(uText0, WHITE_TRIANGLE_TEXTURES);

            for (var i=0; i<len; i++) {
                var posX = positions[i][0]; var posY = positions[i][1];
                var translateMatrix = translate(tile_size_min/2 + tile_size_max*posX , 0.01,tile_size_min/2 + tile_size_max*posY);
                var modelViewMatrix = mult(translateMatrix, pyramid_scalematrix);
                gl.uniformMatrix4fv(uModelViewMatrix, false, flatten(modelViewMatrix));
                gl.drawArrays(gl.TRIANGLES, buffer_indexes[PYRAMID], lenPyramidArray);
            }

            break;
        case PARALLELOGRAM:

            gl.uniform4fv( uColor, RED);
            gl.uniform4fv( uDiffuseProduct, flatten(parallelogramDiffuseProduct));
            gl.uniform4fv( uSpecularProduct, flatten(parallelogramSpecularProduct));
            gl.uniform1f( uShininess, parallelogramShininess);

            gl.uniform1i(uText0, WHITE_SQUARE_TEXTURES);

            for (var i = 0; i < len; i++) {
                var posX = positions[i][0]; var posY = positions[i][1];
                var rotationmatrix = rotate(theta, [0, 1, 0] );
                var translateMatrix = translate(tile_size_min/2 + tile_size_max*posX, 0.01, tile_size_min/2 + tile_size_max*posY);
                var modelViewMatrix = mult(translateMatrix, mult(rotationmatrix, parallelogram_scalematrix));
                gl.uniformMatrix4fv(uModelViewMatrix, false, flatten(modelViewMatrix));
                gl.drawArrays(gl.TRIANGLES, buffer_indexes[PARALLELOGRAM], lenParallelogramArray);
            }
            break;
        case CROCODILEHEAD:

            gl.uniform4fv( uColor, GREEN);
            gl.uniform4fv( uDiffuseProduct, flatten(crocodileDiffuseProduct));
            gl.uniform4fv( uSpecularProduct, flatten(crocodileSpecularProduct));
            gl.uniform1f( uShininess, crocodileShininess);

            gl.uniform1i(uText0, WHITE_TRIANGLE_TEXTURES);

            for (var i = 0; i < len; i++) {
                var posX = positions[i][0]; var posY = positions[i][1];
                var rotationmatrix = rotate(theta, [0, 1, 0] );
                var translateMatrix = translate(tile_size_min/2 + tile_size_max*posX, 0.01, tile_size_min/2 + tile_size_max*posY);
                var modelViewMatrix = mult(translateMatrix, mult(rotationmatrix, crocodilehead_scalematrix));
                gl.uniformMatrix4fv(uModelViewMatrix, false, flatten(modelViewMatrix));
                gl.drawArrays(gl.TRIANGLES, buffer_indexes[CROCODILEHEAD], lenCrocodileheadArray);
            }



            break;
        case CROCODILEBODY:

            gl.uniform4fv( uColor, GREEN);
            gl.uniform4fv( uDiffuseProduct, flatten(crocodileDiffuseProduct));
            gl.uniform4fv( uSpecularProduct, flatten(crocodileSpecularProduct));
            gl.uniform1f( uShininess, crocodileShininess);

            gl.uniform1i(uText0, WHITE_SQUARE_TEXTURES);

            for (var i = 0; i < len; i++) {
                var posX = positions[i][0]; var posY = positions[i][1];
                var rotationmatrix = rotate(theta[i], [0, 1, 0] );
                var translateMatrix = translate(tile_size_min/2 + tile_size_max*posX, 0.01, tile_size_min/2 + tile_size_max*posY);
                var modelViewMatrix = mult(translateMatrix, mult(rotationmatrix, crocodilebody_scalematrix));
                gl.uniformMatrix4fv(uModelViewMatrix, false, flatten(modelViewMatrix));
                gl.drawArrays(gl.TRIANGLES, buffer_indexes[CROCODILEBODY], lenCrocodilebodyArray);
            }


            break;

        case CROCODILETAIL:

            gl.uniform4fv( uColor, GREEN);
            gl.uniform4fv( uDiffuseProduct, flatten(crocodileDiffuseProduct));
            gl.uniform4fv( uSpecularProduct, flatten(crocodileSpecularProduct));
            gl.uniform1f( uShininess, crocodileShininess);

            gl.uniform1i(uText0, WHITE_TRIANGLE_TEXTURES);

            for (var i = 0; i < len; i++) {
                var posX = positions[i][0]; var posY = positions[i][1];
                var rotationmatrix = rotate(theta, [0, 1, 0] );
                var translateMatrix = translate(tile_size_min/2 + tile_size_max*posX, 0.01, tile_size_min/2 + tile_size_max*posY);
                var modelViewMatrix = mult(translateMatrix, mult(rotationmatrix, crocodiletail_scalematrix));
                gl.uniformMatrix4fv(uModelViewMatrix, false, flatten(modelViewMatrix));
                gl.drawArrays(gl.TRIANGLES, buffer_indexes[CROCODILETAIL], lenCrocodiletailArray);
            }
            break;



        case KANGAROO:
            gl.uniform4fv( uColor, MAROON);
            gl.uniform4fv( uDiffuseProduct, flatten(parallelogramDiffuseProduct));
            gl.uniform4fv( uSpecularProduct, flatten(parallelogramSpecularProduct));
            gl.uniform1f( uShininess, parallelogramShininess);

            gl.uniform1i(uText0, WHITE_SQUARE_TEXTURES);
            renderKangaroo();
            break;
        default:
            throw "renderObject(): wrong type";
    }
}

function renderWorld() {
    gl.uniform4fv( uColor, PURPLE);
    gl.uniform4fv( uDiffuseProduct, flatten(squareDiffuseProduct));
    gl.uniform4fv( uSpecularProduct, flatten(squareSpecularProduct));
    gl.uniform1f( uShininess, squareShininess);
    gl.uniform1i( uText0, WHITE_SQUARE_TEXTURES);

    for (var i=0; i<world_size_w; i++) {
        for (var j=0; j<world_size_h; j++) {
            if (food[0][0] == i && food[0][1] == j) {
                gl.uniform4fv( uColor, GREEN);
            } else if (!kangaroo_eated && kangaroo_pos[0][0] == i && kangaroo_pos[0][1] == j) {
                gl.uniform4fv( uColor, WHITE);
            } else {
                gl.uniform4fv( uColor, world[i][j].color);
            }
            renderTile(world[i][j].modelView);
        }
    }
}


function setCamera(eye, at, update_global) {

    var old_eye_pos = eye_pos.slice();
    var old_at_eye = at_eye.slice();
    old_eye_pos.push(1.0);
    old_at_eye.push(1.0);

    var mat_eye  = translate(-old_at_eye[0], 0.0, -old_at_eye[2]);
    mat_eye = mult(rotate( eye.delta_angle , [0, 1, 0] ), mat_eye);
    mat_eye = mult(translate(old_at_eye[0], 0.0, old_at_eye[2]), mat_eye);
    mat_eye = mult(translate( eye.delta_transl[0] , eye.delta_transl[1], eye.delta_transl[2]), mat_eye);

    var mat_at  = translate( at.delta_transl[0] , at.delta_transl[1], at.delta_transl[2]);

    old_eye_pos = vec3(apply_matrix4(mat_eye, old_eye_pos));
    old_at_eye = vec3(apply_matrix4(mat_at, old_at_eye));

    cameraMatrix = lookAt(old_eye_pos, old_at_eye, up_eye);
    gl.uniformMatrix4fv( uCameraMatrix, false, flatten(cameraMatrix));

    if (update_global) {
        eye_pos = vec3(old_eye_pos);
        at_eye = vec3(old_at_eye);
    }

}



function renderTile(modelViewMatrix) {
    gl.uniformMatrix4fv(uModelViewMatrix, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLE_FAN, buffer_indexes[SQUARE], lenSquareArray);
}

function renderCrocodile(val1) {
    var el = crocodileList.next();
    if (el.data.type == CROCODILEHEAD) {
        renderObject(CROCODILEHEAD, [el.data.pos], el.data.angle, 0);
    } else {
        throw "renderCrocodile(): crocodileList in an invalid state";
    }
    el = crocodileList.next();

var positions = []; var angles = [];
   while(el.data.type == CROCODILEBODY) {
        positions.push(el.data.pos);
        angles.push(el.data.angle);
        el = crocodileList.next();
    }
    renderObject(CROCODILEBODY, positions, angles, 10);


  if (el.data.tail.type == CROCODILETAIL) {

        renderObject(CROCODILETAIL, [el.data.tail.pos], el.data.tail.angle, 10);

      } else {
        throw "renderCrocodile(): crocodileList in an invalid state";
    }

    crocodileList.next();

}

// food has two components: the first is the vector of coordinates, the second is the angle
// at is a boolean!
function renderWorldObjects(obstacles, food, croco, val1) {
    renderObject(PYRAMID, obstacles, 0, 10);
    renderObject(PARALLELOGRAM, food[0], food[1], 10);
    renderCrocodile(val1);
}

var leftArrowPressed = false; var rightArrowPressed = false; var upArrowPressed = false;
var leftArrowPressed1 = false; var rightArrowPressed1 = false; var upArrowPressed1 = false;
function bindButtons() {
    // document.getElementById("switchView").onclick = function(){isViewChanged = true; topView = !topView;};
    document.addEventListener('keydown', function(event) {
        if(event.keyCode == 37) {
            leftArrowPressed = true;

        } else if(event.keyCode == 39) {
            rightArrowPressed = true;

        } else if(event.keyCode == 38) {
            upArrowPressed = true;

        } else if (event.keyCode == 13) {
            pause = !pause;
            if (pause)
                document.getElementById("points").innerHTML += " STOPPED";
            else
                updatePoints(points);

        }
    });


}

window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );
    canvas.width = window.innerWidth-35;
    canvas.height = window.innerHeight-250;
    canvas.style.display = "block";

    var instructions = document.getElementById( "instructions" );
    instructions.style.position = "absolute";
    instructions.style.top = canvas.height + 10;
    instructions.style.left = canvas.width/2;
    instructions.style.color = "white";

    //localStorage.removeItem("result");
    var results = document.getElementById( "results" );
    results.style.position = "absolute";
    results.style.top = canvas.height + 10;
    results.style.left = canvas.width/2;
    results.style.color = "white";




 document.getElementById("removeButton").onclick = function(event) {
   for(var i = 0; i<=localStorage.getItem("count")-1; i++){
     localStorage.removeItem("result"+i);
   }

   localStorage.removeItem("count");

   window.location.reload(false);
 }

  console.log(localStorage.getItem("count"));
  for(var i = 0; i<=localStorage.getItem("count")-1; i++){
  var header = document.createElement("p");
  var node = document.createTextNode(localStorage.getItem("result"+i));
  header.appendChild(node);
  var element = document.getElementById("results");
  element.appendChild(header);

}


    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor( 0, 0, 0, 1 );
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

    var near = 0.3; var far = 50.0; var  fovy = 45.0; var  aspect = canvas.width/canvas.height;
    projectionMatrix = perspective(fovy, aspect, near, far);
    cameraMatrix = lookAt(eye_pos, at_eye , up_eye);

    program = initShaders( gl, "vs-env", "fs-env");
    gl.useProgram( program );

    uModelViewMatrix = gl.getUniformLocation( program, "modelViewMatrix");
    uProjectionMatrix = gl.getUniformLocation(program, "projectionMatrix");
    uCameraMatrix = gl.getUniformLocation(program, "cameraMatrix");
    uColor = gl.getUniformLocation(program, "color");
    uDiffuseProduct  = gl.getUniformLocation(program, "diffuseProduct");
    uSpecularProduct = gl.getUniformLocation(program, "specularProduct");
    uShininess = gl.getUniformLocation(program, "shininess");
    uText0 = gl.getUniformLocation( program, "Tex0");

    gl.uniformMatrix4fv( uProjectionMatrix, false, flatten(projectionMatrix));

    gl.uniformMatrix4fv( uCameraMatrix, false, flatten(cameraMatrix));

    // initialize buffer with ALL vertices
    var allVertices = squareArray.concat(pyramidArray).concat(parallelogramArray).concat(crocodileheadArray)
  .concat(crocodilebodyArray).concat(crocodiletailArray);

    vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(allVertices), gl.STATIC_DRAW );
    vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    var allNormals = squareNormalsArray.concat(pyramidNormalsArray).concat(parallelogramNormalsArray).concat(crocodileheadNormalsArray)
                      .concat(crocodilebodyNormalsArray).concat(crocodiletailNormalsArray);

    nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(allNormals), gl.STATIC_DRAW );
    vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal );


      var allTextures = squareTexCoordsArray.concat(pyramidTexCoordsArray).concat(parallelogramTexCoordsArray).concat(crocodileheadTexCoordsArray)
                                        .concat(crocodilebodyTexCoordsArray).concat(crocodiletailTexCoordsArray);

    tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(allTextures), gl.STATIC_DRAW );

    vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vTexCoord );

    initSquareWhiteTexture(gl);
    initTriangleWhiteTexture(gl);

    initializePositionUpdater();

    obs_poss = []; var k = 0;

    obs_poss.push([Math.round(world_size_w/2)-1, Math.round(world_size_h/2)-1]);
    obs_poss.push([Math.round(world_size_w/2)  , Math.round(world_size_h/2)-1]);
    obs_poss.push([Math.round(world_size_w/2)-1, Math.round(world_size_h/2)  ]);
    obs_poss.push([Math.round(world_size_w/2)  , Math.round(world_size_h/2)  ]);
    obs_poss.push([Math.round(world_size_w)-1  , Math.round(world_size_h)-1]);
    obs_poss.push([Math.round(world_size_w)- Math.round(world_size_w) , Math.round(world_size_h)-1]);
    obs_poss.push([Math.round(world_size_w)-1  , Math.round(world_size_h)- Math.round(world_size_h)]);
    obs_poss.push([Math.round(world_size_w)- Math.round(world_size_w) , Math.round(world_size_h)- Math.round(world_size_h)]);


    food = [[3, 3]];
    kangaroo_pos = [[3, 4]];
    initKangarooStuff(uModelViewMatrix, gl);

    world = build_env_matrix(world_size_w, world_size_h, food, obs_poss, kangaroo_pos);


    crocodile_head = {};
    crocodile_head.type = CROCODILEHEAD;
    crocodile_head.pos = [1, 4];
    crocodile_head.angle = 0;
    crocodile_head.direction = NORTH;
    crocodile_head.anim = null;







crocodile_body = {};
crocodile_body.type = CROCODILEBODY;
crocodile_body.pos = [crocodile_head.pos[0], crocodile_head.pos[1]-1];
crocodile_body.angle = crocodile_head.angle;
crocodile_body.direction = crocodile_head.direction;
crocodile_body.anim = FORWARD;

crocodile_ArmTail = { };

  crocodile_ArmTail.tail = {
    type: CROCODILETAIL,
    pos: [crocodile_head.pos[0], crocodile_head.pos[1]-2],
    angle: crocodile_head.angle,
    direction: crocodile_head.direction,
    anim: FORWARD
  };




    crocodileList.add(crocodile_ArmTail);
    crocodileList.add(crocodile_body);
    crocodileList.add(crocodile_head);


    initializeOldPos(crocodileList.head);
    updateCrocoWorld(world, crocodileList.head);


    renderWorld();
    renderWorldObjects(obs_poss, [food, 0], 0);
    counter1 = 1;
    renderObject(KANGAROO, kangaroo, 10);

    bindButtons();
    anim_counter=0; anim=false; cur_anim = null;
    render();
}



var inc_tran={x:0, y:0};
var tot_tran={x:0, y:0};
var inc_rot=0;
var tot_rot=0;

var inc_pos={x:0, y:0};

function animation(type, current) {
    switch(type) {
        case LEFT_ROTATION:
            if (current == 0) {
                initializeOldPos(crocodileList.head);
                crocodile_head.anim = LEFT_ROTATION;
                switch (crocodile_head.old_direction) {
                    case NORTH:
                        crocodile_head.direction = WEST;
                        crocodile_head.future_position = [crocodile_head.pos[0]+1, crocodile_head.pos[1]];
                    inc_pos.x = linear_interpolation(speed, 0, cur_maximum, 0, 1);
                        inc_pos.y = 0;
                        inc_tran.x = linear_interpolation(speed, 0, cur_maximum, 0, tile_size_max);
                        inc_tran.y = 0;
                        break;
                    case SOUTH:
                        crocodile_head.direction = EAST;
                        crocodile_head.future_position = [crocodile_head.pos[0]-1, crocodile_head.pos[1]];
                      inc_pos.x = -linear_interpolation(speed, 0, cur_maximum, 0, 1);
                        inc_pos.y = 0;
                        inc_tran.x = -linear_interpolation(speed, 0, cur_maximum, 0, tile_size_max);
                        inc_tran.y = 0;
                        break;
                    case EAST:
                        crocodile_head.direction = NORTH;
                        crocodile_head.future_position = [crocodile_head.pos[0], crocodile_head.pos[1]+1];
                      inc_pos.x = 0;
                        inc_pos.y = linear_interpolation(speed, 0, cur_maximum, 0, 1);
                        inc_tran.x = 0;
                        inc_tran.y = linear_interpolation(speed, 0, cur_maximum, 0, tile_size_max);
                        break;
                    case WEST:
                        crocodile_head.direction = SOUTH;
                        crocodile_head.future_position = [crocodile_head.pos[0], crocodile_head.pos[1]-1];
                        inc_pos.x = 0;
                        inc_pos.y = -linear_interpolation(speed, 0, cur_maximum, 0, 1);
                        inc_tran.x = 0;
                        inc_tran.y = -linear_interpolation(speed, 0, cur_maximum, 0, tile_size_max);
                        break;
                    default:
                        throw "animation(): facing_direction corrupted";
                }

                if (checkLose()) {

                  var name = prompt("YOU LOSE\n" +" Please enter your name:");
                    if(name=="" || name==null){
                      name = "Anonymous";
                    }
                    result = name + " | " + points;



                    addResult(result);

                    window.location.reload(false);
                }
                if (checkFood()) {

                    points += 1;
                    updatePoints(points);

                    food = [genFood(world_size_w, world_size_h, world, false)];


                    console.log("inside of checkFood");
                }
                if (checkKangaroo()) {

                    points += 5;
                    updatePoints(points);

                    kangaroo_eated = true;

                }

                inc_rot = linear_interpolation(speed, 0, cur_maximum, 0, 90);
                tot_tran.x=0; tot_tran.y=0; tot_rot=0;

            }
            if (current >= cur_maximum) {
                gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

                crocodile_head.angle = fix_round_error(crocodile_head.angle, 90)%360;


                var eye={};
                eye.delta_transl = [NaN, 0.0, NaN];
                eye.delta_angle = 90;

                var at={};
                at.delta_transl = [];

                if (inc_tran.y == 0) {
                    eye.delta_transl[2] = 0.0;
                    if (inc_tran.x>0) {
                        eye.delta_transl[0] = tile_size_max;
                    } else {
                        eye.delta_transl[0] = -tile_size_max;
                    }
                } else if (inc_tran.x == 0) {
                    eye.delta_transl[0] = 0.0;
                    if (inc_tran.y>0) {
                        eye.delta_transl[2] = tile_size_max;
                    } else {
                        eye.delta_transl[2] = -tile_size_max;
                    }
                } else {
                    throw "animation(): inconsistent inc_tran state"
                }
                at.delta_transl = eye.delta_transl;
                setCamera(eye, at, true);

                renderWorld();
                theta_food = (theta_food + 1) % 360;
                crocodile_head.pos = [crocodile_head.old_pos[0] + 1*sign(inc_tran.x), crocodile_head.old_pos[1] + 1*sign(inc_tran.y)];

                updateCrocoPositions(crocodileList.getBody(), current);


                if(counter1 == 0) {
                  counter1++;
                    renderWorldObjects(obs_poss, [food, theta_food], -0.05);
                }
                else if(counter1 == 4){
                counter1 = 0;
                    renderWorldObjects(obs_poss, [food, theta_food], 0);
              }
                else{
                  renderWorldObjects(obs_poss, [food, theta_food], 0);
                counter1++;
              }




                updateCrocoWorld(world, crocodileList.head);
                anim_counter=0; anim=false; cur_anim = null;
          } else {
                gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

                var eye={};
                eye.delta_transl = [tot_tran.x, 0.0, tot_tran.y];
                eye.delta_angle = tot_rot;

                var at={};
                at.delta_transl = eye.delta_transl;

                setCamera(eye, at, false);
                renderWorld();
                theta_food = (theta_food + 1) % 360;
                updateCrocoPositions(crocodileList.getBody(), current);

                renderWorldObjects(obs_poss, [food, theta_food], 0);


                tot_rot    += inc_rot;
                tot_tran.x += inc_tran.x;
                tot_tran.y += inc_tran.y;

                crocodile_head.pos[0] += inc_pos.x;
                crocodile_head.pos[1] += inc_pos.y;
                crocodile_head.angle += inc_rot;




            }
            break;
        case RIGHT_ROTATION:
            if (current == 0) {
                initializeOldPos(crocodileList.head);
                crocodile_head.anim = RIGHT_ROTATION;
                switch (crocodile_head.old_direction) {
                    case NORTH:
                        crocodile_head.direction = EAST;
                        crocodile_head.future_position = [crocodile_head.pos[0]-1, crocodile_head.pos[1]];
                    inc_pos.x = -linear_interpolation(speed, 0, cur_maximum, 0, 1);
                        inc_pos.y = 0;
                        inc_tran.x = -linear_interpolation(speed, 0, cur_maximum, 0, tile_size_max);
                        inc_tran.y = 0;
                        break;
                    case SOUTH:
                        crocodile_head.direction = WEST;
                        crocodile_head.future_position = [crocodile_head.pos[0]+1, crocodile_head.pos[1]];
                        inc_pos.x = linear_interpolation(speed, 0, cur_maximum, 0, 1);
                        inc_pos.y = 0;
                        inc_tran.x = linear_interpolation(speed, 0, cur_maximum, 0, tile_size_max);
                        inc_tran.y = 0;
                        break;
                    case EAST:
                        crocodile_head.direction = SOUTH;
                        crocodile_head.future_position = [crocodile_head.pos[0], crocodile_head.pos[1]-1];
                        inc_pos.x = 0;
                        inc_pos.y = -linear_interpolation(speed, 0, cur_maximum, 0, 1);
                        inc_tran.x = 0;
                        inc_tran.y = -linear_interpolation(speed, 0, cur_maximum, 0, tile_size_max);
                        break;
                    case WEST:
                        crocodile_head.direction = NORTH;
                        crocodile_head.future_position = [crocodile_head.pos[0], crocodile_head.pos[1]+1];
                        inc_pos.x = 0;
                        inc_pos.y = linear_interpolation(speed, 0, cur_maximum, 0, 1);
                        inc_tran.x = 0;
                        inc_tran.y = linear_interpolation(speed, 0, cur_maximum, 0, tile_size_max);
                        break;
                    default:
                        throw "animation(): facing_direction corrupted";
                }

                if (checkLose()) {

                  var name = prompt("YOU LOSE\n" + "Please enter your name:");
                  if(name=="" || name==null){
                    name = "Anonymous";
                  }
                  result = name + " | " + points;



                  addResult(result);
                    window.location.reload(false);
                }
                if (checkFood()) {

                    points += 1;
                    updatePoints(points);

                    food = [genFood(world_size_w, world_size_h, world, false)];



                                        console.log("inside of checkFood");
                }
                if (checkKangaroo()) {

                    points += 5;
                    updatePoints(points);

                    kangaroo_eated = true;

                }
                inc_rot = -linear_interpolation(speed, 0, cur_maximum, 0, 90);
                tot_tran.x=0; tot_tran.y=0; tot_rot=0;

            }
            if (current >= cur_maximum) {
                gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

                crocodile_head.angle = fix_round_error(crocodile_head.angle, 90)%360;

                var eye={};
                eye.delta_transl = [NaN, 0.0, NaN];
                eye.delta_angle = -90;

                var at={};

                if (inc_tran.y == 0) {
                    eye.delta_transl[2] = 0.0;
                    if (inc_tran.x>0) {
                        eye.delta_transl[0] = tile_size_max;
                    } else {
                        eye.delta_transl[0] = -tile_size_max;
                    }
                } else if (inc_tran.x == 0) {
                    eye.delta_transl[0] = 0.0;
                    if (inc_tran.y>0) {
                        eye.delta_transl[2] = tile_size_max;
                    } else {
                        eye.delta_transl[2] = -tile_size_max;
                    }
                } else {
                    throw "animation(): inconsistent inc_tran state"
                }
                at.delta_transl = eye.delta_transl;

                setCamera(eye, at, true);
                renderWorld();
                theta_food = (theta_food + 1) % 360;
                crocodile_head.pos = [crocodile_head.old_pos[0] + 1*sign(inc_tran.x), crocodile_head.old_pos[1] + 1*sign(inc_tran.y)];

                updateCrocoPositions(crocodileList.getBody(), current);

                renderWorldObjects(obs_poss, [food, theta_food], 0);

                updateCrocoWorld(world, crocodileList.head);

                anim_counter=0; anim=false; cur_anim = null;

          } else {
                gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

                var eye={};
                eye.delta_transl = [tot_tran.x, 0.0, tot_tran.y];
                eye.delta_angle = tot_rot;

                var at={};
                at.delta_transl = eye.delta_transl;

                setCamera(eye, at, false);
                renderWorld();
                theta_food = (theta_food + 1) % 360;
                updateCrocoPositions(crocodileList.getBody(), current);
                renderWorldObjects(obs_poss, [food, theta_food] , 0);

                tot_rot    += inc_rot;
                tot_tran.x += inc_tran.x;
                tot_tran.y += inc_tran.y;

                crocodile_head.pos[0] += inc_pos.x;
                crocodile_head.pos[1] += inc_pos.y;
                crocodile_head.angle += inc_rot;

            }
            break;
        case FORWARD:
                if (current == 0) {
                    initializeOldPos(crocodileList.head);

                  crocodile_head.anim = FORWARD;

                  switch (crocodile_head.old_direction) {
                        case WEST:
                            crocodile_head.future_position = [crocodile_head.pos[0]+1, crocodile_head.pos[1]];

                            inc_pos.x = linear_interpolation(speed, 0, cur_maximum/2, 0, 1);
                            inc_pos.y = 0;
                            inc_tran.x = linear_interpolation(speed, 0, cur_maximum/2, 0, tile_size_max);
                            inc_tran.y = 0;
                            break;
                        case EAST:
                            crocodile_head.future_position = [crocodile_head.pos[0]-1, crocodile_head.pos[1]];

                            inc_pos.x = -linear_interpolation(speed, 0, cur_maximum/2, 0, 1);
                            inc_pos.y = 0;
                            inc_tran.x = -linear_interpolation(speed, 0, cur_maximum/2, 0, tile_size_max);
                            inc_tran.y = 0;
                            break;
                        case NORTH:
                            crocodile_head.future_position = [crocodile_head.pos[0], crocodile_head.pos[1]+1];

                            inc_pos.x = 0;
                            inc_pos.y = linear_interpolation(speed, 0, cur_maximum/2, 0, 1);
                            inc_tran.x = 0;
                            inc_tran.y = linear_interpolation(speed, 0, cur_maximum/2, 0, tile_size_max);
                            break;
                        case SOUTH:
                            crocodile_head.future_position = [crocodile_head.pos[0], crocodile_head.pos[1]-1];

                            inc_pos.x = 0;
                            inc_pos.y = -linear_interpolation(speed, 0, cur_maximum/2, 0, 1);
                            inc_tran.x = 0;
                            inc_tran.y = -linear_interpolation(speed, 0, cur_maximum/2, 0, tile_size_max);
                            break;
                        default:
                            throw "animation(): facing_direction corrupted";
                    }
                    if (checkLose()) {

                      var name = prompt("YOU LOSE\n Please enter your name:");
                      if(name=="" || name==null){
                        name = "Anonymous";
                      }
                      result = name + " | " + points;


                      addResult(result);
                        window.location.reload(false);
                    }
                    if (checkFood()) {

                        points += 1;
                        updatePoints(points);

                  food = [genFood(world_size_w, world_size_h, world, false)];


                    }
                    if (checkKangaroo()) {

                        points += 5;
                        updatePoints(points);

                        kangaroo_eated = true;

                    }

                    tot_tran.x=0; tot_tran.y=0;
                }
                if (current >= cur_maximum) {

                  console.log("forward on max-current");

                    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

                    var eye={};
                    eye.delta_transl = [NaN, 0.0, NaN];
                    eye.delta_angle = 0;

                    if (inc_tran.y == 0) {
                        eye.delta_transl[2] = 0.0;
                        if (inc_tran.x>0) {
                            eye.delta_transl[0] = tile_size_max;
                        } else {
                            eye.delta_transl[0] = -tile_size_max;
                        }
                    } else if (inc_tran.x == 0) {
                        eye.delta_transl[0] = 0.0;
                        if (inc_tran.y>0) {
                            eye.delta_transl[2] = tile_size_max;
                        } else {
                            eye.delta_transl[2] = -tile_size_max;
                        }
                    } else {
                        throw "animation(): inconsistent inc_tran state"
                    }

                    var at={};
                    at.delta_transl = eye.delta_transl;

                   setCamera(eye, at, true);
                    renderWorld();
                    theta_food = (theta_food + 1) % 360;
                    crocodile_head.pos = [crocodile_head.old_pos[0] + 1*sign(inc_tran.x), crocodile_head.old_pos[1] + 1*sign(inc_tran.y)];

                  updateCrocoPositions(crocodileList.getBody(), current);
                  renderWorldObjects(obs_poss, [food, theta_food], 0);

                    updateCrocoWorld(world, crocodileList.head);

                    anim_counter=0; anim=false; cur_anim = null;
                } else {

                  console.log("forward before max-current");
                    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

                    var eye={};
                    eye.delta_transl = [tot_tran.x, 0.0, tot_tran.y];
                    eye.delta_angle = 0;

                    var at={};
                    at.delta_transl = eye.delta_transl;

                   setCamera(eye, at, false);
                    renderWorld();
                    theta_food = (theta_food + 1) % 360;
                   updateCrocoPositions(crocodileList.getBody(), current);
                    renderWorldObjects(obs_poss, [food, theta_food], 0);

                    tot_tran.x += inc_tran.x;
                    tot_tran.y += inc_tran.y;


                   crocodile_head.pos[0] += inc_pos.x;
                    crocodile_head.pos[1] += inc_pos.y;

                }
            break;
        default:
            throw "animation(): wrong type";
    }
}

function checkLose() {
    if (crocodile_head.future_position[0] >= world_size_w || crocodile_head.future_position[1] >= world_size_h || crocodile_head.future_position[0] < 0 || crocodile_head.
            future_position[1] < 0)
        return true;
    var head_world = world[crocodile_head.future_position[0]][crocodile_head.future_position[1]].element;

    var body0_round = Math.round(crocodile_body.pos[0]);
    var body1_round = Math.round(crocodile_body.pos[1]);
    var body_world = Math.round(world[body0_round][body1_round].element);

    if ( head_world == PYRAMID || body_world == PYRAMID || head_world == CROCODILEBODY || head_world == CROCODILETAIL ) {
        return true;
    }
    return false;
}

function checkFood() {

    if (world[crocodile_head.future_position[0]][crocodile_head.future_position[1]].element == PARALLELOGRAM)
        return true;
    return false;
}

function checkKangaroo() {
      if(points>=10 && points <=20){
        move = 2;
    }
    else if(points >= 20){
        move = 3;
    }
    if (!kangaroo_eated && crocodile_head.future_position[0] == kangaroo_pos[0][0] && crocodile_head.future_position[1] == kangaroo_pos[0][1])
        return true;
    return false;
}

var anim = false; var cur_anim = null; var anim_counter = 0;
function render() {

    if (pause) {
        gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        renderWorld();
        theta_food = (theta_food + 1) % 360;
        renderWorldObjects(obs_poss, [food, theta_food], 0);
    } else {
      console.log("counter2 is " + counter2);






      if (anim==false) {
            if (kangaroo_eated) {
                reinitializeKangaroo();
                kangaroo_eated = false;
            }
            if (leftArrowPressed) {
                anim = true;
                anim_counter = 0;
                leftArrowPressed = false;
                cur_anim = LEFT_ROTATION;
                animateKangaroo(anim_counter);
                animation(LEFT_ROTATION, anim_counter);
            } else if (rightArrowPressed) {
                anim = true;
                anim_counter = 0;
                rightArrowPressed = false;
                cur_anim = RIGHT_ROTATION;
                 animateKangaroo(anim_counter);
                animation(RIGHT_ROTATION, anim_counter);
            } else if (upArrowPressed) {
                anim = true;
                anim_counter = 0;
                upArrowPressed = false;
                cur_anim = FORWARD;
                   animateKangaroo(anim_counter);
                animation(FORWARD, anim_counter);
            } else {
              anim = true;
                anim_counter = 0;
                upArrowPressed = false;
                cur_anim = FORWARD;
                    animateKangaroo(anim_counter);
                animation(FORWARD, anim_counter);
            }
        } else {
            if (cur_anim == FORWARD){
                anim_counter+=2*speed;

                }
            else
                anim_counter+=speed;
              animateKangaroo(anim_counter);
            animation(cur_anim, anim_counter);
        }
          console.log("Anim counter is" + anim_counter);


          console.log(" counterUpdater val is " + counterUpdater);

                if(counterUpdater > 1){


                                  if(obs_poss[0][0]<1){
                                    shiftVal = -shiftVal;
                                    value = 2;
                                  }else if(obs_poss[0][0]>=world_size_w-2){
                                    shiftVal = -shiftVal;
                                    value = 2;
                                  }

                                    counter2+=shiftVal;

                                    world[obs_poss[0][0]][obs_poss[0][1]].element = VOID;
                                    world[obs_poss[1][0]][obs_poss[1][1]].element = VOID;
                                    world[obs_poss[2][0]][obs_poss[2][1]].element = VOID;
                                    world[obs_poss[3][0]][obs_poss[3][1]].element = VOID;






                                    console.log("postion type : " + world[obs_poss[0][0]][obs_poss[0][1]].element);

                obs_poss = [];
                obs_poss.push([Math.round(world_size_w/2)-counter2, Math.round(world_size_h/2)-1]);
                obs_poss.push([Math.round(world_size_w/2)-(counter2-1) , Math.round(world_size_h/2)-1]);
                obs_poss.push([Math.round(world_size_w/2)-1, Math.round(world_size_h/2)+counter2-value  ]);
                obs_poss.push([Math.round(world_size_w/2)  , Math.round(world_size_h/2)+counter2-value ]);
                world[obs_poss[0][0]][obs_poss[0][1]].element = PYRAMID;
                world[obs_poss[1][0]][obs_poss[1][1]].element = PYRAMID;
                world[obs_poss[2][0]][obs_poss[2][1]].element = PYRAMID;
                world[obs_poss[3][0]][obs_poss[3][1]].element = PYRAMID;
                console.log("postion type : " + world[obs_poss[0][0]][obs_poss[0][1]].element);
                obs_poss.push([Math.round(world_size_w)-1  , Math.round(world_size_h)-1]);
                obs_poss.push([Math.round(world_size_w)- Math.round(world_size_w) , Math.round(world_size_h)-1]);
                obs_poss.push([Math.round(world_size_w)-1  , Math.round(world_size_h)- Math.round(world_size_h)]);
                obs_poss.push([Math.round(world_size_w)- Math.round(world_size_w) , Math.round(world_size_h)- Math.round(world_size_h)]);
                counterUpdaterVal = -counterUpdaterVal;

              }
                else if(counterUpdater<0){
                counterUpdaterVal=-counterUpdaterVal;
              }

              counterUpdater += counterUpdaterVal;

    }

        renderObject(KANGAROO, [[]], 10);
    setTimeout(function() {
        window.requestAnimationFrame(render);
    }, 1000 / 50);

}
