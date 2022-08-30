const canvas2 = document.getElementById('canvas2');
const ctx2 = canvas2.getContext('2d')
canvas2.width = 1024
canvas2.height = 576


//---------------------------------------------------Creating the Particle--------------------------------------------
class Particle2 { //particle attributes
    constructor({position, velocity, radius, color, fades}) {
        this.position = position
        this.velocity = velocity
        this.radius = radius
        this.color = color
        this.opacity = 1
        this.fades = fades
    }

    draw(){ // drawing the projectile (circle)
        ctx2.save();
        ctx2.globalAlpha = this.opacity
        ctx2.beginPath();
        ctx2.arc(this.position.x,this.position.y, this.radius, 0, Math.PI * 2)
        ctx2.fillStyle= this.color
        ctx2.fill();
        ctx2.closePath();
        ctx2.restore();
        
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

class Invader2 { 
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
        
        ctx2.drawImage(// draws our image 
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

}


//---------------------------------------------------Creating a Grid Class--------------------------------------------

class Grid2 {
    constructor() {
        this.position = {
            x: 0,
            y: 0
        }
        
        this.invaders = [] ;// whenever a new grid is created, a new invader is created and stored in the this.invaders array
        
        const columns = Math.floor(Math.random() * 8 + 3); // giving us a random number so we can use to make our columns
        const rows = Math.floor(Math.random() * 3 + 2); // giving us a random number so we can use to make our rows
        const speed = Math.floor(Math.random() * 5 + 4) // giving us a random number to determine the speed
        
        this.velocity = {
            x: speed, 
            y: 0
        }

        this.width = columns * 30 // the width of the grid is the the number of columns * the width of the Invader
        this.height = rows * 30

        for (let x = 0; x < columns; x++){ //creating 10 invaders and pushing them into the array
          for (let y = 0; y < rows; y++){ // this for loop is so we can place the invaders on the y axis after looping through again
            this.invaders.push(
                new Invader2({
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
        if(this.position.x + this.width >= canvas2.width || this.position.x <= 0) { // this checks if the the grid has reached the end of the canvas
            this.velocity.x = -this.velocity.x // if it does the the grid starts going the other way
            this.velocity.y = 30; // everytime the grid hits the wall the grid will go down by 30 pixels
        }
    }

}




//------------------------------------------------------Display the parts and edit the animations -----------------------------------------------------





const particles2 = []
const grids2 = []
let frames2 = 0;
let randomInterval2 = Math.floor(Math.random() * 500 + 500)

for (let i =0; i < 150; i++) { 
    particles2.push(new Particle2({ 
       position: {
           x: Math.random() * canvas2.width,
           y: Math.random() * canvas2.height
       }, 
       velocity: {
           x: 0, 
           y: .3
       }, 
       radius: Math.random()* 2 ,
       color: 'white'
    }))
   }



function animate2() {

    requestAnimationFrame(animate2);
    ctx2.fillStyle = 'black'
    ctx2.fillRect(0,0, canvas2.width, canvas2.height)

    particles2.forEach((particle, i) => {  
        if(particle.position.y - particle.radius >= canvas2.height) { //this checks if the stars leave the page and respawns them at the top
            particle.position.x = Math.random() * canvas2.width
            particle.position.y = -particle.radius
        }

        if(particle.opacity <= 0) { // deleting the particles when their opacity becomes 0
            setTimeout(()=> {
                particles2.splice(i, 1)
            }, 0)
        }else{
            particle.update();
        }    
    })
    grids2.forEach((grid, gridIndex) => {
        grid.update(); // updates the grid
        //spawning projectiles from the enemies
    
        
        grid.invaders.forEach((invader, i) => { //call update from the invader class inside the the grid
            invader.update({velocity: grid.velocity}); // the grid velocity will determine the velocity of the invader
        })
    })

    //Spawning enemies
    if (frames2 % randomInterval2 === 0 ){ //if the animation has happened a certain number of times
        grids2.push(new Grid2()) // we push a new grid into the array and add it into the game
        randomInterval2 = Math.floor(Math.random() * 250 + 250)
        
        frames2 = 0
    }


    frames2++ // keep track how many times we went throught the animation
    
}

animate2()