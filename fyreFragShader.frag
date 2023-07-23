// original shader: https://www.shadertoy.com/view/DsGGWD

precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
uniform float aspectRatio;

float rand(float n){return fract(sin(n) * 43758.5453123);}

void main() {
    //vec2 uv = gl_FragCoord.xy / (resolution.xy);
    vec2 uv = (gl_FragCoord.xy / resolution.xy) * 2.0 - 0.25;
    // uv -= 0.5;
    uv.x *= aspectRatio;
    //vec2 m = (mouse / resolution);
    vec2 m = (mouse / resolution) * 2.0 - 1.0;
    float l = 0.0;
    for(float i = 0.0; i < 32.0; i++){
        float r1 = rand(i);
        float r2 = rand(i*1.3);
        float speedFactor1 = rand(i*0.5);
        float speedFactor2 = rand(i*0.5);
        vec2 p = vec2(
            1.3 * r1 + 0.1 * cos(r1 * (time + speedFactor1 + i) + r1) - (m.x / floor(10.0 + i / 2.0) ),
            1.3 * r2 + 0.1 * sin(r2 * (time + speedFactor2 + i) + r2) - (m.y / floor(10.0 + i / 2.0) )
        );
        
        // scale factor of 0.3, distance of the camera
        float d = distance(uv * 0.25, p);
        
        // controls the size (and glow) of lil fireflies
        l += pow(0.0015 / pow(d, 1.1) * (sin(time + i) + 1.0), 1.2) * 0.5 * (1.0 + sin(time + i));

    }
    vec3 color = vec3(1.0, 1.0, 0.0) * l;
    gl_FragColor = vec4(color, 1.0);
}
