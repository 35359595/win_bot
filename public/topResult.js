//interceptor - beginning
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

    //coordinates
    let firstEnemyLocation = Math.pow(firstEnemy.x, 2) + Math.pow(firstEnemy.y, 2);
    let secondEnemyLocation = Math.pow(secondEnemy.x, 2) + Math.pow(secondEnemy.y, 2);
    let thirdEnemyLocation = Math.pow(thirdEnemy.x, 2) + Math.pow(thirdEnemy.y, 2);

    let currentPlayerLocation = Math.pow(currentPlayer.x, 2) + Math.pow(currentPlayer.y, 2);
    let secondPlayerLocation = Math.pow(secondPlayer.x, 2) + Math.pow(secondPlayer.y, 2);
    let thirdPlayerLocation = Math.pow(thirdPlayer.x, 2) + Math.pow(thirdPlayer.y, 2);

    let ballStopLocation = Math.pow(ballStop.x, 2) + (ballStop.y, 2);

    let sixthPartOfFieldWidth = data.settings.field.width / 6;
    let playerZoneStartX = sixthPartOfFieldWidth * [0, 1, 3][data.playerIndex];
    let playerZoneWidth = sixthPartOfFieldWidth * [1, 2, 3][data.playerIndex];

    //distance to ball
    let currentPlayerDistance = ballStopLocation - currentPlayerLocation;
    let secondPlayerDistance = ballStopLocation - secondPlayerLocation;
    let thirdPlayerDistance = ballStopLocation - thirdPlayerLocation;

    let firstEnemyDistance = ballStopLocation - firstEnemyLocation;
    let secondEnemyDistance = ballStopLocation - secondEnemyLocation;
    let thirdEnemyDistance = ballStopLocation - thirdEnemyLocation;

    let attackDirection;
    let currentVelocity = currentPlayer.velocity + data.settings.player.maxVelocityIncrement;

    //distance detection
    let amICloser = () => {
        if ((currentPlayerDistance < secondPlayerDistance) && (currentPlayerDistance < thirdEnemyDistance)) {
            return true;
        }
        return false;
    };

    //enemy distances detection
    let isEnemyCloser = () => {
        if ((currentPlayerDistance < firstEnemyDistance) && (currentPlayerDistance < secondEnemyDistance) && (currentPlayerDistance < secondEnemyDistance)) {
            return true;
        }
        return false;
    };

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

    //action direction functions
    let attack = () => { return Math.atan2(ballStop.y - currentPlayer.y + (ballStop.x < currentPlayer.x ? (ballStop.y < currentPlayer.y ? ballRadius + 5 : - ballRadius -5): 0), ballStop.x - currentPlayer.x - ballRadius * 2 + 5); };

    let intercept = () => {
        let closestEnemy = getClosestEnemy();
        if (closestEnemy.x < ballStop.x) { return attack(); }
        return Math.atan2(
            //y value
            (ballStop.y < 0 || ballStop.y > hField ? Math.abs(ballStop.y > hField ? hField - ballStop.y : ballStop.y) : ballStop.y - closestEnemy.y < ballStop.y ? ballStop.y - closestEnemy.y : closestEnemy.y - ballStop.y) - ballRadius * 2,//+ 
            //if on same line with the ball
            //(ballRadius * 2 < (currentPlayer.y < ballStop.y ? ballStop.y - currentPlayer.y : currentPlayer.y - ballStop.y) ? (ballStop.y >= currentPlayer.y ? (ballRadius * 2) : - (ballRadius * 2)) : 0),
            //x value
            ballStop.x - ballRadius * 2 - closestEnemy.x);
    };

    let decide = () => {
        if (currentPlayer.x <= ballStop.x && ball.x > currentPlayer.x || amICloser() && ball.x > currentPlayer.x + ballRadius) {
            attackDirection = attack();
        } else {
            attackDirection = intercept();
        }
    };

    let homecoming = x => {
        var zonePoint = {
            x: x,
            y: ballStop.y + (ballStop.y < hField / 2 ? - ballRadius * 2 : ballRadius * 2)
        };
        currentVelocity = getDistance(currentPlayer, zonePoint) < 40 ? 0 : data.settings.player.maxVelocity
        attackDirection = getDirectionTo(currentPlayer, zonePoint);
    };

    //main worker controll
    if (data.playerIndex == 1) {
        if (ballStop.x < wField / 2) {
            decide();
        }else {
            homecoming(wField / 5);
        }
    } else if (data.playerIndex == 2) {
        if (ballStop.x >= wField / 2) {
            decide();
        } else {
            homecoming(wField - wField / 4);
        }
    } else {
        decide();
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