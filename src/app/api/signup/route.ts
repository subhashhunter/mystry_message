import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs"
import { SendVerificationEmail } from "@/helpers/sendverificationemail";
export async function POST(request:Request){
  await dbConnect();
  try{
 const {username,email,password}= await request.json()
 const existingUserVerifirdByUsername=await UserModel.findOne({
    username,
    isVarified:true
 })

 if(existingUserVerifirdByUsername){
    return Response.json({
        success:false,
        message:"username is already taken"
    },
  {
    status:400
  })
 }
 const existingUserByemail=await UserModel.findOne({email})
 const verifyCode=Math.floor(100000+Math.random()*900000).toString()

   if(existingUserByemail){
     if(existingUserByemail.isVerified){
        return Response.json({
            success:true,
             message:"email  already exist. try with other email"
        },{
            status:400
        })
     }
     else{
        const hashedPassword=await bcrypt.hash(password,10);
        existingUserByemail.password=hashedPassword;
        existingUserByemail.verifyCode=verifyCode;
        existingUserByemail.verifyCodeExpiry=new Date(Date.now()+3600000)
        await existingUserByemail.save();
     }
  }
  else{
   const hashedPassword= await bcrypt.hash(password,10);
   const expiryDate=new Date() 
   expiryDate.setHours(expiryDate.getHours()+1)
   const newUser=  new UserModel({
           username,
            email,
            password:hashedPassword,
            verifyCode:verifyCode,
            verifyCodeExpiry:expiryDate,
            isVarified:false,
            isAcceptingMessage:true,
            messsage:[]
    })
        await newUser.save()
  }
  const emailResponse=  await SendVerificationEmail(email,username,verifyCode)
  if(!emailResponse.success){
     return Response.json(
        {
             success:false,
             message:emailResponse.message
        }
    ,{
        status:500
    })
  }
  return Response.json({
    success:true,
    message:"user registered successfully.plaese verify email"
  },{
    status:201
  })
  }
  catch(error){
    console.error("error while signup",error)
    return Response.json(
        {
        success:false,
        message:"error registring user"
    },{
        status:500
    }
    )
  }
}