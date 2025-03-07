export interface ICommentUser {
  url: string;
  name: string;
  image: string;
}

export interface ICommentQA {
  question: string;
  answer: string;
}

export interface IComment {
  date: string;
  id: string;
  imageUrls: { thumb: string; original: string; id: string }[];
  qa: ICommentQA[];
  rating: number;
  response: string;
  review: string;
  time: number;
  user: ICommentUser;
  videoUrls: { videoUrl: string; thumb: string; id: string }[];
}

export interface ICommentImage {
  id: string;
  machineId: string;
  original: string;
  thumb: string;
  uid: string;
}
