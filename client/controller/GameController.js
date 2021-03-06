function GameController([player, mazeMap, bullets]){
    this.player = player;
    // creates the HUD for the player
    player.createHUD()
    player.createCamera();
    this.mazeMap = mazeMap;
    this.bullets = bullets;
    //To avoid typos
    this.directions = {
        up: 'up',
        down: 'down',
        left: 'left',
        right: 'right',
        space: 'space'
    };

    // As the keys pressed will be in keycodes.
    //Converting them to words
    this.keys = {
        32: this.directions.space,
        38: this.directions.up,
        37: this.directions.left,
        39: this.directions.right,
        40: this.directions.down
    };

    // array to hold the keys which are being pressed by the user
    this.keysHeld = [];

    // To handle the movement
    this.movementHandler=(e, isKeyDown)=>{
        const keyCode = e.keyCode;
        // Checks if the button pressed is one of the arrowkeys
        if(keyCode in this.keys){
            // Checks if it is a keydown or keyup event
            if(isKeyDown){
                e.preventDefault();
                this.startMovement(this.keys[keyCode]);
            }
            else{
                this.stopMovement(this.keys[keyCode]);
            }
        }
    };

    this.startMovement=(key)=>{
        // Checks if the key pressed is in array keysHeld
        if(!this.keysHeld.includes(key)){
            // adds the key to the beginning of the array
            this.keysHeld.unshift(key);
        }
        // variable to store the last key that was pressed
        const topKeyHeld = this.keysHeld[0];

        if(topKeyHeld){
            const sheet = this.player.playerDiv.querySelector(".sheet");

            // Changes the topPos and leftPos according to the key pressed
            this.collision()
            switch(topKeyHeld){
                case 'up':
                    this.player.topPos -= this.player.speed;
                    break;
                case 'down':
                    this.player.topPos += this.player.speed;
                    break;
                case 'left':
                    this.player.leftPos -= this.player.speed;
                    break;
                case 'right':
                    this.player.leftPos += this.player.speed;
                    break;
            }

            // checks if the space is pressed
            if(topKeyHeld === 'space'){
                // starts player's shooting  animation if he has a bullet
                if(this.player.hasBullet){
                    this.player.playerDiv.querySelector(".player-sprite").setAttribute("shoot", "true")
                    this.player.isShoot = true
                }
            }
            else{
                // Changes the direction the sprite is facing
                sheet.setAttribute("facing", topKeyHeld)    
                // Starts the player moving animation
                this.player.playerDiv.querySelector(".player-sprite").setAttribute("moving", "true")
            }
        }

    };

    this.stopMovement = (key)=> {
        // removes the key which is released from the array keysHeld
        this.keysHeld.splice(this.keysHeld.indexOf(key),1);
        //Checks if no keys are pressed
        if(this.keysHeld.length <= 0){
            // stops the player moving and shooting animation
            this.player.playerDiv.querySelector(".player-sprite").setAttribute("moving", "false");
            this.player.playerDiv.querySelector(".player-sprite").setAttribute("shoot", "false");
        }
    };

    this.collision = () => {
        // variables to store the players x and y coordinates
        let top = this.player.topPos
        let left = this.player.leftPos
        // Some default values
        let playerWidth = 15
        let tileSize = 80
        let mazeSize = 800
        // Check collisions with the outer perimeter of the maze
        if(top + 400 < tileSize + playerWidth){
            top = tileSize + playerWidth-400
        }
        else if(top + 400 > mazeSize-tileSize-playerWidth){
            top = mazeSize-tileSize-playerWidth-400
        }
        else if(left + 400 < tileSize + playerWidth){
            left = tileSize + playerWidth-400
        }
        else if(left + 400 > mazeSize-tileSize-playerWidth){
            left = mazeSize-tileSize-playerWidth-400
        }
        // Checks collision with each wall in the maze
        this.mazeMap.LayerTwo.forEach(wall=>{
            const [x,y,o] = wall;
            let w = 35
            let h = 80
            if(o === 'h'){
                w = 80
                h = 35
            }
            if(left+400 > x-playerWidth && left +400< x+w && top+400>y && top+400<y+h){
                left = x-playerWidth - 400;
            }
            else if(left+400 < x+w+playerWidth && left+400 > x-playerWidth&& top+400>y && top+400<y+h){
                left = x+w+playerWidth - 400;
            }
            else if(top+400 > y-playerWidth && top+400 < y+h && left+400>x && left+400<x+w){
                top = y-playerWidth - 400;
            }
            else if(top+400 < y+h+playerWidth && top+400 > y-playerWidth && left+400>x && left+400<x+w){
                top = y+h+playerWidth - 400;
            }
        })
        // Checks if any bullets is collected by the player
        this.bullets.forEach((bullet)=>{
            const moving = bullet.bullet.querySelector('.bullet-sheet').getAttribute('moving')
            // adds bullet to the players bullet array
            if(bullet.touchingPlayer(bullet.leftPos, bullet.topPos) && !this.player.hasBullet && moving === 'false' && !bullet.isBeingUsed){
                this.player.playerBullet.push(bullet)
                this.player.hasBullet = true;
                bullet.bullet.classList.add('hide')
                bullet.playerName = this.player.username
                // set the value of being used to true
                bullet.isBeingUsed = true;
            }
        })
        // assigns the value of top and left to the player x and y coordinates
        this.player.topPos = top
        this.player.leftPos = left
    }

}

export default GameController;