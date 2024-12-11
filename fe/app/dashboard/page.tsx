import { AppSidebar } from '@/components/app-sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger
} from '@/components/ui/sidebar'
import { ProductTable } from '@/components/product-table/product-table'
import { headers } from 'next/headers'
import ProfileComponent from '@/components/profile/profile-card'

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function DashboardPage (props: {
  searchParams: SearchParams
}) {
  const searchParams = await props.searchParams
  const ActiveTab = searchParams.ActiveTab
  const headerList = headers()
  const pathname = headerList.get('x-current-path')

  const pathnameSegments = pathname?.split('/').filter(Boolean) || []

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className='flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12'>
          <div className='flex items-center gap-2 px-4'>
            <SidebarTrigger className='-ml-1' />
            <Separator orientation='vertical' className='mr-2 h-4' />
            <Breadcrumb>
              <BreadcrumbList>
                {pathnameSegments.map((segment, index) => (
                  <BreadcrumbItem key={index} className='hidden md:block'>
                    <BreadcrumbLink
                      href={`/${pathnameSegments
                        .slice(0, index + 1)
                        .join('/')}`}
                      className='capitalize'
                    >
                      {segment}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className='flex flex-1 flex-col gap-4 p-4 pt-0'>
          {ActiveTab == 'profile' ? <ProfileComponent /> : <ProductTable />}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
