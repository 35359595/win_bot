//16.12 - simplicity VIII-EX-4dp
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
        let xSetter = ballStop.x - currentPlayer.x - ballRadius * 1.99 + (ball.x < currentPlayer.x ? ballRadius / 5 : 0);
        let ySetter = ballStop.y - currentPlayer.y//standart head to head
        //avoid direct to mate
        + (Math.abs(ballStop.y - secondPlayer.y) <= ballRadius * 2 && Math.abs(secondPlayer.x - ballStop.x) <= ballRadius * 2 ? ballStop.y - secondPlayer.y : 0)
        + (Math.abs(ballStop.y - thirdPlayer.y) <= ballRadius * 2 && Math.abs(thirdPlayer.x - ballStop.x) <= ballRadius * 2 ? ballStop.y - secondPlayer.y : 0)
        //avoid direct to enemy 
        - (closestEnemy.x > ballStop.x && Math.abs(closestEnemy.x - ballStop.x) < ballRadius * 2 ? (closestEnemy.y < currentPlayer.y ? closestEnemy.y - currentPlayer.y : Math.abs(closestEnemy.y - ballStop.y)) : 0 )//ballRadius / 5
        //avoid kicking to my side
        + (ball.x < currentPlayer.x ? (ballStop.y < currentPlayer.y ? + ballRadius * 2 : - ballRadius * 2) : random(0, 5));
        return Math.atan2(ySetter, xSetter); 
    };

    //decider branching
    if(data.playerIndex == 2 && ballStop.x == wField / 2 && ballStop.y == hField / 2){
        var zonePoint = {
            x: wField / 2 - ballRadius + random(1, 2),
            y: hField / 2 + ballRadius
        };
        attackDirection = getDirectionTo(currentPlayer, zonePoint);            
    }else if(data.playerIndex == 0 && ballStop.x == wField / 2 && ballStop.y == hField / 2){
        var zonePoint = {
            x: wField / 2 - ballRadius + random(0, 3),
            y: hField / 2 - ballRadius
        };
        attackDirection = getDirectionTo(currentPlayer, zonePoint);
    }else {
        attackDirection = attack();
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