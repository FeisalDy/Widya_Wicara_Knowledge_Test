'use client'
import * as React from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from '@/components/ui/drawer'
import { useIsMobile } from '@/hooks/use-mobile'
import { DataUserT } from '@/types/User'
import ProfileForm from './profile-form'

type DrawerDialogProductPropsT = {
  isOpen: boolean
  onOpenChange: (value: boolean) => void
  profile: DataUserT
}
export function DrawerDialogProfile ({
  isOpen,
  onOpenChange,
  profile
}: DrawerDialogProductPropsT) {
  const IsMobile = useIsMobile()

  if (!IsMobile) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here.
            </DialogDescription>
          </DialogHeader>
          <ProfileForm profile={profile} onOpenChange={onOpenChange} />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className='px-4'>
        <DrawerHeader className='text-left'>
          <DrawerTitle>Edit product</DrawerTitle>
          <DrawerDescription>
            Make changes to your product here.
          </DrawerDescription>
        </DrawerHeader>
        <ProfileForm profile={profile} onOpenChange={onOpenChange} />
        <DrawerFooter className='pt-2'>
          <DrawerClose asChild>
            <Button variant='outline'>Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
