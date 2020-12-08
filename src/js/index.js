/***problems 
1. when zooming the images, the canvas is weird 
2. add notification when it is saved - DONE 12/7/2020
3. set the time when the image is stored? - DONE 12/7/2020
4. add tags and timestamp the image 
5. drag and clear 
6. able to delete post? // only administrator me can delete it 
7. fix the touchmove ev preventdefault here - couldn't 12/7/2020
***/

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
let ctx = canvas.getContext("2d");
let zVal=0;
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

let upload = document.getElementById("upload");
let posts = document.getElementById("posts");
let title = document.getElementById("title");
//click on post to see the full image 
// can delete it as well 
// let bg = document.getElementById("bg");
let text = document.getElementById("text");
// let draw = document.getElementById("draw");
// let save = document.getElementById("save");
let trash = document.getElementById("trash");
let appDiv = document.getElementById('app');
// getPosts();
let image;
let postCol = document.getElementById("postCol");
let savedText = document.getElementById("savedText");

render();

savedText.innerHTML = "";
posts.addEventListener("click", function () {

  //reset everything 
  savedText.innerHTML = "";
  removeAllAppDiv();
render();
  getPosts();
  zVal=0;

  console.log("working?")

  if (title.innerHTML == `        <h1>Moods Journal by <a href="https://www.yitingliu.com/"> Yiting Liu</a> | <a href="https://github.com/YitingLiu97/moods">code</a> </h1> 
  `) {
    title.innerHTML = `        <h1>Sacred Collections by <a href="https://www.yitingliu.com/"> Yiting Liu</a> | <a href="https://github.com/YitingLiu97/moods">code</a> </h1> 
      `; //change Moods to Collections
    postCol.style.display = "grid";
    document.body.style.overflowY = "visible";

  } else {
    title.innerHTML = `        <h1>Moods Journal by <a href="https://www.yitingliu.com/"> Yiting Liu</a> | <a href="https://github.com/YitingLiu97/moods">code</a> </h1> 
  `; //change to Moods
    postCol.style.display = "none";
    document.body.style.overflowY = "hidden";
  }

  //hover on to each div will show your the full picture 
  //can return to the collections page or add a new one? 
});

let recentID;
let borderS;
let recentIDContent;

let id, idArr;
// fetch posts from server
function getPosts() {

  //show collections of the saved images 
  fetch("/posts", {
      method: "GET"
    }).then(res => res.json())
    .then(response => {
      // shows chronologically but how to highlight the recent one?
      let images_html = response
        .map(file_url => {
          // converting 2020-10-20-13-12-10.png to 2020-10-20 13:12:10 - need to format in server.js as [let month = ("0" + idTime.getMonth()).slice(-2);]
          id = file_url.replace(".png", "");
          idArr = id.split('-');
          recentIDContent = `${idArr[0]}/${idArr[1]}/${idArr[2]} ${idArr[3]}:${idArr[4]}:${idArr[5]}`;

          return `<div>
          <img style=${borderS} src="uploaded/${file_url}">
          <p> ${recentIDContent} </p>
          </div>`;
        })
        .join("\n");
      //create a new page
      postCol.innerHTML = images_html;

    });
}



//open the image when it is clicked - DONE 
//tutorial: https://eloquentjavascript.net/15_event.html
postCol.addEventListener("click", e => {
  console.log(e.target.src);

  let url = e.target.src;
  //open a new page to check
  if (url) {
    var win = window.open(url, '_blank');
    win.focus();
  }
});
postCol.addEventListener("touch", e => {
  console.log(e.target.src);

  let url = e.target.src;
  //open a new page to check
  if (url) {
    var win = window.open(url, '_blank');
    win.focus();
  }
});


//UPLOAD CANVAS TO SERVER - DONE 
upload.addEventListener("click", e => {
  //to save the image, has to use the allowTaint and useCORS from GIT: https://github.com/niklasvh/html2canvas/issues/722
  html2canvas(document.body, {
    logging: true,
    letterRendering: 1,
    allowTaint: false,
    useCORS: true
  }).then(canvas => {
    document.body.appendChild(appDiv);
    let payload = {
      image: canvas.toDataURL("image/png"),
      crossorigin: "anonymous"
    };
    fetch("/upload", {
      method: "POST",
      body: JSON.stringify(payload), // data can be `string` or {object}!
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => res.json()).then(response => {
      console.log("Success:", JSON.stringify(response));
      id = JSON.stringify(response.id);
      recentID = `${id}.png`;
      //highlight the recen id thing- scroll to recent id? 
    }).then(function () {
      savedText.innerHTML = 'mood saved.'

      console.log("saved?")
      // changeTitle();
      removeAllAppDiv();
      getPosts();
      postCol.style.display = "grid";
      zVal=0;

      // removeAllAppDiv();
    });



  });
});



let draggable = false;
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
  draggable = true;

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
trash.addEventListener("click", function () {
  let counter = 0;

  if (counter < appDiv.childElementCount) {

    appDiv.children[appDiv.childElementCount - 1 - counter].remove();

  } else {
    counter = 0;
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
  // console.log("input selected?")
  const curFiles = input.files;
  if (curFiles.length === 0) {
    console.log('No files currently selected for upload');

  } else {

    for (const file of curFiles) {
      if (validFileType(file)) {
        image = document.createElement('img');
        image.src = URL.createObjectURL(file);

        zVal++;
        appDiv.innerHTML += `
        <img  crossorigin="anonymous"
        class="draggable" style="overflow:visible;left:${window.innerWidth / 2 + Math.random() * 50}px;
        top:${window.innerHeight / 2 + Math.random() * 50}px;
        z-index:${zVal};"
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

// show newly added things on top 

//draw to canvas 
let fonts = ["'Finger Paint', cursive", "'Caveat Brush', cursive", "'Finger Paint', cursive", "'Nanum Brush Script', cursive", "'Raleway Dots', cursive", "'Reenie Beanie', cursive", "'Rye', cursive", "'Vast Shadow', cursive"]


text.addEventListener("click", function () {
 
 zVal++;
  appDiv.innerHTML += `<h2 class="draggable"
  contenteditable
  style="left:${window.innerWidth / 2 + Math.random() * 50}px;
          top:${window.innerHeight / 2 + Math.random() * 50}px;
          z-index:${zVal};
          font-family:${fonts[Math.abs(norm_random(fonts.length-1).toFixed(0))]};"               
          >
  I feel ...
  </h2>
  `;



  // console.log(Math.abs(norm_random(fonts.length-1).toFixed(0)));
});

text.addEventListener("touch", function () {

  zVal++;
  appDiv.innerHTML += `
  <h2 class="draggable"
  contenteditable
  style="left:${window.innerWidth / 2 + Math.random() * 50}px;
          top:${window.innerHeight / 2 + Math.random() * 50}px;
          z-index:${zVal};
          font-family:${fonts[Math.abs(norm_random(fonts.length-1).toFixed(0))]};"               
          >
  I feel ...
  </h2>
  `;


});

function removeAllAppDiv() {
  while (appDiv.firstChild) {
    appDiv.removeChild(appDiv.lastChild);
  }
}

function norm_random(size) {
  return (Math.random() - 0.5) * size;
}


function render() {

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = `rgba(${Math.random()*255},${Math.random()*255},${Math.random()*255},0.3)`;
  ctx.globalAlpha = 0.5; //could be performance piece 
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// change background on canvas - allow webcam and access to your gallery?



//save everything into an image - can change the size of the image? - ask max 


//COMMENT THIS OUT - CANVAS DRAWING
/*******

//basic touch events 



let penDown = false;
let last_x = 0;
let last_y = 0;
let clear = document.getElementById("clear");
let click = "left";

//remove all appDiv elements 
//reset canvas 

// clear.addEventListener("click", function () {

//   removeAllAppDiv();
//   render();

// })
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


// clear.addEventListener("click", function () {
//     render();
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
// })

render();


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
  e.stopPropagation();
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

****/

// save.addEventListener("click", function () {
//     console.log("save!");
//     //draw everything onto the bg image and save it 
//     canvas.toBlob(function (blob) {
//         saveAs(blob, "moods_jounral.png");
//     });
// })
