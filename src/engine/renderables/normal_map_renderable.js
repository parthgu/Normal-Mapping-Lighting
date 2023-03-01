"use strict";

import * as glSys from "../core/gl.js";
import TextureRenderable from "./texture_renderable.js";
import * as shaderResources from "../core/shader_resources.js";
import * as texture from "../resources/texture.js";

class NormalMapRenderable extends TextureRenderable {
  constructor(texture, normalMapTexture, lightSource) {
    super(texture);
    this.mNormalTexture = normalMapTexture;
    this.mLightSource = lightSource;

    super._setShader(shaderResources.getNormalMapShader());
  }

  draw(camera) {
    let gl = glSys.get();
    texture.activate(this.mTexture);
    texture.activate(this.mNormalTexture, glSys.get().TEXTURE1);

    // this.mShader.setLightPos(this.mLightSource.getXform());
    // this.mShader.setLightIntensity(this.mLightSource.getIntensity());
    this.mShader.activate(this.mColor, this.mXform.getTRSMatrix(),
      camera, this.mLightSource); // always activate the shader first!
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  getNormalMapTexture() {
    return this.mSecondTexture;
  }

  getLightSource() {
    return this.mLightSource;
  }

  setLightSource(lightSource) {
    this.mLightSource = lightSource;
  }
}

export default NormalMapRenderable;