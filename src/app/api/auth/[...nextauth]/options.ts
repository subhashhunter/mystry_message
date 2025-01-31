import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs"
export const authOptions:NextAuthOptions={
    providers:[
        CredentialsProvider({
            id:"credentials",
            name:"credentials",
            credentials:{
                email:{label:"email",type:"text"},
                password:{label:"password",type:"text",placeholder:"password"}
            },
               async  authorize(credentials, req):Promise<any> {
               await dbConnect();
               try{
              const user=  await UserModel.findOne({
                   email:credentials?.email,
                })
                if(!user){
                    throw new Error("no user found with this email")
                }
                if(!user.isVerified){
                    throw new Error("please verify your email")
                }
                const isCorrectPassword=await bcrypt.compare(credentials?.password ||"" ,user.password)
                if(isCorrectPassword)
                {
                    return user;
                }
                else{
                    throw new Error("passowrd is incorrect")
                }

               }
               catch(error:any){
                throw new Error(error)
               }
            },
        })
    ],
    
    pages:{
        signIn:'/signin'
    },
    callbacks:{
        async jwt({token,user}){
            if(user){
                token._id=user._id
                token.isVerified=user.isVerified
                token.isAcceptingMessage=user.isAcceptingMessage
                token.username=user.username
            }
            return token
        },
        async session({ session, token }) {
            if (token) {
              session.user._id = token._id;
              session.user.isVerified = token.isVerified;
              session.user.isAcceptingMessage = token.isAcceptingMessage;
              session.user.username = token.username;
            }
            return session;
          },

    },
    session:{
        strategy:"jwt"
    },
    secret:process.env.NEXTAUTH_SECRET
}