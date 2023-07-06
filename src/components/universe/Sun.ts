import { Planet } from "./Base/Planet";
import { PointLight, SphereGeometry, Vector3 } from 'three';
import { intervalCallback } from "../../utils/utils";
import { PositionProps } from "./Base/PositionProps";

export class Sun extends Planet {

    constructor(props: PositionProps) {
        const { position } = props;

        super();

        const sun = super.createPlanet({
            geometry: new SphereGeometry(12, 64, 32),
            mapUrl: "sun/sun_map.jpg",
            emissive: true
        });

        sun.position.set(position.x, position.y, position.z);

        sun.castShadow = true;
        sun.receiveShadow = false;

        const pointLight = new PointLight(0xffffff, 0.8, 10000);

        pointLight.position.set(position.x, position.y, position.z);

        pointLight.castShadow = true;
        pointLight.shadow.camera.near = 30;
        // pointLight.shadow.camera.far = 40;

        // this.addObject(new CameraHelper(pointLight.shadow.camera));
        // this.addObject(new PointLightHelper(pointLight))

        this.addObject(sun, pointLight);

        this.render = intervalCallback(() => {
            sun.rotation.x += 0.001;
            sun.rotation.y += 0.001;
        });
    }
}