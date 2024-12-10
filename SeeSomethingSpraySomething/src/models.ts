/* eslint-disable @typescript-eslint/no-namespace */
export namespace Models{
    export interface Controller{
        _id: number,
        controller_name:string,
        doc_link:string
    }
    export interface Nozzle{
        _id: number,
        nozzle_name:string,
        doc_link:string,
        flow_rate:number,
        angle:number,
        spray_shape:string,
        twist_angle:number
    }
    export interface Gun{
        _id:number,
        gun_name:string,
        max_frequency:number
    }
    export interface User{
        _id: number,
        username:string,
        role:string,
        projects:Array<Models.Project>
    }
    export interface Project{
        project_id:number,
        owner_id:number,
        project_name:string,
        project_description:string,
        last_modified_date:Date,
        line_speed:number,
        line_width:number,
        sensor_distance:number,
        product_width:number,
        product_length:number,
        product_height:number,
        nozzle_count:number,
        nozzle_spacing:number,
        nozzle_height:number,
        fluid_pressure:number,
        duty_cycle:number,
        start_delay:number,
        stop_delay:number,
        spray_duration:number,
        nozzle:Models.Nozzle,
        controller:Models.Controller,
        gun:Models.Gun
    }
}