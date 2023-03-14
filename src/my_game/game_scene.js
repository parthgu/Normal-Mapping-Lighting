"use strict"; // Operate in Strict mode such that variables must be declared before used!

import engine from "../engine/index.js";

class GameScene extends engine.Scene {
  constructor() {
    super();

    this.kBg = "assets/Rock_044_BaseColor.jpg";
    this.kBgNormal = "assets/Rock_044_Normal.jpg";

    this.kHero = "assets/8-Bit-Character-1.png";
    this.kTorch = "assets/pngimg.com - torch_PNG25.png";
    this.kWater = "assets/Water_002_COLOR.jpg";
    // this.kWaterNormal = "assets/Water_002_NORM.jpg";
    this.kWaterNormal = "assets/Rock_044_Normal.jpg";
    this.kPebble = "assets/Pebbles_028_BaseColor.jpg";
    this.kPebbleNormal = "assets/Pebbles_028_Normal.jpg";

    this.mCamera = null;
    
    this.mBackground = null;
    this.mHero = null;
    this.mTorch = null;
    
    this.mTorchLight = new engine.LightSource();
    this.mTorchLight.getXform().setPosition(17.5, 67, 1);
    this.mTorchLight.setColor([1, 0.6, 0, 1]);
    this.mTorchLight.setFalloff([5, 10]);
    this.mBeaconLight = new engine.LightSource();
    this.mBeaconLight.getXform().setPosition(80, 15, 0.5);
    this.mBeaconLight.setFalloff([5, 10]);
    this.mBeaconLight.setColor([1, 1, 1, 0.5]);
    this.mLights = [this.mTorchLight, this.mBeaconLight];

    let startColor = [0, 0, 0, 1];
    let startXPos = 20;
    for (let i = 0; i < 3; i++) {
      let lights = [new engine.LightSource(), new engine.LightSource()];
      lights[0].getXform().setYPos(30);
      lights[1].getXform().setYPos(60);
      lights[1].getXform().setZPos(2);
      lights.forEach(x => {
        x.setColor([0 + .3 * i, 0* i, 1, 0]);
        x.getXform().setXPos(40 + 30 * i);
        x.setFalloff([0, 20])
        this.mLights.push(x);
      });
    }

    let kDuration = 260;
    let kRate = 0.02;
    this.mTorchFlicker = new engine.Shake(0.2, 0.1, 30);
    this.mBeaconMove = new engine.LerpVec2([80, 15], kDuration, kRate);
    this.mBeaconRange = new engine.Lerp(5, kDuration, kRate);
    this.mBeaconZ = new engine.Lerp(0.5, kDuration, kRate);
    this.mBeaconIntensity = new engine.Lerp(0.5, kDuration, kRate);
    this.mRowIntensity = new engine.Lerp(0, 400, 0.01);
    this.mBeaconRange.setFinal(25);
    this.mBeaconMove.setFinal([0, 50]);
    this.mBeaconZ.setFinal(20);
    this.mBeaconIntensity.setFinal(0.9);

    this.mBeaconRangeReached = false;
  }

  load() {
    engine.texture.load(this.kBg);
    engine.texture.load(this.kBgNormal);
    
    engine.texture.load(this.kHero);
    engine.texture.load(this.kTorch);
    engine.texture.load(this.kWater);
    engine.texture.load(this.kWaterNormal);
    engine.texture.load(this.kPebble);
    engine.texture.load(this.kPebbleNormal);
  }

  unload() {
    engine.texture.unload(this.kBg);
    engine.texture.unload(this.kBgNormal);
    
    engine.texture.unload(this.kHero);
    engine.texture.unload(this.kTorch);
    engine.texture.unload(this.kWater);
    engine.texture.unload(this.kWaterNormal);
    engine.texture.unload(this.kPebble);
    engine.texture.unload(this.kPebbleNormal);
  }

  init() {
    this.mCamera = new engine.Camera(
      vec2.fromValues(50, 40), // position of the camera
      100, // width of camera
      [0, 0, 640, 480] // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
    this.mCamera.setAmbientIntensity(0.05);
    this.mBackground = new engine.NormalMapRenderable(
      this.kPebble, // Texture
      this.kPebbleNormal, // Normal map
      this.mLights
    );
    this.mBackground.getXform().setSize(200, 200);
    this.mBackground.getXform().setPosition(50, 40);
    this.mBackground.mShininess = 2;
    this.mBackground.mDiffuseWeight = 0.5;
    this.mBackground.mSpecularWeight = 0.3;

    this.mWaterSize = 4;
    this.mWater = [];
    for (let i = 0; i < this.mWaterSize; i++) {
      let curr =
        new engine.NormalMapRenderable(
          this.kWater, // Texture
          this.kWaterNormal, // Normal map
          this.mLights
        );
      curr.mDiffuseWeight = curr.mSpecularWeight = 1;
      curr.mShininess = 32;
      curr.getXform().setSize(50, 20);
      curr.getXform().setPosition(i * 50, 45);
      this.mWater.push(curr);
    }
    console.log(this.mWater);

    this.mHero = new engine.NormalMapRenderable(
      this.kHero, // Texture
      null, // Normal map
      this.mLights
    );
    this.mTorch = new engine.NormalMapRenderable(
      this.kTorch, // Texture
      null, // Normal map
      this.mLights
    );
    this.mHero.getXform().setSize(10, 10);
    this.mHero.getXform().setPosition(15, 65);
    this.mTorch.getXform().setSize(5, 5);
    this.mTorch.getXform().setPosition(18, 65);

    this.mMsg = new engine.FontRenderable("");
    this.mMsg.setTextHeight(2);
    this.mMsg.setColor([1, 1, 1, 1]);

  }

  draw() {
    engine.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray
    this.mCamera.setViewAndCameraMatrix();

    this.mBackground.draw(this.mCamera);
    this.mWater.forEach(x => x.draw(this.mCamera));
    
    this.mHero.draw(this.mCamera);
    this.mTorch.draw(this.mCamera);
    this.mMsg.draw(this.mCamera);

    this.mCamera.update();
  }

  // The update function, updates the application state. Make sure to _NOT_ draw
  // anything from this function!
  update() {
    this.mWater.forEach(x => {
      x.getXform().incXPosBy(0.3);
      
      if (x.getXform().getXPos() >= 150) {
        let diff = x.getXform().getXPos() - 150;
        x.getXform().setXPos(-50 + diff);
      }
    });

    let kBound = 15;
    if (this.mHero.getXform().getXPos() >
          this.mBeaconLight.getXform().getXPos() - kBound &&
        this.mHero.getXform().getYPos() <
          this.mBeaconLight.getXform().getYPos() + kBound &&
        this.mBeaconRangeReached == false
      )
    {
      this.mBeaconRangeReached = true;
      this.mRowIntensity.setFinal(1);
      this.mCamera.zoomTowards([50, 40], 1.5);
    }

    if (this.mBeaconRangeReached && this.mBeaconMove.mCyclesLeft > 0) {
      this.mBeaconLight.setFalloff([this.mBeaconRange.get(), 50]);
      this.mBeaconLight.getXform().setPosition(
          this.mBeaconMove.get()[0],
          this.mBeaconMove.get()[1],
          this.mBeaconZ.get()
      );
      this.mBeaconLight.setIntensity(this.mBeaconIntensity.get());

      for (let i = 2; i < 8; i++) {
        this.mLights[i].setIntensity(this.mRowIntensity.get());
      }
      
      this.mBeaconRange.update();
      this.mBeaconMove.update();
      this.mBeaconZ.update();
      this.mBeaconIntensity.update();
    }
    this.mRowIntensity.update();

    this.mTorchLight.setIntensity(0.7 + this.mTorchFlicker.getNext());
    if (this.mTorchFlicker.mNumCyclesLeft == 0) {
      this.mTorchFlicker.reStart();
    }

    let kMoveSpeed = 0.5;
    if (engine.input.isKeyPressed(engine.input.keys.Up)) {
      this.mHero.getXform().incYPosBy(kMoveSpeed);
      this.mTorchLight.getXform().incYPosBy(kMoveSpeed);
      this.mTorch.getXform().incYPosBy(kMoveSpeed);
    }
    if (engine.input.isKeyPressed(engine.input.keys.Down)) {
      this.mHero.getXform().incYPosBy(-kMoveSpeed);
      this.mTorchLight.getXform().incYPosBy(-kMoveSpeed);
      this.mTorch.getXform().incYPosBy(-kMoveSpeed);
    }
    if (engine.input.isKeyPressed(engine.input.keys.Right)) {
      this.mHero.getXform().incXPosBy(kMoveSpeed);
      this.mTorchLight.getXform().incXPosBy(kMoveSpeed);
      this.mTorch.getXform().incXPosBy(kMoveSpeed);
    }
    if (engine.input.isKeyPressed(engine.input.keys.Left)) {
      this.mHero.getXform().incXPosBy(-kMoveSpeed);
      this.mTorchLight.getXform().incXPosBy(-kMoveSpeed);
      this.mTorch.getXform().incXPosBy(-kMoveSpeed);
    }
    
    this.mMsg.setText(
      "(" + this.mCamera.mouseWCX() + ", " + this.mCamera.mouseWCY() + ")"
    );
    this.mMsg.getXform().setPosition(
      this.mCamera.mouseWCX(),
      this.mCamera.mouseWCY()
    );
  }
}
export default GameScene;

window.onload = function () {
  engine.init("GLCanvas");

  let myGame = new GameScene();
  myGame.start();
};
