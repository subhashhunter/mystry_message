'use client'
import MessageCard from "@/components/MessageCard"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Message } from "@/model/User"
import { acceptMessagesSchema } from "@/schemas/acceptMessageSchema"
import { ApiResponse } from "@/types/Apiresponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { Loader2, RefreshCcw } from "lucide-react"
import { useSession } from "next-auth/react"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"

 function Page(){
    const [messages,setMessages]=useState<Message[]>([])
    const [isLoading,setIsLoading]=useState(false)
    const[isSwitchLoading,setIsSwitchLoading]=useState(false)
    const {toast}=useToast()
    const handleDeleteMessage=(messageId:string)=>{
        setMessages(messages.filter((message)=>message._id!==messageId))
    }
    const {data:session}=useSession()
    console.log(session)
    const form=useForm({
        resolver:zodResolver(acceptMessagesSchema)
    })
    const {register,watch,setValue}=form
 const acceptMessages=watch('acceptMessages')
 const fetechAcceptMessage=useCallback(async()=>{
    setIsSwitchLoading(true)
    try {
       const response=await axios.get<ApiResponse>('/api/acceptmessage')
       setValue('acceptMessages',response.data.isAcceptingMessage)
        
    } catch (error) {
        const axiosError=error as AxiosError<ApiResponse>
        toast({
            title:"error",
            description:axiosError.response?.data.message || "failed to fetch message",
            variant:"destructive"
        })
    }
    finally{
        setIsSwitchLoading(false)
    }
 },[setValue])
 
  const fetchMessage=useCallback(async(refresh:boolean=false)=>{
    setIsLoading(true)
    setIsSwitchLoading(false)
    try {
        const response=await axios.get<ApiResponse>('/api/getmessage');
        setMessages(response.data.messages ||[])
        if(refresh){
            toast({
                title:"refreshed message",
                description:'showing latest message'
            })
        }
    } catch (error) {
        const axiosError=error as AxiosError<ApiResponse>
        toast({
            title:"error",
            description:axiosError.response?.data.message || "failed to fetch message",
            variant:"destructive"
        })
    }
    finally{
        setIsLoading(false)
        setIsSwitchLoading(false)
    }
  },[setIsLoading,setMessages])

  useEffect(()=>{
  if(!session || !session.user)return
  fetchMessage()
  fetechAcceptMessage()
  },[fetchMessage,fetechAcceptMessage,session,setValue])

  const handleSwitchChange=async()=>{
   try {
    const response=await axios.post('/api/acceptmessage',{
        acceptMessages:!acceptMessages
    })
    setValue('acceptMessages',! acceptMessages);
    toast({
        title:response.data.message,
        variant:'default'
    })
   } catch (error) {
    const axiosError=error as AxiosError<ApiResponse>
    toast({
        title:"error",
        description:axiosError.response?.data.message || "failed to update switch",
        variant:"destructive"
    })
   }
  }
  const username=session?.user.username
  const baseUrl=`${window.location.protocol}//${window.location.host}`
   const profileUrl=`${baseUrl}/u/${username}`
   const copyToClipBoard=()=>{
    navigator.clipboard.writeText(profileUrl)
    .then(()=>{
        alert("copied to clipboard")
    })
    .catch((err) => {
        console.error('Failed to copy text: ', err);
      });
    toast({
        title:"Url copied",
        description:"profile Url has been copied to clipboard"
       })
   }
   
  if(!session || !session.user)
  {
    return <div>Please Login</div>
  }
    return (
        <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white">
            <h1 className="text-4xl font-bold mb-4">
                User Dashboard
            </h1>
            <div className="mb-4">
                <h2 className="text-lg font-semibold mb-4">
                    Copy your unique link
                </h2>
                <div className="flex items-center">
                    <input type="text"
                    value={profileUrl}
                    disabled
                    className="input input-bordered w-full mr-2 p-2" />
                      <Button className="flex" onClick={copyToClipBoard}>Copy</Button>
                </div>
              
            </div>
            <div className="mb-4">
               <Switch
                {...register('acceptMessages')}
                checked={acceptMessages}
                onCheckedChange={handleSwitchChange}
                disabled={isSwitchLoading}
               />
               <span className="ml-2">
                Accept messages:{acceptMessages?'On':'Off'}
               </span>
            </div>
            <Separator/>
           <Button
            className="mt-4"
            variant='outline'
            onClick={(e)=>{
                fetchMessage(true)
            }}
           >
            {isLoading?(
                <Loader2 className="h-4 w-4 animate-spin"/>
            ):(
                <RefreshCcw className="h-4 w-4"/>
            )}
           </Button>
           <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            {messages.length>0 ?(
                messages.map((message,index)=>(
                    <MessageCard 
                    key={message._id}
                    message={message}
                    onMessageDelete={handleDeleteMessage}
                    />
                ))
            ):(
                <p>No message found to display</p>
            )}

           </div>
        </div>
    )
}
export default  Page