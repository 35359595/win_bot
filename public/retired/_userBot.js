//
// Aggresive strategy "run-and-kick"- all players run to ball and kick it if possible to any direction
//
'use strict';

function getDirectionTo(startPoint, endPoint) {
  return Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x);
}

function getDistance(point1, point2) {
  return Math.hypot(point1.x-point2.x, point1.y - point2.y);
}

function getPlayerMove(data) {
  var fieldW = data.settings.field.width;
  var fieldH = data.settings.field.height;
  var halfField = data.settings.field.width / 3;
  var currentPlayer = data.yourTeam.players[data.playerIndex];
  var currentPlayerIndex = data.playerIndex;
  var ball = data.ball;
  var startZone = currentPlayer.x;
  var ballStop = getBallStats(ball, data.settings);
  var ballRadius = ball.settings.radius;
  var velocity = currentPlayer.velocity + data.settings.player.maxVelocityIncrement

  var attack = function(){
    return Math.atan2(ballStop.y - currentPlayer.y + (ballStop.x < currentPlayer.x ? ball.y > currentPlayer.y ? - ballRadius * 2 : ballRadius * 2 : 0), ballStop.x - currentPlayer.x - ballRadius * 2);
  };

  var defend = function(){
    return Math.atan2(
        (ballStop.y < 0 ? ball.y : ballStop.y) - currentPlayer.y + ( Math.abs(ball.y - currentPlayer.y) < ballRadius * 2 
          ? ballStop.x - currentPlayer.x < ballRadius * 2
            ? - ballRadius * 2
            : ballRadius * 2
          : 0),
        ballStop.x - currentPlayer.x - ballRadius * 2
        );
  }; 

  var amICloser = function(){
    for (var i = 0; i < data.yourTeam.players.length; i++){
      var cP = data.yourTeam.players[i];
      if (ballStop.x - cP.x + ballStop.y - cP.y < ballStop.x - currentPlayer.x + ballStop.y - currentPlayer.y){
        return false;
      }
    }
    return true;
  };

var zonePoint = undefined;
//main action
if (currentPlayerIndex == 1){
  if (ballStop.x < fieldW / 2 && ballStop.y >= fieldW / 2){
    if(ball.x > currentPlayer.x + ballRadius){//attack
      var attackDirection = attack(0);
    }else{//defend
      var attackDirection = defend(); 
    }
  }
  else{var zonePoint = {
      x: fieldW / 4,
      y: fieldH - fieldH / 4
    };
    var attackDirection = getDirectionTo(currentPlayer, zonePoint);
    velocity = getDistance(currentPlayer, zonePoint) < 40 ? 0 : data.settings.player.maxVelocity;
  }
}else if (currentPlayerIndex == 0){
  if (ballStop.x < fieldW / 2 && ballStop.y < fieldW / 2){
    if(ball.x > currentPlayer.x + ballRadius){//attack
      var attackDirection = attack(0);
    }else{//defend
      var attackDirection = defend(); 
    }
  }
  else{var zonePoint = {
      x: fieldW / 4,
      y: fieldH / 4
    };
    var attackDirection = getDirectionTo(currentPlayer, zonePoint);
    velocity = getDistance(currentPlayer, zonePoint) < 40 ? 0 : data.settings.player.maxVelocity;
  }
}else{
  if (ballStop.x >= fieldW / 2){
    if(ball.x > currentPlayer.x + ballRadius){//attack
      var attackDirection = attack(0);
    }else{//defend
      var attackDirection = defend(); 
    }
  }
}
return {
    direction: attackDirection,
    velocity: velocity
  };
}

function getBallStats(ball, gameSettings) {
  var stopTime = getStopTime(ball);
  var stopDistance = ball.velocity * stopTime
    - ball.settings.moveDeceleration * (stopTime + 1) * stopTime / 2;

  var x = ball.x + stopDistance * Math.cos(ball.direction);
  var y = Math.abs(ball.y + stopDistance * Math.sin(ball.direction));

  // check the reflection from field side
  if (y > gameSettings.field.height) y = 2 * gameSettings.field.height - y;

  return { stopTime, stopDistance, x, y };
}

function getStopTime(ball) {
  return ball.velocity / ball.settings.moveDeceleration;
}

onmessage = (e) => postMessage(getPlayerMove(e.data));
