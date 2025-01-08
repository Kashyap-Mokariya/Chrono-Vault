"use client"

import {
  type LucideIcon,
  ChevronsUpDown,
  CreditCard,
  Frame,
  Image,
  Images,
  Layers,
  Sparkles,
  SquareTerminal,
 } from "lucide-react"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: SquareTerminal
  },
  {
    title: "Generate Image",
    url: "/image-generation",
    icon: Image
  },
  {
    title: "My Models",
    url: "/models",
    icon: Frame
  },
  {
    title: "Train Model",
    url: "/model-training",
    icon: Layers
  },
  {
    title: "My Images",
    url: "/gallery",
    icon: Images
  },
  {
    title: "Billing",
    url: "/billing",
    icon: CreditCard
  },
  {
    title: "Settings",
    url: "/account-settings",
    icon: CreditCard
  }
]

export function NavMain() {

  const pathName = usePathname()

  return (
    <SidebarGroup>
      <SidebarMenu>
        {navItems.map((item) => (
          <Link key={item.title} href={item.url} className={cn("rounded-none",
            pathName === item.url ? "text-black font-medium" : "text-muted-foreground")}>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip={item.title}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </Link>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
