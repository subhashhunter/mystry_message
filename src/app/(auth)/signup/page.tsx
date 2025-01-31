'use client'
import React, { useEffect, useState } from "react";
import {useDebounceValue,useDebounceCallback} from 'usehooks-ts'
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { SignupSchema } from "@/schemas/signupSchema";
import { zodResolver } from '@hookform/resolvers/zod';
import {z} from 'zod'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from "@/types/Apiresponse";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";
 function Page(){
    const [username,setUsername]=useState('')
    const[usernameMessage,setUsernameMessage]=useState('')
    const[isCheckingUsername,setIsCheckingUsername]=useState(false)
    const[isSubmitting,setIsSubmitting]=useState(false)
    const dedebounced=useDebounceCallback(setUsername,300)
    const { toast } = useToast()
    const router=useRouter()
    //zod imp
    const form=useForm<z.infer<typeof SignupSchema>>({
        resolver:zodResolver(SignupSchema),
        defaultValues:{
            username:'',
            email:'',
            password:''
        }
    })
    useEffect(()=>{
        const checkUsername=async()=>{
            if(username){
                setIsCheckingUsername(true)
                setUsernameMessage('')
                try {
                   const response=  await axios.get(`/api/checkusername?username=${username}`)
                  setUsernameMessage(response.data.message)
                } catch (error) {
                    const axioserror=error as AxiosError<ApiResponse>;
                    setUsernameMessage(axioserror.response?.data.message
                         ??"error checking username")
                }
                finally{
                    setIsCheckingUsername(false)
                }
            }
        }
      
        checkUsername()
    },[username])
    
    const onSubmit=async(data:z.infer<typeof SignupSchema>)=>{
        setIsSubmitting(true)
        try {
            const response=await axios.post('/api/signup',data)
            toast({
                title:'success',
                description:response.data.message
            })
            router.replace(`/verify/${username}`)
            setIsSubmitting(false)
        } catch (error) {
            // console.log("error in signup",error)
            const axioserror=error as AxiosError<ApiResponse>;
            let errorMessage=axioserror.response?.data.message
            toast({
                title:"signup failed",
                description:errorMessage,
                variant:"destructive"
            })
            setIsSubmitting(false)
        }

    }

    return(
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        join mystry message
                    </h1>
                    <p className="mb-4">Signup to start your anonymous advanture</p>

                </div>
                <Form  {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}className="space-y-6">
                    <FormField
               control={form.control}
                 name="username"
                render={({ field }) => (
         <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="username" {...field}
                onChange={(e)=>{
                    field.onChange(e)
                    dedebounced(e.target.value)
                }}
                />
              </FormControl>
              {isCheckingUsername && <Loader2 className="animate-spin"/>}
              <p className={`text-sm 
                ${usernameMessage==="username is unique"? 'text-green-500':'text-red-500'}`}>
                 {usernameMessage}
              </p>
              <FormMessage />
            </FormItem>
          )}
        />
           <FormField
               control={form.control}
                 name="email"
                render={({ field }) => (
         <FormItem>
              <FormLabel>email</FormLabel>
              <FormControl>
                <Input placeholder="email" {...field}
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
        <Button  type="submit" disabled={isSubmitting}>
            {
                isSubmitting ?(
                    <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin"></Loader2>
                    </>
                ):('signup')
            }
        </Button>
          </form>
            </Form>
            <div className="text-center mt-4">
               <p> Already a member?{' '}
               <Link href='/signin' className="text-blue-600 hover:text-blue-800">signin
               </Link>
               </p>
            </div>
            </div>

        </div>
    )
}
export  default Page


