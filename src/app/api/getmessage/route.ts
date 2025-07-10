import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User";

export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  console.log("🔍 Session:", session);

  if (!session || !session.user) {
    return Response.json({
      success: false,
      message: "User is not authenticated"
    }, {
      status: 400
    });
  }

  try {
   
    const usersWithMessages = await UserModel.aggregate([
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      {
        $group: {
          _id: null, 
          messages: { $push: "$messages" }
        }
      }
    ]);

    if (!usersWithMessages || usersWithMessages.length === 0) {
      return Response.json({
        success: false,
        message: "No messages found"
      }, {
        status: 404
      });
    }

    return Response.json({
      success: true,
      messages: usersWithMessages[0].messages
    }, {
      status: 200
    });

  } catch (error) {
    console.log("An unexpected error", error);
    return Response.json({
      success: false,
      message: "An unexpected error occurred"
    }, {
      status: 500
    });
  }
}
