'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
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
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { registerUser } from '@/server/auth'
import { useMutation } from '@tanstack/react-query'
import { redirect } from 'next/navigation'
import { setJWTToken } from '@/lib/setJWTToken'

const formSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password must be at least 1 characters long'),
    confirmPassword: z.string().min(1, 'Confirm password is required'),
    gender: z
      .enum(['male', 'female'])
      .or(z.string().min(1, 'Gender is required'))
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword']
  })

export function RegisterForm () {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      gender: 'male',
      password: '',
      confirmPassword: ''
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
    mutate: server_registerUser,
    isPending,
    isError,
    isSuccess
  } = useMutation({
    mutationFn: (formData: z.infer<typeof formSchema>) =>
      registerUser(formData),
    onSuccess: data => {
      if (data?.error) {
        setErrorMessage(data.error.error || 'An unexpected error occurred.')
      } else {
        const { token } = data
        setJWTToken(token as string)
      }
    },
    onError: err => {
      setErrorMessage(err.message)
    }
  })

  async function onSubmit (values: z.infer<typeof formSchema>) {
    setErrorMessage(null)
    try {
      server_registerUser(values)
    } catch (err) {
      setErrorMessage('An unexpected error occurred. Please try again.')
      console.error(err)
    }
  }

  if (isSuccess) {
    redirect('/dashboard')
  }

  return (
    <Card className='mx-auto max-w-sm'>
      <CardHeader>
        <CardTitle className='text-2xl'>Register</CardTitle>
        <CardDescription>
          Create an account by filling out the form below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className='grid gap-4'>
          <div className='grid gap-2'>
            <Label htmlFor='name'>Name</Label>
            <Input
              id='name'
              placeholder='Your name'
              {...register('name')}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <span className='text-sm text-red-500'>
                {errors.name.message}
              </span>
            )}
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='email'>Email</Label>
            <Input
              id='email'
              type='email'
              placeholder='m@example.com'
              {...register('email')}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <span className='text-sm text-red-500'>
                {errors.email.message}
              </span>
            )}
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='gender'>Gender</Label>
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
          <div className='grid gap-2'>
            <Label htmlFor='password'>Password</Label>
            <Input
              id='password'
              type='password'
              {...register('password')}
              className={errors.password ? 'border-red-500' : ''}
            />
            {errors.password && (
              <span className='text-sm text-red-500'>
                {errors.password.message}
              </span>
            )}
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='confirmPassword'>Confirm Password</Label>
            <Input
              id='confirmPassword'
              type='password'
              {...register('confirmPassword')}
              className={errors.confirmPassword ? 'border-red-500' : ''}
            />
            {errors.confirmPassword && (
              <span className='text-sm text-red-500'>
                {errors.confirmPassword.message}
              </span>
            )}
          </div>
          {errorMessage && (
            <div className='text-sm text-red-500 text-center'>
              {errorMessage}
            </div>
          )}
          <Button type='submit' className='w-full' disabled={isPending}>
            Register
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
