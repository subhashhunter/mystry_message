import { resend } from "@/lib/resend";
import VerificationEmail from "../../email/verificationemail";
import { ApiResponse } from "@/types/Apiresponse";
export async function SendVerificationEmail(
    email:string,
    username:string,
    verifyCode:string
):Promise<ApiResponse>{
    try{
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'feedback | verification code',
            react:VerificationEmail({username,otp:verifyCode})
          });
          return{
            success:true,
            message:"verification email sent successfully"
          }

    }
    catch(error){
        console.log("error while sending an email",error)
        return{
            success:false,
            message:"failed to send verification email"
        }
    }
}