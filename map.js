const canvas = document.getElementById("canvas")
const context = canvas.getContext("2d")
const scoreEl = document.getElementById("score")

canvas.width = window.innerWidth - 40
canvas.height = window.innerHeight - 65
// rectangle(0,0,canvas.width,canvas.height,"blue")
// rectangle(50,50,canvas.width-50,canvas.height-50,"blue")

class Boundary{
    static width = 30
    static height = 30
    constructor({position, color}){
        this.position = position
        this.width = 30
        this.height = 30
        this.color =  color
    }
    draw(){
        context.fillStyle = this.color
        context.fillRect(this.position.x,this.position.y,this.width,this.height)
    }
}

class Pacman {
    static speed = 3
    constructor({position,velocity}){
        this.position = position
        this.velocity = velocity
        this.radius = 10
        this.radians = 0.75
        this.openRate = 0.12
        this.rotation = 0
        this.speed = 3
    }
    draw(){
        context.save()
        context.translate(this.position.x,this.position.y)
        context.rotate(this.rotation)
        context.translate(-this.position.x,-this.position.y)
        context.beginPath()
        context.arc(this.position.x,this.position.y,this.radius,this.radians,Math.PI*2 - this.radians)
        context.lineTo(this.position.x,this.position.y)
        context.fillStyle = "yellow"
        context.fill()
        context.closePath()
        context.restore()
    }
    update(){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        if (this.radians < 0 || this.radians > 0.75){
            this.openRate = -this.openRate
        }
        this.radians += this.openRate
    }
    rotateCircle() {
        const cosTheta = Math.cos(this.rotation);
        const sinTheta = Math.sin(this.rotation);

        const rotatedPoints = [];

        for (let angle = 0; angle < 360; angle++) {
            const radians = (angle * Math.PI) / 180;
            const x = this.position.x + radius * Math.cos(radians);
            const y = this.position.y + radius * Math.sin(radians);
            const newX = x * cosTheta - y * sinTheta;
            const newY = x * sinTheta + y * cosTheta;
            rotatedPoints.push({ x: newX, y: newY });
        }
        rotatedPoints.forEach((point) => {
            context.arc(this.position.x,this.position.y,this.radius,this.radians,degree - this.radians)    }
        )
    }
}

function drawCircle(context, centerX, centerY, radius) {
let x = 0;
let y = radius;
let d = 3 - 2 * radius;

while (x <= y) {
    plotPoints(context, centerX, centerY, x, y);
    if (d < 0) {
    d = d + 4 * x + 6;
    } else {
    d = d + 4 * (x - y) + 10;
    y--;
    }
    x++;
}
}

function plotPoints(context, centerX, centerY, x, y) {
context.fillRect(centerX + x, centerY + y, 1, 1);
context.fillRect(centerX - x, centerY + y, 1, 1);
context.fillRect(centerX + x, centerY - y, 1, 1);
context.fillRect(centerX - x, centerY - y, 1, 1);
context.fillRect(centerX + y, centerY + x, 1, 1);
context.fillRect(centerX - y, centerY + x, 1, 1);
context.fillRect(centerX + y, centerY - x, 1, 1);
context.fillRect(centerX - y, centerY - x, 1, 1);
}

function floodFill(x, y, newColor, targetColor) {
    console.log(x, y, newColor, targetColor);
    const stack = [];
    const initialColor = context.getImageData(x, y, 1, 1).data;

    if (
        initialColor[0] === newColor[0] &&
        initialColor[1] === newColor[1] &&
        initialColor[2] === newColor[2]
    ) {
        return;
    }

    stack.push({ x, y });

    while (stack.length) {
        const { x, y } = stack.pop();
        const pixel = context.getImageData(x, y, 1, 1).data;

        if (
        x >= 0 &&
        y >= 0 &&
        x < canvas.width &&
        y < canvas.height &&
        pixel[0] === targetColor[0] &&
        pixel[1] === targetColor[1] &&
        pixel[2] === targetColor[2] &&
        pixel[3] === targetColor[3]
        ) {
        context.fillStyle = newColor;
        context.fillRect(x, y, 1, 1);

        stack.push({ x: x + 1, y });
        stack.push({ x: x - 1, y });
        stack.push({ x, y: y + 1 });
        stack.push({ x, y: y - 1 });
        }
    }
    }


class Ghost {
    static speed = 3
    constructor({position,velocity, color = "red"}){
        this.position = position
        this.velocity = velocity
        this.radius = 10
        this.color = color
        this.prevCollisions = []
        this.speed = 3
        this.chaser = false
    }
    draw(){
        // drawCircle(context, this.position.x,this.position.y,this.radius);
        // const initialColor = context.getImageData(this.position.x,this.position.y, 1, 1).data;
        // const fill_color = this.chaser ? 'red' : this.color
        // floodFill(this.position.x, this.position.y, fill_color, initialColor)
        context.beginPath()
        context.arc(this.position.x,this.position.y,this.radius,0,Math.PI*2)
        context.fillStyle = this.chaser ? 'red' : this.color
        context.fill()
    }
    update(){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

class Pellets {
    constructor({position}){
        this.position = position
        this.radius = 3
    }
    draw(){
        context.beginPath()
        context.arc(this.position.x,this.position.y,this.radius,0,Math.PI*2)
        context.fillStyle = "white"
        context.fill()
        context.closePath()
    }
}

class PowerUp {
    constructor({position}){
        this.position = position
        this.radius = 8
    }
    draw(){
        context.beginPath()
        context.arc(this.position.x,this.position.y,this.radius,0,Math.PI*2)
        context.fillStyle = "white"
        context.fill()
        context.closePath()
    }
}
const pellets = []
const boundaries = []
const powerUps = []
const ghosts = [
    new Ghost({
        position:{
            x: Boundary.width * 21 + Boundary.width / 2,
            y: Boundary.height * 10 + Boundary.height / 2
        },
        velocity:{
            x: Ghost.speed,
            y: 0
        },
        color: "green"
    } ),
    new Ghost({
        position:{
            x: Boundary.width * 21 + Boundary.width / 2,
            y: Boundary.height * 10 + Boundary.height / 2
        },
        velocity:{
            x: Ghost.speed,
            y: 0
        },
        color: "green"
    } ),
    new Ghost({
        position:{
            x: Boundary.width * 21 + Boundary.width / 2,
            y: Boundary.height * 10 + Boundary.height / 2
        },
        velocity:{
            x: Ghost.speed,
            y: 0
        },
        color: "green"
    } ),
    new Ghost({
        position:{
            x: Boundary.width * 21 + Boundary.width / 2,
            y: Boundary.height * 10 + Boundary.height / 2
        },
        velocity:{
            x: Ghost.speed,
            y: 0
        },
        color: "green"
    } ),
    new Ghost({
        position:{
            x: Boundary.width * 21 + Boundary.width / 2,
            y: Boundary.height * 10 + Boundary.height / 2
        },
        velocity:{
            x: Ghost.speed,
            y: 0
        },
        color: "green"
    } ),
    new Ghost({
        position:{
            x: Boundary.width * 21 + Boundary.width / 2,
            y: Boundary.height * 10 + Boundary.height / 2
        },
        velocity:{
            x: Ghost.speed,
            y: 0
        },
        color: "green"
    } ),
    new Ghost({
        position:{
            x: Boundary.width * 21 + Boundary.width / 2,
            y: Boundary.height * 10 + Boundary.height / 2
        },
        velocity:{
            x: Ghost.speed,
            y: 0
        },
        color: "green"
    } )
]
const pacman = new Pacman({
    position:{
        x: Boundary.width + Boundary.width / 2,
        y: Boundary.height + Boundary.height / 2
    },
    velocity:{
        x: Pacman.speed,
        y: 0
    }
})

const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
}

let lastKey = ''
let score = 0
let number_of_ghosts = 0

const map = [
    ['-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-'],
    ['-','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','-'],
    ['-','.','-','-','-','-','-','.','-','-','-','-','-','.','-','-','-','-','-','.','-','-','-','-','-','.','-','-','-','-','-','.','-','-','-','-','-','.','-','.','-','.','-','.','-','-','.','-','.','-'],
    ['-','.','-',' ',' ',' ','-','.','-',' ',' ','-','-','.','-',' ',' ',' ','-','.','-',' ',' ','-','-','.','-',' ',' ',' ','-','.','-','-','-','-','-','.','-','.','.','.','-','.','-','-','.','-','.','-'],
    ['-','.','-','-','-','-','-','.','-','-','-','-','-','.','-','-','-','-','-','.','-','-','-','-','-','.','-',' ',' ',' ','-','.','-','-','-','-','-','.','-','-','-','-','-','.','-','-','.','-','.','-'],
    ['-','.','-','.','.','.','-','.','-',' ',' ',' ','-','.','-','.','.','.','-','.','-','.','.','.','-','.','-',' ',' ',' ','-','.','-','-','-','-','-','.','-','.','.','.','-','.','.','.','.','-','.','-'],
    ['-','.','-','.','-','.','-','.','-','-','-','-','-','.','-','.','-','.','-','.','-','.','-','.','-','.','-','-','-','-','-','.','-','-','-','-','-','.','-','.','-','.','-','.','-','-','.','-','.','-'],
    ['-','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','-'],
    ['-','.','-','.','-','-','-','.','-','-','.','-','.','-','.','-','.','-','.','-','-','.','-','.','-','.','-','.','-','.','-','.','-','-','.','-','.','-','.','-','-','.','-','-','-','-','-','-','.','-'],
    ['-','.','-','.','.','.','.','.','-','.','.','-','.','.','.','.','.','-','.','.','.','.','.','.','-','.','-','.','-','.','.','.','.','.','.','-','.','.','.','.','.','.','-',' ',' ',' ',' ','-','.','-'],
    ['-','.','-','-','-','-','-','.','-','.','-','.','.','-','.','-','.','.','.','-','-','.','-','.','-','.','.','.','-','.','-','.','-','-','.','-','.','-','-','-','-','.','-',' ',' ',' ',' ','-','.','-'],
    ['-','.','.','.','.','.','-','.','-','.','-','.','-','-','.','-','.','-','.','-','-','.','-','.','-','-','-','-','-','.','-','.','-','-','.','-','.','.','.','.','-','.','-',' ',' ',' ',' ','-','.','-'],
    ['-','.','-','.','-','.','-','.','.','.','.','.','.','-','.','-','.','.','.','-','-','.','-','.','.','.','.','.','.','.','-','.','-','-','.','-','.','-','-','.','-','.','-','-','-','-','-','-','.','-'],
    ['-','.','-','.','-','.','.','.','-','-','-','-','.','-','.','-','-','-','.','-','-','.','-','.','-','-','-','-','-','.','-','.','-','-','.','.','.','.','.','.','-','.','.','.','.','.','.','.','.','-'],
    ['-','.','.','.','.','.','-','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','-','.','-','-','.','-','.','-','.','-','-','.','-','.','-'],
    ['-','.','-','-','.','-','-','.','-','-','-','-','-','.','-','-','-','-','-','.','-','-','-','-','-','.','-','-','-','-','-','.','-','-','.','-','.','-','-','.','.','.','-','.','.','-','.','-','.','-'],
    ['-','.','-','-','.','.','.','.','-',' ',' ',' ','-','.','-',' ','-',' ','-','.','-',' ','-',' ','-','.','-',' ','-',' ','-','.','-','.','.','-','.','.','-','.','-','-','-','-','.','.','.','-','.','-'],
    ['-','.','-','-','-','-','-','.','-',' ',' ',' ','-','.','-',' ','-','-','-','.','-','-','-','-','-','.','-','-','-','-','-','.','-','.','-','-','-','.','-','.','-','.','.','.','-','-','.','-','.','-'],
    ['-','.','-','-','-','-','-','.','-',' ',' ',' ','-','.','-',' ',' ',' ','-','.','-','-','-','-','-','.','-','-','-','-','-','.','.','.','.','-','.','.','-','.','-','.','-','.','.','.','.','.','.','-'],
    ['-','.','-','-','-','-','-','.','-','-','-','-','-','.','-','-','-','-','-','.','-','-','-','-','-','.','-','-','-','-','-','.','-','-','.','-','.','-','-','.','-','.','-','-','-','-','.','-','.','-'],
    ['-','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','-'],
    ['-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-'],


]

const reds = [[2,12],[3,12],[2,24],[3,24],[5,32],[5,33],[5,34],[5,35],
                [3,33],[3,34],[3,35],[3,36],[15,3],[18,4],[18,5],[19,4],[19,5],[17,2],[18,2],[19,2],[18,8],[19,8],[19,9],[19,10],[19,11],
                [18,18],[16,20],[16,24],[18,21],[18,22],[18,23],[19,21],[19,22],[19,23],[16,26],[16,30],[18,27],[18,28],[18,29],[19,27],[19,28],[19,29]]

const blacks = [[8,42],[8,43],[8,44],[8,45],[8,46],[8,47],
                [9,42],[9,47],
                [10,42],[10,47],
                [11,42],[11,47],
                [12,42],[12,43],[12,44],[12,45],[12,46],[12,47],]

function check(i, j, colors){
    for (let x = 0; x < colors.length; x++ ){
        if (i == colors[x][0] && j == colors[x][1])
            return true
    }
    return false
}

map.forEach((row, i) => {
    row.forEach((symbol, j) => {
        switch(symbol){
            case '-':
                boundaries.push(
                    new Boundary({
                        position:{
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        // if i, j in reds "red" else "blue"
                        color: check(i, j, reds) ? "black" : check(i, j, blacks) ? "red" : "blue",
                    })
                )
                break
            case '.':
                pellets.push(
                    new Pellets({
                        position:{
                            x: Boundary.width * j + Boundary.width / 2,
                            y: Boundary.height * i + Boundary.height / 2
                        }
                    })
                )
                break
        }
    })
})

function collide({circle,rectangle}){
    const padding = Boundary.width / 2 - circle.radius - 1
    return(circle.position.y - circle.radius  + circle.velocity.y <= rectangle.position.y + rectangle.height + padding &&
            circle.position.x + circle.radius + circle.velocity.x >= rectangle.position.x - padding &&
            circle.position.y + circle.radius + circle.velocity.y >= rectangle.position.y  - padding &&
            circle.position.x - circle.radius + circle.velocity.x <= rectangle.position.x + rectangle.width + padding)
}

let animationId
function animate(){
    animationId = requestAnimationFrame(animate)
    context.clearRect(0,0,canvas.width,canvas.height)

    if (keys.ArrowUp && lastKey === 'ArrowUp'){
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (
                collide({
                    circle: {
                        ...pacman,
                        velocity: {
                            x: 0,
                            y: -Pacman.speed
                        }
                    },
                    rectangle: boundary
                })
                ){
                pacman.velocity.y = 0
                break
            }   else{
                pacman.velocity.y = -Pacman.speed
            }
        }
    } else if (keys.ArrowDown && lastKey === 'ArrowDown'){
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (
                collide({
                    circle: {
                        ...pacman,
                        velocity: {
                            x: 0,
                            y: Pacman.speed}
                    },
                    rectangle: boundary
                })
                ){
                pacman.velocity.y = 0
                break
            }   else{
                pacman.velocity.y = Pacman.speed
            }
        }
    } else if (keys.ArrowLeft && lastKey === 'ArrowLeft'){
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (
                collide({
                    circle: {
                        ...pacman,
                        velocity: {
                            x: -Pacman.speed,
                            y: 0}
                    },
                    rectangle: boundary
                })
                ){
                pacman.velocity.x = 0
                break
            }   else{
                pacman.velocity.x = -Pacman.speed
            }
        }
    } else if (keys.ArrowRight && lastKey === 'ArrowRight'){
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (
                collide({
                    circle: {
                        ...pacman,
                        velocity: {
                            x: Pacman.speed,
                            y: 0}
                    },
                    rectangle: boundary
                })
                ){
                pacman.velocity.x = 0
                break
            }   else{
                pacman.velocity.x =  Pacman.speed
            }
        }
    }
    for (let i = ghosts.length - 1; i >= 0; i--) {
        const ghost = ghosts[i];
        if (
            Math.hypot(
                ghost.position.x - pacman.position.x,
                ghost.position.y - pacman.position.y
            ) < pacman.radius + ghost.radius
        ) {
            if (ghost.chaser == false){
                ghost.chaser = true
                number_of_ghosts += 1
                ghost.position = {
                    x: Boundary.width * 14 + Boundary.width / 2,
                    y: Boundary.height * 10 + Boundary.height / 2
                }
                // ghosts.splice(i, 1)
                // score += 100
                // scoreEl.innerText = score
            } else {
            cancelAnimationFrame(animationId)
            alert("Game Over")}
        }
    }

    if (pellets.length === 1){
        alert("You Win!")
        cancelAnimationFrame(animationId)
    }

    for (let i = powerUps.length - 1; i >= 0; i--) {
        const powerUp = powerUps[i];
        powerUp.draw()

        // if(Math.hypot(
        //     powerUp.position.x - pacman.position.x,
        //     powerUp.position.y - pacman.position.y) < pacman.radius + powerUp.radius){
        //     powerUps.splice(i, 1)
        //     score += 50
        //     scoreEl.innerText = score

        //     ghosts.forEach((ghost) => {
        //         ghost.scared = true

        //         setTimeout(() => {
        //             ghost.scared = false
        //         }, 5000)
        //     })
        // }
    }

    for (let i = pellets.length - 1; i > 0; i--) {
        const pellet = pellets[i];
        pellet.draw()

        if(Math.hypot(
            pellet.position.x - pacman.position.x,
            pellet.position.y - pacman.position.y) < pacman.radius + pellet.radius && number_of_ghosts == ghosts.length){
            pellets.splice(i, 1)
            score += 10
            scoreEl.innerText = score
        }
    }

    boundaries.forEach((boundary) => {
        boundary.draw()

        if(
            collide({
                circle: pacman,
                rectangle: boundary
            })
            ){
            pacman.velocity.y = 0
            pacman.velocity.x = 0
            }
    })
    pacman.update()

    ghosts.forEach((ghost) => {
        ghost.update()

        const collisions = []
        boundaries.forEach(boundary => {
            if(
                !collisions.includes('right') &&
                collide({
                    circle: {...ghost, velocity: {x: ghost.speed, y: 0}},
                    rectangle: boundary
                })
                ){
                collisions.push('right')
                }
            if(
                !collisions.includes('left') &&
                collide({
                    circle: {...ghost, velocity: {x: -ghost.speed, y: 0}},
                    rectangle: boundary
                })
                ){
                collisions.push('left')
                }
            if(
                !collisions.includes('down') &&
                collide({
                    circle: {...ghost, velocity: {x: 0, y: ghost.speed}},
                    rectangle: boundary
                })
                ){
                collisions.push('down')
                }
            if(
                !collisions.includes('up') &&
                collide({
                    circle: {...ghost, velocity: {x: 0, y: -ghost.speed}},
                    rectangle: boundary
                })
                ){
                collisions.push('up')
                }
        })

        if (collisions.length > ghost.prevCollisions.length)
        ghost.prevCollisions = collisions

        if (JSON.stringify(collisions) !== JSON.stringify(ghost.prevCollisions)){
            if (ghost.velocity.x > 0){ ghost.prevCollisions.push('right')}
            else if (ghost.velocity.x < 0){ ghost.prevCollisions.push('left')}
            else if (ghost.velocity.y > 0){ ghost.prevCollisions.push('down')}
            else if (ghost.velocity.y < 0){ ghost.prevCollisions.push('up')}

            const pathways = ghost.prevCollisions.filter(collision => {
                return !collisions.includes(collision)})

            const direction = pathways[Math.floor(Math.random() * pathways.length)]

            switch(direction){
                case 'right':
                    ghost.velocity.x = ghost.speed
                    ghost.velocity.y = 0
                    break
                case 'left':
                    ghost.velocity.x = -ghost.speed
                    ghost.velocity.y = 0
                    break
                case 'down':
                    ghost.velocity.x = 0
                    ghost.velocity.y = ghost.speed
                    break
                case 'up':
                    ghost.velocity.x = 0
                    ghost.velocity.y = -ghost.speed
                    break
            }
            ghost.prevCollisions = []
        }
        })

        if (pacman.velocity.x > 0){
            pacman.rotation = 0
        } else if (pacman.velocity.x < 0){
            pacman.rotation = Math.PI
        } else if (pacman.velocity.y > 0){
            pacman.rotation = Math.PI / 2
        } else if (pacman.velocity.y < 0){
            pacman.rotation = Math.PI * 3 / 2
        }
}
animate()

addEventListener('keydown', (event) => {
    switch(event.key){
        case 'ArrowUp':
            keys.ArrowUp = true
            lastKey = 'ArrowUp'
            break
        case 'ArrowDown':
            keys.ArrowDown = true
            lastKey = 'ArrowDown'
            break
        case 'ArrowLeft':
            keys.ArrowLeft = true
            lastKey = 'ArrowLeft'
            break
        case 'ArrowRight':
            keys.ArrowRight = true
            lastKey = 'ArrowRight'
            break
    }
})

addEventListener('keyup', (event) => {
    switch(event.key){
        case 'ArrowUp':
            keys.ArrowUp = false
            break
        case 'ArrowDown':
            keys.ArrowDown = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft = false
            break
        case 'ArrowRight':
            keys.ArrowRight = false

            break
    }
})




























