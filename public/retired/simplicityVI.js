//11.12 - simplicity VI
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

    let firstEnemyDistance = Math.abs(ballStopLocation - firstEnemyLocation);
    let secondEnemyDistance = Math.abs(ballStopLocation - secondEnemyLocation);
    let thirdEnemyDistance = Math.abs(ballStopLocation - thirdEnemyLocation);

    let currentPlayerLocation = Math.pow(currentPlayer.x, 2) + Math.pow(currentPlayer.y, 2);
    let secondPlayerLocation = Math.pow(secondPlayer.x, 2) + Math.pow(secondPlayer.y, 2);
    let thirdPlayerLocation = Math.pow(thirdPlayer.x, 2) + Math.pow(thirdPlayer.y, 2);

    let currentPlayerDistance = Math.abs(ballStopLocation - currentPlayerLocation);
    let secondPlayerDistance = Math.abs(ballStopLocation - secondPlayerLocation);
    let thirdPlayerDistance = Math.abs(ballStopLocation - thirdPlayerLocation);

    let attackDirection;
    let currentVelocity = currentPlayer.velocity + data.settings.player.maxVelocityIncrement;

    let random = (a, b) => {
        return Math.random() * (b - a) + a;
    };

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

    let amICloser = () => {
        return secondPlayerDistance < currentPlayerDistance && thirdPlayerDistance < currentPlayerDistance ? true : false;
    };

    let whoIsCloser = (me, hem) => {
        if(me.x - ballStop.x <= hem.x - ballStop.x && me.y - ballStop.y <= hem.y - ballStop.y){
            return true;
        }else{
            return false;
        }
    };

    //action direction functions
    let attack = () => {
        let closestEnemy = getClosestEnemy();
        let iMCloser = whoIsCloser(currentPlayer, closestEnemy); 
        let xSetter = ballStop.x - currentPlayer.x - ballRadius * 1.99 + random(1, 3);
        let ySetter = ballStop.y - currentPlayer.y//standart head to head
        //avoid direct to mate
        + (Math.abs(ballStop.y - secondPlayer.y) <= ballRadius * 4 && Math.abs(secondPlayer.x - ballStop.x) <= ballRadius * 2 ? ballStop.y - secondPlayer.y : 0)
        + (Math.abs(ballStop.y - thirdPlayer.y) <= ballRadius * 4 && Math.abs(thirdPlayer.x - ballStop.x) <= ballRadius * 2 ? ballStop.y - secondPlayer.y : 0)
        //avoid direct tot enemy 
        - (closestEnemy.x - ballStop.x <= ballRadius * 4 && Math.abs(closestEnemy.x - ballStop.x) < ballRadius * 2 ? ballRadius / 5 : 0 );
        return Math.atan2(ySetter, xSetter); 
    };

    let homecoming = x => {
        var zonePoint = {
            x: x,
            y: ballStop.y + (ball.direction < 2 ? hField / 4 : - hField/ 4)
        };
        currentVelocity = getDistance(currentPlayer, zonePoint) < 40 ? 0 : data.settings.player.maxVelocity
        return getDirectionTo(currentPlayer, zonePoint);
    };

    var defend = () => {
    return Math.atan2(
        ballStop.y - currentPlayer.y 
        + ((Math.abs(currentPlayer.y - ball.y) > ballRadius * 2) 
            ? 0 //go directly behind the ball if I wount kick it during the way
            : ballStop.y < currentPlayer.y //otherwise need some extra space
                ? + ballRadius * 2.2
                : - ballRadius * 2.2),
        ballStop.x < ballRadius ? ballRadius : ballStop.x - currentPlayer.x - ballRadius * 2
        );
    };

    let decide = () => {
        if (ball.x >= currentPlayer.x + ballRadius * 2){
            attackDirection = attack();
        // }else if(ballStop.x > wField / 4 && ballStop.x < currentPlayer.x + ballRadius * 3 && currentPlayer.x > secondPlayer.x || currentPlayer.x > thirdPlayer.x){
        //     attackDirection = homecoming(ballStop.x + (ballStop.x < wField / 2) ? + wField / 3 : - wField / 3);
        }else{
            attackDirection = defend();
        }
    };

    decide();

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