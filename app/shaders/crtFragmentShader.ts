// CRT fragment shader: barrel-distorts the scene and applies a green phosphor terminal look.
export const CRT_FRAGMENT_SHADER = `
uniform float uTime;

// Barrel distortion around the screen center, mimicking a curved CRT tube.
vec2 warp(vec2 uv) {
    vec2 cc = uv - 0.5;
    float dist = dot(cc, cc);
    return uv + cc * dist * 0.20;
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    vec2 distortedUv = warp(uv);

    // Pixels pushed outside the screen bounds by the warp become the monitor bezel.
    if (distortedUv.x < 0.0 || distortedUv.x > 1.0 || distortedUv.y < 0.0 || distortedUv.y > 1.0) {
        outputColor = vec4(0.01, 0.012, 0.01, 1.0);
        return;
    }

    vec4 texColor = texture(inputBuffer, distortedUv);

    // Luminance-only brightness so all scene color maps onto a single phosphor hue.
    float brightness = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));

    vec3 phosphorColor = vec3(0.2, 1.0, 0.3);
    vec3 baseScreenGlow = vec3(0.015, 0.03, 0.015);
    vec3 terminalColor = mix(baseScreenGlow, phosphorColor * 1.8, brightness);

    // Horizontal scanlines drifting over time.
    float scanline = sin(distortedUv.y * 650.0 + uTime * 5.0) * 0.05 + 0.95;
    terminalColor *= scanline;

    // Vignette from distance-to-edge, powered up for a sharper falloff.
    float vignette = distortedUv.x * distortedUv.y * (1.0 - distortedUv.x) * (1.0 - distortedUv.y);
    vignette = clamp(pow(16.0 * vignette, 0.25), 0.0, 1.0);
    terminalColor *= vignette;

    outputColor = vec4(terminalColor, 1.0);
}
`;
