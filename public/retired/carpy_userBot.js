'use strict';

function getDirectionTo(startPoint, endPoint) {
  return Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x);
}

function getDistance(point1, point2) {
  return Math.hypot(point1.x-point2.x, point1.y - point2.y);
}

function getPlayerMove(data) {
//region variables
  let currentPlayer = data.yourTeam.players[data.playerIndex];
  let ball = data.ball;
  let ballStop = getBallStats(ball, data.settings);
  let ballRadius = ball.settings.radius;
  let bDiameter = ballRadius * 2;
  let secondPlayer = data.yourTeam.players[[1,2,0][data.playerIndex]];
  let thirdPlayer = data.yourTeam.players[[2,0,1][data.playerIndex]];
  let myCord = currentPlayer.x * 2 + currentPlayer.y * 2;
  let sCord = secondPlayer.x * 2 + secondPlayer.y * 2;
  let tCord = thirdPlayer.x * 2 + thirdPlayer.y * 2;
  let ballCord = ballStop.x * 2 + ballStop.y * 2;
  let fieldW = data.settings.field.width;
  let fieldH = data.settings.field.height;
  let retreatPoint = {
    x: fieldW - [[fieldW / 5 * 4 , fieldW / 5 * 4, fieldW / 4][data.playerIndex]],
    y: fieldH - [[fieldH / 4 * 3, fieldH / 4, fieldH / 2][data.playerIndex]]
  };
  let attackDirection;

  let velocity = currentPlayer.velocity + data.settings.player.maxVelocityIncrement;
//endregion

  let attack = () => {
    return Math.atan2(ballStop.y - currentPlayer.y + Math.random(), ballStop.x - currentPlayer.x - bDiameter + (ballStop.y - bDiameter < currentPlayer.y ? 0 : 4));
  };

  let defend = () => {
    // var stopPoint = {
    //      x: ballStop.x - bDiameter - 1,
    //      y: ballStop.y + (ballStop.y < currentPlayer.y ? bDiameter + 1 : - bDiameter - 1 )
    //    }
    // return getDirectionTo(currentPlayer, stopPoint);
    return Math.atan2(
        ballStop.y - currentPlayer.y + ( Math.abs(ballStop.y - currentPlayer.y) < bDiameter 
            ? ballRadius * 3
            : - ballRadius * 3
          ),
        ballStop.x - currentPlayer.x - ballRadius * 3
      );
  };
  
  let amIBehind = () => {
    if (secondPlayer.x > ball.x && thirdPlayer.x > ball.x && currentPlayer.x < ball.x){
      return true;
    }
    return false;
  };

  let amICloser = () => {
    if (data.playerIndex == 2 && ballStop.x < fieldW / 2 || amIBehind()){
      return false;
    }else if(data.yourTeam.players[2].x > ball.x || data.playerIndex == 0 && ballStop.x < fieldW / 2 && ballStop.y < fieldH / 2 || amIBehind()){
      return true;
    }else if(
      data.playerIndex == 1 && ballStop.x < fieldW / 2 && ballStop.y > fieldH / 2 || amIBehind()
    ){
      return true;
    }else if(
      sCord - ballCord > myCord - ballCord || tCord - ballCord > myCord - ballCord 
    ){
      return false;
    }
    return true;
  };

//region MainActions
  if(amICloser()){
   if(ballStop.x > currentPlayer.x){
      attackDirection = attack();
    }
    else{
        attackDirection = defend();
    }
  }
  else{
    let zonePoint = retreatPoint;
    attackDirection = getDirectionTo(currentPlayer, zonePoint);
    velocity = getDistance(currentPlayer, zonePoint) < 40 ? 0 : data.settings.player.maxVelocity;
  }
//endregion

  return {
    direction: attackDirection,
    velocity: velocity
  };
}

function getBallStats(ball, gameSettings) {
  let stopTime = getStopTime(ball);
  let stopDistance = ball.velocity * stopTime
    - ball.settings.moveDeceleration * (stopTime + 1) * stopTime / 2;

  let x = ball.x + stopDistance * Math.cos(ball.direction);
  let y = Math.abs(ball.y + stopDistance * Math.sin(ball.direction));

  // check the reflection from field side
  if (y > gameSettings.field.height) y = 2 * gameSettings.field.height - y;

  return { stopTime, stopDistance, x, y };
}

function getStopTime(ball) {
  return ball.velocity / ball.settings.moveDeceleration;
}

onmessage = (e) => postMessage(getPlayerMove(e.data));
