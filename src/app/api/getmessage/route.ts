import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";
import UserModel from "@/model/User";

export async function GET(request:Request){
    await dbConnect();
    const session=await getServerSession(authOptions);
    const user=await session?.user
    if(!session || !session.user){
        return Response.json({
            success:false,
            message:"user is not Authnticated"
        },{
            status:400
        })
    }
    const userId=new mongoose.Types.ObjectId(user._id as string);
    try{
        const user=await UserModel.aggregate([
            {$match:{_id:userId}},
            {$unwind:'$messages'},
            {$sort:{'messages.createdAt':-1}},
            {$group:{_id:'$_id',messages:{$push:'$messages'}}}
        ])
        if(!user ||user.length==0)
        {
            return Response.json({
                success:false,
                message:"user  not found"
            },{
                status:401
            })
        }
        return Response.json({
            success:true,
            messages:user[0].messages
        },{
            status:200
        })
    }
    catch(error){
       console.log("an unexpted error",error)
       return Response.json({
        success:false,
        message:"An unexpted error"
        },{
        status:500
      })
 
    }


}