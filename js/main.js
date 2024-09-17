import Renderer from "./renderer.js";

// Main elements
const canvas = document.getElementsByTagName("canvas")[0];
const nav = document.getElementsByTagName("nav")[0];
const renderer = new Renderer();

// Set canvas size (or resize in case of change in screenwidth)
function resizeCanvas(){
    canvas.setAttribute("width", canvas.offsetWidth);
    canvas.setAttribute("height", canvas.offsetHeight);
}
window.addEventListener("resize", resizeCanvas);

// Check url for selected item
let selectedItem;
function loadSelectionFromUrl(){
    let url = window.location.href;
    if (url.includes("#")){
        url = url.split("#");
        selectedItem = decodeURIComponent(url[url.length - 1]);
    } else {
        selectedItem = Object.keys(renders)[0];
    }
    applySelection();
}

// Import new image array to renderer
function applySelection(){
    renderer.directory = selectedItem;
    renderer.imageArray = renders[selectedItem];
}

// Framerate logic
const input = document.getElementById("framerate");
let framerate = input.value;
input.addEventListener("change", () => {
    framerate = input.value;
});

// Animation loop logic
let currentFrame, startTime = Date.now();

function loop(){
    let elapsed = Date.now() - startTime;
    renderer.Draw();

    if (!renderer.loading && elapsed > (1000 / framerate)){
        if (!manual)
            renderer.currentImage++;
        startTime = Date.now();
    }
    currentFrame = requestAnimationFrame(loop);
}

// Clear navigation
function clearActive(){
    let navElems = document.getElementsByTagName("a");
    for (let elem of navElems){
        elem.classList.remove("active");
    }
}

// Click event for navs
function handleClick(e){
    clearActive();
    this.classList.add("active");
    selectedItem = this.innerText;
    applySelection();
}

// Create navigation
function buildNav(){
    for(const property in renders){
        let item = document.createElement("a");
        item.setAttribute("href", "#" + property);
        item.innerText = property;
        if (property == selectedItem)
            item.classList.add("active");
        item.addEventListener("click", handleClick);
        nav.appendChild(item);
    }
}

// Start sequence
window.addEventListener("load", () => {
    resizeCanvas();
    loadSelectionFromUrl();
    buildNav();
    loop();
});

// Click and drag logic (manual control over animation flow)
let manual = false, startX, startImage;
canvas.addEventListener("mousedown", (e) => {
    if (!renderer.loading){
        startX = e.clientX - canvas.getBoundingClientRect().left;
        startImage = renderer.currentImage;
        manual = true;
        canvas.style.cursor = "ew-resize";
    }
});
canvas.addEventListener("mousemove", (e) => {
    if (manual){
        let currentX = e.clientX - canvas.getBoundingClientRect().left,
            distance = currentX - startX;
        
        // threshold for switching images
        let threshold = (canvas.width / renderer.max) * 0.2;
        if (Math.abs(distance) >= threshold){
            renderer.currentImage += Math.sign(distance);
            startX = currentX;
        }
    }
});
window.addEventListener("mouseup", () => {
    manual = false;
    canvas.style.cursor = renderer.loading ? "default" : "grab";
});



