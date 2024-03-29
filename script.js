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
    constructor({position}){
        this.position = position
        this.width = 30
        this.height = 30
    }
    draw(){
        context.fillStyle = "blue"
        context.fillRect(this.position.x,this.position.y,this.width,this.height)
    }
}

class Pacman {
    static speed = 4
    constructor({position,velocity}){
        this.position = position
        this.velocity = velocity
        this.radius = 10
        this.radians = 0.75
        this.openRate = 0.12
        this.rotation = 0
        this.speed = 4
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

class Ghost {
    static speed = 4
    constructor({position,velocity, color = "red"}){
        this.position = position
        this.velocity = velocity
        this.radius = 10
        this.color = color
        this.prevCollisions = []
        this.speed = 4
        this.chaser = false
    }
    draw(){
        context.beginPath()
        context.arc(this.position.x,this.position.y,this.radius,0,Math.PI*2)
        context.fillStyle = this.chaser ? 'red' : this.color
        context.fill()
        context.closePath()
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
            x: Boundary.width * 6 + Boundary.width / 2,
            y: Boundary.height + Boundary.height / 2
        },
        velocity:{
            x: Ghost.speed,
            y: 0
        },
        color: "green"
    } ),
    new Ghost({
        position:{
            x: Boundary.width * 6 + Boundary.width / 2,
            y: Boundary.height * 6 + Boundary.height / 2
        },
        velocity:{
            x: Ghost.speed,
            y: 0
        },
        color: "green"
    } ),
    new Ghost({
        position:{
            x: Boundary.width * 6 + Boundary.width / 2,
            y: Boundary.height * 8 + Boundary.height / 2
        },
        velocity:{
            x: Ghost.speed,
            y: 0
        },
        color: "green"
    } ),
    new Ghost({
        position:{
            x: Boundary.width * 6 + Boundary.width / 2,
            y: Boundary.height * 20 + Boundary.height / 2
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
    ['-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-'],
    ['-','.','.','.','.','.','.','.','.','-','.','.','.','.','.','.','.','.','-'],
    ['-','.','-','-','.','-','-','-','.','-','.','-','-','-','.','-','-','.','-'],
    ['-','.','-','-','.','-','-','-','.','-','.','-','-','-','.','-','-','.','-'],
    ['-','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','-'],
    ['-','.','-','-','.','-','.','-','-','-','-','-','.','-','.','-','-','.','-'],
    ['-','.','.','.','.','-','.','.','.','-','.','.','.','-','.','.','.','.','-'],
    ['-','.','-','-','.','-','-','-','.','-','.','-','-','-','.','-','-','.','-'],
    ['-','.','-','-','.','-','.','.','.','.','.','.','.','-','.','-','-','.','-'],
    ['-','.','-','-','.','-','.','-','-','-','-','-','.','-','.','-','-','.','-'],
    ['-','.','.','.','.','.','.','-',' ',' ',' ','-','.','.','.','.','.','.','-'],
    ['-','.','-','-','.','-','.','-','-','-','-','-','.','-','.','-','-','.','-'],
    ['-','.','-','-','.','-','.','.','.','.','.','.','.','-','.','-','-','.','-'],
    ['-','.','-','-','.','-','.','-','-','-','-','-','.','-','.','-','-','.','-'],
    ['-','.','.','.','.','.','.','.','.','-','.','.','.','.','.','.','.','.','-'],
    ['-','.','-','-','.','-','-','-','.','-','.','-','-','-','.','-','-','.','-'],
    ['-','.','.','-','.','.','.','.','.','.','.','.','.','.','.','-','.','.','-'],
    ['-','-','.','-','.','-','.','-','-','-','-','-','.','-','.','-','.','-','-'],
    ['-','.','.','.','.','-','.','.','.','-','.','.','.','-','.','.','.','.','-'],
    ['-','.','-','-','-','-','-','-','.','-','.','-','-','-','-','-','-','.','-'],
    ['-','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','-'],
    ['-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-'],


]
map.forEach((row, i) => {
    row.forEach((symbol, j) => {
        switch(symbol){
            case '-':
                boundaries.push(
                    new Boundary({
                        position:{
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        }
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
            // case 'p':
            // powerUps.push(
            //     new PowerUp({
            //         position:{
            //             x: Boundary.width * j + Boundary.width / 2,
            //             y: Boundary.height * i + Boundary.height / 2
            //         }
            //     })
            // )
            // break
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
            pellet.position.y - pacman.position.y) < pacman.radius + pellet.radius && number_of_ghosts == 4){
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




























