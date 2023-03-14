"use strict";

import * as glSys from "../core/gl.js";
import TextureRenderable from "./texture_renderable.js";
import * as shaderResources from "../core/shader_resources.js";
import * as texture from "../resources/texture.js";

class NormalMapRenderable extends TextureRenderable {
  constructor(texture, normalMapTexture, lightSources = null) {
    super(texture);
    this.mNormalTexture = normalMapTexture;
    this.mLightSources = lightSources;
    
    this.mDiffuseWeight = 0.7;
    this.mSpecularWeight = 0.7;
    this.mShininess = 16;

    super._setShader(shaderResources.getNormalMapShader());
  }

  draw(camera) {
    let gl = glSys.get();
    texture.activate(this.mTexture);
    if (this.mNormalTexture !== null)
      texture.activate(this.mNormalTexture, glSys.get().TEXTURE1);

    this.mShader.activate(this, camera); // always activate the shader first!
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  getNormalMapTexture() {
    return this.mSecondTexture;
  }

  setNormalMapTexture(texture) {
    this.mNormalTexture = texture;
  }

  getLightSources() { return this.mLightSources; }
  setLightSources(newLights) { this.mLightSources = newLights; }

  getDiffuseWeight() { return this.mDiffuseWeight; }
  setDiffuseWeight(newVal) {
    this.mDiffuseWeight = this._clampVal(newVal, 0 , 1);
  }
  incDiffuseWeightBy(delta) {
    this.mDiffuseWeight = this._clampVal(this.mDiffuseWeight + delta, 0 , 1);
  }
  
  getSpecularWeight() { return this.mSpecularWeight; }
  setSpecularWeight(newVal) {
    this.mSpecularWeight = this._clampVal(newVal, 0 , 1);
  }
  incSpecularWeightBy(delta) {
    this.mSpecularWeight = this._clampVal(this.mSpecularWeight + delta, 0 , 1);
  }

  getShininess() { return this.mShininess; }
  setShininess(newVal) { this.mShininess = Math.max(1, newVal); }

  _clampVal(val, min, max) {
    if (val < min) return min;
    if (val > max) return max;
    return val;
  }
}

export default NormalMapRenderable;
