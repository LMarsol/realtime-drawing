document.addEventListener('DOMContentLoaded', (event) => {

    const socket = io.connect();

    const drawer = {
        prevPos: null,
        pos: { x: 0, y: 0 },
        active: false,
        moving: false,
    };

    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');

    canvas.width = 700;
    canvas.height = 500;

    context.lineWidth = 10;
    context.strokeStyle = "red";

    socket.on('ondraw', (line) => {
        drawLine(line);
    });

    const drawLine = (line) => {
        context.beginPath();
        context.moveTo(line.prevPos.x, line.prevPos.y);
        context.lineTo(line.pos.x, line.pos.y);
        context.stroke();
    }

    canvas.onmousedown = (event) => { drawer.active = true };
    canvas.onmouseup = (event) => { drawer.active = false };
    canvas.onmousemove = (event) => {
        drawer.pos.x = event.clientX;
        drawer.pos.y = event.clientY;
        drawer.moving = true;
    };

    const listener = () => {
        if (drawer.active && drawer.moving && drawer.prevPos) {
            socket.emit('ondraw', { prevPos: drawer.prevPos, pos: drawer.pos })
                // drawLine({ prevPos: drawer.prevPos, pos: drawer.pos });
            drawer.moving = false;
        }

        drawer.prevPos = {...drawer.pos }
        setTimeout(listener, 10);
    };

    listener();
})