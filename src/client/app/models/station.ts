export interface IStation {
  key: string
  name: string
  lat?: number
  lon?: number
}

export class Station implements IStation {
  [propName: string]: any;

  key: string;
  name: string;
  lat: number;
  lon: number;

  static fromObject(object: any): Station {
    let station = new Station();
    Object.assign(station, object);
    return station
  }
}
