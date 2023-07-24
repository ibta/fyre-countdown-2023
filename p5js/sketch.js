let fyreShader;

function preload() {
  fyreShader = loadShader("fyreVertShader.vert", "fyreFragShader.frag");
  uniSansHeavy = loadFont("assets/uni-sans-heavy.otf");
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  textFont(uniSansHeavy);
}

// function windowResized() {
//   resizeCanvas(windowWidth, windowHeight);
// }

function draw() {
  background(0);
  fyreShader.setUniform("resolution", [width, height]);
  fyreShader.setUniform("aspectRatio", width / height);
  fyreShader.setUniform("mouse", [mouseX, mouseY]);
  fyreShader.setUniform("time", millis() / 1000.0);
  shader(fyreShader);
  rect(0, 0, width, height);
}
