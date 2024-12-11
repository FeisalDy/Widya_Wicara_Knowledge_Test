import { Search } from 'lucide-react'

import { Label } from '@/components/ui/label'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarInput
} from '@/components/ui/sidebar'

export function SearchForm ({
  value,
  onChange
}: {
  value: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <form>
      <SidebarGroup className='py-0'>
        <SidebarGroupContent className='relative'>
          <Label htmlFor='search' className='sr-only'>
            Search
          </Label>
          <SidebarInput
            id='search'
            placeholder='Search the products...'
            value={value}
            onChange={onChange}
            className='pl-8'
          />
          <Search className='pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50' />
        </SidebarGroupContent>
      </SidebarGroup>
    </form>
  )
}
