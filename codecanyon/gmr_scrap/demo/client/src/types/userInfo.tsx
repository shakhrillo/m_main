import type { Timestamp } from "firebase/firestore";

export interface IUserInfo {
  coinBalance: number;
  createdAt: Timestamp;
  displayName: string;
  email: string;
  notifications?: number;
  phone: number;
  photoURL: string;
  totalSpent: number;
  totalImages: number;
  totalOwnerReviews: number;
  totalReviews: number;
  totalValidateComments: number;
  totalValidateInfo: number;
  totalVideos: number;
  uid: string;
  isAdmin: boolean;
  isEditor: boolean;
  isDeleted: boolean;
}
