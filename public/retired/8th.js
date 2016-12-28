//
// Aggresive strategy "run-and-kick"- all players run to ball and kick it if possible to any direction
//
'use strict';

function getDirectionTo(startPoint, endPoint) {
  return Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x);
}

function getPlayerMove(data) {
  var halfField = data.settings.field.width / 2;
  var currentPlayer = data.yourTeam.players[data.playerIndex];
  var currentPlayerIndex = data.playerIndex;
  var ball = data.ball;
  var startZone = currentPlayer.x;
  var ballStop = getBallStats(ball, data.settings);

//if ball position < initial of player1 - kick to antoher direction
if(currentPlayerIndex != 1){
  var whoAmI = currentPlayerIndex == 0 ? 0 : 2;
  var thisPlayer = data.yourTeam.players[whoAmI];
  var anotherPlayer = data.yourTeam.players[[2,1,0][whoAmI]];
  var ballY = ball.y < currentPlayer.y ? +(ball.settings.radius) : -(ball.settings.radius); 

  if((ball.x - thisPlayer.x)<(ball.x - anotherPlayer.x)){
    if((ballStop.x <= currentPlayer.x)){
      var attackDirection = Math.atan2(ball.y - currentPlayer.y + ballY*2, ballStop.x - currentPlayer.x - ball.settings.radius * 2);
    }
    else{
      var attackDirection = Math.atan2(ballStop.y - currentPlayer.y, ballStop.x - currentPlayer.x - ball.settings.radius);
    }
  }else{
    if((ballStop.x <= currentPlayer.x)){
      var attackDirection = Math.atan2(ballStop.y - currentPlayer.y + ballY, ball.x - currentPlayer.x - ball.settings.radius * 2);
    }
    else{
      var attackDirection = Math.atan2(ballStop.y - currentPlayer.y, ballStop.x - currentPlayer.x - ball.settings.radius);
    }
  }
}
else{
  //defender
  if((currentPlayer.x <= halfField) && (ball.x >= currentPlayer.x)){
    if((ballStop.x <= currentPlayer.x)){
        var attackDirection = Math.atan2(ballStop.y - currentPlayer.y + ballY, ballStop.x - currentPlayer.x - ball.settings.radius * 2);
      }
      else{
        var attackDirection = Math.atan2(ballStop.y - currentPlayer.y, ballStop.x - currentPlayer.x - ball.settings.radius);
      }
  }
    else{
      var zonePoint = {
        x: ball.x - halfField,
        y: ball.y + ball.settings.radius
      };
      var attackDirection = getDirectionTo(currentPlayer, zonePoint);
    }
}

  return {
    direction: attackDirection,
    velocity: currentPlayer.velocity + data.settings.player.maxVelocityIncrement
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