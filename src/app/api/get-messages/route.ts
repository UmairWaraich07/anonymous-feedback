import { connectDB } from "@/lib/connectDB";
import UserModel from "@/models/user.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET() {
  await connectDB();

  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      {
        success: false,
        message: "Not authenticated",
      },
      { status: 401 }
    );
  }
  const user = session.user;

  const userId = new mongoose.Types.ObjectId(user._id);

  try {
    const user = await UserModel.aggregate([
      {
        $match: {
          _id: userId,
        },
      },
      {
        $unwind: "$messages",
      },
      {
        $sort: {
          "$messages.createdAt": -1,
        },
      },
      {
        $group: {
          _id: "$_id",
          messages: { $push: "$messages" },
        },
      },
    ]);

    if (!user || user.length === 0) {
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
        messages: user[0].messages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error on getting the messages: ${error}`);

    return Response.json(
      {
        success: false,
        message: "Error on getting the messages",
      },
      { status: 500 }
    );
  }
}
