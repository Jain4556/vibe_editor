"use client";

import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import Image from "next/image";

const AddRepo = ({ onClick }: { onClick: () => void }) => {
  return (
    <div
      onClick={onClick}
      className="group px-6 py-6 flex flex-row justify-between items-center border rounded-lg bg-muted cursor-pointer 
      transition-all duration-300 ease-in-out
      hover:bg-background hover:border-[#E93F3F] hover:scale-[1.02]"
    >
      <div className="flex gap-4">
        <Button type="button" variant="outline" size="icon">
          <ArrowDown size={30} />
        </Button>

        <div>
          <h1 className="text-xl font-bold text-[#e93f3f]">
            Open Github Repository
          </h1>
          <p className="text-sm text-muted-foreground">
            Work with your repositories
          </p>
        </div>
      </div>

      <Image src="/github.svg" alt="GitHub" width={150} height={150} />
    </div>
  );
};

export default AddRepo;