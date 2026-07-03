import { Effect } from "postprocessing";
import { Uniform, WebGLRenderer, WebGLRenderTarget } from "three";
import { CRT_FRAGMENT_SHADER } from "../shaders/crtFragmentShader";

export class CRTEffect extends Effect {
  constructor() {
    super("CRTEffect", CRT_FRAGMENT_SHADER, {
      uniforms: new Map<string, Uniform>([["uTime", new Uniform(0)]]),
    });
  }

  update(renderer: WebGLRenderer, inputBuffer: WebGLRenderTarget | null, deltaTime: number): void {
    const uTime = this.uniforms.get("uTime");
    if (uTime) uTime.value += deltaTime;
  }
}
