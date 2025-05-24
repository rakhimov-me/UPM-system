import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";
import type { Telemetry } from "../hooks/useTelemetry";

export function createTelemetrySocket(onData: (pt: Telemetry) => void): Socket {
  const socket = io("/", { transports: ["websocket"] });
  socket.on("telemetry", onData);
  return socket;
}
