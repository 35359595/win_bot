//10.12 - simplicity II
'use strict';

function getDirectionTo(startPoint, endPoint) {
    return Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x);
}

function getDistance(point1, point2) {
    return Math.hypot(point1.x - point2.x, point1.y - point2.y);
}

function getPlayerMove(data) {
    //teams and plyers data
    //enemies
    let opTeam = data.opponentTeam.players;
    let firstEnemy = opTeam[0];
    let secondEnemy = opTeam[1];
    let thirdEnemy = opTeam[2];

    //my guys
    let currentPlayer = data.yourTeam.players[data.playerIndex];
    let myTeam = data.yourTeam.players;
    let secondPlayer = myTeam[[1, 2, 0][data.playerIndex]];
    let thirdPlayer = myTeam[[2, 0, 1][data.playerIndex]];

    //ball
    let ball = data.ball;
    let ballStop = getBallStats(ball, data.settings);
    let ballRadius = ball.settings.radius;

    //field
    let hField = data.settings.field.height;
    let wField = data.settings.field.width;
    let ballStopLocation = Math.pow(ballStop.x, 2) + (ballStop.y, 2);

    //coordinates
    let firstEnemyLocation = Math.pow(firstEnemy.x, 2) + Math.pow(firstEnemy.y, 2);
    let secondEnemyLocation = Math.pow(secondEnemy.x, 2) + Math.pow(secondEnemy.y, 2);
    let thirdEnemyLocation = Math.pow(thirdEnemy.x, 2) + Math.pow(thirdEnemy.y, 2);

    let firstEnemyDistance = ballStopLocation - firstEnemyLocation;
    let secondEnemyDistance = ballStopLocation - secondEnemyLocation;
    let thirdEnemyDistance = ballStopLocation - thirdEnemyLocation;

    let attackDirection;
    let currentVelocity = currentPlayer.velocity + data.settings.player.maxVelocityIncrement;

    //enemy distances detection

    let getClosestEnemy = () => {
        let nearestCoord = Math.min(firstEnemyDistance, secondEnemyDistance, thirdEnemyDistance);
        if (nearestCoord == firstEnemyDistance) {
            return firstEnemy;
        } else if (nearestCoord == secondEnemyDistance) {
            return secondEnemy;
        } else {
            return thirdEnemy;
        }
    };

    let whoIsCloser = (me, hem) => {
        if(me.x - ball.x <= hem.x - ball.x && me.y - ball.y <= hem.y - ball.y){
            return true;
        }else{
            return false;
        }
    };

    //action direction functions
    let attack = () => {
        let closestEnemy = getClosestEnemy();
        let iMCloser = whoIsCloser(currentPlayer, closestEnemy); 
        let xSetter = ballStop.x - currentPlayer.x - ballRadius * 1.99;
        let ySetter = ballStop.y - currentPlayer.y - (closestEnemy.x - ballStop.x <= ballRadius * 4 && Math.abs(closestEnemy.x - ballStop.x) < ballRadius * 2 ? ballRadius / 5 : 0 );
        return Math.atan2(ySetter, xSetter); 
    };

    let homecoming = x => {
        var zonePoint = {
            x: x,
            y: ballStop.y
        };
        currentVelocity = getDistance(currentPlayer, zonePoint) < 40 ? 0 : data.settings.player.maxVelocity
        return getDirectionTo(currentPlayer, zonePoint);
    };

    var defend = () => {
    return Math.atan2(
        ballStop.y - currentPlayer.y + ((Math.abs(currentPlayer.y - ball.y) > ballRadius * 2) ? 0 : ballStop.y < currentPlayer.y ? ballRadius * 2 : - ballRadius * 2),
        ballStop.x <= 0 ? ballRadius : ballStop.x - currentPlayer.x - ballRadius * 1.99
        );
    };

    let decide = () => {
      if (ballStop.x >= currentPlayer.x + ballRadius * 2){
        attackDirection = attack();
      }else{
        attackDirection = defend();
      }
    };

  if(data.playerIndex == 1){
    if(ballStop.x >= wField / 2){
      attackDirection = homecoming(wField / 5);
    }else{
      decide();
    }
  }
  else{
    if(ballStop.x <= wField / 5){
      attackDirection = homecoming(currentPlayer.x + wField / 5);
    }else{
      decide();
    }
  }
  return {
    direction: attackDirection,
    velocity: currentVelocity
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