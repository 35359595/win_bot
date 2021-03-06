//6.12 - interceptor III
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
    let currentPlayerDistance = Math.abs(ballStopLocation - currentPlayerLocation);
    let secondPlayerDistance = Math.abs(ballStopLocation - secondPlayerLocation);
    let thirdPlayerDistance = Math.abs(ballStopLocation - thirdPlayerLocation);

    let firstEnemyDistance = Math.abs(ballStopLocation - firstEnemyLocation);
    let secondEnemyDistance = Math.abs(ballStopLocation - secondEnemyLocation);
    let thirdEnemyDistance = Math.abs(ballStopLocation - thirdEnemyLocation);

    let attackDirection;
    let currentVelocity = currentPlayer.velocity + data.settings.player.maxVelocityIncrement;

    //randomizer
    let random = (a, b) => {
        return Math.random() * (b - a) + a;
    };
    //distance detection
    let amICloser = () => {
        if ((currentPlayerDistance < secondPlayerDistance) && (currentPlayerDistance < thirdPlayerDistance)) {
            return true;
        }
        return false;
    };

    //enemy distances detection
    let isEnemyCloser = () => {
        // if (currentPlayer.x < secondPlayer.x && currentPlayer.x < thirdPlayer.x){
        //     return true;
        // }else 
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

    let whoIsCloser = (me, hem) => {
        if(me.x - ball.x < hem.x - ball.x && me.y - ball.y <= hem.y - ball.y){
            return true;
        }else{
            return false;
        }
    };

    //action direction functions
    let attack = () => {
        let closestEnemy = getClosestEnemy(); 
        let xSetter = ballStop.x - currentPlayer.x - ballRadius * 2;
        let ySetter = ballStop.y - currentPlayer.y - random(1, 6)//+ (ballStop.x < currentPlayer.x ? (ballStop.y < currentPlayer.y ? ballRadius + 5 : - ballRadius -5): 0)//correction is unnesessary
        + (closestEnemy.x > ballStop.x && closestEnemy.x - ballStop.x < ballStop.x - currentPlayer.x? (ballRadius < Math.abs(closestEnemy.y - ballStop.y) ? - (ballStop.y - closestEnemy.y) : 0): 0);
        return Math.atan2(ySetter, xSetter); 
    };

    let homecoming = x => {
        var zonePoint = {
            x: x,
            y: ballStop.y +(currentPlayer.y < ballStop.y ? - ballRadius * 2 : ballRadius * 2) //(ballStop.y < hField / 2 && Math.abs(currentPlayer.y - ballStop.y) < ballRadius * 2 ? - ballRadius * 2 : ballRadius * 2)
        };
        currentVelocity = getDistance(currentPlayer, zonePoint) < 40 ? 0 : data.settings.player.maxVelocity
        return getDirectionTo(currentPlayer, zonePoint);
    };

    let chase = () => {
        let closestEnemy = getClosestEnemy();
        return Math.atan2(closestEnemy.y - currentPlayer.y, closestEnemy.x - currentPlayer.x - (closestEnemy.x < currentPlayer.x ? ballRadius * 2 - (closestEnemy.x - currentPlayer.x) / 2 : ballRadius * 2)); 
    };

    let intercept = () => {
        if (ballStop.x > currentPlayer.x + ballRadius * 2){
            let closestEnemy = getClosestEnemy();
            //if (isEnemyCloser() && ball.x < currentPlayer.x + ballRadius * 2) { return attack(); }//closestEnemy.x < ballStop.x
            let ySetter = (ballStop.y < 0 || ballStop.y > hField ? Math.abs(ballStop.y > hField ? hField - ballStop.y : ballStop.y) 
                : (amICloser ? ballStop.y - currentPlayer.y + (ballStop.y < currentPlayer.y ? ballRadius * 2 : - ballRadius + ball.direction)  
                    : (closestEnemy.y < ballStop.y ? ballStop.y - closestEnemy.y : closestEnemy.y - ballStop.y)));
            //if(ballStop.y < currentPlayer.y + ballRadius * 2){ySetter = ballStop.y + (ballStop.y < currentPlayer.y ? - ballRadius * 2 : ballRadius * 2)} //no autogoals, please!
            let xSetter = ballStop.x - ballRadius * 2 - (whoIsCloser(currentPlayer, closestEnemy) && amICloser() ? currentPlayer.x : - closestEnemy.x - closestEnemy.direction * 2);// + random(5, 10)
            return Math.atan2(ySetter, xSetter);
        }else{
            return homecoming(currentPlayer.x < secondPlayer.x && currentPlayer.x < thirdPlayer.x ? ballStop.x - ballRadius - ballRadius / 4 : ballStop.x + wField / 6);
        }
    };

    var defend = () => {
    return Math.atan2(
        ballStop.y - currentPlayer.y + (ballStop.y < currentPlayer.y ? ballRadius * 2 : - ballRadius * 2),
        ballStop.x - currentPlayer.x - ballRadius * 1.5
        );
    };

    let decide = () => {
        let closestEnemy = getClosestEnemy();
        if (currentPlayer.x + ballRadius * 2 < ball.x ){//|| amICloser() && ball.x > currentPlayer.x + ballRadius) {
            attackDirection = attack();
        } else if (whoIsCloser(currentPlayer, closestEnemy) || ballStop.x - currentPlayer.x < ballStop.x - secondPlayer.x && ballStop.x - currentPlayer.x < ballStop.x - thirdPlayer.x){
            attackDirection = defend();
        }else {
            attackDirection = amICloser() && ball.x > currentPlayer.x ? intercept() : chase(); 
        }
    };

    

    //main worker controll
    // if (data.playerIndex == 1) {
    //     if (ballStop.x < wField / 2) {
    //         attackDirection = ballStop.x < currentPlayer.x + ballRadius ? attack() : defend();
    //     }else {
    //         attackDirection = homecoming(wField / 4);
    //     }
    // }else 
    // if (data.playerIndex == 0) {
    //     if (ballStop.x < wField / 2) {
    //         attackDirection = homecoming(wField / 2);
    //     } else {
    //         decide(); //homecoming(wField - wField / 2);
    //     }
    // // }else if (ballStop.x < currentPlayer.x + ballRadius * 2){
    // //     attackDirection = attack();
    // } else {
    //     decide();
    // }
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