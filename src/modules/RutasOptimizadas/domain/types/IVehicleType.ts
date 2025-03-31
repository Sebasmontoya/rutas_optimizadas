export interface IVehicleType {
    id: number
    profile: string
    description: string
    start: [number, number]
    end: [number, number]
    capacity: number[]
    skills: number[]
    time_window: number[]
    breaks: {
        id: number
        description: string
        service: number
        time_windows: number[][]
    }[]
    speed_factor?: number // Optional property for speed adjustment
}
