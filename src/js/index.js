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


let canvas = document.getElementById("canvas");
let upload = document.getElementById("upload");
let posts = document.getElementById("posts");

let bg = document.getElementById("bg");
let text = document.getElementById("text");
let draw = document.getElementById("draw");
let save = document.getElementById("save");
let trash = document.getElementById("trash");
let appDiv = document.getElementById('app');


// fetch posts from server
function getPosts() {
  fetch("/posts", {
      method: "GET"
    }).then(res => res.json())
    .then(response => {

      console.log("RESPONSE", response)
      let images_html = response
        .map(file_url => {
          return `<img src="uploaded/${file_url}">`;
        })
        .join("\n");
      posts.innerHTML = images_html;
    });
}

getPosts();


//UPLOAD CANVAS TO SERVER
upload.addEventListener("click", e => {

  html2canvas(document.body).then(canvas => {
    document.body.appendChild(canvas);
    document.body.appendChild(appDiv);

    let payload = {
      image: canvas.toDataURL("image/png"),
      // crossorigin:"anonymous"
    };


    fetch("/upload", {
      method: "POST",
      body: JSON.stringify(payload), // data can be `string` or {object}!
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => res.json()).then(response => {
      console.log("Success:", JSON.stringify(response));
      getPosts();
    });
  });
});

console.log(trash.style.width,"trash style")

let draggable =false;
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
    draggable=true;

});



// function dragStart(event) {
//   event.dataTransfer.setData("Text", event.target.id);
//   document.getElementById("demo").innerHTML = "Started to drag the p element";
// }

// function allowDrop(event) {
//   event.preventDefault();
// }

// function drop(event) {
//   event.preventDefault();
//   var data = event.dataTransfer.items;
//   data.forEach(e=>{
//     e.parentNode.removeChild(e);
//     console.log(e,'e');
//   })
// }
// function dragend_handler(ev) {
//   console.log("dragEnd");
//   var dataList = ev.dataTransfer.items;
//   for (var i = 0; i < dataList.length; i++) {
//     dataList.remove(i);
//   }
//   // Clear any remaining drag data
//   dataList.clear();
// }
  
// text.addEventListener("dragend",function(){
//   dragend_handler(trash);

// })

//click trash and delete one from appdiv
// more like a redo 
trash.addEventListener("click",function(){
let counter=0;

  if(counter<appDiv.childElementCount){

    appDiv.children[appDiv.childElementCount-1-counter].remove();

  }else{
    counter=0;
  }
  counter++;

})

//drop and clear - inspo https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/ondrop

// appDiv.addEventListener("drag",function(){
//   console.log(   appDiv.children[0].draggable);

// })

//drag to trash and delete the specific event 
// function dropToTrash(element,trash){
//   if(element.draggble)

// }
// dragg the element. if it on top of trash, delete the element 



//draw text onto canvas - change text fonts 

//draw text input on canvas 
//inspo: https://thefutureofmemory.online/hanzi-maker/

//get file input from phone and camera: https://github.com/mdn/learning-area/blob/master/html/forms/file-examples/file-example.html
const input = document.querySelector('input');

input.addEventListener("change", updateImageDisplay);

function updateImageDisplay() {
  const curFiles = input.files;
  if (curFiles.length === 0) {
    console.log('No files currently selected for upload');

  } else {

    for (const file of curFiles) {
      if (validFileType(file)) {
        let image = document.createElement('img');
        image.src = URL.createObjectURL(file);
        console.log(image.src)

        appDiv.innerHTML += `
        <img  crossorigin="anonymous"
        class="draggable" style="overflow:visible;left:${window.innerWidth / 2 + Math.random() * 50}px;
        top:${window.innerHeight / 2 + Math.random() * 50}px;"
        src=${image.src} alt="">
    
        `;
      } else {
        console.log(`File name ${file.name}: Not a valid file type. Update your selection.`);

      }
    }
  }
}

const fileTypes = [
  'image/apng',
  'image/bmp',
  'image/gif',
  'image/jpeg',
  'image/pjpeg',
  'image/png',
  'image/svg+xml',
  'image/tiff',
  'image/webp',
  `image/x-icon`
];

function validFileType(file) {
  return fileTypes.includes(file.type);
}
document.getElementById('bg').onclick = function () {
  document.getElementById('picture').click();
};
/* make the picture less res? 
function returnFileSize(number) {
  if(number < 1024) {
    return number + 'bytes';
  } else if(number > 1024 && number < 1048576) {
    return (number/1024).toFixed(1) + 'KB';
  } else if(number > 1048576) {
    return (number/1048576).toFixed(1) + 'MB';
  }
}
*/

//draw to canvas 
let fonts = ["'Finger Paint', cursive", "'Caveat Brush', cursive", "'Finger Paint', cursive", "'Nanum Brush Script', cursive", "'Raleway Dots', cursive", "'Reenie Beanie', cursive", "'Rye', cursive", "'Vast Shadow', cursive"]


text.addEventListener("click", function () {
  appDiv.innerHTML += `<h2 class="draggable"
  contenteditable
  style="left:${window.innerWidth / 2 + Math.random() * 50}px;
          top:${window.innerHeight / 2 + Math.random() * 50}px;
          
          font-family:${fonts[Math.abs(norm_random(fonts.length-1).toFixed(0))]};"               
          >
  I feel ...
  </h2>
  `;



  // console.log(Math.abs(norm_random(fonts.length-1).toFixed(0)));
});

text.addEventListener("touch", function () {

  appDiv.innerHTML += `
  <h2 class="draggable"
  contenteditable
  style="left:${window.innerWidth / 2 + Math.random() * 50}px;
          top:${window.innerHeight / 2 + Math.random() * 50}px;
          
          font-family:${fonts[Math.abs(norm_random(fonts.length-1).toFixed(0))]};"               
          >
  I feel ...
  </h2>
  `;


});


function deleteItem(){
  draggables.forEach((element) => {
    element.parentNode.removeChild(element);
  });
}

// trash.addEventListener("click",function(){
//   deleteItem();
// })
// draw on canvas 


// change background on canvas - allow webcam and access to your gallery?



//save everything into an image - can change the size of the image? - ask max 






//basic touch events 
// let canvas = document.getElementById("canvas");
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
  middleCircle();


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

// effectsBtn.addEventListener("click", function () {
//     ctx.globalCompositeOperation = effects[index % effects.length];
//     index++;
//     effectsBtn.innerHTML = effects[index % effects.length];
// })

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


// save.addEventListener("click", function () {
//     console.log("save!");
//     //draw everything onto the bg image and save it 
//     canvas.toBlob(function (blob) {
//         saveAs(blob, "moods_jounral.png");
//     });
// })
