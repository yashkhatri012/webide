"use client";

import React from 'react';
import AddNewButton from "@/features/dashboard/components/add-new-button";
import AddRepo from "@/features/dashboard/components/add-repo-button";
import EmptyState from '@/components/ui/empty-state';

const Page = () => {
  const playgrounds: any[] = [];

  return (
    <div className="flex flex-col justify-start items-center min-h-screen mx-auto max-w-7xl px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <AddNewButton />
        <AddRepo />
      </div>

      <div className="mt-10 flex flex-col justify-center items-center w-full">
        {playgrounds.length === 0 ? (
          <EmptyState
            title="No projects Found"
            description="Create a new project to get started"
            imageSrc="/empty-state.svg"
          />
        ) : null}
      </div>
    </div>
  );
};

export default Page;
