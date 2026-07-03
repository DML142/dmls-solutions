"use client";
import { forwardRef, useMemo } from "react";
import { CRTEffect } from "../effects/CRTEffect";

const CRTPostEffect = forwardRef<unknown, Record<string, unknown>>((props, ref) => {
  const effect = useMemo(() => new CRTEffect(), []);
  return <primitive ref={ref} object={effect} />;
});
CRTPostEffect.displayName = "CRTPostEffect";

export default CRTPostEffect;
