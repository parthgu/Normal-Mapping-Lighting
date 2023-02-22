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

  setIntensity(factor) {
    this.mIntensity = factor;
  }

  incIntensityBy(factor) {
    this.mIntensity += factor;
  }

  getIntensity() {
    return this.mIntensity;
  }
}

export default LightSource;
