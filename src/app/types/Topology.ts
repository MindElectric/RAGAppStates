// To parse this data:
//
//   import { Convert, Mexico } from "./file";
//
//   const mexico = Convert.toMexico(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface Mexico {
    type: string;
    objects: Objects;
    arcs: Array<Array<number[]>>;
    transform: Transform;
}

export interface Objects {
    states: States;
    municipalities: Municipalities;
}

export interface Municipalities {
    type: string;
    geometries: MunicipalitiesGeometry[];
}

export interface MunicipalitiesGeometry {
    type: Type;
    properties: PurpleProperties;
    arcs: Array<Array<number[] | number>>;
}

export interface PurpleProperties {
    state_code: number;
    mun_code: number;
    mun_name: string;
}

export enum Type {
    MultiPolygon = "MultiPolygon",
    Polygon = "Polygon",
}

export interface States {
    type: string;
    geometries: StatesGeometry[];
}

export interface StatesGeometry {
    type: Type;
    properties: FluffyProperties;
    arcs: Array<Array<number[] | number>>;
}

export interface FluffyProperties {
    state_code: number;
    state_name: string;
}

export interface Transform {
    scale: number[];
    translate: number[];
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toMexico(json: string): Mexico {
        return cast(JSON.parse(json), r("Mexico"));
    }

    public static mexicoToJson(value: Mexico): string {
        return JSON.stringify(uncast(value, r("Mexico")), null, 2);
    }
}

function invalidValue(typ: any, val: any, key: any, parent: any = ''): never {
    const prettyTyp = prettyTypeName(typ);
    const parentText = parent ? ` on ${parent}` : '';
    const keyText = key ? ` for key "${key}"` : '';
    throw Error(`Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(val)}`);
}

function prettyTypeName(typ: any): string {
    if (Array.isArray(typ)) {
        if (typ.length === 2 && typ[0] === undefined) {
            return `an optional ${prettyTypeName(typ[1])}`;
        } else {
            return `one of [${typ.map(a => { return prettyTypeName(a); }).join(", ")}]`;
        }
    } else if (typeof typ === "object" && typ.literal !== undefined) {
        return typ.literal;
    } else {
        return typeof typ;
    }
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = '', parent: any = ''): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key, parent);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) { }
        }
        return invalidValue(typs, val, key, parent);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases.map(a => { return l(a); }), val, key, parent);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue(l("array"), val, key, parent);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue(l("Date"), val, key, parent);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue(l(ref || "object"), val, key, parent);
        }
        const result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, key, ref);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key, ref);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val, key, parent);
    }
    if (typ === false) return invalidValue(typ, val, key, parent);
    let ref: any = undefined;
    while (typeof typ === "object" && typ.ref !== undefined) {
        ref = typ.ref;
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems") ? transformArray(typ.arrayItems, val)
                : typ.hasOwnProperty("props") ? transformObject(getProps(typ), typ.additional, val)
                    : invalidValue(typ, val, key, parent);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function l(typ: any) {
    return { literal: typ };
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    "Mexico": o([
        { json: "type", js: "type", typ: "" },
        { json: "objects", js: "objects", typ: r("Objects") },
        { json: "arcs", js: "arcs", typ: a(a(a(0))) },
        { json: "transform", js: "transform", typ: r("Transform") },
    ], false),
    "Objects": o([
        { json: "states", js: "states", typ: r("States") },
        { json: "municipalities", js: "municipalities", typ: r("Municipalities") },
    ], false),
    "Municipalities": o([
        { json: "type", js: "type", typ: "" },
        { json: "geometries", js: "geometries", typ: a(r("MunicipalitiesGeometry")) },
    ], false),
    "MunicipalitiesGeometry": o([
        { json: "type", js: "type", typ: r("Type") },
        { json: "properties", js: "properties", typ: r("PurpleProperties") },
        { json: "arcs", js: "arcs", typ: a(a(u(a(0), 0))) },
    ], false),
    "PurpleProperties": o([
        { json: "state_code", js: "state_code", typ: 0 },
        { json: "mun_code", js: "mun_code", typ: 0 },
        { json: "mun_name", js: "mun_name", typ: "" },
    ], false),
    "States": o([
        { json: "type", js: "type", typ: "" },
        { json: "geometries", js: "geometries", typ: a(r("StatesGeometry")) },
    ], false),
    "StatesGeometry": o([
        { json: "type", js: "type", typ: r("Type") },
        { json: "properties", js: "properties", typ: r("FluffyProperties") },
        { json: "arcs", js: "arcs", typ: a(a(u(a(0), 0))) },
    ], false),
    "FluffyProperties": o([
        { json: "state_code", js: "state_code", typ: 0 },
        { json: "state_name", js: "state_name", typ: "" },
    ], false),
    "Transform": o([
        { json: "scale", js: "scale", typ: a(3.14) },
        { json: "translate", js: "translate", typ: a(3.14) },
    ], false),
    "Type": [
        "MultiPolygon",
        "Polygon",
    ],
};
