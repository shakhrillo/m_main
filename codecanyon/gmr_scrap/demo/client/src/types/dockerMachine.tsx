import type { Timestamp } from "firebase/firestore";

export interface IDockerMachine {
  Action: "create" | "start" | "stop" | "die";
  Actor: {
    Attributes: {
      execDuration: string;
      exitCode: string;
      image: string;
      name: string;
    };
  };
  ID: string;
  Type: string;
  from: string;
  id: string;
  scope: string;
  status: string;
  time: number;
  timeNano: number;
  type: string;
  Size: number;
  Os: string;
  Architecture: string;
  Variant: string;
  Created: Timestamp;
  updatedAt: Timestamp;
}
