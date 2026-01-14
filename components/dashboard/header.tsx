"use client"

import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

export const Header = () => {
  return (
    <div className="flex items-center p-4 border-b h-16 bg-background">
      <Button variant="ghost" size="icon" className="md:hidden">
        <Menu />
      </Button>
      <div className="flex w-full justify-end">
        {/* User Button Placeholder */}
        <div className="h-8 w-8 rounded-full bg-slate-200" /> 
      </div>
    </div>
  )
}
