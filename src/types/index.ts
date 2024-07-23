import { Message } from "@/models/user.model";

export interface IVerificationEmail {
  verificationCode: string;
  username: string;
  email: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  isAcceptingMessages?: boolean;
  messages?: Array<Message>;
}
