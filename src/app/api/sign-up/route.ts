import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { connectDB } from "@/lib/connectDB";
import UserModel from "@/models/user.model";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  await connectDB();
  try {
    const { username, email, password } = await request.json();

    const existingUserByUsername = await UserModel.findOne({ username });

    if (existingUserByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username already exsits",
        },
        {
          status: 500,
        }
      );
    }

    const existingUserByEmail = await UserModel.findOne({ email });

    // Generate a 6-digit verification code
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Set the expiry time to 30 minutes from now
    const codeExpiry = new Date(Date.now() + 30 * 60 * 1000);

    if (existingUserByEmail) {
      const isVerifiedUser = existingUserByEmail.isVerified;

      if (isVerifiedUser) {
        // user account with this email is already verified
        return Response.json(
          {
            success: false,
            message: "User already exist with this email",
          },
          {
            status: 400,
          }
        );
      } else {
        // user account with this email is not verified
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = codeExpiry;

        await existingUserByEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: codeExpiry,
      });

      await newUser.save();
    }

    // send the verification email
    const emailResponse = await sendVerificationEmail({
      email,
      username,
      verificationCode: verifyCode,
    });

    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        {
          status: 500,
        }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User registered successfully. Please verify your email",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error on registering the user ", error);
    return Response.json(
      {
        success: false,
        message: "Error registering the user",
      },
      {
        status: 500,
      }
    );
  }
}
