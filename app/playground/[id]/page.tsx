"use client";
import { SidebarInset , SidebarTrigger } from '@/components/ui/sidebar';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { useParams } from 'next/navigation';

import { Separator } from "@/components/ui/separator";
import React from 'react'
import { usePlayground } from '@/features/playground/hooks/usePlayground';

const Page = () => {

    const {id} = useParams<{id:string}>();
    const {playgroundData, templateData, isLoading, error, saveTemplateData} = usePlayground(id)

  return (
    <TooltipProvider>
      <>
      {/* TODO: TEMPLATE FFILE TREE */}
      <SidebarInset>
            <header className='flex h-16 shrink-0 items-center gap-2 border-b px-4'>
                <SidebarTrigger className='-ml-1'>
                    <Separator orientation="vertical" className='mr-2 h-4' />
                </SidebarTrigger>
                <div className="flex flex-1 items-center gap-2">
              <div className="flex flex-col flex-1 text-white">
                {playgroundData?.title || "Code Playground"}
              </div>
              </div>
            </header>
            
      </SidebarInset>
      </>
    </TooltipProvider>
  )
}

export default Page
