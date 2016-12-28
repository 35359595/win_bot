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
  var currentPlayer = data.yourTeam.players[data.playerIndex];
  var ball = data.ball;
  var ballStop = getBallStats(ball, data.settings);
  var ballRadius = ball.settings.radius;
  var secondPlayer = data.yourTeam.players[[1,2,0][data.playerIndex]];
  var thirdPlayer = data.yourTeam.players[[2,0,1][data.playerIndex]];
  var myCord = currentPlayer.x * 2 + currentPlayer.y * 2;
  var sCord = secondPlayer.x * 2 + secondPlayer.y * 2;
  var tCord = thirdPlayer.x * 2 + thirdPlayer.y * 2;
  var ballCord = ballStop.x * 2 + ballStop.y * 2;
  var fieldW = data.settings.field.width;
  var fieldH = data.settings.field.height;
  var retreatPoint = fieldW - [[fieldW / 2,fieldW / 4 * 3, fieldW / 3][data.playerIndex]] + ballRadius * 2;

  var velocity = currentPlayer.velocity + data.settings.player.maxVelocityIncrement;

  var attack = function(){
    return Math.atan2(ballStop.y - currentPlayer.y, ballStop.x - currentPlayer.x - ballRadius * 2 + 5);
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
    if (
      secondPlayer.x > ballStop.x && thirdPlayer.x > ballStop.x && currentPlayer.x < ballStop.x 
    ){
      return true
    }else if(
      sCord - ballCord > myCord - ballCord || tCord - ballCord > myCord - ballCord 
    ){
      return false;
    }
    return true;
  };

  if(amICloser()){
    if(ball.x > currentPlayer.x){
      var attackDirection = attack();
    }else{
      var attackDirection = defend();
    }
  }
  else{
    var zonePoint = {
      x: retreatPoint,
      y: ballStop.y + ballRadius * 2
    };
    var attackDirection = getDirectionTo(currentPlayer, zonePoint);
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