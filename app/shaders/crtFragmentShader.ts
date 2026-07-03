// CRT fragment shader: subtle barrel distortion + green phosphor terminal look
// with drifting scanlines, VHS-style row glitch, and a dark retrace band that
// periodically rolls down the screen.
export const CRT_FRAGMENT_SHADER = `
uniform float uTime;

float hash(float n) {
    return fract(sin(n) * 43758.5453123);
}

// Subtle barrel distortion around the screen center, mimicking a curved CRT tube.
vec2 warp(vec2 uv) {
    vec2 cc = uv - 0.5;
    float dist = dot(cc, cc);
    return uv + cc * dist * 0.17;
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    vec2 distortedUv = warp(uv);

    // Pixels pushed outside the frame by the warp form the curved screen edge:
    // a dark gray band right at the image boundary, fading to true black
    // further out so the canvas blends seamlessly into the page background.
    vec2 outsideAmount = max(-distortedUv, distortedUv - 1.0);
    float outsideDist = max(outsideAmount.x, outsideAmount.y);
    if (outsideDist > 0.0) {
        float borderBlend = clamp(outsideDist / 0.16, 0.0, 1.0);
        outputColor = vec4(mix(vec3(0.014, 0.017, 0.014), vec3(0.0), borderBlend), 1.0);
        return;
    }

    // Retrace band: center travels from above the top (1.15) to below the
    // bottom (-0.15) so it never pops in/out visibly at the edges.
    float rollCycle = mod(uTime, 6.0);
    float rollProgress = rollCycle / 1.8;
    float band = 0.0;
    if (rollProgress < 1.0) {
        float bandCenter = 1.15 - rollProgress * 1.3;
        band = exp(-pow((distortedUv.y - bandCenter) * 14.0, 2.0));
        // The band drags the image sideways slightly, like a tracking tear.
        distortedUv.x += band * 0.006;
    }

    // VHS-style glitch: each scanline row jitters horizontally by a small
    // random amount, with occasional stronger bursts.
    float rowIndex = floor(distortedUv.y * 220.0);
    float frame = floor(uTime * 14.0);
    float rowNoise = hash(rowIndex * 3.7 + frame * 17.3) - 0.5;
    float burst = step(0.975, hash(frame * 7.1));
    distortedUv.x += rowNoise * (0.0004 + burst * 0.008);
    distortedUv.x = clamp(distortedUv.x, 0.0, 1.0);

    vec4 texColor = texture(inputBuffer, distortedUv);

    // Luminance-only brightness so all scene color maps onto a single phosphor hue.
    float brightness = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));

    vec3 phosphorColor = vec3(0.2, 1.0, 0.3);
    vec3 baseScreenGlow = vec3(0.015, 0.03, 0.015);
    vec3 terminalColor = mix(baseScreenGlow, phosphorColor * 1.8, brightness);

    // Horizontal scanlines drifting over time.
    float scanline = sin(distortedUv.y * 650.0 + uTime * 5.0) * 0.05 + 0.95;
    terminalColor *= scanline;

    // The retrace band darkens the image like the black roll bar on old sets.
    terminalColor *= 1.0 - band * 0.55;

    // Vignette from distance-to-edge, powered up for a sharper falloff.
    float vignette = distortedUv.x * distortedUv.y * (1.0 - distortedUv.x) * (1.0 - distortedUv.y);
    vignette = clamp(pow(16.0 * vignette, 0.25), 0.0, 1.0);
    terminalColor *= vignette;

    outputColor = vec4(terminalColor, 1.0);
}
`;
