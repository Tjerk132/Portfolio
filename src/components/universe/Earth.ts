import { Mesh, MeshPhongMaterial, SphereGeometry } from "three";
import { Planet } from "./Base/Planet"
import { intervalCallback } from "../../utils/utils";
import { PositionProps } from "./Base/PositionProps";

export class Earth extends Planet {

    constructor(props: PositionProps) {
        const { position } = props;
        
        super();

        const earth = super.createPlanet({
            geometry: new SphereGeometry(8, 64, 32),
            mapUrl: "earth/earth_color.jpg",
            bumpMapUrl: "earth/earth_bump.jpg",
            specularMapUrl: "earth/earth_spec.jpg",
            lightMapUrl: "earth/earth_light.jpg"
        })

        earth.receiveShadow = true;
        earth.castShadow = true;

        earth.position.set(position.x, position.y, position.z);

        const clouds = this.createClouds();

        clouds.position.set(position.x, position.y, position.z);

        this.render = intervalCallback((t: number) => {
            clouds.rotation.y -= 0.001;
            earth.rotation.y += 0.001;

            earth.position.x = position.x * Math.cos(t);
            earth.position.z = position.x * Math.sin(t);

            clouds.position.x = position.x * Math.cos(t);
            clouds.position.z = position.x * Math.sin(t);
        }, 0.003);

        this.addObject(earth, clouds);
    }

    private createClouds = () => {
        const cloudGeometry = new SphereGeometry(8.2, 32, 12);
        const cloudMaterial = new MeshPhongMaterial({
            map: this.textureLoader.load("earth/earth_clouds.jpg"),
            transparent: true,
            opacity: 0.5,
        });

        const clouds = new Mesh(cloudGeometry, cloudMaterial);

        return clouds;
    }
}