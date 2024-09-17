export default class Renderer 
{
    // Image props
    current; max; images;

    // Normalize current image (circle from last position to first)
    set currentImage(value){
        this.current = value;
        if (this.current > this.max - 1){
            this.current = 0;
        } else if (this.current < 0){
            this.current = this.max - 1;
        }
        console.log(this.current);
    }
    get currentImage() {
        return this.current;
    }

    // First set directory name, then set array of images
    directory; loaded; loading;

    set imageArray(value){
        // while loading, reset cursor style
        this.canvas.style.cursor = "default";

        // reset current position & max
        this.current = 0;
        this.max = value.length;

        // start loading images
        this.images = [];
        this.loaded = 0;
        this.loading = true;

        for (let entry of value){
            let img = new Image();
            img.onload = () => this.Loaded();
            img.src = `renders/${this.directory}/${entry}`;
            this.images.push(img);
        }
    }

    // Signal loading of image has completed (separated to avoid 'this' mess)
    Loaded(){
        this.loaded++;
        if (this.loaded == this.max){
            this.loading = false;
            this.canvas.style.cursor = "grab";
        }
    }

    // Canvas props
    canvas = document.getElementsByTagName("canvas")[0];
    ctx = canvas.getContext("2d");

    Draw(){
        let ctx = this.ctx, canvas = this.canvas;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (this.loading){
            ctx.font = "20px serif";
            ctx.fillStyle = "black";

            const line1 = ctx.measureText("loading"),
                  line2 = ctx.measureText(this.loaded + "/" + this.max),
                  height = line1.actualBoundingBoxAscent + line1.actualBoundingBoxDescent;

            ctx.fillText("Loading", (canvas.width - line1.width) / 2, (canvas.height * 0.5) - (1.25 * height));
            ctx.fillText(this.loaded + "/" + this.max, (canvas.width - line2.width) / 2, canvas.height * 0.5 + 0.25 * height);

        } else {
            const img = this.images[this.current];
            
            // normalize image width & height
            let width = img.width, height = img.height;
            if (width > canvas.width){
                let ratio = img.width / canvas.width;
                width = canvas.width;
                height = height / ratio;
            }
            if (height > canvas.height){
                let ratio = height / canvas.height;
                height = canvas.height;
                width = width / ratio;
            }
            ctx.drawImage(img, (canvas.width - width) * 0.5, (canvas.height - height) * 0.5, width, height);
        }
    }


}