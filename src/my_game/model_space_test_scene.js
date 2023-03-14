"use strict"; // Operate in Strict mode such that variables must be declared before used!

import engine from "../engine/index.js";

class ModelSpaceTestScene extends engine.Scene {
  constructor() {
    super();
    
    this.kPebbles = "assets/Pebbles_028_BaseColor.jpg";
    this.kPebblesNormal = "assets/Pebbles_028_Normal.jpg";
    
    this.kRocky = "assets/Rock_044_BaseColor.jpg";
    this.kRockyNormal = "assets/Rock_044_Normal.jpg";

    this.mCamera = null;
  }

  load() {
    engine.texture.load(this.kPebbles);
    engine.texture.load(this.kPebblesNormal);
    engine.texture.load(this.kRocky);
    engine.texture.load(this.kRockyNormal);
  }
  
  unload() {
    engine.texture.unload(this.kPebbles);
    engine.texture.unload(this.kPebblesNormal);
    engine.texture.unload(this.kRocky);
    engine.texture.unload(this.kRockyNormal);
  }

  init() {
    this.mCamera = new engine.Camera(
      vec2.fromValues(50, 40), // position of the camera
      100, // width of camera
      [0, 0, 640, 480] // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);

    // Light objects ------------------------------------------------------------------------------------
    this.mTorch = new engine.LightSource();
    this.mTorch.getXform().setPosition(50, 40, 10);
    this.mTorch.setColor([0.97, 0.76, 0.47, 1.0]);
    this.mLightFlicker = new engine.Shake(0.07, 1, 450);
    
    this.mBlueLight = new engine.LightSource();
    this.mBlueLight.getXform().setPosition(50, 40, 5);
    this.mBlueLight.setColor([0.2, 0.5, 0.97, 1]);
    this.mBlueLight.setFalloff([0.4, 0.04, 0.0001]);
    
    this.mRedLight = new engine.LightSource();
    this.mRedLight.getXform().setPosition(50, 40, 3);
    this.mRedLight.setColor([0.8, 0.1, 0.1, 1]);
    this.mRedLight.setFalloff([0.4, 0.04, 0.0001]);
    this.mRedLight.mIsUsingWC = false;
    this.mRedLightBob = new engine.Oscillate(10, 5, 450);
    this.mRedLightAngle = 0;

    this.mLights = [this.mTorch, this.mBlueLight, this.mRedLight];

    // Renderables with normal map functionality ------------------------------------------
    this.mSmallObj = new engine.NormalMapRenderable(
      this.kRocky, // Texture
      this.kRockyNormal, // Normal map
      this.mRedLight, // First light source
      this.mTorch // Second light source (optional)
    );
    this.mSmallObj.getXform().setSize(30, 30);
    this.mSmallObj.getXform().setPosition(50, 40);

    this.mLargeObj = new engine.NormalMapRenderable(
      this.kPebbles,
      this.kPebblesNormal,
      this.mTorch,
      this.mBlueLight
    );
    this.mLargeObj.getXform().setSize(100, 100);
    this.mLargeObj.getXform().setPosition(50, 40);
  }

  draw() {
    engine.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray
    this.mCamera.setViewAndCameraMatrix();

    this.mLargeObj.draw(this.mCamera);
    this.mSmallObj.draw(this.mCamera);
  }

  // The update function, updates the application state. Make sure to _NOT_ draw
  // anything from this function!
  update() {
    // red light movement ------------------------------------------------------------------------------------
    let kOrbitRadius = 5;
    let kRotSpeed = 50;
    let kRotSpeedRadians = (kRotSpeed * 2 * Math.PI / 360) / 60;

    if (this.mRedLightBob.mNumCyclesLeft < this.mRedLightBob.mCycles / 1.4) {
      this.mRedLightBob.reStart();
    }
    this.mRedLight.getModelSpaceXform().setPosition(
      kOrbitRadius * Math.cos(this.mRedLightAngle),
      kOrbitRadius * Math.sin(this.mRedLightAngle),
      this.mRedLightBob.getNext()
    )
    this.mRedLightAngle += kRotSpeedRadians;

    // yellow light intensity and movement ------------------------------------------------------------------------------------
    if (this.mLightFlicker.mNumCyclesLeft < this.mLightFlicker.mCycles / 1.4) {
      this.mLightFlicker.reStart();
    }
    this.mTorch.setIntensity(
      this.mTorch.getIntensity() + this.mLightFlicker.getNext()
    );

    this.mTorch.getXform().setPosition(
      this.mCamera.mouseWCX(),
      this.mCamera.mouseWCY(),
      this.mTorch.getXform().getZPos()
    );
    
    // small renderable controls ------------------------------------------------------------------------------------
    if (engine.input.isKeyPressed(engine.input.keys.Up)) {
      this.mSmallObj.getXform().incYPosBy(1);
    }
    if (engine.input.isKeyPressed(engine.input.keys.Down)) {
      this.mSmallObj.getXform().incYPosBy(-1);
    }
    if (engine.input.isKeyPressed(engine.input.keys.Left)) {
      this.mSmallObj.getXform().incXPosBy(-1);
    }
    if (engine.input.isKeyPressed(engine.input.keys.Right)) {
      this.mSmallObj.getXform().incXPosBy(1);
    }
  }
}
export default ModelSpaceTestScene;

window.onload = function () {
  engine.init("GLCanvas");

  let myGame = new ModelSpaceTestScene();
  myGame.start();
};
