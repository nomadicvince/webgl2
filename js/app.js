// WebGL2 Example based on lessons from webgl2fundamentals

  "use strict";

var vs = `#version 300 es
in vec2 a_position;

uniform mat3 u_matrix;

void main() {
  // Multiply the position by the matrix.
  gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0, 1);
}`;

var fs = `#version 300 es
precision mediump float;

uniform vec4 u_color;

out vec4 outColor;

void main() {
   outColor = u_color;
}`;

function mainApp() {
  // Get A WebGL context
  /** @type {HTMLCanvasElement} */
  var canvas = document.getElementById("webCanvas");
  var gl = canvas.getContext("webgl2");
  if (!gl) {
    return;
  }

  // setup GLSL program
  var program = webglUtils.createProgramFromSources(gl, [vs, fs]);

  // look up where the vertex data needs to go.
  var positionAttributeLocation = gl.getAttribLocation(program, "a_position");

  // lookup uniforms
  var colorLocation = gl.getUniformLocation(program, "u_color");
  var matrixLocation = gl.getUniformLocation(program, "u_matrix");

  // Create a buffer and put a 2 points in it for 1 line
  var positionBuffer = gl.createBuffer();

  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  var positions = [
    0.0, 0.5,
   -0.5, -0.5,
    0.5, -0.5
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  // Create a vertex array object (attribute state)
  var vao = gl.createVertexArray();

  // and make it the one we're currently working with
  gl.bindVertexArray(vao);

  // Turn on the attribute
  gl.enableVertexAttribArray(positionAttributeLocation);
  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  var size = 2;          // 2 components per iteration
  var type = gl.FLOAT;   // the data is 32bit floats
  var normalize = false; // don't normalize the data
  var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
  var offset = 0;        // start at the beginning of the buffer
  gl.vertexAttribPointer(
      positionAttributeLocation, size, type, normalize, stride, offset);

  requestAnimationFrame(drawScene);

  // Draw the scene.
  function drawScene(now) {
    resize(gl.canvas);

    now *= 0.001;  // convert to seconds

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Clear the canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Tell it to use our program (pair of shaders)
    gl.useProgram(program);

    // Bind the attribute/buffer set we want.
    gl.bindVertexArray(vao);

    // Compute the matrices
    var matrix = m3.rotation(now);

    // Set the matrix.
    gl.uniformMatrix3fv(matrixLocation, false, matrix);

    // Draw in Green
    gl.uniform4fv(colorLocation, [.456, 0.679, 0.380, 1]);

    // Draw the triangle
    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 3;
    gl.drawArrays(primitiveType, offset, count);

    requestAnimationFrame(drawScene);
  }
}

function resize(canvas) {
  var cssToRealPixels = window.devicePixelRatio || 1;

  // Lookup the size the browser is displaying the canvas in CSS pixels
  // and compute a size needed to make our drawingbuffer match it in
  // device pixels.
  var displayWidth  = Math.floor(canvas.clientWidth  * cssToRealPixels);
  var displayHeight = Math.floor(canvas.clientHeight * cssToRealPixels);

  // Check if the canvas is not the same size.
  if (canvas.width  !== displayWidth ||
      canvas.height !== displayHeight) {

    // Make the canvas the same size
    canvas.width  = displayWidth;
    canvas.height = displayHeight;
  }
}

mainApp();
