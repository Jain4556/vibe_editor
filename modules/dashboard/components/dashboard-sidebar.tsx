"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    Code2,
    Compass,
    FolderPlus,
    History,
    Home,
    LayoutDashboard,
    Lightbulb,
    type LucideIcon,
    Plus,
    Settings,
    Star,
    Terminal,
    Zap,
    Database,
    FlameIcon,
} from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarGroupAction,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"
import Image from "next/image"

interface PlaygroundData {
    id: string
    name: string
    icon: string
    starred: boolean
}

const lucideIconMap: Record<string, LucideIcon> = {
    Zap,
    Lightbulb,
    Database,
    Compass,
    FlameIcon,
    Terminal,
    Code2,
}

export function DashboardSidebar({
    initialPlaygroundData,
}: {
    initialPlaygroundData: PlaygroundData[]
}) {
    const pathname = usePathname()
    const [starredPlaygrounds] = useState(
        initialPlaygroundData.filter((p) => p.starred)
    )
    const [recentPlaygrounds] = useState(initialPlaygroundData)

    return (
        <Sidebar variant="inset" collapsible="icon" className="border b order-r">
            <SidebarHeader>
                <div className="flex items-center justify-center px-4 py-3">
                    <Image src="/logo.svg" alt="logo" height={60} width={60} />
                </div>
            </SidebarHeader>

            <SidebarContent>
                {/* MAIN MENU */}
                <SidebarGroup>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <Link href="/">
                                <SidebarMenuButton isActive={pathname === "/"} tooltip="Home">
                                    <Home className="h-4 w-4" />
                                    <span>Home</span>
                                </SidebarMenuButton>
                            </Link>
                        </SidebarMenuItem>

                        <SidebarMenuItem>
                            <Link href="/dashboard">
                                <SidebarMenuButton
                                    isActive={pathname === "/dashboard"}
                                    tooltip="Dashboard"
                                >
                                    <LayoutDashboard className="h-4 w-4" />
                                    <span>Dashboard</span>
                                </SidebarMenuButton>
                            </Link>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>

                {/* STARRED */}
                <SidebarGroup>
                    <SidebarGroupLabel>
                        <Star className="mr-2 h-4 w-4" />
                        Starred
                    </SidebarGroupLabel>

                    <SidebarGroupAction title="Add starred playground">
                        <Plus className="h-4 w-4" />
                    </SidebarGroupAction>

                    <SidebarGroupContent>
                        <SidebarMenu>
                            {starredPlaygrounds.length === 0 &&
                                recentPlaygrounds.length === 0 ? (
                                <div className="w-full py-4 text-center text-muted-foreground">
                                    Create your playground
                                </div>
                            ) : (
                                starredPlaygrounds.map((playground) => {
                                    const IconComponent =
                                        lucideIconMap[playground.icon] || Code2

                                    return (
                                        <SidebarMenuItem key={playground.id}>
                                            <Link href={`/playground/${playground.id}`}>
                                                <SidebarMenuButton
                                                    isActive={
                                                        pathname === `/playground/${playground.id}`
                                                    }
                                                    tooltip={playground.name}
                                                >
                                                    <IconComponent className="h-4 w-4" />
                                                    <span>{playground.name}</span>
                                                </SidebarMenuButton>
                                            </Link>
                                        </SidebarMenuItem>
                                    )
                                })
                            )}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* RECENT */}
                <SidebarGroup>
                    <SidebarGroupLabel>
                        <History className="mr-2 h-4 w-4" />
                        Recent
                    </SidebarGroupLabel>

                    <SidebarGroupAction title="Create new playground">
                        <FolderPlus className="h-4 w-4" />
                    </SidebarGroupAction>

                    <SidebarGroupContent>
                        <SidebarMenu>
                            {starredPlaygrounds.length === 0 &&
                                recentPlaygrounds.length === 0
                                ? null
                                : recentPlaygrounds.map((playground) => {
                                    const IconComponent =
                                        lucideIconMap[playground.icon] || Code2

                                    return (
                                        <SidebarMenuItem key={playground.id}>
                                            <Link href={`/playground/${playground.id}`}>
                                                <SidebarMenuButton
                                                    isActive={
                                                        pathname === `/playground/${playground.id}`
                                                    }
                                                    tooltip={playground.name}
                                                >
                                                    <IconComponent className="h-4 w-4" />
                                                    <span>{playground.name}</span>
                                                </SidebarMenuButton>
                                            </Link>
                                        </SidebarMenuItem>
                                    )
                                })}

                            <SidebarMenuItem>
                                <Link href="/playgrounds">
                                    <SidebarMenuButton tooltip="View all">
                                        <span className="text-sm text-muted-foreground">
                                            View all playgrounds
                                        </span>
                                    </SidebarMenuButton>
                                </Link>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            {/* FOOTER */}
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <Link href="/settings">
                            <SidebarMenuButton tooltip="Settings">
                                <Settings className="h-4 w-4" />
                                <span>Settings</span>
                            </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    )
}