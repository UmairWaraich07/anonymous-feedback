import { connectDB } from "@/lib/connectDB";
import UserModel from "@/models/user.model";
import { verifySchema } from "@/schemas/verifySchema";

export async function POST(request: Request) {
  await connectDB();

  try {
    const { email, code } = await request.json();

    const queryParam = {
      code,
    };

    // validate the code with zod
    const result = verifySchema.safeParse(queryParam);

    if (!result.success) {
      const verifyCodeErrors = result.error.format().code?._errors || [];

      return Response.json(
        {
          success: false,
          message:
            verifyCodeErrors.length > 0
              ? verifyCodeErrors.join(", ")
              : "Invalid verify code",
        },
        { status: 400 }
      );
    }

    const { code: verifyCode } = result.data;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 400 }
      );
    }

    const isVerifyCodeCorrect = user.verifyCode === verifyCode;

    const isVerifyCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isVerifyCodeCorrect && isVerifyCodeNotExpired) {
      user.isVerified = true;
      await user.save();

      return Response.json(
        {
          success: true,
          message: "Account verified successfully",
        },
        {
          status: 200,
        }
      );
    }

    if (!isVerifyCodeCorrect) {
      return Response.json(
        {
          success: false,
          message: "Invalid code",
        },
        { status: 400 }
      );
    }

    if (!isVerifyCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message:
            "Verification code is expired. Please signup again to get a new verification code.",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error(`Error on verifying code: ${error}`);
    return Response.json(
      {
        success: false,
        message: "Failed to verify the code",
      },
      {
        status: 500,
      }
    );
  }
}
