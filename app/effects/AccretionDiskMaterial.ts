import { AdditiveBlending, DoubleSide, ShaderMaterial, Uniform } from "three";
import {
  ACCRETION_DISK_VERTEX_SHADER,
  ACCRETION_DISK_FRAGMENT_SHADER,
} from "../shaders/accretionDiskShader";

interface AccretionDiskOptions {
  innerRadius: number;
  outerRadius: number;
  intensity: number;
}

// Self-illuminated ring material shared by the accretion disk and the polar
// halo. Additive blending means black output is invisible, so the two rings
// overlap without alpha-sorting artifacts; depthWrite stays off so they
// never occlude each other, while depthTest (default on) still lets the
// opaque event-horizon sphere hide the halo's near side.
export class AccretionDiskMaterial extends ShaderMaterial {
  constructor({ innerRadius, outerRadius, intensity }: AccretionDiskOptions) {
    super({
      vertexShader: ACCRETION_DISK_VERTEX_SHADER,
      fragmentShader: ACCRETION_DISK_FRAGMENT_SHADER,
      uniforms: {
        uTime: new Uniform(Math.random() * 100),
        uInner: new Uniform(innerRadius),
        uOuter: new Uniform(outerRadius),
        uIntensity: new Uniform(intensity),
      },
      transparent: true,
      blending: AdditiveBlending,
      depthWrite: false,
      side: DoubleSide,
    });
  }

  update(delta: number): void {
    this.uniforms.uTime.value += delta;
  }
}
