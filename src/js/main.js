import {
    distance,
    scale,
    add,
    sub,
    angle,
    magnitude,
    pointsAlongLine,
} from "./vector.js";

import {
    saveAs
} from './fileSaver.js';


import {} from "./draggable.js";
// position randomly
let draggables = document.querySelectorAll(".draggable");
draggables.forEach((element) => {
    let bounds = element.getBoundingClientRect();
    element.style.left =
        bounds.width / 2 +
        Math.random() * (window.innerWidth - bounds.width) +
        "px";
    element.style.top =
        bounds.height / 2 +
        Math.random() * (window.innerHeight - bounds.height) +
        "px";
});



let bg = document.getElementById("bg");
let text = document.getElementById("text");
let draw = document.getElementById("draw");
let save = document.getElementById("save");
let trash = document.getElementById("trash");
let appDiv = document.getElementById('app');

//draw text onto canvas 

//draw text input on canvas 
//inspo: https://thefutureofmemory.online/hanzi-maker/

let roseURL = "https://images.pexels.com/photos/736230/pexels-photo-736230.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"

// let picture = document.getElementById("picture");

//return could not GET error 
// function getPic(e) {
//     var fileInput = e.target.files;
//     if (fileInput.length > 0) {
//         var windowURL = window.URL || window.webkitURL;
//         var picURL = windowURL.createObjectURL(fileInput[0]);
// console.log(picURL)
//         var newPic = new Image();
//         newPic.onload = function () {
//             ctx.drawImage(newPic, 20, 20, 500, 400);
//             newPic.src = picURL;
//             windowURL.revokeObjectURL(picURL);
//         }
//     }


// }


//draw to canvas 



picture.addEventListener("change", function (e) {
    getPic(e);
});

bg.addEventListener("click", function () {
    appDiv.innerHTML += `
    <image crossorigin="anonymous"
     class="draggable"
     src=${roseURL}
     style="left:${window.innerWidth / 2 + Math.random() * 50}px;
            top:${window.innerHeight / 2 + Math.random() * 50}px;" />
    `;
});

bg.addEventListener("touchstart", function () {
    appDiv.innerHTML += `
    <image crossorigin="anonymous"
     class="draggable"
     src=${roseURL}
     style="left:${window.innerWidth / 2 + Math.random() * 50}px;
            top:${window.innerHeight / 2 + Math.random() * 50}px;" />
    `;
});


text.addEventListener("click", function () {
    appDiv.innerHTML += `
    <h1 class="draggable"
    contenteditable
    style="left:${window.innerWidth / 2 + Math.random() * 50}px;
            top:${window.innerHeight / 2 + Math.random() * 50}px;
            "          
            >
    :)
    </h1>
    `;
});

text.addEventListener("touchstart", function () {

    appDiv.innerHTML += `
    <h1 class="draggable"
    contenteditable
    style="left:${window.innerWidth / 2 + Math.random() * 50}px;
            top:${window.innerHeight / 2 + Math.random() * 50}px;
        "          
            >
    :)
    </h1>
    `;
});


//touch location determins the placement of the text


// draw on canvas 


// change background on canvas - allow webcam and access to your gallery?



//save everything into an image - can change the size of the image? - ask max 






//basic touch events 
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let pixelRatio = 1.5;
canvas.width = window.innerWidth * pixelRatio;
canvas.height = window.innerHeight * pixelRatio;
let p1 = {
    x: canvas.width / 2.5,
    y: canvas.height / 2.5
};
let p2 = {
    x: canvas.width / 4,
    y: canvas.height / 4
};

let penDown = false;
let last_x = 0;
let last_y = 0;
let clear = document.getElementById("clear");
let click = "left";

canvas.addEventListener("mousemove", function (e) {

    if (click == "left") {
        p1 = {
            x: e.clientX * pixelRatio,
            y: e.clientY * pixelRatio
        };
    }


    render();
    drawLine();
    middleCircle();

    if (click == "right") {
        p2 = {
            x: e.clientX * pixelRatio,
            y: e.clientY * pixelRatio
        };
    }

    paintMove(p1.x, p1.y, p2.x, p2.y)


});

canvas.addEventListener("touchmove", function (e) {
    e.preventDefault();
    let touches = Array.from(e.touches);

    let touch = touches[0];
    p1 = {
        x: touch.clientX * pixelRatio,
        y: touch.clientY * pixelRatio
    };

    touch = touches[1];

    if (touch) {
        p2 = {
            x: touch.clientX * pixelRatio,
            y: touch.clientY * pixelRatio
        };


    }

    render();

    drawLine();
    paintMove(p1.x, p1.y, p2.x, p2.y)
    // middleCircle();


});

function render() {

    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = `rgba(${Math.random()*255},${Math.random()*255},${Math.random()*255},0.3)`;
    ctx.globalAlpha = 0.5; //could be performance piece 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// clear.addEventListener("click", function () {
//     render();
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
// })

render();

function norm_random(size) {
    return (Math.random() - 0.5) * size;
}

// draw a line between  two touch points 
// angle determines thickness
function drawLine() {

    let thick = (angle(p1) + angle(p2)) / 2;
    ctx.lineWidth = 5 * thick;
    ctx.beginPath();
    ctx.fillStyle = `hsl(240,90%,60%)`;
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();

}

function paintStart(x, y) {
    penDown = true;
    last_x = x;
    last_y = y;

}
let effects = ["soft-light", "difference", "exclusion", "luminosity", "color-burn"];
let index = 0;
let effectsBtn = document.getElementById("bg");
ctx.globalCompositeOperation = effects[0];

effectsBtn.addEventListener("click", function () {
    ctx.globalCompositeOperation = effects[index % effects.length];
    index++;
    effectsBtn.innerHTML = effects[index % effects.length];
})

function paintMove(x, y, x2, y2) {


    penDown = true;
    let rate = 20;
    // let changingCol = `rgba(${x%255},${y%255},${(x2+y2)%255},0.2)`;

    let interpolatedPoints = pointsAlongLine(x, y, x2, y2, rate);

}

function paintEnd(x, y) {
    pushState();
    console.log("push state: paint end")

}


//size of every element depends on distance between two fingers 
function middleCircle() {

    let length = distance(p1, p2);

    let pDifference = sub(p1, p2);

    pDifference = scale(pDifference, 0.5);
    // let p3 = add(p1, pDifference);


}



// undo and clear
let restore = document.getElementById("back");

let undoStack = [];
pushState();

// restore.addEventListener("click", undo);

function undo() {
    console.log("undo clicked")
    if (undoStack.length > 1) {
        undoStack.pop();
    }
    let lastElemeent = undoStack[undoStack.length - 1];
    ctx.putImageData(lastElemeent, 0, 0);
}

function pushState() {
    undoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));

    if (undoStack.length > 50) {
        undoStack.shift();
    }
}


canvas.addEventListener("mouseout", function (evt) {
    penDown = false;
});
canvas.addEventListener("mouseup", function (evt) {
    penDown = false;
    let x = evt.clientX * pixelRatio;
    let y = evt.clientY * pixelRatio;
    paintEnd(x, y);
});


canvas.addEventListener("touchend", function (evt) {
    penDown = false;
    let x = evt.clientX * pixelRatio;
    let y = evt.clientY * pixelRatio;
    paintEnd(x, y);
});

//disable right click context menu 
canvas.oncontextmenu = function (e) {
    e.preventDefault();
    // e.stopPropagation();
}

canvas.addEventListener("mousedown", function (e) {
    paintStart(e.clientX, e.clientY);

    if (e.button == 2) {
        click = "right";
        console.log("right click")
    } else {
        click = "left";
        console.log("left click")

    }

});


save.addEventListener("click", function () {
    console.log("save!");
    //draw everything onto the bg image and save it 
    canvas.toBlob(function (blob) {
        saveAs(blob, "drawing.png");
    });
})
