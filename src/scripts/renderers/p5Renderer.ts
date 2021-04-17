import * as seedrandom from 'seedrandom';
import { BaseRenderer } from './baseRenderer';
import gsap from 'gsap';
import P5 from 'p5';

const srandom = seedrandom('b');

let noiseMax = 5;
let aoff = 0;

let grad;
let grad2;

export default class P5Renderer implements BaseRenderer{

    colors: any[];
    backgroundColor = '#FFFFFF';

    canvas: HTMLCanvasElement;
    s: any;


    completeCallback: any;
    delta = 0;
    animating = true;

    width: number = 1920 / 2;
    height: number = 1080 / 2;

    constructor(w, h) {

        this.width = w;
        this.height = h;

        const sketch = (s) => {
            this.s = s;
            s.setup = () => this.setup(s)
            s.draw = () => this.draw(s)
        }

        new P5(sketch);

    }

    protected setup(s) {
        let renderer = s.createCanvas(this.width, this.height);
        this.canvas = renderer.canvas;

        this.colors = [s.color(0, 155, 0), s.color(255, 155, 155), s.color(0, 0, 155)];

        grad = s.createGraphics(this.width * 2, this.height);
        grad2 = s.createGraphics(this.width * 2, this.height);

        //s.noLoop();
        s.background(0, 0, 0, 255);
    }

    protected draw(s) {

        if (this.animating) {
            this.delta += 0.1;

            s.blendMode(s.BLEND);
            s.noTint();
            s.background(0, 0, 0, 255);
            
            s.push();            
            //s.blendMode(s.ADD);
            //s.tint(255, 50, 200, 255); // Display at half opacity
            let colors2 = [s.color(0, 155, 0), s.color(255, 155, 155), s.color(0, 0, 155)];
            s.rotate(s.radians(-35));
            s.translate(-grad2.width / 2, 100);
            this.drawGradient(s, grad2, colors2);
            s.image(grad2, 0, 0, grad2.width, grad2.height);
            s.pop();

            s.push();            
            let colors = [s.color(155, 155, 0), s.color(0, 155, 155), s.color(0, 0, 155)];
            //this.distort(s, grad, 1000, 0.01, this.delta * 1000);
            s.rotate(s.radians(-35));
            s.translate(-grad.width / 2, 0);
            this.drawGradient(s, grad, colors);
            s.image(grad, 0, 0, grad.width, grad.height);
            s.pop();
        }

    }

    protected drawGradient(s, sourceImage, colors) {
        let x = 0;
        let y = 0;
        let w = sourceImage.width;
        let h = sourceImage.height;
        let c;
        let inter;

        for (let i = x; i <= x + w; i++) {
            if (i < (x + w) / colors.length) {
                inter = s.map(i, x, x + (w / colors.length), 0, 1);
                c = s.lerpColor(colors[0], colors[1], inter);
            } else {
                inter = s.map(i, x + (w / colors.length), x + w, 0, 1);
                c = s.lerpColor(colors[1], colors[2], inter);
            }
            sourceImage.stroke(c);
            console.log(this.delta);
            sourceImage.line(i, y, i, y + h - (s.sin(this.delta) * (h / 2)));
        }
    }

    /*
    protected distort(s, sourceImage, amount, scale, delta){
        let vectorField = [];
        //var amount = 1000;
        //var scale = 0.01;

        sourceImage.loadPixels();

        for (let x = 0; x < sourceImage.width; x++){
          let row = [];
          for (let y = 0; y < sourceImage.height; y++){
            let _xoffset;
            let _yoffset;
            if (delta > 0) {
                _xoffset = amount*(s.noise(scale*x,scale*y * 0.5*delta)-0.5);
                _yoffset = 4*amount*(s.noise((100+scale*x*delta),(scale*y * 0.5))-0.5);
            } else {
                _xoffset = amount*(s.noise(scale*x,scale*y * 0.5)-0.5);
                _yoffset = 4*amount*(s.noise((100+scale*x + this.delta),(scale*y * 0.5))-0.5);
            }

            let vector = s.createVector(_xoffset, _yoffset);
            row.push(vector);
          }
          vectorField.push(row);
        }
      
        let result = [];
        for (let j = 0; j < sourceImage.height; j++) {
            for (let i = 0; i < sourceImage.width; i++) {

            let res = vectorField[i][j];

            let ii = s.constrain(s.floor(i + res.x), 0, sourceImage.width - 1);
            let jj = s.constrain(s.floor(j + res.y), 0, sourceImage.height - 1);

            let source_i = (jj * sourceImage.width + ii) * 4;
            let col = s.color(
                sourceImage.pixels[source_i],
                sourceImage.pixels[source_i + 1],
                sourceImage.pixels[source_i + 2],
                sourceImage.pixels[source_i + 3]);

            result.push(col);
            }
        }

        for(let m = 0; m < sourceImage.height; m++) {
            for (let n = 0; n < sourceImage.width; n++) {

                let result_i = m * sourceImage.width + n;
                let target_i = result_i * 4;

                let col = result[result_i];
                sourceImage.pixels[target_i]     = s.red(col);
                sourceImage.pixels[target_i + 1] = s.green(col);
                sourceImage.pixels[target_i + 2] = s.blue(col);
                sourceImage.pixels[target_i + 3] = s.alpha(col);
            }
        }

        sourceImage.updatePixels(0, 0, this.width, this.height);
    }
    */

    public render() {

    }

    public play() {
        this.animating = true;
        setTimeout(() => {
            console.log('go');
            if (this.completeCallback) {
                this.completeCallback();
            }
        }, 10000);
    }

    public stop() {
        this.animating = false;
    }

    public setCompleteCallback(completeCallback: any) {
        this.completeCallback = completeCallback;
    }

    public resize() {
        this.s.resizeCanvas(window.innerWidth, window.innerHeight);
        this.s.background(0, 0, 0, 255);
    }
}