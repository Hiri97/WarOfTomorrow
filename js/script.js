

document.addEventListener("DOMContentLoaded", function () {
    const mainSquare = document.getElementById("main-square");
    const line = 8;

    for (let i = 0; i < line; i++) {
        for (let j = 0; j < line; j++) {
            const square = document.createElement("div");
            square.classList.add("square");
            mainSquare.appendChild(square);
        }
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const layer = document.getElementById("layer1");

    if (layer) {
        layer.addEventListener("click", function (event) {
            const mainSquare = document.querySelector(".main-square");
            const robots = document.querySelectorAll(".robot, .robot1, .robot3, .robot4");
            let robotsInMainSquare = 0;

            robots.forEach((robot) => {
                const robotRect = robot.getBoundingClientRect();
                const mainSquareRect = mainSquare.getBoundingClientRect();

                if (
                    robotRect.left >= mainSquareRect.left &&
                    robotRect.right <= mainSquareRect.right &&
                    robotRect.top >= mainSquareRect.top &&
                    robotRect.bottom <= mainSquareRect.bottom
                ) {
                    robotsInMainSquare++;
                }
            });

            const currentDotCount = document.querySelectorAll(".smalldots").length;

            if (currentDotCount < robotsInMainSquare) {
                const smallDot = document.createElement("div");
                smallDot.classList.add("smalldots");

                const layerRect = layer.getBoundingClientRect();
                smallDot.style.left = `${event.clientX - layerRect.left}px`;
                smallDot.style.top = `${event.clientY - layerRect.top}px`;

                layer.appendChild(smallDot);

                setTimeout(() => {
                    smallDot.remove();
                }, 10000);
            } else {
                alert(`You can only place ${robotsInMainSquare} dots!`);
            }
        });
    }
});
let buttonclick = true;
let positionY = 0;


function moveLayer() {
    const button = document.querySelector(".ActivateLayer");
    const layer = document.getElementById("layer1");

    if (buttonclick) {
        positionY -= 315;
        layer.style.transform = `translateY(${positionY}px)`;
        layer.style.transition = "transform 0.5s ease";

        buttonclick = false;

        
        setTimeout(() => {
            dothittarget(); 
        }, 500); 
    } else {
        positionY = 0;
        layer.style.transform = `translateY(${positionY}px)`;
        layer.style.transition = "transform 0.5s ease";

        buttonclick = true;

        
        setTimeout(() => {
            dothittarget(); 
        }, 500);
    }
}


document.addEventListener("DOMContentLoaded", () => {
    const button = document.querySelector(".ActivateLayer");
    button.addEventListener("click", moveLayer);
});

let mousedown = false;
let offsetX = 0;
let offsetY = 0;
let currentRobot = null;

function moverobot(event) {
    if (mousedown && currentRobot) {
        const mainSquare = document.querySelector(".main-square");
        const squareRect = mainSquare.getBoundingClientRect();

        let robotX = event.clientX - offsetX;
        let robotY = event.clientY - offsetY;

        const additionalWidth = squareRect.width * 0.4;  
        const additionalHeight = squareRect.height * 0.4;  

        
        if (robotX < squareRect.left - additionalWidth) {
            robotX = squareRect.left - additionalWidth;
        } else if (robotX > squareRect.right + additionalWidth - currentRobot.offsetWidth) {
            robotX = squareRect.right + additionalWidth - currentRobot.offsetWidth;
        }

        
        if (robotY < squareRect.top - additionalHeight) {
            robotY = squareRect.top - additionalHeight;
        } else if (robotY > squareRect.bottom + additionalHeight - currentRobot.offsetHeight) {
            robotY = squareRect.bottom + additionalHeight - currentRobot.offsetHeight;
        }

        currentRobot.style.left = `${robotX - squareRect.left}px`;
        currentRobot.style.top = `${robotY - squareRect.top}px`;
    }
}

document.addEventListener("mousedown", (event) => {
    const robots = document.querySelectorAll(".robot, .robot1, .robot3, .robot4");
    robots.forEach((robot) => {
        const robotRect = robot.getBoundingClientRect();

        if (
            event.clientX >= robotRect.left &&
            event.clientX <= robotRect.right &&
            event.clientY >= robotRect.top &&
            event.clientY <= robotRect.bottom
        ) {
            mousedown = true;
            currentRobot = robot;
            offsetX = event.clientX - robotRect.left;
            offsetY = event.clientY - robotRect.top;
            currentRobot.style.position = "absolute";
        }
    });
});

document.addEventListener("mouseup", () => {
    mousedown = false;
    currentRobot = null;
});

document.addEventListener("mousemove", moverobot);


function dothittarget() {
    const tanks = document.querySelectorAll(".tank, .tank1, .tank2");
    const smallDots = document.querySelectorAll(".smalldots");
    const explosionSound = document.querySelector(".explosion-sound");

    smallDots.forEach(dot => {
        tanks.forEach(tank => {
            const dotRect = dot.getBoundingClientRect();
            const tankRect = tank.getBoundingClientRect();

            
            if (
                dotRect.top < tankRect.bottom &&
                dotRect.bottom > tankRect.top &&
                dotRect.left < tankRect.right &&
                dotRect.right > tankRect.left
            ) {
                console.log("Hit detected: explosion triggered!");

                
                tank.style.backgroundImage = "url('assets/images/ex.gif')";
                tank.style.backgroundSize = "cover"; 
                tank.style.backgroundRepeat = "no-repeat";
                tank.style.position = "absolute";
                tank.style.display = "block";

                
                dot.remove();

                
                if (explosionSound) {
                    explosionSound.currentTime = 0; 
                    explosionSound.play(); 
                } else {
                    console.error("Explosion sound element not found!");
                }

                
                setTimeout(() => {
                    tank.style.visibility = "hidden"; 
                }, 3000);

                
                points += 5;
                updatePoints();

                
                if (points % 20 === 0) {
                    const robotCount = Math.floor(points / 10); 
                    addRobots(1);
                }
            }
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    updatePoints();
});


const maxTanks = 8;
const minTanks = 4;
const mainSquare = document.querySelector(".main-square");
const tanks = document.querySelectorAll(".tank, .tank1, .tank2");
let activeTanks = [];

function generateSingleTank() {
    if (activeTanks.length >= maxTanks) {
        console.log('Max tanks reached:', activeTanks.length);
        return;
    }

    const randomTank = tanks[Math.floor(Math.random() * tanks.length)];
    const newTank = randomTank.cloneNode(true);
    newTank.style.position = "absolute";

    const randomSize = Math.random() * 50 + 50;
    newTank.style.width = `${randomSize}px`;
    newTank.style.height = `${randomSize}px`;

    const randomX = Math.random() * (mainSquare.offsetWidth - randomSize);
    const randomY = Math.random() * (mainSquare.offsetHeight / 2);

    newTank.style.left = `${randomX}px`;
    newTank.style.top = `${randomY}px`;

    mainSquare.appendChild(newTank);
    activeTanks.push(newTank);

    console.log('New tank generated! Total tanks:', activeTanks.length);
}

function checkAndRegenerateTanks() {
    const previousCount = activeTanks.length;
    
    activeTanks = activeTanks.filter(tank => 
        tank.parentNode === mainSquare && 
        tank.style.display !== 'none' && 
        tank.style.visibility !== 'hidden'
    );

    console.log('Active tanks check:', {
        previous: previousCount,
        current: activeTanks.length,
        needsRegeneration: activeTanks.length < minTanks
    });

    while (activeTanks.length < minTanks) {
        console.log('Regenerating tank...');
        generateSingleTank();
    }
}

function startGeneratingTanks() {
    console.log('Starting tank generation system');
    
    while (activeTanks.length < minTanks) {
        generateSingleTank();
    }

    setInterval(() => {
        if (activeTanks.length < maxTanks) {
            generateSingleTank();
        }
    }, 3000);

    setInterval(checkAndRegenerateTanks, 1000);
}

startGeneratingTanks();


let buttonclick1 = false;
let dotInterval;
let dotTimeout;

function phase1() {
    const button = document.querySelector('.ActivateLayer'); 
    const redLight = document.querySelector('.red-light'); 
    const greenLight = document.querySelector('.green-light'); 
    const layer = document.getElementById("layer1");
    const layer2 = document.getElementById('layer2');

    button.addEventListener('click', () => {
        if (!buttonclick1) {

            if (layer2) {
                layer2.style.display = 'none';
            }
           
            redLight.style.display = 'block'; 
            greenLight.style.display = 'none'; 
            button.style.display = 'none';
            buttonclick1 = true;
        
           
           
           
        dotInterval = setInterval(generateCPUDots, 500);

       
        dotTimeout = setTimeout(() => {
            clearInterval(dotInterval);  
        }, 10000);
    
           
            setTimeout(() => {
               
                positionY = 0;
                layer.style.transform = `translateY(${positionY}px)`;
                layer.style.transition = "transform 0.5s ease";        
                redLight.style.display = 'none'; 
                greenLight.style.display = 'block'; 
                button.style.display = 'block';  
                buttonclick1 = false; 
                if (layer2) {
                    layer2.style.display = 'none'; 
                }
            }, 10000);
        }
    });
}

phase1();




const layer2 = document.createElement('div');
layer2.id = 'layer2';
layer2.style.position = 'absolute';
layer2.style.top = '0';
layer2.style.left = '0';
layer2.style.width = '100%';
layer2.style.height = '50%';
layer2.style.backgroundImage = "url('assets/images/wl.jpg')";
layer2.style.backgroundSize = "cover";
layer2.style.backgroundRepeat = "no-repeat";
layer2.style.zIndex = '0';
layer2.style.top = '50%';
layer2.style.transition = "transform 0.5s ease"; 
layer2.style.opacity = '0.5';
layer2.style.zIndex = '0';
layer2.style.pointerEvents = 'none';



mainSquare.appendChild(layer2);


function generateCPUDots() {
    const mainSquare = document.querySelector(".main-square");
    if (!mainSquare) return;

    const mainSquareRect = mainSquare.getBoundingClientRect();

    const cpuDot = document.createElement("div");
    cpuDot.classList.add("smalldots");

    const widthReduction = 0.2;
    const reducedWidth = mainSquareRect.width * (1 - widthReduction);

    const randomX = Math.random() * reducedWidth + (mainSquareRect.width - reducedWidth) / 2;
    const randomY = Math.random() * (mainSquareRect.height / 2 - 10) + mainSquareRect.height / 2;

    cpuDot.style.position = "absolute";
    cpuDot.style.width = "10px";
    cpuDot.style.height = "10px";
    cpuDot.style.backgroundColor = "red";
    cpuDot.style.borderRadius = "50%";
    cpuDot.style.left = `${randomX}px`;
    cpuDot.style.top = `${randomY}px`;

    mainSquare.appendChild(cpuDot);

    setTimeout(() => {
        if (cpuDot.parentNode) cpuDot.remove();
    }, 5000);

    const robots = document.querySelectorAll(".robot, .robot1, .robot3, .robot4");
    robots.forEach(robot => {
        const robotRect = robot.getBoundingClientRect();

        const robotX = robotRect.left - mainSquareRect.left;
        const robotY = robotRect.top - mainSquareRect.top;

        const isColliding = (
            randomX < robotX + robotRect.width &&
            randomX + 10 > robotX &&
            randomY < robotY + robotRect.height &&
            randomY + 10 > robotY
        );

        if (isColliding) {
            robot.style.display = 'none';
            robot.style.backgroundImage = "url('assets/images/ex.gif')";
            robot.style.backgroundSize = "cover";
            robot.style.backgroundRepeat = "no-repeat";
            robot.style.position = "absolute";
        }
    });
}



let points = 0;

function updatePoints() {
    const pointContainer = document.querySelector(".point h3");
    if (pointContainer) {
        pointContainer.textContent = `Points: ${points}`;
    }
}

function addRobots(count) {
    const unitContainer = document.querySelector(".unit .safelayer");

    if (!unitContainer) {
        console.error("The container '.unit .safelayer' does not exist!");
        return;
    }

    const robotStyles = [
        {
            className: "robot",
            src: "assets/images/ro.gif",
            top: "20%",
            left: "50%",
            width: "100px",
            position: "absolute",
            height: "auto",
            marginLeft: "25px",
            cursor: "crosshair",
            zIndex: "2"
        },
        {
            className: "robot1",
            src: "assets/images/ro1.gif",
            top: "10%",
            left: "5%",
            width: "100px",
            position: "absolute",
            height: "auto",
            marginLeft: "25px",
            cursor: "crosshair",
            zIndex: "2"
        },
        {
            className: "robot3",
            src: "assets/images/ro3.gif",
            top: "50%",
            left: "5%",
            width: "100px",
            position: "relative",
            height: "auto",
            marginLeft: "25px",
            cursor: "crosshair",
            zIndex: "2"
        },
        {
            className: "robot4",
            src: "assets/images/ro4.gif",
            top: "50%",
            left: "40%",
            width: "100px",
            position: "absolute",
            height: "auto",
            marginLeft: "25px",
            cursor: "crosshair",
            zIndex: "2"
        }
    ];

    for (let i = 0; i < count; i++) {
        robotStyles.forEach(style => {
            const newRobot = document.createElement("img");
            newRobot.classList.add(style.className);
            newRobot.src = style.src;
            newRobot.alt = "robot";

            newRobot.style.top = style.top;
            newRobot.style.left = style.left;
            newRobot.style.width = style.width;
            newRobot.style.position = style.position;
            newRobot.style.height = style.height;
            newRobot.style.marginLeft = style.marginLeft;
            newRobot.style.cursor = style.cursor;
            newRobot.style.zIndex = style.zIndex;

            unitContainer.appendChild(newRobot);
        });
    }
}
