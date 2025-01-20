import { GeoPoint, Timestamp } from "firebase/firestore";
import { IDockerMachine } from "./dockerMachine";

export interface IDockerContainer {
  address: string;
  createdAt: Timestamp;
  extendedUrl: string;
  id: string;
  keywords: string[];
  location: GeoPoint;
  machine: IDockerMachine;
  rating: number;
  reviewId: string;
  reviews: number;
  screenshot: string;
  status: string;
  title: string;
  type: "info" | "comments";
  updatedAt: Timestamp;
  url: string;
  userId: string;
}
