import * as THREE from "three";
import { ParticleSystem } from "./three-tdl-particle-system";

const MAX_POOFS = 10;

export default class Particles extends ParticleSystem {
  constructor(scene, camera) {
    super(scene, camera);

    if (Particles.exists) {
      return Particles.instance;
    }

    Particles.instance = this;
    Particles.exists = true;

    this.poofs = [];
    this._createDust();
  }

  static getInstance() {
    return this.instance;
  }

  triggerDust(position) {
    const puff = this.poofs.pop();
    const { x, y, z } = position;
    puff.trigger([x, y + 0.5, z]);
    this.poofs.unshift(puff);
  }

  _createDust() {
    const texture = THREE.Cache.get("smoke_alpha.png");
    const emitter = this.createParticleEmitter(texture);
    emitter.setState(THREE.AdditiveBlending);
    emitter.setColorRamp(
      [
        0.3, 0.3, 0.3, 0.3,
        0.3, 0.3, 0.3, 0
      ]
    );
    emitter.setParameters({
      numParticles: 120,
      lifeTime: 0.7,
      startTime: 0,
      startSize: 1,
      endSize: 2,
      spinSpeedRange: 5,
      positionRange: [4, 0, 2],
      velocityRange: [0.3, 0.5, 0.3],
      billboard: true
    },
      function (index, parameters) {
        const matrix = new THREE.Matrix4();
        const angle = Math.random() * 2 * Math.PI;
        matrix.makeRotationY(angle);
        const position = new THREE.Vector3(3, 3, 0);
        const len = position.length();
        position.transformDirection(matrix);
        parameters.velocity = [position.x * len, position.y * len, position.z * len];
        const acc = new THREE.Vector3(- 0.5, 0, - 0.5).multiply(position);
        parameters.acceleration = [acc.x, acc.y, acc.z];

      });

    for (let i = 0; i < MAX_POOFS; ++i) {
      this.poofs[i] = emitter.createOneShot();
    }
  }
}