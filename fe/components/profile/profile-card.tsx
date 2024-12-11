'use client'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { getProfile } from '@/server/user'
import { useQuery } from '@tanstack/react-query'
import { DrawerDialogProfile } from '@/components/profile/profile-drawer'
import { useState, useCallback } from 'react'
import { LoadingSpinner } from '@/components/loading-spinner'

export default function ProfileComponent () {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)

  const { data, isPending, isError } = useQuery({
    queryKey: ['profile'],
    queryFn: () => getProfile()
  })

  const onEdit = useCallback(() => {
    setIsDialogOpen(true)
  }, [])

  if (isPending) {
    return (
      <div className='flex items-center justify-center h-full w-full'>
        <LoadingSpinner size={64} className='animate-spin text-primary' />
      </div>
    )
  }

  if (isError) {
    return <div>Error</div>
  }

  return (
    <div className='container mx-auto'>
      <h4 className='text-lg'>Profile Detail</h4>
      <Separator className='my-4' />
      <div className=''>
        <div className='flex flex-row items-center'>
          <div className='basis-1/3'>Profile</div>
          <div className='basis-1/3'>
            <div className='flex items-center gap-2'>
              <Avatar>
                <AvatarImage
                  src='https://i.pravatar.cc/300'
                  alt={data.data?.name}
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <p className='capitalize'>{data.data?.name}</p>
            </div>
          </div>
          <div className='basis-1/3 flex justify-end'>
            <Button onClick={onEdit}>Edit Profile</Button>
          </div>
        </div>
        <Separator className='my-4' />
        <div className='flex flex-row'>
          <div className='basis-1/3'>Email Adress</div>
          <div className='basis-2/3 first-letter:capitalize'>
            {data?.data?.email}
          </div>
        </div>
        <Separator className='my-4' />
        <div className='flex flex-row'>
          <div className='basis-1/3'>Gender</div>
          <div className='basis-2/3 capitalize'>{data?.data?.gender}</div>
        </div>
      </div>

      <DrawerDialogProfile
        profile={data?.data || {}}
        isOpen={isDialogOpen}
        onOpenChange={value => {
          setIsDialogOpen(value)
        }}
      />
    </div>
  )
}
