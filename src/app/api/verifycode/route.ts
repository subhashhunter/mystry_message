import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/User";

export async function POST(request:Request){
    await dbConnect();
    try{
        const{username,code}=await request.json()
        const decodedUsername=decodeURIComponent(username)
       const user= await UserModel.findOne({username:decodedUsername})
       if(!user){
        return Response.json({
            success:false,
            message:"user not found"
        },{
            status:500
        })
       }
       const isCodeValid=user.verifyCode===code
       const isCodeNotExpired=new Date(user.verifyCodeExpiry)>new Date()
       if(isCodeNotExpired && isCodeValid){
        user.isVerified=true
         await user.save();
         console.log("verified")
         return Response.json({
            success:true,
            message:"account verifies successfully",
            
           },{
            status:200
           })
       }
      else if(!isCodeNotExpired){
        return Response.json({
              success:false,
            message:"verification code has expired.please signup again"
        },{
            status:400
        })
       }
       else{
        return Response.json({
            success:false,
            message:"verification code is incorrect"
        },{
            status:400
        })
       }   
    }
    catch(error){
        return Response.json({
            success:false,
            message:"Error verifying user"
        },{
            status:500
        })

    }
   
}