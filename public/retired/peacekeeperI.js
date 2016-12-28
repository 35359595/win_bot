//9.12 - peacekeeper I
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

    let currentPlayerLocation = Math.pow(currentPlayer.x, 2) + Math.pow(currentPlayer.y, 2);
    let secondPlayerLocation = Math.pow(secondPlayer.x, 2) + Math.pow(secondPlayer.y, 2);
    let thirdPlayerLocation = Math.pow(thirdPlayer.x, 2) + Math.pow(thirdPlayer.y, 2);

    //distance to ball
    // let currentPlayerDistance = Math.abs(ballStopLocation - currentPlayerLocation);
    // let secondPlayerDistance = Math.abs(ballStopLocation - secondPlayerLocation);
    // let thirdPlayerDistance = Math.abs(ballStopLocation - thirdPlayerLocation);

    let firstEnemyDistance = Math.abs(ballStopLocation - firstEnemyLocation);
    let secondEnemyDistance = Math.abs(ballStopLocation - secondEnemyLocation);
    let thirdEnemyDistance = Math.abs(ballStopLocation - thirdEnemyLocation);

    let attackDirection;
    let currentVelocity = currentPlayer.velocity + data.settings.player.maxVelocityIncrement;

    //randomizer
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

    //action direction functions
    let attack = () => {
        let closestEnemy = getClosestEnemy();
        let ySetter;
        let xSetter;
        if(Math.abs(currentPlayerLocation - secondPlayerLocation) <= ballRadius * 2 && currentPlayer.x < secondPlayer.x){
            ySetter = ballStop.y - currentPlayer.y - random(1, 6)
            + (secondPlayer.y <= currentPlayer.y ? ballRadius * 2.2 : - ballRadius * 2.2)
            + (closestEnemy.x > ballStop.x && closestEnemy.x - ballStop.x < ballStop.x - currentPlayer.x? (ballRadius < Math.abs(closestEnemy.y - ballStop.y) ? - (ballStop.y - closestEnemy.y) : 0): 0);
            xSetter = ballStop.x - currentPlayer.x - ballRadius * 2 + (currentPlayer.x <= secondPlayer.x ? -ballRadius * 2 : 0);
        }else if (Math.abs(currentPlayerLocation - thirdPlayerLocation <= ballRadius * 2 && currentPlayer.x < thirdPlayer.x)){
            ySetter = ballStop.y - currentPlayer.y - random(1, 6)
            + (thirdPlayer.y <= currentPlayer.y ? ballRadius * 2.2 : - ballRadius * 2.2)
            + (closestEnemy.x > ballStop.x && closestEnemy.x - ballStop.x < ballStop.x - currentPlayer.x? (ballRadius < Math.abs(closestEnemy.y - ballStop.y) ? - (ballStop.y - closestEnemy.y) : 0): 0);
            xSetter = ballStop.x - currentPlayer.x - ballRadius * 2 + (currentPlayer.x <= thirdPlayer.x ? -ballRadius * 2 : 0);
        }else{
            ySetter = ballStop.y - currentPlayer.y - random(1, 6)
            + (closestEnemy.x > ballStop.x && closestEnemy.x - ballStop.x < ballStop.x - currentPlayer.x? (ballRadius < Math.abs(closestEnemy.y - ballStop.y) ? - (ballStop.y - closestEnemy.y) : 0): 0);
            xSetter = ballStop.x - currentPlayer.x - ballRadius * 2 + random(1,3);
        }
        
        return Math.atan2(ySetter, xSetter); 
    };

    //main worker controll
    attackDirection = attack();
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