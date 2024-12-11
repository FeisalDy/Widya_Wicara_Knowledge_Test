import { LoginForm } from '@/components/auth/login-form'
import { RegisterForm } from '@/components/auth/register-form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function AuthPage (props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams
  const ActiveTab = searchParams.ActiveTab

  return (
    // <div className='flex h-screen w-full items-center justify-center px-4'>
    <div className='flex justify-center items-center h-screen'>
      {/* {ActiveTab == 'register' ? 'register' : <LoginForm />} */}

      <Tabs defaultValue='login'>
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='login'>Login</TabsTrigger>
          <TabsTrigger value='register'>Register</TabsTrigger>
        </TabsList>
        <TabsContent value='login'>
          <LoginForm />
        </TabsContent>
        <TabsContent value='register'>
          <RegisterForm />
        </TabsContent>
      </Tabs>
    </div>
  )
}
