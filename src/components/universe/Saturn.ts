import { SphereGeometry, Vector3 } from "three";
import { RingPlanet } from "./Base/RingPlanet";
import { intervalCallback } from "../../utils/utils";
import { PositionProps } from "./Base/PositionProps";

export class Saturn extends RingPlanet {

    constructor(props: PositionProps) {
        const { position } = props;
        
        super({
            geometry: new SphereGeometry(8, 64, 32),
            position: position,
            mapUrl: "saturn/saturn_map.jpg",
            bumpMapUrl: "saturn/saturn_normal_map.jpg",
            ringMapUrl: "saturn/ring/saturn_ring_map.jpg"
        });

        this.planet.castShadow = true;
        this.planet.receiveShadow = true;

        // this.ring.receiveShadow = true;
        this.ring.castShadow = true;

        this.render = intervalCallback((t: number) => {
            this.ring.rotation.x = Math.sin(t)
            this.ring.rotation.y = Math.cos(t)

            this.planet.position.x = position.x * Math.cos(t);
            this.planet.position.z = position.x * Math.sin(t);

            this.ring.position.x = position.x * Math.cos(t);
            this.ring.position.z = position.x * Math.sin(t);
        }, 0.001)
    }
}