import { MathUtils, Mesh, MeshPhongMaterial, SphereGeometry } from 'three';
import { RenderObject } from '../RenderObject';

export class Star extends RenderObject {

    constructor() {
        super();

        const geometry = new SphereGeometry(0.25, 24, 24);
        const material = new MeshPhongMaterial({ color: 0xffffff, emissive: 0xffffff });

        const star = new Mesh(geometry, material);

        const [x, y, z] = new Array(3).fill(1).map(() => MathUtils.randFloatSpread(200));

        star.position.set(x, y, z);

        const emissiveIntensityFadeCallback = this.emissiveIntensityFadeCallbackSetup();
        this.render = () => {
            const emissiveIntensity = emissiveIntensityFadeCallback();            
            material.emissiveIntensity = emissiveIntensity;
        }

        this.addObject(star);
    }

    private emissiveIntensityFadeCallbackSetup(): () => number {
        const min = 0.1;
        const max = 1.0;

        let current = Math.random() * (max - min) + min;
        let step = 0.005;

        return () => {
            current += step
            //MathUtils.pingpong();
            if (current >= max || current <= min) {
                step = -step;
            }
            return current;
        }
    }
}