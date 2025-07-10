import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request:Request){
    await dbConnect()
    const session=await getServerSession(authOptions)
    console.log("hello")
    console.log(session)
    const user= session?.user
    if(!session || !session.user){
        return Response.json({
            success:false,
            message:"you are not logged in"
        },{
            status:401
        })
    }
    const userId=user._id;
    const {acceptingMessages}=await request.json();
    try{
        const updatedUser=await UserModel.findByIdAndUpdate(
            userId,
            {isAcceptingMessage:acceptingMessages},
            {new:true}
        )
        if(!updatedUser){
            return Response.json({
                success:false,
                message:"failed to update user status to accept the message",
                updatedUser
            },{
                status:401
            })
        }
        return Response.json({
            success:true,
            message:"successfully  update user status to accept the message"
        },{
            status:200
        })

    }
    catch(error){
        console.error("failed to update the status of user to accept the message")
        return Response.json({
            success:false,
            message:"failed to update user status to accept the message"
        },{
            status:500
        })
    }
}
export async function GET(request:Request){
    await dbConnect()
    const session=await getServerSession(authOptions)
    const user=await session?.user
    if(!session || !session.user){
        return Response.json({
            success:false,
            message:"Not Authnticated"
        },{
            status:401
        })
    }
    const userId=user._id;
    try{
        const foundUser=await UserModel.findById(userId)
        if(!foundUser){
            return Response.json({
                success:false,
                message:"user not found",
                
            },{
                status:404
            })
        }
        return Response.json({
            success:true,
            isAcceptingMessage:foundUser.isAcceptingMessage
            
        },{
            status:200
        })
        
    }
    catch(error){
        console.error("failed to update the status of user to accept the message")
        return Response.json({
            success:false,
            message:"error in getting message acceptinng status"
        },{
            status:500
        })
    }

}