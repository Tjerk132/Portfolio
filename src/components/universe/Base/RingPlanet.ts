import { DoubleSide, Mesh, MeshPhongMaterial, RingGeometry, SphereGeometry, Vector3 } from "three";
import { Planet } from "./Planet";

export abstract class RingPlanet extends Planet {

    protected planet: Mesh;
    protected ring: Mesh;

    constructor(
        { geometry, position, mapUrl, bumpMapUrl, ringMapUrl }
            : {
                geometry: SphereGeometry,
                position: Vector3,
                mapUrl: string,
                bumpMapUrl?: string,
                ringMapUrl?: string
            }
    ) {
        super();

        this.planet = super.createPlanet({
            geometry: geometry,
            mapUrl: mapUrl,
            bumpMapUrl: bumpMapUrl
        });

        this.planet.position.set(position.x, position.y, position.z);

        this.ring = this.createRing(ringMapUrl);

        this.ring.position.set(position.x, position.y, position.z);

        this.addObject(this.planet, this.ring);
    }

    private createRing(mapUrl: string): Mesh {
        const ringGeometry = new RingGeometry(16, 10, 30);

        const map = this.textureLoader.load(mapUrl);

        const ringMaterial = new MeshPhongMaterial({
            map: map,
            flatShading: true,
            // color: 0xa8a7a2, 
            side: DoubleSide
        })

        const ring = new Mesh(ringGeometry, ringMaterial);

        ring.rotation.set(5, 2.5, 0);

        return ring;
    }
}