import { Request, Response } from "express";
import { isObject } from "util";


// Esta función se encarga de cambiar el nombre de todos los
// campos de un objeto que se encuentren dentro de el objeto m (map)
// por el valor de los mismos, esto se hace de forma recursiva en cada
// objeto y los objetos anidados, esta función no funciona si el objeto
// no tiene arreglos
export const mapear = (object: any, m: any) => {
    const mapped: any = {};
    Object.keys(object).forEach((k) => {
        if (!isObject(object[k])) {
            if (m[k]) {
                mapped[m[k]] = object[k];
            }
        } else {
            mapped[m[k]] = mapear(object[k], m);
        }
    });
    return mapped;
};

const map = {
    numeroCelular: "nc",
    appIdentifier: "idH",
    deviceInfo: "ia",
    manufacturer: "fab",
    model: "mod",
    osName: "so",
    osVersion: "vSO",
};


export function Mapper(req: Request, res: Response, next: () => void) {
    const newBody = mapear(req.body, map);
    req.body = newBody;
    next();
}
