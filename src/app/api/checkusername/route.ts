import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/User";
import { usernameValidation } from "@/schemas/signupSchema"
import {z} from "zod"

const UsernameQuerySchema=z.object({
    username:usernameValidation
})
export async function GET(request:Request){
   await dbConnect();
   try{
    const {searchParams}=new URL(request.url);
    const queryParam={
        username:searchParams.get('username')
    }
    const result=UsernameQuerySchema.safeParse(queryParam)
    if(!result.success)
    {
        const UsernameErrors=result.error.format().username?._errors ||[]
        return Response.json({
            success:false,
            message:"invalid query param"
        },{
            status:400
        })
    }
    const {username}=result.data
    const existingUserVerified=await UserModel.findOne({
        username,isVerified:true
    })
    if(existingUserVerified){
        return Response.json({
            success:false,
            message:"username is already taken"
        },{
            status:400
        })
    }
    return Response.json({
        success:true,
        message:"username is unique"
    },{
        status:400
    })

   }

   catch(error){
    console.error("Error check username",error)
    return Response.json({
        success:false,
        message:"Error check username"
    },{
        status:500
    })
   }
}