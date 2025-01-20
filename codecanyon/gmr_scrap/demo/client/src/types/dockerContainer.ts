import { Timestamp } from "firebase/firestore";

export interface IDockerContainer {
  Action: "create" | "start" | "stop" | "destroy";
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
  updatedAt: Timestamp;
}
