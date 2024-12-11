'use client'
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
import { ProductForm } from './form_data'
import { useIsMobile } from '@/hooks/use-mobile'
import { ProductT } from './columns'

type DrawerDialogProductPropsT = {
  isOpen: boolean
  onOpenChange: (value: boolean) => void
  product: ProductT | null
  mode: 'Edit' | 'Create'
}
export function DrawerDialogProduct ({
  isOpen,
  onOpenChange,
  product,
  mode
}: DrawerDialogProductPropsT) {
  const IsMobile = useIsMobile()

  if (!IsMobile) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>{mode} product</DialogTitle>
            <DialogDescription>
              Make changes to your product here.
            </DialogDescription>
          </DialogHeader>
          <ProductForm
            mode={mode}
            product={product}
            onOpenChange={onOpenChange}
          />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className='text-left'>
          <DrawerTitle>Edit product</DrawerTitle>
          <DrawerDescription>
            Make changes to your product here.
          </DrawerDescription>
        </DrawerHeader>
        <ProductForm
          mode={mode}
          className='px-4'
          product={product}
          onOpenChange={onOpenChange}
        />
        <DrawerFooter className='pt-2'>
          <DrawerClose asChild>
            <Button variant='outline'>Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
