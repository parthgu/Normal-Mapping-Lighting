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

    this.mAmbientColorRef = gl.getUniformLocation(
      this.mCompiledShader,
      "uAmbientColor"
    );

    this.getGLUniformRefs1();
    this.getGLUniformRefs2();
  }

  activate(pixelColor, trsMatrix, camera, light) {
    // first call the super class' activate
    super.activate(pixelColor, trsMatrix, camera.getCameraMatrix());
    
    let gl = glSys.get();

    gl.uniform1i(this.mTextureRef, 0);
    gl.uniform1i(this.mNormalRef, 1);
    gl.uniform4fv(this.mAmbientColorRef, camera.mAmbientColor);

    gl.uniform1i(this.mHasDiffuseRef, light.mHasDiffuse);
    gl.uniform1i(this.mHasSpecRef, light.mHasSpec);
    gl.uniform3fv(this.mLightPosRef, light.getXform().getPosition());
    gl.uniform4fv(this.mLightColorRef, light.mColor);
    gl.uniform3fv(this.mFalloffRef, light.mFalloff);
  }

  getGLUniformRefs1() {
    let gl = glSys.get();

    this.mLightPosRef = gl.getUniformLocation(
      this.mCompiledShader,
      "uLightPos"
    );

    this.mLightColorRef = gl.getUniformLocation(
      this.mCompiledShader,
      "uLightColor"
    );

    this.mFalloffRef = gl.getUniformLocation(
      this.mCompiledShader,
      "uFalloff");

    this.mHasDiffuseRef = gl.getUniformLocation(
      this.mCompiledShader,
      "uHasDiffuse");

    this.mHasSpecRef = gl.getUniformLocation(
      this.mCompiledShader,
      "uHasSpec");
  }

  getGLUniformRefs2() {
    let gl = glSys.get();

    this.mLightPosRef2 = gl.getUniformLocation(
      this.mCompiledShader,
      "uLightPos2"
    );

    this.mLightColorRef2 = gl.getUniformLocation(
      this.mCompiledShader,
      "uLightColor2"
    );

    this.mFalloffRef2 = gl.getUniformLocation(
      this.mCompiledShader,
      "uFalloff2");

    this.mHasDiffuseRef2 = gl.getUniformLocation(
      this.mCompiledShader,
      "uHasDiffuse2");

    this.mHasSpecRef2 = gl.getUniformLocation(
      this.mCompiledShader,
      "uHasSpec2");
  }
}

export default NormalMapShader;
