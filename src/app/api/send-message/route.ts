import { connectDB } from "@/lib/connectDB";
import UserModel, { Message } from "@/models/user.model";
import { messageSchema } from "@/schemas/messageSchema";

export async function POST(request: Request) {
  await connectDB();

  try {
    const { username, message } = await request.json();

    const queryParam = {
      content: message,
    };

    // validate the message with zod
    const result = messageSchema.safeParse(queryParam);

    if (!result.success) {
      const messageErrors = result.error.format().content?._errors || [];

      return Response.json(
        {
          success: false,
          message:
            messageErrors.length > 0
              ? messageErrors.join(", ")
              : "Invalid content",
        },
        { status: 400 }
      );
    }

    const { content } = result.data;

    const user = await UserModel.findOne({ username });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 500 }
      );
    }

    // check if the user is accepting messages
    if (!user.isAceeptingMessages) {
      return Response.json(
        {
          success: false,
          message: `${user.username} is currently not accepting any messages`,
        },
        { status: 403 }
      );
    }

    const newMessage = { content, createdAt: new Date() };
    user.messages.push(newMessage as Message);
    await user.save();

    return Response.json(
      {
        success: true,
        message: `Message sent successfully`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(`Error on sending the message: ${error}`);

    return Response.json(
      {
        success: false,
        message: "Error on sending the message",
      },
      { status: 500 }
    );
  }
}
