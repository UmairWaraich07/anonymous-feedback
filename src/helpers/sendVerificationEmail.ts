import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse, IVerificationEmail } from "@/types";

export async function sendVerificationEmail({
  email,
  verificationCode,
  username,
}: IVerificationEmail): Promise<ApiResponse> {
  try {
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Verification Code - Anonymous Feedback",
      react: VerificationEmail({ verificationCode, username }),
    });

    console.log(data);
    console.log(error);

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true, message: "Verification email sent successfully" };
  } catch (error) {
    return { success: false, message: "Failed to send the verification email" };
  }
}
