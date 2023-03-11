"use strict";

import Transform from "./utils/transform.js";

class LightSource {
  constructor() {
    this.mXform = new Transform(); // WC position
    this.mModelSpaceXform = new Transform(); // Model-relative position
    this.mIsUsingWC = true;
    
    this.mColor = [1.0, 0.0, 1.0, 1.0];
    this.mFalloff = [0.5, 0.02, 0.001];

    this.mHasDiffuse = true;
    this.mHasSpec = true;
  }

  getXform() { return this.mXform; }

  getModelSpaceXform() { return this.mModelSpaceXform; }

  getColor() { return this.mColor; }
  setColor(color) { this.mColor = color; }

  getIntensity() { return this.mColor[3]; }
  setIntensity(newVal) {
    this.mColor[3] = this._clampVal(newVal, 0, 1);
  }
  IncIntensityBy(delta) {
    this.mColor[3] = this._clampVal(
      this.mColor[3] + delta, 0, 1
    );
  }
  
  getFalloff() { return this.mFalloff; }
  setFalloff(newVal) { this.mFalloff = newVal; }
  incFalloffBy(delta) {
    this.mFalloff[0] += delta[0];
    this.mFalloff[1] += delta[1];
    this.mFalloff[2] += delta[2];
  }

  _clampVal(val, min, max) {
    if (val < min) return min;
    if (val > max) return max;
    return val;
  }
}

export default LightSource;
