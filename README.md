# Pecten Render test
This is a small POC that will likely be used on https://www.pecten.be to showcase 3D models. The idea is to have images that provide a 360° view of the 3D model, which are then played in sequence to generate a rotating animation. 

### Why this instead of a simple video file?
We wanted to allow the user to interact with the animation by clicking and dragging. Clicking pauses the animation, dragging left or right moves the animation backwards or forwards. While this is also possible with a video file (with some js event handlers and creative use of stop & play methods), the end result is always clunky. Video files aren't designed to be through like this.

### Then why no true 3D library like Three.js?
To have full control over the shading (i.e. keep the high quality shading exported from blender) and the way the object moves (i.e. we only want the user to move horizontally).

### How does it work?
The project uses php to read the contents of the 'renders' directories. Any directories found there are saved as names of an object. These directories are the scanned for images. The names of the images are saved as an array, which is then but into an associative array with the directory name as key. This assoiciative array is then encoded to JSON and inserted into a script in the html head.

Next, javascript takes over. In main.js is the logic to show the images in sequence (they are drawn onto a canvas). The Renderer class provides the logic to load the images, switch which image is displayed, and draw it on the canvas.

### What will it be used for?
Because of large filesizes, this will most likely show up as a pop-up on https://www.pecten.be: the user gets a thumbnail of a 3D object; clicking it opens a modal where the entire image sequence is loaded and where the user can interact with the object.