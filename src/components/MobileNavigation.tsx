"use client"

import React, { useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { avatarPlaceholderUrl, navItems } from '@/constants/constants'
import { Separator } from './ui/separator'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { Button } from './ui/button'
import FileUploader from './FileUploader'
import { Logout } from '@/app/actions/auth-actions'

interface Props {
  email: string | null
  fullName: string | null
}

const MobileNavigation = ({ email, fullName }: Props) => {

  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const handleLogout = async () => {
    await Logout()
  }

  return (
    <header className='mobile-header'>
      <Image
        src={"/assets/icons/logo-full-brand.svg"}
        alt='logo'
        width={150}
        height={52}
        className='h-auto'
      />

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger>
          <Image
            src={"/assets/icons/menu.svg"}
            alt='search'
            width={30}
            height={30}
          />
        </SheetTrigger>
        <SheetContent className='shad-sheet h-screen px-3'>
          <SheetTitle>
            <div className='header-user'>
              <Image
                src={avatarPlaceholderUrl}
                alt='avatar'
                width={44}
                height={44}
                className='header-user-avatar'
              />

              <div className='sm:hidden lg:block'>
                <p className='subtitle-2'>
                  {fullName}
                </p>

                <p className='caption'>
                  {email}
                </p>
              </div>
            </div>

            <Separator className='mb-4 bg-light-200/20' />
          </SheetTitle>

          <nav className='mobile-nav'>
            <ul className='mobile-nav-list'>
              {navItems.map(({ url, name, icon }) => (
                <Link key={name} href={url} className='lg:w-full'>
                  <li className={cn("mobile-nav-item", pathname === url && "shad-active")}>
                    <Image
                      src={icon}
                      alt={name}
                      width={24}
                      height={24}
                      className={cn("nav-icon", pathname === url && "nav-icon-active")}
                    />

                    <p>
                      {name}
                    </p>
                  </li>
                </Link>
              ))}
            </ul>
          </nav>

          <Separator className='my-5 bg-light-200/20' />

          <div className='flex flex-col justify-between gap-5 pb-5'>
            <FileUploader />

            <Button
              type='submit'
              className='mobile-sign-out-button'
              onClick={handleLogout}
            >
              <Image
                src={"/assets/icons/logout.svg"}
                alt='logo'
                width={24}
                height={24}
                className='w-6'
              />

              <p>
                Logout
              </p>
            </Button>
          </div>

        </SheetContent>
      </Sheet>

    </header>
  )
}

export default MobileNavigation
