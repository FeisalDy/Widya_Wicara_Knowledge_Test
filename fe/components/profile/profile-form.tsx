import { useState } from 'react'
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
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

type ProfileFormPropsT = {
  className?: string
  profile?: DataUserT | null
  onOpenChange: (value: boolean) => void
}

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  gender: z.enum(['male', 'female']).or(z.string().min(1, 'Gender is required'))
})

export default function ProfileForm ({
  className,
  profile,
  onOpenChange
}: ProfileFormPropsT) {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: profile?.name || '',
      email: profile?.email || '',
      gender: profile?.gender || ''
    }
  })

  const { handleSubmit, register, setValue, watch, formState } = form
  const { errors } = formState

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' }
  ]
  const gender = watch('gender')

  const {
    data,
    mutate: server_updateProfile,
    isPending
  } = useMutation({
    mutationFn: (formData: z.infer<typeof formSchema>) =>
      updateUserProfile({ profile: formData }),
    onSuccess: data => {
      console.log(data)
      if (data.error) {
        setErrorMessage(data.error.error || 'An unexpected error occurred.')
      } else {
        queryClient.invalidateQueries({ queryKey: ['profile'] })
        onOpenChange(false)
      }
    },
    onError: error => {
      setErrorMessage(error.message)
    }
  })

  async function onSubmit (values: z.infer<typeof formSchema>) {
    setErrorMessage(null)
    try {
      server_updateProfile(values)
    } catch (err) {
      setErrorMessage('An unexpected error occurred. Please try again.')
      console.error(err)
    }
  }
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn('grid items-start gap-4', className)}
    >
      <div className='grid gap-2'>
        <Label htmlFor='name'>Name</Label>
        <Input
          id='name'
          placeholder='Your name'
          {...register('name')}
          value={watch('name')}
          className={errors.name ? 'border-red-500' : ''}
        />
        {errors.name && (
          <span className='text-sm text-red-500'>{errors.name.message}</span>
        )}
      </div>
      <div className='grid gap-2'>
        <Label htmlFor='price'>Email</Label>
        <Input
          id='email'
          type='email'
          placeholder='m@example.com'
          {...register('email')}
          className={errors.email ? 'border-red-500' : ''}
        />
        {errors.email && (
          <span className='text-sm text-red-500'>{errors.email.message}</span>
        )}
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
              {gender
                ? genderOptions.find(g => g.value === gender)?.label
                : 'Select your gender...'}
              <ChevronsUpDown className='opacity-50' />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='p-0'>
            <Command>
              <CommandList>
                <CommandGroup>
                  {genderOptions.map(g => (
                    <CommandItem
                      key={g.value}
                      value={g.value}
                      onSelect={value => {
                        setValue('gender', value, { shouldValidate: true })
                        setOpen(false)
                      }}
                    >
                      {g.label}
                      <Check
                        className={cn(
                          'ml-auto',
                          gender === g.value ? 'opacity-100' : 'opacity-0'
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
      {errorMessage && (
        <div className='text-sm text-red-500 text-center'>{errorMessage}</div>
      )}
      <Button type='submit' disabled={isPending}>
        Save Changes
      </Button>
    </form>
  )
}
