export class ParameterConstraints{
    private static _instance: ParameterConstraints;
    constraintMap: Map<string, Array<number>>;
    private constructor(){
        this.constraintMap = new Map();
        this.constraintMap.set("line_speed", [1, 256]);
        this.constraintMap.set("line_width", [1, 128]);
        this.constraintMap.set("sensor_distance", [1, 64]);
        this.constraintMap.set("product_width", [1, 128]);
        this.constraintMap.set("product_length", [1, 128]);
        this.constraintMap.set("product_height", [1, 32]);
        this.constraintMap.set("nozzle_count", [1, 16]);
        this.constraintMap.set("nozzle_spacing", [1, 32]);
        this.constraintMap.set("nozzle_height", [1, 32]);
        this.constraintMap.set("fluid_pressure", [1, 128]);
        this.constraintMap.set("duty_cycle", [0, 100]);
        this.constraintMap.set("start_delay", [0, 64]);
        this.constraintMap.set("stop_delay", [0, 64]);
        this.constraintMap.set("spray_duration", [0, 64]);
        this.constraintMap.set("flow_rate", [0, 1]);
        this.constraintMap.set("angle", [1, 180]);
        this.constraintMap.set("twist_angle", [0, 90]);
    }
    public static get Instance()
    {
        // Do you need arguments? Make it a regular static method instead.
        return this._instance || (this._instance = new this());
    }
}