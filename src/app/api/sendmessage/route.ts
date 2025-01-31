import dbConnect from "@/lib/dbConnect";
import UserModel, { Message } from "@/model/User";

export async function POST(request:Request){
    await dbConnect()
    const {username,content}=await request.json();
    try{
        const user=await UserModel.findOne({username})
        if(!user){
            return Response.json({
                success:false,
                message:"user  not found"
            },{
                status:404
            })  
        }
        if(!user.isAcceptingMessage){
            return Response.json({
                success:false,
                message:"user  is not Accepting message"
            },{
                status:401
            })
        }
        const newMessage={content,createdAt:new Date()}
       user. messages.push(newMessage as Message)
       await user.save();
       return Response.json({
        success:true,
        message:" message sent successfully"
    },{
        status:200
    })
    }
    catch(error){
        console.log("error while send message")
        return Response.json({
            success:false,
            message:"unable to send message"
        },{
            status:500
        })

    }
}