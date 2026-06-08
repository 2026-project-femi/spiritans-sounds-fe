import { HeaderClient } from './Component.client'
import { getCachedGlobal } from '@/payload/utilities/getGlobals'

export async function Header() {
  const headerData = await getCachedGlobal('header', 1)()

  return <HeaderClient data={headerData} />
}
