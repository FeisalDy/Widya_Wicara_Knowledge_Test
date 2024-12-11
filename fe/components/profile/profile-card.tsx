'use client'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { getProfile } from '@/server/user'
import { useQuery } from '@tanstack/react-query'
import { DrawerDialogProfile } from '@/components/profile/profile-drawer'
import { useState, useCallback, useMemo } from 'react'
import { DataUserT } from '@/types/User'

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
    return <div>Loading...</div>
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
                  src='https://github.com/shadcn.png'
                  alt='@shadcn'
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <p>{data.data?.name}</p>
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
            {data.data.email}
          </div>
        </div>
        <Separator className='my-4' />
        <div className='flex flex-row'>
          <div className='basis-1/3'>Gender</div>
          <div className='basis-2/3 capitalize'>{data.data.gender}</div>
        </div>
      </div>

      <DrawerDialogProfile
        profile={data.data}
        isOpen={isDialogOpen}
        onOpenChange={value => {
          setIsDialogOpen(value)
        }}
      />
    </div>
  )
}
