"use strict";

import * as glSys from "../core/gl.js";
import TextureRenderable from "./texture_renderable.js";
import * as shaderResources from "../core/shader_resources.js";
import * as texture from "../resources/texture.js";

class NormalMapRenderable extends TextureRenderable {
  constructor(texture, normalMapTexture, lightSource) {
    super(texture);
    this.mSecondTexture = normalMapTexture;
    this.mLightSource = lightSource;

    super._setShader(shaderResources.getNormalMapShader());
  }

  draw(camera) {
    texture.activate(this.normalMapTexture, glSys.get().TEXTURE1);
    super.draw(camera);
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
