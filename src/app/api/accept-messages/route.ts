import { connectDB } from "@/lib/connectDB";
import UserModel from "@/models/user.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function PATCH(request: Request) {
  await connectDB();

  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not authenticated",
      },
      { status: 401 }
    );
  }
  const user = session.user;

  const userId = user._id;

  try {
    const acceptMessages = await request.json();
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        isAceeptingMessages: acceptMessages,
      },
      { new: true }
    );

    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          messae: "Failed to update the message acceptance status",
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Successfully updated the message acceptance status",
        updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error on changing the message acceptance status: ${error}`);
    return Response.json(
      {
        success: false,
        message: "Error on changing the message acceptance status",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  await connectDB();

  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not authenticated",
      },
      { status: 401 }
    );
  }
  const user = session.user;

  const userId = user._id;

  try {
    const foundUser = await UserModel.findById(userId);

    if (!foundUser) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 401 }
      );
    }

    return Response.json(
      {
        success: true,
        isAceptingMessages: foundUser.isAceeptingMessages,
      },
      { status: 401 }
    );
  } catch (error) {
    console.error(`Error on getting the message acceptance status : ${error}`);

    return Response.json(
      {
        success: false,
        message: "Error on getting the message acceptance status",
      },
      { status: 500 }
    );
  }
}
