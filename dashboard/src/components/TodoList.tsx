"use client"
import React, { useState } from 'react'
import { ScrollArea } from './ui/scroll-area'
import { Card } from './ui/card'
import { Checkbox } from './ui/checkbox'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Button } from './ui/button'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { Calendar } from './ui/calendar'

const TodoList = () => {

    const [date, setDate] = useState<Date | undefined>(new Date());
    const [open, setOpen] = useState(false);

  return (
    <div>
        <h1 className='text-lg font-medium mb-6'>To Do List</h1>
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button className='w-full'>
                    <CalendarIcon/>
                    {date ? format(date, "PPP"): <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0' >
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => {
                        setDate(date)
                        setOpen(false)
                    }}
                />
            </PopoverContent>
        </Popover>  
        <ScrollArea className='max-h-[400px] mt-4 overflow-y-auto'>
            <div className='flex flex-col gap-4'>
            {/* List Items */}
                <Card className='p-4'>
                    <div className='flex items-center gap-4'>
                        <Checkbox id='item01'/>
                        <label htmlFor="item01" className='text-sm text-muted-foreground'>randonmm text</label>
                    </div>
                </Card>
                <Card className='p-4'>
                    <div className='flex items-center gap-4'>
                        <Checkbox id='item01'/>
                        <label htmlFor="item01" className='text-sm text-muted-foreground'>randonmm text</label>
                    </div>
                </Card>
                <Card className='p-4'>
                    <div className='flex items-center gap-4'>
                        <Checkbox id='item01'/>
                        <label htmlFor="item01" className='text-sm text-muted-foreground'>randonmm text</label>
                    </div>
                </Card>
                <Card className='p-4'>
                    <div className='flex items-center gap-4'>
                        <Checkbox id='item01'/>
                        <label htmlFor="item01" className='text-sm text-muted-foreground'>randonmm text</label>
                    </div>
                </Card>
                <Card className='p-4'>
                    <div className='flex items-center gap-4'>
                        <Checkbox id='item01'/>
                        <label htmlFor="item01" className='text-sm text-muted-foreground'>randonmm text</label>
                    </div>
                </Card><Card className='p-4'>
                    <div className='flex items-center gap-4'>
                        <Checkbox id='item01'/>
                        <label htmlFor="item01" className='text-sm text-muted-foreground'>randonmm text</label>
                    </div>
                </Card><Card className='p-4'>
                    <div className='flex items-center gap-4'>
                        <Checkbox id='item01'/>
                        <label htmlFor="item01" className='text-sm text-muted-foreground'>randonmm text</label>
                    </div>
                </Card><Card className='p-4'>
                    <div className='flex items-center gap-4'>
                        <Checkbox id='item01'/>
                        <label htmlFor="item01" className='text-sm text-muted-foreground'>randonmm text</label>
                    </div>
                </Card><Card className='p-4'>
                    <div className='flex items-center gap-4'>
                        <Checkbox id='item01'/>
                        <label htmlFor="item01" className='text-sm text-muted-foreground'>randonmm text</label>
                    </div>
                </Card><Card className='p-4'>
                    <div className='flex items-center gap-4'>
                        <Checkbox id='item01'/>
                        <label htmlFor="item01" className='text-sm text-muted-foreground'>randonmm text</label>
                    </div>
                </Card><Card className='p-4'>
                    <div className='flex items-center gap-4'>
                        <Checkbox id='item01'/>
                        <label htmlFor="item01" className='text-sm text-muted-foreground'>randonmm text</label>
                    </div>
                </Card><Card className='p-4'>
                    <div className='flex items-center gap-4'>
                        <Checkbox id='item01'/>
                        <label htmlFor="item01" className='text-sm text-muted-foreground'>randonmm text</label>
                    </div>
                </Card><Card className='p-4'>
                    <div className='flex items-center gap-4'>
                        <Checkbox id='item01'/>
                        <label htmlFor="item01" className='text-sm text-muted-foreground'>randonmm text</label>
                    </div>
                </Card><Card className='p-4'>
                    <div className='flex items-center gap-4'>
                        <Checkbox id='item01'/>
                        <label htmlFor="item01" className='text-sm text-muted-foreground'>randonmm text</label>
                    </div>
                </Card><Card className='p-4'>
                    <div className='flex items-center gap-4'>
                        <Checkbox id='item01'/>
                        <label htmlFor="item01" className='text-sm text-muted-foreground'>randonmm text</label>
                    </div>
                </Card><Card className='p-4'>
                    <div className='flex items-center gap-4'>
                        <Checkbox id='item01'/>
                        <label htmlFor="item01" className='text-sm text-muted-foreground'>randonmm text</label>
                    </div>
                </Card><Card className='p-4'>
                    <div className='flex items-center gap-4'>
                        <Checkbox id='item01'/>
                        <label htmlFor="item01" className='text-sm text-muted-foreground'>randonmm text</label>
                    </div>
                </Card><Card className='p-4'>
                    <div className='flex items-center gap-4'>
                        <Checkbox id='item01'/>
                        <label htmlFor="item01" className='text-sm text-muted-foreground'>randonmm text</label>
                    </div>
                </Card><Card className='p-4'>
                    <div className='flex items-center gap-4'>
                        <Checkbox id='item01'/>
                        <label htmlFor="item01" className='text-sm text-muted-foreground'>randonmm text</label>
                    </div>
                </Card><Card className='p-4'>
                    <div className='flex items-center gap-4'>
                        <Checkbox id='item01'/>
                        <label htmlFor="item01" className='text-sm text-muted-foreground'>randonmm text</label>
                    </div>
                </Card><Card className='p-4'>
                    <div className='flex items-center gap-4'>
                        <Checkbox id='item01'/>
                        <label htmlFor="item01" className='text-sm text-muted-foreground'>randonmm text</label>
                    </div>
                </Card>
            </div>
        </ScrollArea>
    </div>
  )
}

export default TodoList