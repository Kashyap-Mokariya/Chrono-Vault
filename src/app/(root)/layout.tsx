import Header from '@/components/Header'
import MobileNavigation from '@/components/MobileNavigation'
import Sidebar from '@/components/Sidebar'
import React from 'react'
import { GetUserInfo } from '../actions/user-actions'
import { redirect } from 'next/navigation'

const layout = async ({ children }: { children: React.ReactNode }) => {

  const { success, data: currentUser, error } = await GetUserInfo()

  if (!success || !currentUser) {
    console.error(error)
    return redirect("/login")
  }

  const { email, fullName, userId } = currentUser

  return (
    <main className='flex h-screen'>
      <Sidebar email={email} fullName={fullName} />

      <section className='flex h-full flex-1 flex-col'>
        <MobileNavigation email={email} fullName={fullName} />
        <Header userId={userId ? userId : undefined} fullName={fullName ? fullName : ""} />

        <div className='main-content'>
          {children}
        </div>
      </section>

    </main>
  )
}

export default layout