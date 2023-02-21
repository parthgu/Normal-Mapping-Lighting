"use strict";

import Transform from "./utils/transform";

class LightSource {
  constructor() {
    this.mXform = new Transform();
    this.mColor = [1.0, 1.0, 1.0];
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
}

export default LightSource;
