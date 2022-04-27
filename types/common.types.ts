import { Id } from "convex-dev/values";

export type Message = {
  _id: Id;
  author: string;
  body: string;
  channel: Id;
  user: Id;
  time: number;
};

export type Channel = {
  _id: Id;
  name: string;
  owner: Id;
};

export type User = {
  _id: Id;
  name: string;
  tokenIdentifier: string;
};
