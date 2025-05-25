import api from './auth';         

export interface DroneInput {
  brand: string;
  model: string;
  serial_number: string;
}

/** GET /api/drones */
export const listDrones = () =>
  api.get('/drones').then(r => r.data);

/** POST /api/drones */
export const createDrone = (data: DroneInput) =>
  api.post('/drones', data).then(r => r.data);
