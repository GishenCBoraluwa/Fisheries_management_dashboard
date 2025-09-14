"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { SheetContent, SheetDescription, SheetHeader, SheetTitle } from "./ui/sheet"


import { z } from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Input } from "./ui/input"
import { useForm } from "react-hook-form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Button } from "./ui/button"
 
const formSchema = z.object({
  username: z.string().min(5 , {message:"User name must be at least 5 characters"}).max(50),
  email: z.string().email({message:"Invalid email address"}),
  phone: z.string().min(10 , {message:"Phone number must be at least 10 characters"}).max(15),
  location: z.string().min(2 , {message:"Location must be at least 2 characters"}).max(50),
  role: z.enum(["Admin", "User"], {message:"Role is required"}),
})


const EditUser = () => {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "john.doe",
        email: "john.doe@nezig.com",
        phone: "+97 78 924 4778",
        location: "Kurudugaha Hathakma",
        role: "Admin"
    },
  })
  return (
    <SheetContent>
        <SheetHeader>
        <SheetTitle className="mb-4">Edit User</SheetTitle>
        <SheetDescription asChild>
            <Form {...form}>
                <form className="space-y-8">
                    <FormField control={form.control} name="username" render={({field})=>(
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormDescription>
                                This is your public user name.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="email" render={({field})=>(
                        <FormItem>
                            <FormLabel>email</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormDescription>
                                Email addreess
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="phone" render={({field})=>(
                        <FormItem>
                            <FormLabel>phone</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormDescription>
                                your phone number
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="location" render={({field})=>(
                        <FormItem>
                            <FormLabel>location</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormDescription>
                                your location
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="role" render={({field})=>(
                        <FormItem>
                            <FormLabel>location</FormLabel>
                            <FormControl>
                            <Select>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="light">Admin</SelectItem>
                                    <SelectItem value="dark">User</SelectItem>
                                </SelectContent>
                            </Select>
                            </FormControl>
                            <FormDescription>
                                Only Verify users has role
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </SheetDescription>
        </SheetHeader>
    </SheetContent>
  )
}

export default EditUser