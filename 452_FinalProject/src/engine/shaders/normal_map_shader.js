"use strict";

import * as glSys from "../core/gl.js";
import TextureShader from "./texture_shader.js";

class NormalMapShader extends TextureShader {
  constructor(vertexShaderPath, fragmentShaderPath) {
    // Call super class constructor
    super(vertexShaderPath, fragmentShaderPath); // call SimpleShader constructor

    let gl = glSys.get();
    this.mNormalMapTextureRef = gl.getUniformLocation(
      this.mCompiledShader,
      "uNormalMapTexture"
    );
  }
}

export default NormalMapShader;
