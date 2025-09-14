import AppLineChart from "@/components/AppLineChart"
import CardList from "@/components/CardList"
import EditUser from "@/components/EditUser"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Progress } from "@/components/ui/progress"
import { Sheet, SheetTrigger } from "@/components/ui/sheet"
import { BadgeCheck, Candy, Citrus } from "lucide-react"


const SingleUserPage = () => {
  return (
    <div>
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbLink href="/users">Users</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbPage>Jahn</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>

        {/* CONTAINER */}
        <div className="mt-4 flex flex-col xl:flex-row gap-8">
            {/* LEFT */}
            <div className="w-full xl:w-1/3 space-y-6">
                {/* USER BADGES CONTAINER */}
                <div className="bg-primary-foreground p-4 rounded-lg">
                    <h1 className="text-xl font-semibold">User Badges</h1>
                    <div className="flex gap-4 mt-4">
                        <HoverCard>
                            <HoverCardTrigger>
                                <BadgeCheck size={36} className="rounded-full bg-blue-500/30 border-1 border-blue-500/50 p-2"/>
                            </HoverCardTrigger>
                            <HoverCardContent>
                                <h1 className="font-bold mb-2">Verified User</h1>
                                <p className="text-sm text-muted-foreground">This user has been Verified by the admin</p>
                            </HoverCardContent>
                        </HoverCard>
                        <HoverCard>
                            <HoverCardTrigger>
                                <Candy size={36} className="rounded-full bg-orange-500/30 border-1 border-orange-500/50 p-2"/>
                            </HoverCardTrigger>
                            <HoverCardContent>
                                <h1 className="font-bold mb-2">Popular User</h1>
                                <p className="text-sm text-muted-foreground">This user has been Awarded for the contribution</p>
                            </HoverCardContent>
                        </HoverCard>
                        <HoverCard>
                            <HoverCardTrigger>
                                <Citrus size={36} className="rounded-full bg-green-500/30 border-1 border-green-500/50 p-2"/>
                            </HoverCardTrigger>
                            <HoverCardContent>
                                <h1 className="font-bold mb-2">Awarded User</h1>
                                <p className="text-sm text-muted-foreground">This user has been popular in the community</p>
                            </HoverCardContent>
                        </HoverCard>
                    </div>
                </div>
                {/* INFORMATION CONTAINER */}
                <div className="bg-primary-foreground p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl font-semibold">User Information</h1>
                        <Sheet>
                        <SheetTrigger asChild>
                            <Button>Edit User</Button>
                        </SheetTrigger>
                        {/* Edit User Form Here  */}
                        <EditUser/>
                        </Sheet>
                    </div>

                    <div className="space-y-4 mt-4">
                        <div className="flex flex-col gap-2 mb-8">
                            <p className="text-sm text-muted-foreground">Profile Completion</p>
                            <Progress value={63} />
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-bold">Username:</span>
                            <span> john.doe</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-bold">Email:</span>
                            <span> john.doe@nezig.com</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-bold">Phone Number:</span>
                            <span>+97 78 924 4778</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-bold">Location:</span>
                            <span>Kurudugaha Hathakma</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-bold">User Role:</span>
                            <Badge className="text-sm">Admin</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-4">Joined on 2025.01.01</p>
                    </div>
                </div>
                {/* CARD LIST CONTAINER */}
                <div className="bg-primary-foreground p-4 rounded-lg space-y-2">
                    <CardList title="Recent Transactions"/>
                </div>
            </div>
            {/* RIGHT */}
            <div className="w-full xl:w-2/3 space-y-6">
                {/* USER CARD CONTAINER */}
                <div className="bg-primary-foreground p-4 rounded-lg">
                    <div className="flex items-center gap-2">
                        <Avatar className="size-12">
                            <AvatarImage src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGLRAlpUwgnA01Ksosn99mzvGi1dZEeLS0Mw&s" />
                            <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <h1 className="text-xl font-semibold">John Doe</h1>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                </div>
                {/* CHART CONTAINER */}
                <div className="bg-primary-foreground p-4 rounded-lg">
                    <h1 className="text-xl font-semibold">User Activity</h1>
                    <AppLineChart/>
                </div>
            </div>
        </div>
    </div>
  )
}

export default SingleUserPage