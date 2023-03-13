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

    this.mActiveRef = null;
    this.mPosRef = null;
    this.mColorRef = null;
    this.mFalloffRef = null;
    this.mHasDiffuseRef = null;
    this.mHasSpecRef = null;

    // this.getGLUniformRefs1();
    // this.getGLUniformRefs2();
  }

  activate(pixelColor, trsMatrix, camera, lights) {
    // first call the super class' activate
    super.activate(pixelColor, trsMatrix, camera.getCameraMatrix());

    let gl = glSys.get();

    gl.uniform1i(this.mTextureRef, 0);
    gl.uniform1i(this.mNormalRef, 1);
    gl.uniform4fv(this.mAmbientColorRef, camera.mAmbientColor);

    let i = 0;
    for (i; i < 8; i++) {
      this.getUniforms(i);
      if (lights != null) {
        if (lights[i] == null) {
          gl.uniform1i(this.mActiveRef, false);
        } else {
          gl.uniform1i(this.mActiveRef, lights[i].isActive());
          gl.uniform3fv(this.mPosRef, lights[i].getXform().getPosition());
          gl.uniform4fv(this.mColorRef, lights[i].getColor());
          gl.uniform2fv(this.mFalloffRef, lights[i].getFalloff());
          gl.uniform1i(this.mHasDiffuseRef, lights[i].hasDiffuse());
          gl.uniform1i(this.mHasSpecRef, lights[i].hasSpec());
        }
      } else {
        gl.uniform1i(this.mActiveRef, false);
      }
    }
  }

  getUniforms(index) {
    let gl = glSys.get();
    this.mActiveRef = gl.getUniformLocation(
      this.mCompiledShader,
      "uLights[" + index + "].Active"
    );
    this.mPosRef = gl.getUniformLocation(
      this.mCompiledShader,
      "uLights[" + index + "].Pos"
    );
    this.mColorRef = gl.getUniformLocation(
      this.mCompiledShader,
      "uLights[" + index + "].Color"
    );
    this.mFalloffRef = gl.getUniformLocation(
      this.mCompiledShader,
      "uLights[" + index + "].Falloff"
    );
    this.mHasDiffuseRef = gl.getUniformLocation(
      this.mCompiledShader,
      "uLights[" + index + "].HasDiffuse"
    );
    this.mHasSpecRef = gl.getUniformLocation(
      this.mCompiledShader,
      "uLights[" + index + "].HasSpec"
    );
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

    this.mFalloffRef = gl.getUniformLocation(this.mCompiledShader, "uFalloff");

    this.mHasDiffuseRef = gl.getUniformLocation(
      this.mCompiledShader,
      "uHasDiffuse"
    );

    this.mHasSpecRef = gl.getUniformLocation(this.mCompiledShader, "uHasSpec");
  }

  getGLUniformRefs2() {
    let gl = glSys.get();

    this.mIsSecondLightActiveRef = gl.getUniformLocation(
      this.mCompiledShader,
      "isSecondLightActive"
    );

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
      "uFalloff2"
    );

    this.mHasDiffuseRef2 = gl.getUniformLocation(
      this.mCompiledShader,
      "uHasDiffuse2"
    );

    this.mHasSpecRef2 = gl.getUniformLocation(
      this.mCompiledShader,
      "uHasSpec2"
    );
  }
}

export default NormalMapShader;
