"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import FileUploader from './FileUploader'
import Search from './Search'
import { Logout } from '@/app/actions/auth-actions'

const Header = () => {

  const handleLogout = async () => {
    await Logout()
  }

  return (
    <header className='header'>
      <Search />

      <div className='header-wrapper'>
        <FileUploader />

        <form>
          <Button
            type='submit'
            className='sign-out-button'
            onClick={handleLogout}
          >
            <Image
              src={"/assets/icons/logout.svg"}
              alt='logo'
              width={24}
              height={24}
              className='w-6'
            />
          </Button>
        </form>
      </div>
    </header>
  )
}

export default Header
