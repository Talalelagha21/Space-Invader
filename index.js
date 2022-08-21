const canvas = document.querySelector('canvas');
const scoreElement = document.getElementById('score');
const gameOver = document.getElementById('gameOver');
const ctx = canvas.getContext('2d')
canvas.width = 1024
canvas.height = 576


//---------------------------------------------------Creating the Player Class--------------------------------------------


class Player {
    constructor() { // Player attributes
        this.velocity = {
            x: 0,
            y: 0
        }
        this.rotation = 0
        this.opacity = 1

        const img = new Image() //creates our image
        img.src = './contents/spaceship.png'
        img.onload = () => { // this function runs once the page is loaded
            const scale = .15
            this.img = img;
            this.width = img.width * scale // multiplying the width of the image by a number to change the img size
            this.height = img.height * scale
            this.position = {
                x: canvas.width / 2 - this.width / 2,
                y: canvas.height - this.height - 20
            } 
        }    
    }
    draw() { // drawing the Player
        
        ctx.save() // takes a "snapshot" and sets the canvas to the middle of our player for a second so we can rotate our player
        ctx.globalAlpha = this.opacity
        ctx.translate( // sets the canvas postion to the player position
            player.position.x + player.width /2, 
            player.position.y + player.height /2
            )
        ctx.rotate(this.rotation) //rotates the canvas
        ctx.translate( // returns the canvas position back to normal
            -player.position.x - player.width /2, 
            -player.position.y - player.height /2
            )
        ctx.drawImage(// draws our image 
            this.img, 
            this.position.x, 
            this.position.y, 
            this.width, 
            this.height
            )  

        ctx.restore()
    }

    update(){ //this method will be used to move our player
        if (this.img) { // waits till the image is loaded
            this.draw()
            this.position.x += this.velocity.x;
        }
     

    }
}


//---------------------------------------------------Creating the Projectile Classes--------------------------------------------


class Projectile { //projectile attributes
    constructor({position, velocity}) {
        this.position = position
        this.velocity = velocity
        this.radius = 4
    }

    draw(){ // drawing the projectile (circle)
        ctx.beginPath();
        ctx.arc(this.position.x,this.position.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle= 'red'
        ctx.fill()
        ctx.closePath()
        
    }

    update() { //this method will be used to move our projectile
        this.draw();
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

    }
}

class InvaderProjectile { //projectile attributes
    constructor({position, velocity}) {
        this.position = position
        this.velocity = velocity
        this.width = 3
        this.height = 10
    }

    draw(){ // drawing the projectile (circle)
        ctx.fillStyle ='white';
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
        
    }

    update() { //this method will be used to move our projectile
        this.draw();
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

    }
}

//---------------------------------------------------Creating the Particle--------------------------------------------
// this class will help us create an explosion everytime we kill an invader or the player is destroyed


class Particle { //particle attributes
    constructor({position, velocity, radius, color, fades}) {
        this.position = position
        this.velocity = velocity
        this.radius = radius
        this.color = color
        this.opacity = 1
        this.fades = fades
    }

    draw(){ // drawing the projectile (circle)
        ctx.save();
        ctx.globalAlpha = this.opacity
        ctx.beginPath();
        ctx.arc(this.position.x,this.position.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle= this.color
        ctx.fill();
        ctx.closePath();
        ctx.restore();
        
    }

    update() { //this method will be used to move our projectile
        this.draw();
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        
        if(this.fades){
        this.opacity -=0.015
        }

    }
}


//---------------------------------------------------Creating the Invader Class--------------------------------------------

class Invader { 
    constructor({position}) { //Invader attributes
        this.velocity = {
            x: 0,
            y: 0
        }
        const img = new Image() //creates our image
        img.src = './contents/invader.png'
        img.onload = () => { // this function runs once the page is loaded
            const scale = 1;
            this.img = img;
            this.width = img.width * scale 
            this.height = img.height * scale
            this.position = {
                x: position.x,
                y: position.y
            } 
        }    
    }
    draw() { // drawing the Invader
        
        ctx.drawImage(// draws our image 
            this.img, 
            this.position.x, 
            this.position.y, 
            this.width, 
            this.height
            )  
    }

    update({velocity}){ //this method will be used to move our player
        if (this.img) { 
            this.draw()
            this.position.x += velocity.x; // the velocity of the invaders will be affected by the grids velocity now
            this.position.y += velocity.y;
        }
    }

    shoot(invaderProjectiles){ //method that shoots from the invader
        invaderProjectiles.push(new InvaderProjectile({
            position: {
                x: this.position.x + this.width / 2,
                y: this.position.y +this.height
            },
            velocity: {
                x: 0,
                y: 5
            }
        }))

}
}


//---------------------------------------------------Creating a Grid Class--------------------------------------------

class Grid {
    constructor() {
        this.position = {
            x: 0,
            y: 0
        }
        
        this.invaders = [] ;// whenever a new grid is created, a new invader is created and stored in the this.invaders array
        
        const columns = Math.floor(Math.random() * 10 + 5); // giving us a random number so we can use to make our columns
        const rows = Math.floor(Math.random() * 5 + 2); // giving us a random number so we can use to make our rows
        const speed = Math.floor(Math.random() * 5 + 4) // giving us a random number to determine the speed
        
        this.velocity = {
            x: speed, 
            y: 0
        }

        this.width = columns * 30 // the width of the grid is the the number of columns * the width of the Invader

        for (let x = 0; x < columns; x++){ //creating 10 invaders and pushing them into the array
          for (let y = 0; y < rows; y++){ // this for loop is so we can place the invaders on the y axis after looping through again
            this.invaders.push(
                new Invader({
                    position:{
                        x: x*30, // lines up the invaders on the x axis because we multiplied them by the width of each one
                        y: y*30 // lines up the invaders on the y axis because we multiplied them by the hight of each one
                    }
                }))
            }
        }
    }

    update(){
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.velocity.y = 0; //this makes sure the velocity of y stays at 0 except for the exact moment it hits the canvas wall
        if(this.position.x + this.width >= canvas.width || this.position.x <= 0) { // this checks if the the grid has reached the end of the canvas
            this.velocity.x = -this.velocity.x // if it does the the grid starts going the other way
            this.velocity.y = 30; // everytime the grid hits the wall the grid will go down by 30 pixels
        }
    }

}





//------------------------------------------------------Display the parts and edit the animations -----------------------------------------------------



const player = new Player() // creating a new player by calling Player class
const projectiles = [] // empty array that we will store all our projectiles in 
const grids = [] // grids array for the invaders
const invaderProjectiles =[] // storing the invader projectiles
const particles = [] //storing the particles from the explosions
const keys = { // this will be used to monitar our keys and to check if they are pressed or not
    a: {
        pressed: false
    },
    d: {
        pressed: false
    }
}

let frames = 0;
let randomInterval = Math.floor(Math.random() * 500 + 500)
let game = { //checks if the game is over
    over: false, 
    active:true

}

let score = 0


// Creating Stars for the background
for (let i =0; i < 150; i++) { 
    particles.push(new Particle({ 
       position: {
           x: Math.random() * canvas.width,
           y: Math.random() * canvas.height
       }, 
       velocity: {
           x: 0, 
           y: .3
       }, 
       radius: Math.random()* 2 ,
       color: 'white'
    }))
   }


function createParticles({object, color, fades}) {
    for (let i =0; i < 15; i++) { //creating multiple particles in the explosion
        particles.push(new Particle({ // whenever an invader is destroyed, these particles "explosions" happen
           position: {
               x: object.position.x + object.width /2,
               y: object.position.y + object.height /2
           }, 
           velocity: {
               x: (Math.random() -0.5)*2, 
               y: (Math.random() -0.5)*2
           }, 
           radius: Math.random()*3 ,
           color: color,
           fades: fades
        }))
       }
}

function animate(){ //function to create an animation loop
    if (!game.active) return
    
    requestAnimationFrame(animate);
    ctx.fillStyle = 'black'
    ctx.fillRect(0,0, canvas.width, canvas.height) //filling the whole screen black
    player.update(); 
    particles.forEach((particle, i) => {  

        if(particle.position.y - particle.radius >= canvas.height) { //this checks if the stars leave the page and respawns them at the top
            particle.position.x = Math.random() * canvas.width
            particle.position.y = -particle.radius
        }

        if(particle.opacity <= 0) { // deleting the particles when their opacity becomes 0
            setTimeout(()=> {
                particles.splice(i, 1)
            }, 0)
        }else{
            particle.update();
        }    
    })
    invaderProjectiles.forEach((invaderProjectile, index) =>{
        if(invaderProjectile.position.y + invaderProjectile.height >= canvas.height){// checks if the projectiles left the page
            setTimeout(()=>{ 
                invaderProjectiles.splice(index, 1)    //if it has, we remove it from the array
            }, 0)
        }else{
            invaderProjectile.update()
        }     

        //conditons to check if the projectiles hit our player
        if(invaderProjectile.position.y + invaderProjectile.height >= player.position.y &&
            invaderProjectile.position.x + invaderProjectile.width >= player.position.x &&
            invaderProjectile.position.x <= player.position.x + player.width)
            {
                setTimeout(()=>{  
                    invaderProjectiles.splice(index, 1)   // removes projectile if it has hit our player
                    player.opacity = 0
                    game.over = true; // game.over is triggered when the player dies and the player is not able to shoot anymore
                }, 0)

                setTimeout(()=>{  
                    game.active = false; // game.active is triggerd after 2 seconds and the whole game stops
                    gameOver.innerHTML="GAME OVER"
                }, 2000)

                createParticles({
                    object: player, 
                    color: 'white', 
                    ades: true
                });
            }
    })
    projectiles.forEach((projectile, index) => { //for each projectile in the array we are gonna call update on it
        if (projectile.position.y + projectile.radius <= 0){// checks if the projectiles left the page
            setTimeout(()=>{ 
                projectiles.splice(index, 1)    //if it has, we remove it from the array
            }, 0)
        }else{
            projectile.update()
        }     
    })
    grids.forEach((grid, gridIndex) => {
        grid.update(); // updates the grid
        //spawning projectiles from the enemies
        if(frames % 100 === 0 && grid.invaders.length > 0){//check if there is invaders on the canvas, and if there is the projectiles span from them
            grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(invaderProjectiles)// choosing a random invader to shoot the projectile

        } 
        grid.invaders.forEach((invader, i) => { //call update from the invader class inside the the grid
            invader.update({velocity: grid.velocity}); // the grid velocity will determine the velocity of the invader
            
            //Shooting the invaders 
            projectiles.forEach((projectile, j) => {//detecting for collision
                if(projectile.position.y - projectile.radius <= //checks if the top of the projectile hits the bottom of an invader
                    invader.position.y + invader.height && 
                    projectile.position.x + projectile.radius >= invader.position.x &&
                    projectile.position.x - projectile.radius <= invader.position.x + invader.width &&
                    projectile.position.y + projectile.radius >= invader.position.y)
                    { 
                     
                    
                    setTimeout(() =>{
                        const invaderFound = grid.invaders.find(invader2 => invader2 === invader)
                        const projectileFound = projectiles.find( projectile2 => projectile2 === projectile)

                        
                        if (invaderFound && projectileFound){
                            score += 100
                            scoreElement.innerHTML = score; //updates the score on the screen
                            createParticles({object: invader, color: '#BAA0DE', fades: true});
                            grid.invaders.splice(i, 1) // this splices "removes" the invader from the grid.invader array
                            projectiles.splice(j, 1) // this splices "removes" the projectile from the projectiles array
                            //changing the width of the grid after invaders get killed
                            if(grid.invaders.length > 0 ) {
                                const firstInvader = grid.invaders[0];
                                const lastInvader  = grid.invaders[grid.invaders.length - 1]

                                grid.width = lastInvader.position.x - firstInvader.position.x + 30// the grid width is now the length of the first invader to the last invader
                                grid.position.x = firstInvader.position.x
                            }else {
                                grids.splice(gridIndex, 1) // cleaning up the grid after deletion  
                             } 
                        
                            
                        } 
                    }, 0)
                }

            })
        })
    })

    if(keys.a.pressed && player.position.x >= 0 ) { // if statement to check if the controls is pressed which determines the velocity of the spaceship
        player.velocity.x = -7;
        player.rotation = -.15; // rotates the player a little towards the direction we moved it
    } else if (keys.d.pressed && player.position.x + player.width <= canvas.width){
        player.velocity.x = 5;
        player.rotation = .15;
    }else{
        player.velocity.x = 0
        player.rotation = 0
    }
   
    //Spawning enemies
    if (frames % randomInterval === 0 ){ //if the animation has happened a certain number of times
        grids.push(new Grid()) // we push a new grid into the array and add it into the game
        randomInterval = Math.floor(Math.random() * 500 + 500)
        console.log(randomInterval)
        frames = 0
    }


    frames++ // keep track how many times we went throught the animation
}
animate() 


//-----------------------------------------------------EventListener for the Controls------------------------------------------------------------------------



window.addEventListener('keydown', ({key}) => { // event listener for when we press the controls
    if(game.over) return
    switch(key) {
        case 'a':
            keys.a.pressed = true;
            break;
        case 'd':
            keys.d.pressed = true;
            break
        case 'w':
            projectiles.push(new Projectile({ //pushing a new projectile into the array everytime 'w' is pressed
                position: {
                    x: player.position.x + player.width / 2, 
                    y: player.position.y
                },
                velocity: {
                    x: 0, 
                    y:-10
                }
            }))
            break
    }
    
})
window.addEventListener('keyup', ({key}) => { // event listener for when we let go of the controls
    switch(key) {
        case 'a':
            keys.a.pressed = false;
            break;
        case 'd':
            keys.d.pressed = false;
            break
        case 'w':
            console.log('shoot')
            break
    }
    
})