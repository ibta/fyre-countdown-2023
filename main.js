// original shader: https://www.shadertoy.com/view/DsGGWD

import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 1;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// add an event listener for window resize (to update the camera and renderer)
window.addEventListener('resize', onWindowResize, false);

// add an event listener for mouse movement (to use mouse coordinates and update based on that)
window.addEventListener('mousemove', onMouseMove, false);


// original shader: https://www.shadertoy.com/view/DsGGWD
const material = new THREE.ShaderMaterial({
    uniforms: {
        time: { value: (Math.random() * 16) },
        resolution: { value: new THREE.Vector3() },
        mouse: { value: new THREE.Vector2() },
        aspectRatio: { value: (window.innerWidth / window.innerHeight) },
    },
    vertexShader:
        `
    void main() {
          gl_Position = vec4( position, 1.0 );
      }
    `,
    fragmentShader: `
    float rand(float n) {return fract(sin(n) * 43758.5453123);}

    uniform vec3 resolution;
    uniform float time;
    uniform vec2 mouse;

    void main() {
        vec2 mouse = (mouse.xy / resolution.xy);
        float ratio = resolution.y / resolution.x;
        vec2 uv = (gl_FragCoord.xy / resolution.xy);
        vec2 uv2 = (clamp(abs(uv), 0.8, 1.0) - 0.8) * 5.0;

        float r = 0.0005 * mix(1., 0., max(uv2.x,uv2.y));

        // could apply the ratio to either x or y it seems?
        uv.y *= ratio;
        float l = 0.0;
        for (float i=0.0; i<32.0; i+=1.0) {
            float r1 = rand(i);
            float r2 = rand(i*1.3);

            // how contained the fireflies will be -- 2.2 seems to be a good number for both mobile and desktop
            vec2 p = vec2(
            1.3 * r1 + 0.1 * cos(r1 * (time + i) + r1) - (mouse.x / floor(10.0 + i / 2.0) ),
            2. * r2 + 0.2 * sin(r2 * (time + i) + r2) - (mouse.y / floor(8.0 + i / 2.0) )
            ) - 0.1;
            float d = distance(uv * 1.2, p);
            l += pow(4.0*r/d*(sin(time+i)+1.),1.4);
        }

        gl_FragColor = vec4(vec3(1.0,0.7,0.0)*l,1.0);
    }
`
});

// set the resolution of the shader material
material.uniforms.resolution.value.set(renderer.domElement.clientWidth, renderer.domElement.clientHeight, 1);

// create the plane that the shader will be applied to
const geometry = new THREE.PlaneGeometry(2, 2);

// apply the shader material to the plane and add it to the scene
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// updates the mouse coordinates in the shader material uniforms
function onMouseMove(event) {
    material.uniforms.mouse.value.x = event.clientX;
    material.uniforms.mouse.value.y = event.clientY;
}

// updates the resolution/canvas size of the shader material uniforms
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    material.uniforms.resolution.value.set(renderer.domElement.clientWidth, renderer.domElement.clientHeight, 1);
}

// render the scene
function render() {
    // time value that dictates the speed of the animation (lower = slower)
    material.uniforms.time.value += 0.01;
    renderer.render(scene, camera);
}

// animate the scene
function animate() {
    requestAnimationFrame(animate);
    render(scene, camera);
}

// boom animate
animate();

