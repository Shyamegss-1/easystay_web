import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/ApiResponse";
import VerificationEmail from "../../emails/VerificationEmail";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verificationToken: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Verification Code",
      react: VerificationEmail({ username, otp: verificationToken }),
    });
    return { success: true, message: "Verification email send successfully" };
  } catch (error) {
    console.log("Error sending verification email", error);
    return { success: false, message: "Failed to send email" };
  }
}
