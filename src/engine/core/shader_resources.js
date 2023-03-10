/*
 * File: shader_resources.js
 *
 * defines drawing system shaders
 *
 */
"use strict";

import SimpleShader from "../shaders/simple_shader.js";
import TextureShader from "../shaders/texture_shader.js";
import SpriteShader from "../shaders/sprite_shader.js";
import NormalMapShader from "../shaders/normal_map_shader.js";
import * as text from "../resources/text.js";
import * as map from "./resource_map.js";

// Simple Shader
let kSimpleVS = "src/glsl_shaders/simple_vs.glsl"; // Path to the VertexShader
let kSimpleFS = "src/glsl_shaders/simple_fs.glsl"; // Path to the simple FragmentShader
let kNormalShaderVS = "src/glsl_shaders/normal_map_vs.glsl";
let kNormalShaderFS = "src/glsl_shaders/normal_map_fs.glsl";
let mConstColorShader = null;

// Texture Shader
let kTextureVS = "src/glsl_shaders/texture_vs.glsl"; // Path to the VertexShader
let kTextureFS = "src/glsl_shaders/texture_fs.glsl"; // Path to the texture FragmentShader
let mTextureShader = null;
let mSpriteShader = null;
let mNormalMapShader = null;

function createShaders() {
  mConstColorShader = new SimpleShader(kSimpleVS, kSimpleFS);
  mTextureShader = new TextureShader(kTextureVS, kTextureFS);
  mSpriteShader = new SpriteShader(kTextureVS, kTextureFS);
  mNormalMapShader = new NormalMapShader(kNormalShaderVS, kNormalShaderFS);
}

function cleanUp() {
  mConstColorShader.cleanUp();
  mTextureShader.cleanUp();
  mSpriteShader.cleanUp();
  mNormalMapShader.cleanUp();

  text.unload(kSimpleVS);
  text.unload(kSimpleFS);
  text.unload(kTextureVS);
  text.unload(kTextureFS);
  text.unload(kNormalShaderVS);
  text.unload(kNormalShaderFS);
}

function init() {
  let loadPromise = new Promise(async function (resolve) {
    await Promise.all([
      text.load(kSimpleFS),
      text.load(kSimpleVS),
      text.load(kTextureFS),
      text.load(kTextureVS),
      text.load(kNormalShaderVS),
      text.load(kNormalShaderFS),
    ]);
    resolve();
  }).then(function resolve() {
    createShaders();
  });
  map.pushPromise(loadPromise);
}

function getConstColorShader() {
  return mConstColorShader;
}
function getTextureShader() {
  return mTextureShader;
}
function getSpriteShader() {
  return mSpriteShader;
}
function getNormalMapShader() {
  return mNormalMapShader;
}

export {
  init,
  cleanUp,
  getConstColorShader,
  getTextureShader,
  getSpriteShader,
  getNormalMapShader,
};
