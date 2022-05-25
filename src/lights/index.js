import { SpotLight } from "three";

export function getDirectionLight(sourcePoint, destinationPoint,color, intensity) {
    const light = new SpotLight(color,intensity, 4, Math.PI/2,0.5);
    light.position.set(...sourcePoint);
    light.target.position.set(...destinationPoint);
    light.castShadow = true;

    return light;
}
