import {z} from "zod"
export const usernameValidation=z.string().min(2,"username must be of atleat 2 char")
export const SignupSchema=z.object({
    username:usernameValidation,
    email:z.string().email({message:"invalid email"}),
    password:z.string().min(5,{message:'passwowwrd of atleast of 6 char'})
})