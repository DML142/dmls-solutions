// Shared shader for the black hole's accretion disk and polar halo ring.
// Works in the ring's local XY plane: radius drives a white-hot -> amber
// gradient, angle drives both the flowing-gas streaks and a fixed
// brightness asymmetry (one side brighter, aping relativistic beaming in
// the reference image). All motion comes from uTime; the mesh itself
// never rotates.
export const ACCRETION_DISK_VERTEX_SHADER = `
varying vec2 vPos;

void main() {
    vPos = position.xy;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const ACCRETION_DISK_FRAGMENT_SHADER = `
uniform float uTime;
uniform float uInner;
uniform float uOuter;
uniform float uIntensity;

varying vec2 vPos;

void main() {
    float r = length(vPos);
    // 0 at the inner edge, 1 at the outer edge.
    float t = clamp((r - uInner) / (uOuter - uInner), 0.0, 1.0);
    float theta = atan(vPos.y, vPos.x);

    // Differential rotation: gas closer to the hole orbits faster, so the
    // angular offset grows as radius shrinks. Streaks are sums of sines in
    // (swirled angle, radius) space — inherently seamless in theta, unlike
    // value noise, which would show a hard seam at the +/-PI wraparound.
    float swirl = theta + uTime * (0.12 + 0.5 / max(r, 0.25));
    float streaks =
        0.55
        + 0.25 * sin(swirl * 9.0 + r * 14.0)
        + 0.20 * sin(swirl * 23.0 - r * 31.0 + uTime * 0.6);

    // Hottest right at the inner edge, falling off outward.
    float radial = pow(1.0 - t, 1.6);

    // Fixed left/right asymmetry: the approaching side of the disk appears
    // brighter to the viewer, so this stays anchored to screen-space angle
    // rather than swirling with the gas.
    float beaming = 1.0 + 0.7 * cos(theta);

    float edge = smoothstep(0.0, 0.07, t) * (1.0 - smoothstep(0.82, 1.0, t));

    float brightness = radial * (0.35 + 0.65 * streaks) * beaming * uIntensity;

    vec3 hot = vec3(1.0, 0.97, 0.90);
    vec3 cool = vec3(1.0, 0.55, 0.22);
    vec3 col = mix(hot, cool, smoothstep(0.12, 0.9, t));

    // Additive blending: output is pre-multiplied by brightness/edge, and
    // pushed past 1.0 so the core blows out under bloom like the photo.
    gl_FragColor = vec4(col * brightness * edge * 2.1, 1.0);
}
`;
