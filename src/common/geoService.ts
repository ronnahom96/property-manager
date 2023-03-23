import { booleanContains, booleanWithin, Feature, intersect, Polygon } from "@turf/turf";
import { singleton } from "tsyringe";

@singleton()
export class GeoService {
  public isIntersects(geoJsonOne: Polygon, geoJsonTwo: Feature<Polygon>): boolean {
    const intersectArea = intersect(geoJsonOne, geoJsonTwo);
    return !!intersectArea;
  }

  public isContains(geoJsonOne: Feature<Polygon>, geoJsonTwo: Feature<Polygon>): boolean {
    return booleanContains(geoJsonOne, geoJsonTwo);
  }

  public isWithin(geoJsonOne: Feature<Polygon>, geoJsonTwo: Feature<Polygon>): boolean {
    return booleanWithin(geoJsonOne, geoJsonTwo);
  }

}