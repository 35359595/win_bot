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
  var ballRadius = ball.settings.radius; 

if(currentPlayerIndex != 1){
  var whoAmI = currentPlayerIndex == 0 ? 0 : 2;
  var thisPlayer = data.yourTeam.players[whoAmI];
  var anotherPlayer = data.yourTeam.players[[2,1,0][whoAmI]];

  if((halfField - ball.x - thisPlayer.x)<(halfField - ball.x - anotherPlayer.x)){//forward
    if(ball.x > currentPlayer.x + ballRadius){//attack

      var attackDirection = Math.atan2(ballStop.y - currentPlayer.y, ballStop.x - currentPlayer.x - ballRadius * 2);

    }else if(anotherPlayer.x > ball.x){//defend
      var attackDirection = Math.atan2(
        ballStop.y - currentPlayer.y - ballRadius,
        ballStop.x - currentPlayer.x - ballRadius * 3 - (ballStop.x < halfField ? halfField : 0)
      );
    }
  }else{//middler
    if(ball.x > currentPlayer.x + ballRadius){//attack

      var attackDirection = Math.atan2(ballStop.y - currentPlayer.y, ballStop.x - currentPlayer.x + ballRadius * 2);

    }else{//defend
      var attackDirection = Math.atan2(
        ballStop.y - currentPlayer.y - ballRadius,
        ballStop.x - currentPlayer.x - ballRadius * 3
      );
    }
  }
}else{//defender
  if ((ballStop.x < halfField) && (ball.x > currentPlayer.x)){//attack

    var attackDirection = Math.atan2(ballStop.y - currentPlayer.y, ballStop.x - currentPlayer.x - ballRadius * 2);

  }else{//defend
    var attackDirection = Math.atan2(
        ballStop.y - currentPlayer.y - ballRadius,
        ballStop.x - currentPlayer.x - ballRadius * 4 - (ball.x > halfField ? halfField : 0)
      );
      // var stopPoint = {
      //    x: ballStop.x - ballRadius - (ballStop.x - ball.x > ballStop.x - currentPlayer.x 
      //       ? ballStop.x - currentPlayer.x
      //       : ballStop.x - ball.x) - (ball.x > halfField ? halfField : 0),
      //    y: ballStop.y + (ballStop.y > currentPlayer.y ?  - ballRadius : + ballRadius) * 3 
      //  };
      //  var attackDirection = getDirectionTo(currentPlayer, stopPoint);
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