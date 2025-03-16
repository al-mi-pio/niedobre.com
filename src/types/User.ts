import { UUID } from "crypto";

export type User = {
  id: UUID;
  login: string;
  password: string;
  email?: string;
  sessionId?: UUID;
};
