//========GET ELEMENT========//
const enemyHull = document.querySelector("#enemyHull");
const enemyFirePower =  document.querySelector("#enemyFirePower");
const enemyAccuracy =  document.querySelector("#enemyAccuracy");
const enemyName = document.querySelector("#enemyName");

const playerHull = document.querySelector("#playerHull");
const playerirePower =  document.querySelector("#playerFirePower");
const playerAccuracy =  document.querySelector("#playerAccuracy");

const playerImage = document.querySelector('.playerImage');
const enemyImage = document.querySelector('.enemyImage');

//========CLARIFY VARIABLES AND CLASS=======//
let currentEnemy = 0;
let gameOver = false;
let defalutPlayerHull = 20;

const gameStates = {
    start:'start',
    attack: 'attack',
    takeDamage: 'takeDamage',
    retreat: 'retreat',
    gameOver: 'gameOver',
    gameRestart: 'gameRestart'
};

let gameState = gameStates.start;

//========FUNCTION========//

function getRandomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    //The maximum is inclusive and the minimum is inclusive 
    return Math.floor(Math.random() * (max - min + 1) + min); 
  }
  
class ship  {
    constructor(name, hull, firePW, acc){
        this.name = name;
        this.hull = hull;
        this.firePW = firePW;
        this.acc = acc
    };
    setHull(value){
        this.hull = value;
    };
    setFirePW(value){
        this.firePW = value;
    };
    setAcc(value){
        this.acc = value;
    };
    getHull (){
        return this.hull;
    };
    getFirePower () {
        return this.firePW;
    };
    getAccuracy (){
        return this.acc;
    };
    takeDamage(value){
        console.log(this.hull);
        console.log("This the damage points " + value);
        this.hull -= value;
        console.log(this.hull);
    }

}

const player = new ship('uss',defalutPlayerHull, 5, .7);

function updatePlayerStatus(){
    playerHull.textContent = "Hull :" +  player.getHull();
    playerirePower.textContent = "Fire Power : " + player.getFirePower();
    playerAccuracy.textContent = "Accuracy : " + player.getAccuracy();
}

function updateEnemyStatus(){
    enemyName.textContent = alienFleet[0].name;
    enemyHull.textContent = "Hull :" + alienFleet[0].getHull();
    enemyFirePower.textContent = "Fire Power : " + alienFleet[0].getFirePower();
    enemyAccuracy.textContent = "Accuracy : " + alienFleet[0].getAccuracy();
}


const alienFleet = [];
const numberOfEnimeis = 6;

function gameStart(){
    while(alienFleet.length > 0) {
        alienFleet.pop();
    }

    player.setHull(defalutPlayerHull);
    for(let i = 0; i < numberOfEnimeis; i++){
        let hull = getRandomNumber(3,6);
        let firePW = getRandomNumber(2,4);
        let acc = getRandomNumber(6,8)/10;
        let name = "enemy-" + (i+1);
        alienFleet.push(new ship(name, hull, firePW, acc));
    }
    console.log(alienFleet);
    updatePlayerStatus();
    updateEnemyStatus();
}

function isEnemyLeft(){
    if(alienFleet.length === 0){
        message = "You won the game. You killed all the enemies. You are the Best!";
        popupBoxType = 'alert';
        gameState = gameStates.gameRestart;
        return false;
    }else{
        return true;
    }
}

//========GAME PROCESS========//

do{
    let AlienAttackSuccesfull = true;
    let playerSelection = null;
    let popupBoxType = 'confirm';

    console.log("Loop Starts " + gameState)
    switch(gameState){
        case gameStates.start:
            gameStart();
            popupBoxType = "alert";
            alienFleet[0].takeDamage(player.getFirePower());

            enemyHull.textContent = "Hull : " + alienFleet[0].getHull();

            if(alienFleet[currentEnemy].getHull() <= 0){
                alienFleet[currentEnemy].setHull(0);
                message = "You have destroyed an alien ship. Do you want to retreat?";
                updateEnemyStatus();
                alienFleet.splice(0,1);
                
                popupBoxType = 'prompt';
            }else{
                message = "You have attacked an alien ship.";
            }
            
            gameState = gameStates.takeDamage;
            break;
        case gameStates.attack:
            updateEnemyStatus();
            popupBoxType = 'alert';
            console.log("I am in attack");
            console.log("Alien ship being attacked " + alienFleet[0].name);
            if (Math.random() < player.getAccuracy()) { 
                message = `You have attacked an alien ship! You did ${player.getFirePower()} points in damage`;
                alienFleet[0].takeDamage(player.getFirePower());
                alienFleet[0].textContent = "Hull : " + alienFleet[0].getHull();
                if(alienFleet[currentEnemy].getHull() <= 0){
                    alienFleet[currentEnemy].setHull(0);
                    message = "You have destroyed an alien ship. Do you want to retreat?";
                    updateEnemyStatus();
                    alienFleet.splice(0,1);
                    if(alienFleet.length === 0){
                        message = "You won the game. You killed all the enemies. You are the Best!";
                        popupBoxType = 'alert';
                        gameState = gameStates.gameRestart;
                        break;
                    }
                    popupBoxType = 'prompt';
                }else{
                    message = "You have attacked an alien ship.";
                }
            }else{
                message = 'You have missed! You are out of luck!';
            }
            gameState = gameStates.takeDamage;
            break;
        case gameStates.takeDamage:
            if(alienFleet.length === 0){
                message = "You won the game. You killed all the enemies. You are the Best!";
                popupBoxType = 'alert';
                gameState = gameStates.gameRestart;
                break;
            }
            console.log("I am in takeDamage");
            updateEnemyStatus();
            console.log(alienFleet[0].getFirePower());
            if (Math.random() < alienFleet[0].getAccuracy()) { 
                message = `You have been hit! You took ${alienFleet[0].getFirePower()} points in damage`;
                player.takeDamage(alienFleet[0].getFirePower());
                playerHull.textContent = "Hull : " + player.getHull();
            }else{
                message = 'Enemy has missed! You are Lucky!';
            }
            
            if(player.getHull() <= 0){
                player.setHull(0);
                updatePlayerStatus();
                message = "Your Ship has been destroyed. Game Over! hahaha!";
                popupBoxType = 'alert';
                gameState = gameStates.gameRestart;
                break;
            }
            popupBoxType = 'alert';
            gameState = gameStates.attack;
            console.log(gameState);
            break;
        case gameStates.retreat:
            message = "Your Ship is leaving the game. Game Over!";
            popupBoxType = 'alert';
            gameState = gameStates.gameRestart;
            break;
        case gameStates.gameRestart:
            message = "Do you want to play again."
            popupBoxType = 'prompt'; 
            break;
        default:
            console.log("I am in default");
            popupBoxType = 'prompt';
            break;
    }
    console.log(popupBoxType);

    if (popupBoxType === 'prompt'){
        playerSelection = confirm(message);
        if(playerSelection === true){
            if(gameState === gameStates.takeDamage){
                gameState = gameStates.retreat;
            }else{
                gameState = gameStates.start;
            }   
        }else{
            if(gameState === gameStates.takeDamage){
                gameState = gameStates.attack;
            }else{
                gameState = gameStates.gameOver;
            } 
        }
    } else if (popupBoxType ===  'confirm'){
        confirm(message);
    } else {
        alert(message);
    }
    console.log(alienFleet);
    console.log("Just before while loop ends " + gameState)
}while(gameState !== gameStates.gameOver)

alert("Game over!");