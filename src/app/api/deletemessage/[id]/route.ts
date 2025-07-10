import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import mongoose from "mongoose";
import { NextRequest } from "next/server";

async function DELETE(req:NextRequest,{params}:{params:{id:string}}){
    await dbConnect();
    const messageId=params.id
    try {
      const result=await UserModel.updateMany(
            {},
            { $pull: { messages: { _id: new mongoose.Types.ObjectId(messageId) } } }
        )
         return Response.json({
        success: true,
        message: "Message deleted successfully",
        result
    });
    } catch (error) {
         console.error("❌ Delete error:", error);
    return Response.json({
      success: false,
      message: "Failed to delete message"
    }, {
      status: 500
    });
  
    }

}