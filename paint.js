const canvas = document.querySelector('canvas'),
toolBtns = document.querySelectorAll('.tool'),
fillColor = document.querySelector('#fill-color'),
sizeSlider = document.querySelector('#size-slider'),
colorBtns = document.querySelectorAll('.colors .option'),
colorPicker = document.querySelector('#color-picker'),
clearCanvas = document.querySelector('.clear-button'),
downloadImage = document.querySelector('.download-button'),
ctx = canvas.getContext('2d');

// Global Variables for Tool
let prevMouseX, prevMouseY, snapshot, 
isDrawing = false;
selectedTool = "Paint-Brush";
brushWidth = 5,
selectedColor = "#000";

const setCanvasBackground = (canvas) => {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = selectedColor;
}

window.addEventListener("load", () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBackground(canvas);
})

const drawRectangle = (e) => {
    if(fillColor.checked) {
        return ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    }
    ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
}

const drawCirle = (e) => {
    ctx.beginPath();
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2));
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
    ctx.stroke();
    // ctx.ellipse(e.offsetX, e.offsetY, Math.abs(prevMouseX - e.offsetX)/2, Math.abs(prevMouseY - e.offsetY)/2, 0, 0, 2 * Math.PI);
    if(fillColor.checked) {
        ctx.fill();
    } else {
        ctx.stroke();
    }
}

const drawTriangle = (e) => {
    ctx.beginPath();
    ctx.moveTo(prevMouseX, prevMouseY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);
    ctx.closePath();
    ctx.stroke();
    if(fillColor.checked) {
        ctx.fill();
    } else {
        ctx.stroke();
    }
}

const startDrawing = (e) => {
    isDrawing = true; // start drawing
    prevMouseX = e.offsetX;
    prevMouseY = e.offsetY; // remember previous mouse position
    ctx.beginPath(); // start a new path
    ctx.lineWidth = brushWidth; // set line width
    ctx.strokeStyle = selectedColor;
    ctx.fillStyle = selectedColor;
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height); 
};

const drawing = (e)=>{
    if(!isDrawing) return; // if not drawing, ignore event
    ctx.putImageData(snapshot, 0, 0); // redraw previous snapshot

    if(selectedTool === "Paint-Brush" || selectedTool === "Eraser") {
        ctx.strokeStyle = selectedTool === "Eraser" ? "#fff" : selectedColor;
     ctx.lineTo(e.offsetX,e.offsetY); // line creating
     ctx.stroke(); // drawing line with stroke
    } else if(selectedTool === "Rectangle") {
        drawRectangle(e);
    } else if(selectedTool === "Circle") {
        drawCirle(e);
    } else{
        drawTriangle(e);
    }
}

toolBtns.forEach(btn => {
    btn.addEventListener('click',()=>{
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedTool = btn.id; // set selected tool
        console.log(selectedTool);
    });
});

sizeSlider.addEventListener("change", () => {
    brushWidth = sizeSlider.value; // update brush width
    console.log(brushWidth);
});

colorBtns.forEach(btn => {
    btn.addEventListener('click',()=>{
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");
        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
    });
});

colorPicker.addEventListener("change",() => {
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
});

clearCanvas.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // clear canvas
    setCanvasBackground(canvas); // redraw canvas with background color
});

downloadImage.addEventListener("click", () => {
    const link = document.createElement('a');
    link.download = 'BuyCodeFromBhavu.png';  // `${Date.now()}BuyCodeFromBhavu.png`
    link.href = canvas.toDataURL('image/png');
    link.click();
}); 

canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mousedown", startDrawing);

canvas.addEventListener("mouseup", () => {
    isDrawing = false; // stop drawing
});

