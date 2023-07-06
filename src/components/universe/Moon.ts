import { SphereGeometry, Vector3 } from "three";
import { Planet } from "./Base/Planet";
import { intervalCallback } from "../../utils/utils";
import { PositionProps } from "./Base/PositionProps";

export class Moon extends Planet {

    constructor(props: PositionProps) {
        const { position } = props;

        super();

        const moon = super.createPlanet({
            geometry: new SphereGeometry(14, 64, 32),
            mapUrl: "moon/moon_map.jpg",
            bumpMapUrl: "moon/moon_bump.jpg",
            specularMapUrl: "moon/moon_specularmap.jpg",
        });

        moon.position.set(position.x, position.y, position.z);

        moon.castShadow = true;
        moon.receiveShadow = true;

        this.render = intervalCallback((t: number) => {
            moon.rotation.y += 0.005;

            moon.position.x = position.x * Math.cos(t);
            moon.position.z = position.x * Math.sin(t);
        }, 0.002);

        this.addObject(moon);
    }
}