"use strict";

import Transform from "./utils/transform.js";

class LightSource {
  constructor() {
    this.mXform = new Transform();
    this.mColor = [1.0, 1.0, 1.0];
    this.mIntensity = 1.0;
  }

  getXform() {
    return this.mXform;
  }

  getColor() {
    return this.mColor;
  }

  setColor(color) {
    this.mColor = color;
  }

  getIntensity() {
    return this.mIntensity;
  }

  setIntensity(factor) {
    this.mIntensity = factor;
    this._clampIntensity();
  }

  incIntensityBy(factor) {
    this.mIntensity += factor;
    this._clampIntensity();
  }

  _clampIntensity() {
    if (this.mIntensity > 3) this.mIntensity = 3;
    else if (this.mIntensity < 0) this.mIntensity = 0;
  }
}

export default LightSource;
