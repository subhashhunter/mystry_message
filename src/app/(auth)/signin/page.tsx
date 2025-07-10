'use client'
import { useToast } from "@/hooks/use-toast";
import { signinSchema } from "@/schemas/signinSchema";
import { signIn } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
export default function Page(){
    const {toast}=useToast();
    const router=useRouter();
    const form=useForm<z.infer<typeof signinSchema>>({
        defaultValues:{
            email:'',
            password:''
        }

    })
   const onSubmit=async(data:z.infer<typeof signinSchema>)=>{
     const result= await signIn('credentials',{
        redirect:false,
        email:data.email,
        password:data.password
    })
    if (result?.error) {
        if (result.error === 'CredentialsSignin') {
          toast({
            title: 'Login Failed',
            description: 'Incorrect username or password',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Error',
            description: result.error,
            variant: 'destructive',
          });
        }
      }
  
      if (result?.url) {
        router.replace('/dashboard');
      }
   }
   return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="max-w-md w-full p-8 space-y-6 bg-white rounded-lg shadow-md">
            <div className="text-center">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                    Signin to mystry message
                </h1>
                <p className="mb-4">
                    Signin to start your anonymous advanture
                </p>

            </div>
            <Form  {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}className="space-y-6">
           <FormField
               control={form.control}
                 name="email"
                render={({ field }) => (
         <FormItem>
              <FormLabel>email/username</FormLabel>
              <FormControl>
                <Input placeholder="email/username" {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
               control={form.control}
                 name="password"
                render={({ field }) => (
         <FormItem>
              <FormLabel>password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="password" {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="display flex gap-2">
          <Button  type="submit" >signin</Button>
        <div className="text-center mt-4">
               <p> Don't have account?{' '}
               <Link href='/signup' className="text-blue-600 hover:text-blue-800">signup
               </Link>
               </p>
            </div>
        </div>
          </form>
            </Form>
            
        </div>
        

    </div>
   )
}