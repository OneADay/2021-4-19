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

        this.colors = [s.color(0, 155, 100), s.color(255, 155, 155), s.color(0, 0, 155)];

        //s.noLoop();
        s.background(0, 0, 0, 255);
    }

    protected draw(s) {
        if (this.animating) {

            this.delta += 0.05;

            let total = 20;
            for (let i = 0; i < total; i++) {
                let y = s.height / i;
                let height = (s.height / 2) / i;
                let color = s.lerpColor(this.colors[0], this.colors[2], i / total);
                this.drawShape(s, color, y, height);
            }
        }
    }

    public drawShape(s, color, posy, height) {
        let padding = 200;
        s.beginShape();
        s.noStroke();
        s.fill(color);
        var xoff = posy + this.delta + 100;

        for(var x=0; x<s.width + padding; x++){
          var y = posy + s.noise(xoff) * height;
          s.vertex(x,y)
          xoff += 0.005
        }
        
        s.vertex(s.width + padding, s.noise(xoff) * height);
        s.vertex(s.width + padding,0)
        s.vertex(0,0)
        
        s.endShape();
    }

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