import * as React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DataUserT } from '@/types/User'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Check, ChevronsUpDown } from 'lucide-react'
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { updateUserProfile } from '@/server/user'

type ProfileFormPropsT = {
  className?: string
  profile?: DataUserT | null
  onOpenChange: (value: boolean) => void
}

const gender = [
  {
    value: 'male',
    label: 'Male'
  },
  {
    value: 'female',
    label: 'Female'
  }
]
export default function ProfileForm ({
  className,
  profile,
  onOpenChange
}: ProfileFormPropsT) {
  const queryClient = useQueryClient()

  const [formData, setFormData] = React.useState<DataUserT>({
    name: profile?.name || '',
    email: profile?.email || '',
    gender: profile?.gender || ''
  })
  const [open, setOpen] = React.useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }))
  }
  const { mutate: server_updateProfile, isPending } = useMutation({
    mutationFn: (profileData: Omit<DataUserT, 'id'>) =>
      updateUserProfile({ profile: profileData }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      onOpenChange(false)
    },
    onError: error => {
      console.error('Error updating profile:', error)
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    server_updateProfile(formData)
  }
  return (
    <form
      onSubmit={handleSubmit}
      className={cn('grid items-start gap-4', className)}
    >
      <div className='grid gap-2'>
        <Label htmlFor='name'>Name</Label>
        <Input
          id='name'
          name='name'
          value={formData.name}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className='grid gap-2'>
        <Label htmlFor='price'>Email</Label>
        <Input
          id='email'
          name='email'
          value={formData.email}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className='grid gap-2'>
        <Label htmlFor='category'>Gender</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant='outline'
              role='combobox'
              aria-expanded={open}
              className='justify-between'
            >
              {formData.gender
                ? gender.find(g => g.value === formData.gender)?.label
                : 'Select your gender...'}
              <ChevronsUpDown className='opacity-50' />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='p-0'>
            <Command>
              <CommandList>
                <CommandGroup>
                  {gender.map(g => (
                    <CommandItem
                      key={g.value}
                      value={g.value}
                      onSelect={currentValue => {
                        setFormData(prevState => ({
                          ...prevState,
                          gender:
                            currentValue === formData.gender ? '' : currentValue
                        }))
                        setOpen(false)
                      }}
                    >
                      {g.label}
                      <Check
                        className={cn(
                          'ml-auto',
                          formData.gender === g.value
                            ? 'opacity-100'
                            : 'opacity-0'
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <Button type='submit' disabled={isPending}>
        Save Changes
      </Button>
    </form>
  )
}
