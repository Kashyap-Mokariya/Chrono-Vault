"use client"

import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from 'next/image'
import { actionsDropdownItems } from '@/constants/constants'
import Link from 'next/link'
import { constructDownloadUrl } from '@/lib/utils'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { renameFile } from '@/app/actions/File actions/rename-file-action'
import { usePathname } from 'next/navigation'
import { FileDetails, ShareInput } from './Modal/ActionsModalContent'

const ActionDropdown = ({ file }: { file: SupabaseFile }) => {

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDropDownOpen, setIsDropDownOpen] = useState(false)
  const [action, setAction] = useState<ActionType | null>(null)
  const [fileName, setFileName] = useState(file.name)
  const [isLoading, setIsLoading] = useState(false)
  const [emails, setEmails] = useState<string[]>([])
  const path = usePathname()

  const closeAllModals = () => {
    setIsModalOpen(false)
    setIsDropDownOpen(false)
    setAction(null)
    setFileName(file.name)
  }

  const handleAction = async () => {
    if (!action) return;

    setIsLoading(true);

    try {
      let success = false;

      const actions = {
        rename: async () => {
          const updatedFile = await renameFile({
            fileId: file.id,
            name: fileName,
            extension: file.extension,
            path,
          });
          if (updatedFile && updatedFile?.name) {
            setFileName(updatedFile.name);
            return true;
          }
          return false;
        },
        share: async () => {
          console.log("Share");
          return true;
        },
        delete: async () => {
          console.log("Delete");
          return true;
        },
      };

      const actionHandler = actions[action.value as keyof typeof actions];
      if (actionHandler) {
        success = await actionHandler();
      }

    } catch (error) {
      console.error("Action failed:", error);
    } finally {
      setIsLoading(false);
      closeAllModals()
    }
  }

  const handleRemoveUser = () => {
    
  }

  const renderDialogContent = () => {
    if (!action)
      return null

    const { value, label } = action

    return (
      <DialogContent className='shad-dialog button'>
        <DialogHeader className='flex flex-col gap-3'>
          <DialogTitle className='text-center text-light-100'>
            {label}
          </DialogTitle>

          {value === "rename" && (
            <Input
              type='text'
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
            />
          )}

          {value === "details" && (<FileDetails file={file} />)}

          {value === "share" && (
            <ShareInput
              file={file}
              onInputChange={setEmails}
              onRemove={handleRemoveUser}
            />)
            }

        </DialogHeader>
        {
          ["rename", "delete", "share"].includes(value) && (
            <DialogFooter className='flex flex-col gap-3 md:flex-row'>
              <Button
                onClick={closeAllModals}
                className='modal-cancel-button'
              >
                Cancel
              </Button>
              <Button
                onClick={handleAction}
                className='modal-submit-button'
              >
                <p className='capitalize'>
                  {value}
                </p>

                {isLoading && (
                  <Image
                    src={"/assets/icons/loader.svg"}
                    alt='loader'
                    width={24}
                    height={24}
                    className='animate-spin'
                  />
                )}
              </Button>
            </DialogFooter>
          )
        }
      </DialogContent>
    )
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DropdownMenu open={isDropDownOpen} onOpenChange={setIsDropDownOpen}>
        <DropdownMenuTrigger className='shad-no-focus'>
          <Image
            src={"/assets/icons/dots.svg"}
            alt='dots'
            width={34}
            height={34}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className='max-w-[200px] truncate'>
            {file.name}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {actionsDropdownItems.map((actionItem) => (
            <DropdownMenuItem
              key={actionItem.value}
              className='shad-dropdown-item'
              onClick={() => {
                setAction(actionItem)

                if (["rename", "share", "details", "delete"].includes(actionItem.value)) {
                  setIsModalOpen(true)
                }
              }}
            >
              {actionItem.value === "download" ?
                <Link
                  href={constructDownloadUrl(file.url)}
                  download={file.name}
                  className='flex items-center gap-2'
                >
                  <Image
                    src={actionItem.icon}
                    alt={actionItem.label}
                    width={30}
                    height={30}
                  />

                  {actionItem.label}
                </Link> : (
                  <div className='flex items-center gap-2'>
                    <Image
                      src={actionItem.icon}
                      alt={actionItem.label}
                      width={30}
                      height={30}
                    />

                    {actionItem.label}
                  </div>
                )
              }
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {renderDialogContent()}
    </Dialog>

  )
}

export default ActionDropdown
