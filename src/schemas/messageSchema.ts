import {z} from 'zod'
export const MessageSchema=z.object({
    content:z.
    string()
    .min(10,{message:"content must be of atleast 10 length"})
})