function main() {
    const canvas = document.querySelector("#c");
    const gl = canvas.getContext("webgl");

    if (!gl) {
        throw new Error("WebGL not supported");
    }

    const positionBuffer = gl.createBuffer();
    const colorBuffer = gl.createBuffer();

    var vertexShaderSource = document.querySelector("#vertex-shader-2d").text;
    var fragmentShaderSource = document.querySelector("#fragment-shader-2d").text;

    var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    var program = createProgram(gl, vertexShader, fragmentShader);

    gl.useProgram(program);

    const positionLocation = gl.getAttribLocation(program, `position`);
    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const colorLocation = gl.getAttribLocation(program, `color`);
    gl.enableVertexAttribArray(colorLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    let farolAceso = false;
    canvas.addEventListener("mousedown", mouseDown, false);

    loop(gl, positionBuffer, colorBuffer);

    function mouseDown(event) {
        console.log(event.screenX);
        console.log(event.screenY);
        loop(gl, positionBuffer, colorBuffer);
    }
}

function createShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }

    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }

    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}

function setRectangleVertices(gl, x, y, width, height) {
    var x1 = x;
    var x2 = x + width;
    var y1 = y;
    var y2 = y + height;
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]), gl.STATIC_DRAW);
}

function setRectangleColor(gl, color) {
    colorData = [];
    for (let triangle = 0; triangle < 2; triangle++) {
        for (let vertex = 0; vertex < 3; vertex++) colorData.push(...color);
    }
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);
}

function setCircleVertices(gl, n, radius, centerX, centerY) {
    // let center = [0.0, 0.0];
    let vertexData = [];
    for (let i = 0; i < n; i++) {
        vertexData.push(centerX, centerY);
        vertexData.push(
            centerX + radius * Math.cos((i * (2 * Math.PI)) / n),
            centerY + radius * Math.sin((i * (2 * Math.PI)) / n)
        );
        vertexData.push(
            centerX + radius * Math.cos(((i + 1) * (2 * Math.PI)) / n),
            centerY + radius * Math.sin(((i + 1) * (2 * Math.PI)) / n)
        );
    }
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);
}

function setCircleColor(gl, n, color) {
    colorData = [];
    for (let triangle = 0; triangle < n; triangle++) {
        for (let vertex = 0; vertex < 3; vertex++) colorData.push(...color);
    }
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);
}

function setTriangleVertices(gl, x1, y1, x2, y2, x3, y3) {
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([x1, y1, x2, y2, x3, y3]), gl.STATIC_DRAW);
}

function setTriangleColor(gl, color) {
    colorData = [];
    for (let vertex = 0; vertex < 3; vertex++) {
        colorData.push(...color);
    }
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);
}

function drawTriangle(gl, x1, y1, x2, y2, x3, y3, color, positionBuffer, colorBuffer) {
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    setTriangleVertices(gl, x1, y1, x2, y2, x3, y3);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    setTriangleColor(gl, color);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}

function drawPoints(gl, x1, y1, positionBuffer, colorBuffer) {
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([x1, y1]), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    let colorData = [];
    let color = [Math.random(), Math.random(), Math.random()];
    colorData.push(...color);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);
    gl.drawArrays(gl.POINTS, 0, 1);
}

function drawCircle(gl, n, radius, centerX, centerY, color, positionBuffer, colorBuffer) {
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    setCircleVertices(gl, n, radius, centerX, centerY);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    setCircleColor(gl, n, color);
    gl.drawArrays(gl.TRIANGLES, 0, 3 * n);
}

function drawRectangle(gl, x, y, width, height, color, positionBuffer, colorBuffer) {
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    setRectangleVertices(gl, x, y, width, height);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    setRectangleColor(gl, color);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function loop(gl, positionBuffer, colorBuffer) {
    const corCabelo = [Math.random(), Math.random(), Math.random()];
    const corChapeu = [0, 0.5, 0.5];
    const n = 30;

    //##cabelo
    //#lado direito
    drawCircle(gl, n, 0.15, 0.6, 0, corCabelo, positionBuffer, colorBuffer);
    drawCircle(gl, n, 0.2, 0.6, 0.2, corCabelo, positionBuffer, colorBuffer);
    drawCircle(gl, n, 0.15, 0.4, 0.3, corCabelo, positionBuffer, colorBuffer);
    //lado esquerdo
    drawCircle(gl, n, 0.15, -0.6, 0, corCabelo, positionBuffer, colorBuffer);
    drawCircle(gl, n, 0.2, -0.6, 0.2, corCabelo, positionBuffer, colorBuffer);
    drawCircle(gl, n, 0.15, -0.4, 0.3, corCabelo, positionBuffer, colorBuffer);

    //##rosto
    drawCircle(gl, n, 0.5, 0, 0, [0.9, 0.7, 0.63], positionBuffer, colorBuffer);

    //##chapéu
    drawRectangle(gl, -0.25, 0.35, 0.5, 0.15, corChapeu, positionBuffer, colorBuffer);
    drawCircle(gl, n, 0.075, 0.26, 0.425, corChapeu, positionBuffer, colorBuffer);
    drawCircle(gl, n, 0.075, -0.26, 0.425, corChapeu, positionBuffer, colorBuffer);
    drawTriangle(gl, 0.3, 0.4, 0, 0.8, -0.3, 0.4, corChapeu, positionBuffer, colorBuffer);
    drawCircle(gl, n, 0.05, 0, 0.8, [1, 0, 0], positionBuffer, colorBuffer);

    //##olhos
    //#parte branca
    drawCircle(gl, n, 0.07, 0.2, 0.1, [1, 1, 1], positionBuffer, colorBuffer);
    drawCircle(gl, n, 0.07, -0.2, 0.1, [1, 1, 1], positionBuffer, colorBuffer);

    //#iris
    drawCircle(gl, n, 0.04, 0.18, 0.07, [0.2, 0.6, 0.6], positionBuffer, colorBuffer);
    drawCircle(gl, n, 0.04, -0.18, 0.07, [0.2, 0.6, 0.6], positionBuffer, colorBuffer);

    //#pupila
    drawCircle(gl, n, 0.025, 0.17, 0.06, [0, 0, 0], positionBuffer, colorBuffer);
    drawCircle(gl, n, 0.025, -0.17, 0.06, [0, 0, 0], positionBuffer, colorBuffer);

    //##nariz
    drawCircle(gl, n, 0.1, 0, -0.08, [1, 0.1, 0.1], positionBuffer, colorBuffer);

    //##boca
    drawCircle(gl, n, 0.08, 0, -0.3, [0.9, 0.2, 0.2], positionBuffer, colorBuffer);
    drawCircle(gl, n, 0.03, 0, -0.3, [0, 0, 0], positionBuffer, colorBuffer);
}

main();
