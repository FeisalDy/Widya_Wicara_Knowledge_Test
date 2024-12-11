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
import { auth } from '@/server/auth'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { setJWTToken } from '@/lib/setJWTToken'

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
})

export function LoginForm () {
  const router = useRouter()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const { handleSubmit, register, formState } = form
  const { errors } = formState

  async function onSubmit (values: z.infer<typeof formSchema>) {
    setErrorMessage(null)
    try {
      const { token, error } = await auth(values)

      if (token) {
        setJWTToken(token)
        router.push('/')
      } else {
        setErrorMessage(error?.message || 'Login failed')
      }
    } catch (err) {
      setErrorMessage('An unexpected error occurred. Please try again.')
      console.error(err)
    }
  }

  return (
    <Card className='mx-auto max-w-sm'>
      <CardHeader>
        <CardTitle className='text-2xl'>Login</CardTitle>
        <CardDescription>
          Enter your email and password to log in to your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className='grid gap-4'>
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
          {errorMessage && (
            <div className='text-sm text-red-500 text-center'>
              {errorMessage}
            </div>
          )}
          <Button type='submit' className='w-full'>
            Login
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
