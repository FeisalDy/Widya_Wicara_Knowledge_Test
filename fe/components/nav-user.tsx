'use client'

import { ChevronsUpDown, LogOut } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@/components/ui/sidebar'
import Cookies from 'js-cookie'
import { useQuery } from '@tanstack/react-query'
import { getProfile } from '@/server/user'
import { LoadingSpinner } from '@/components/loading-spinner'

export function NavUser () {
  const { isMobile } = useSidebar()
  const logout = () => {
    Cookies.remove('jwtToken', { secure: true, sameSite: 'strict' })
    window.location.href = '/auth'
  }

  const { data, isPending, isError } = useQuery({
    queryKey: ['profile'],
    queryFn: () => getProfile()
  })

  if (isPending) {
    return (
      <div className='flex items-center justify-center h-full w-full'>
        <LoadingSpinner size={12} className='animate-spin text-primary' />
      </div>
    )
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <Avatar className='h-8 w-8 rounded-lg'>
                <AvatarImage
                  src='https://i.pravatar.cc/300'
                  alt={data?.data?.name}
                />
                <AvatarFallback className='rounded-lg'>CN</AvatarFallback>
              </Avatar>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-semibold capitalize'>
                  {data?.data?.name}
                </span>
                <span className='truncate text-xs'>{data?.data?.email}</span>
              </div>
              <ChevronsUpDown className='ml-auto size-4' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
            side={isMobile ? 'bottom' : 'right'}
            align='end'
            sideOffset={4}
          >
            <DropdownMenuItem onClick={logout}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
