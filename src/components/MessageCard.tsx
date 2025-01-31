import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { Button } from "./ui/button"
import { Message } from "@/model/User"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"
import { ApiResponse } from "@/types/Apiresponse"
  
type MessageCardProps={
    message:Message,
    onMessageDelete:(messageId:string)=>void
}
export default function MessageCard({message,onMessageDelete}:MessageCardProps){
    const {toast}=useToast();
   const handleDeleteConfirm=async()=>{
  const response= await axios.delete<ApiResponse>(`/api/deletemessage/${message._id}`)
  toast({
    title:response.data.message
  })
  onMessageDelete(message._id)

   }
  
    return (
     <Card>
      <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <AlertDialog>
      <AlertDialogTrigger asChild>
      <div className="flex items-center justify-between">
        {/* Card Title */}
        <h2 className="text-lg font-bold">title</h2>

        {/* X Button in the top-right corner of the same row */}
        <Button
          className="w-8 h-8"
          variant="destructive"
        >
          X
        </Button>
      </div>
        
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    <CardDescription>Card Description</CardDescription>
  </CardHeader>
  <p>{message.content}</p>
  <CardContent>
  </CardContent>
  <CardFooter>
  </CardFooter>
</Card>

    )
}
