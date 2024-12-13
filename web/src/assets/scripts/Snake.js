import { AcGameObject } from "./AcGameObject";
import { Cell } from "./Cell";

export class Snake extends AcGameObject {
    constructor(info, gamemap) {
        super();

        this.gamemap = gamemap;
        this.id = info.id;
        this.color = info.color;

        this.cells = [new Cell(info.r, info.c)]; // 存放蛇的身体，cells[0]存放蛇头

        this.speed = 5; // 蛇每秒移动5格
    }

    start() {

    }

    update_move() {
        
    }

    update() {
        this.update_move();
        this.render();
    }

    render() {
        const L = this.gamemap.L;
        const ctx = this.gamemap.ctx;

        ctx.fillStyle = this.color;
        for (const cell of this.cells) {
            ctx.beginPath();
            ctx.arc(cell.x * L, cell.y * L, L * 0.8 / 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}