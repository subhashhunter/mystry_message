'use client'
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { verifySchema } from "@/schemas/verifySchema";
import { ApiResponse } from "@/types/Apiresponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function verifyaccount(){
    const router=useRouter();
    const param=useParams()
    const {toast}=useToast()
    const form=useForm<z.infer<typeof verifySchema>>({
        resolver:zodResolver(verifySchema)
    })
    const onSubmit=async(data:z.infer<typeof verifySchema>)=>{
        try {
            const response=await axios.post('/api/verifycode',{
                username:param.username,
                code:data.code
            })
            toast({
                title:"success",
                description:response.data.message
            })
            router.replace('/dashboard')
        } catch (error) {
              const axioserror=error as AxiosError<ApiResponse>;
                 let errorMessage=axioserror.response?.data.message
                 toast({
                        title:"code verificstion failed",
                            description:errorMessage,
                            variant:"destructive"
                    })
        }
    }
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
               <div className="text-center">
               <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        verify your account
                    </h1>
                    <p className="mb-4">Enter your verification code sent to your email</p>
                </div> 
                <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Code</FormLabel>
              <FormControl>
                <Input placeholder="Code" {...field} />
              </FormControl>
              <FormDescription>
                Enter your verification code
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
            </div>

        </div>
    )
}