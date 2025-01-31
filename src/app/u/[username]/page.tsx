'use client'
import { useToast } from "@/hooks/use-toast"
import { MessageSchema } from "@/schemas/messageSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { useParams } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
export default  function Page(){

  const[messages,setMessages]=useState<string[]>([])
    const {toast}=useToast()
    const param=useParams()
    const form=useForm<z.infer<typeof MessageSchema>>({
        resolver:zodResolver(MessageSchema),
        defaultValues:{
            content:''
        }
    })
    
    const handleSendMessage=async(data: z.infer<typeof MessageSchema>)=>{
        try {
            const response=await axios.post('/api/sendmessage',{
                username:param.username,
                content:data.content
            })
            toast({
                title:"message sent successfully",
                description:"sent successfully"
            })
        } catch (error) { 
            toast({
                title:"error",
                description:"message can not send"
            })
        }
    }
    const handleSuggestMessage = () => {
      try {
        // Mock suggestions
        const suggestions = [
          "What’s a hobby you’ve recently started?",
          "If you could have dinner with any historical figure, who would it be?",
          "What’s a simple thing that makes you happy?",
          "What’s a place you’ve always wanted to visit?",
          "If you could relive any day from your past, which day would it be?",
        ]
        // Randomly pick 3 suggestions
        const randomSuggestions = suggestions
          .sort(() => 0.5 - Math.random())
          .slice(0, 3)
  
        setMessages(randomSuggestions)
        toast({
          title: "Suggestions Generated",
          description: "Here are some suggested messages.",
        })
      } catch (error) {
        console.error("Error generating suggestions:", error)
        toast({
          title: "Error",
          description: "Could not generate suggestions.",
        })
      }
    }
    return (
        <div className=" container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
            <h1 className="text-4xl  font-bold mb-6 text-center">
                Public profile Name
            </h1>
            
            <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSendMessage)} className="space-y-8">
        <FormField 
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Send Anonymous Message to </FormLabel>
              <FormControl>
                <Input  placeholder="Write your anonymous message here" 
                {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
    <Button className="mt-6" onClick={handleSuggestMessage}>
      Suggest Messages
    </Button>
    <div>
  {messages ? (
    <p>{messages}</p>
  ) : (
    <p>No suggested messages yet. Click "Suggest Messages" to generate them.</p>
  )}
</div>
            
        </div>
    )
}