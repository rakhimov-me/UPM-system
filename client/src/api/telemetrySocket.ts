import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";
import type { Telemetry } from "../hooks/useTelemetry";

export function createTelemetrySocket(onData: (pt: Telemetry) => void): Socket {
  const socket = io("http://localhost:3000", { transports: ["websocket"] });
  socket.on("telemetry", onData);
  return socket;
}
