"use strict";

import * as glSys from "../core/gl.js";
import TextureShader from "./texture_shader.js";

class NormalMapShader extends TextureShader {
  constructor(vertexShaderPath, fragmentShaderPath) {
    // Call super class constructor
    super(vertexShaderPath, fragmentShaderPath); // call SimpleShader constructor

    let gl = glSys.get();

    this.mTextureRef = gl.getUniformLocation(
      this.mCompiledShader,
      "textureSampler"
    );

    this.mNormalRef = gl.getUniformLocation(
      this.mCompiledShader,
      "normalSampler"
    );

    this.mCameraPosRef = gl.getUniformLocation(
      this.mCompiledShader,
      "uCameraPos"
    );

    this.mLightPosRef = gl.getUniformLocation(
      this.mCompiledShader,
      "uLightPos"
    );

    this.mLightIntensityRef = gl.getUniformLocation(
      this.mCompiledShader,
      "uIntensity"
    );
  }

  activate(pixelColor, trsMatrix, camera, light) {
    // first call the super class' activate
    super.activate(pixelColor, trsMatrix, camera.getCameraMatrix());

    // now our own functionality: enable texture coordinate array
    let gl = glSys.get();

    // bind uSampler to texture 0
    gl.uniform1i(this.mTextureRef, 0); // texture.activateTexture() binds to Texture0
    gl.uniform1i(this.mNormalRef, 1);

    let cameraVec4 = camera.getCameraPosVector();
    gl.uniform3fv(
      this.mCameraPosRef,
      vec3.fromValues(cameraVec4[0], cameraVec4[1], cameraVec4[2])
    );
    gl.uniform3fv(this.mLightPosRef, light.getXform().mPosition);
    gl.uniform1f(this.mLightIntensityRef, light.mIntensity);
  }
}

export default NormalMapShader;
