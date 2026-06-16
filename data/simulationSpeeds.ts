import { SimulationSpeed } from "../types/trip";

export const simulationSpeedOptions:{
    label: string;
    value: SimulationSpeed;
    delay: number;
}[] = [
    { label: 'Lenta', value: 'slow', delay: 1500},
    { label: 'Normal', value: 'normal', delay: 1000},
    { label: 'Rápida', value: 'fast', delay: 500},
];