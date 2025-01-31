import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

import messages from '@/message.json'

export default function Home(){
    return (
        <main className="flex flex-col justify-center items-center
        px-4 md:px-24 py-12">
            <section className="text-center mb-8 md:mb-12">
                <h1 className="text-3xl md:text-5xl">
                    Dive into the world of anonymous conversation
                </h1>
                <p className="mt-3 md:mt-4 text-2xl md:text-lg font-semibold">
                    explore mystry Message-Where your identity remains a secret</p>
            </section><Carousel className="w-full max-w-xs">
      <CarouselContent>
        {
            messages.map((message,index)=>(
                <CarouselItem key={index}>
                <div className="p-1">
                  <Card>
                    <CardHeader>
                        {message.title}
                    </CardHeader>
                    <CardContent className="flex aspect-square items-center justify-center p-6">
                      <span className="text-lg font-semibold">{message.content}</span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))
        }
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
        </main>
    )
}