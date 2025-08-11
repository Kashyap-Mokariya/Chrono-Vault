// "use client"

// import React, { useId, useState } from 'react'
// import {
//   Dialog,
//   DialogContent,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle
// } from "@/components/ui/dialog"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import Image from 'next/image'
// import { actionsDropdownItems } from '@/constants/constants'
// import Link from 'next/link'
// import { constructDownloadUrl } from '@/lib/utils'
// import { Input } from './ui/input'
// import { Button } from './ui/button'
// import { renameFile, updateFileUsers } from '@/app/actions/File actions/rename-file-action'
// import { usePathname } from 'next/navigation'
// import { FileDetails, ShareInput, TranscribedText } from './Modal/ActionsModalContent'
// import { deleteFile } from '@/app/actions/File actions/delete-file-action'
// import { AssemblyAI, TranscriptParams } from 'assemblyai';
// import { toast } from 'sonner'
// import { uploadTranscribedText } from '@/app/actions/File actions/upload-transcribed-text'

// const client = new AssemblyAI({
//   apiKey: '5f5eba2119924ec5a92e5a56aa640026',
// });

// const ActionDropdown = ({ file }: { file: SupabaseFile }) => {

//   const [isModalOpen, setIsModalOpen] = useState(false)
//   const [isDropDownOpen, setIsDropDownOpen] = useState(false)
//   const [action, setAction] = useState<ActionType | null>(null)
//   const [fileName, setFileName] = useState(file.name)
//   const [isLoading, setIsLoading] = useState(false)
//   const [emails, setEmails] = useState<string[]>([])

//   const toastId = useId()
//   const path = usePathname()

//   const closeAllModals = () => {
//     setIsModalOpen(false)
//     setIsDropDownOpen(false)
//     setAction(null)
//     setFileName(file.name)
//   }

//   const handleAction = async () => {
//     if (!action) return;

//     setIsLoading(true);

//     try {
//       let success = false;

//       const actions = {
//         rename: async () => {
//           const oldFileName = file.name

//           const updatedFile = await renameFile({
//             fileId: file.id,
//             name: fileName,
//             extension: file.extension,
//             path,
//           });
//           if (updatedFile) {
//             setFileName(fileName);
//             toast.success(`"${oldFileName}" was successfully changed to "${fileName}.${file.extension}"`, { id: toastId })
//             return true;
//           }
//           else{
//             toast.error('Failed to rename file', { id: toastId })
//           }
//           return false;
//         },
//         share: async () => {
//           const fileShared = await updateFileUsers({ fileId: file.id, emailsToAdd: emails, path })

//           if (fileShared) {
//             toast.success(`${file.name} shared with - "${emails}" successfully!`, { id: toastId })
//             return true
//           }
//           else {
//             toast.error(`Failed to share ${file.name} with "${emails}"!`, { id: toastId })
//           }
//           return false
//         },
//         delete: async () => {
//           const deletedFile = await deleteFile({fileId: file.id, fileName: file.name, path})

//           if (deletedFile) {
//             toast.success(`${file.name} deleted successfully!`, { id: toastId })
//             return true;
//           }
//           else{
//             toast.error(`${file.name} deletion failed!`, { id: toastId })
//           }
//           return false;
//         },
//         transcribe: async () => {

//           // const FILE_URL = file.url;

//           // const data: TranscriptParams = {
//           //   audio_url: FILE_URL,
//           //   speech_model: 'nano',
//           //   language_detection: true,
//           // }

//           // const transcript = await client.transcripts.transcribe(data);
//           // console.log(transcript.text);

//           const transciptText = "Hello This is vBlxze"

//           const transcribedData = await uploadTranscribedText({ fileId: file.id, transcribedText : transciptText})

//           // {<TranscribedText file = { file } />}

//           return true;
//         }
//       };

//       const actionHandler = actions[action.value as keyof typeof actions];
//       if (actionHandler) {
//         success = await actionHandler();
//       }

//     } catch (error) {
//       console.error("Action failed:", error);
//     } finally {
//       setIsLoading(false)

//       if (action.value === "transcribe") {
//         <TranscribedText file={file} />
//       }
//       else
//       {
//         closeAllModals()
//       }
//     }
//   }

//   const handleRemoveUser = async (email: string) => {
//     const UpdatedEmails = emails.filter((e) => e !== email)

//     const success = await updateFileUsers({
//       fileId: file.id,
//       emailsToRemove: [email],
//       path
//     })

//     if (success)
//       setEmails(UpdatedEmails)
//   }

//   const renderDialogContent = () => {
//     if (!action)
//       return null

//     const { value, label } = action

//     return (
//       <DialogContent className='shad-dialog button'>
//         <DialogHeader className='flex flex-col gap-3'>
//           <DialogTitle className='text-center text-light-100'>
//             {label}
//           </DialogTitle>

//           {value === "rename" && (
//             <Input
//               type='text'
//               value={fileName}
//               onChange={(e) => setFileName(e.target.value)}
//             />
//           )}

//           {value === "details" && (<FileDetails file={file} />)}

//           {value === "transcribe" && (
//             <p className='delete-confirmation'>
//               Are you sure you want to transcribe{` `}

//               <span className='delete-file-name'>
//                 {file.name}
//               </span>?
//             </p>
//           )}

//           {value === "share" && (
//             <ShareInput
//             file={file}
//             onInputChange={setEmails}
//             onRemove={handleRemoveUser}
//             />)
//           }

//           {value === "delete" && (
//             <p className='delete-confirmation'>
//               Are you sure you want to delete{` `}

//               <span className='delete-file-name'>
//                 {file.name}
//               </span>?

//             </p>
//           )}

//         </DialogHeader>
//         {
//           ["rename", "delete", "share", "transcribe"].includes(value) && (
//             <DialogFooter className='flex flex-col gap-3 md:flex-row'>
//               <Button
//                 onClick={closeAllModals}
//                 className='modal-cancel-button'
//               >
//                 Cancel
//               </Button>
//               <Button
//                 onClick={handleAction}
//                 className='modal-submit-button'
//               >
//                 <p className='capitalize'>
//                   {value}
//                 </p>

//                 {isLoading && (
//                   <Image
//                     src={"/assets/icons/loader.svg"}
//                     alt='loader'
//                     width={24}
//                     height={24}
//                     className='animate-spin'
//                   />
//                 )}
//               </Button>
//             </DialogFooter>
//           )
//         }
//       </DialogContent>
//     )
//   }

//   return (
//     <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
//       <DropdownMenu open={isDropDownOpen} onOpenChange={setIsDropDownOpen}>
//         <DropdownMenuTrigger className='shad-no-focus'>
//           <Image
//             src={"/assets/icons/dots.svg"}
//             alt='dots'
//             width={34}
//             height={34}
//           />
//         </DropdownMenuTrigger>
//         <DropdownMenuContent>
//           <DropdownMenuLabel className='max-w-[200px] truncate'>
//             {file.name}
//           </DropdownMenuLabel>
//           <DropdownMenuSeparator />
//           {actionsDropdownItems.map((actionItem) => (
//             <DropdownMenuItem
//               key={actionItem.value}
//               className='shad-dropdown-item'
//               onClick={() => {
//                 setAction(actionItem)

//                 if (["rename", "share", "details", "delete", "transcribe"].includes(actionItem.value)) {
//                   setIsModalOpen(true)
//                 }
//               }}
//             >
//               {actionItem.value === "download" ?
//                 <Link
//                   href={constructDownloadUrl(file.url)}
//                   download={file.name}
//                   className='flex items-center gap-2'
//                 >
//                   <Image
//                     src={actionItem.icon}
//                     alt={actionItem.label}
//                     width={30}
//                     height={30}
//                   />

//                   {actionItem.label}
//                 </Link> : (
//                   <div className='flex items-center gap-2'>
//                     <Image
//                       src={actionItem.icon}
//                       alt={actionItem.label}
//                       width={30}
//                       height={30}
//                     />

//                     {actionItem.label}
//                   </div>
//                 )
//               }
//             </DropdownMenuItem>
//           ))}
//         </DropdownMenuContent>
//       </DropdownMenu>

//       {renderDialogContent()}
//     </Dialog>

//   )
// }

// export default ActionDropdown

// Working

// "use client"

// import React, { useId, useState } from 'react'
// import {
//   Dialog,
//   DialogContent,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle
// } from "@/components/ui/dialog"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import Image from 'next/image'
// import { actionsDropdownItems } from '@/constants/constants'
// import Link from 'next/link'
// import { constructDownloadUrl } from '@/lib/utils'
// import { Input } from './ui/input'
// import { Button } from './ui/button'
// import { renameFile, updateFileUsers } from '@/app/actions/File actions/rename-file-action'
// import { usePathname } from 'next/navigation'
// import { FileDetails, ShareInput, TranscribedText } from './Modal/ActionsModalContent'
// import { deleteFile } from '@/app/actions/File actions/delete-file-action'
// import { AssemblyAI, TranscriptParams } from 'assemblyai';
// import { toast } from 'sonner'
// import { uploadTranscribedText } from '@/app/actions/File actions/upload-transcribed-text'

// const client = new AssemblyAI({
//   apiKey: '5f5eba2119924ec5a92e5a56aa640026',
// });

// const ActionDropdown = ({ file }: { file: SupabaseFile }) => {

//   const [isModalOpen, setIsModalOpen] = useState(false)
//   const [isDropDownOpen, setIsDropDownOpen] = useState(false)
//   const [action, setAction] = useState<ActionType | null>(null)
//   const [fileName, setFileName] = useState(file.name)
//   const [isLoading, setIsLoading] = useState(false)
//   const [emails, setEmails] = useState<string[]>([])
//   const [showTranscriptionResult, setShowTranscriptionResult] = useState(false)

//   const toastId = useId()
//   const path = usePathname()

//   const closeAllModals = () => {
//     setIsModalOpen(false)
//     setIsDropDownOpen(false)
//     setAction(null)
//     setFileName(file.name)
//     setShowTranscriptionResult(false)
//   }

//   const handleAction = async () => {
//     if (!action) return;

//     setIsLoading(true);

//     try {
//       let success = false;

//       const actions = {
//         rename: async () => {
//           const oldFileName = file.name

//           const updatedFile = await renameFile({
//             fileId: file.id,
//             name: fileName,
//             extension: file.extension,
//             path,
//           });

//           if (updatedFile) {
//             setFileName(fileName);
//             toast.success(`"${oldFileName}" was successfully changed to "${fileName}.${file.extension}"`, { id: toastId })
//             return true;
//           } else {
//             toast.error('Failed to rename file', { id: toastId })
//           }
//           return false;
//         },
//         share: async () => {
//           const fileShared = await updateFileUsers({ fileId: file.id, emailsToAdd: emails, path })

//           if (fileShared) {
//             toast.success(`${file.name} shared with - "${emails}" successfully!`, { id: toastId })
//             return true
//           } else {
//             toast.error(`Failed to share ${file.name} with "${emails}"!`, { id: toastId })
//           }
//           return false
//         },
//         delete: async () => {
//           const deletedFile = await deleteFile({ fileId: file.id, fileName: file.name, path })

//           if (deletedFile) {
//             toast.success(`${file.name} deleted successfully!`, { id: toastId })
//             return true;
//           } else {
//             toast.error(`${file.name} deletion failed!`, { id: toastId })
//           }
//           return false;
//         },
//         transcribe: async () => {
//           const data: TranscriptParams = {
//             audio_url: file.url,
//             speech_model: 'nano',
//             language_detection: true,
//           }
//           const transcript = await client.transcripts.transcribe(data);
//           const transcriptText = transcript.text;

//           // const transcriptText = "Hello This is vBlxze";

//           const transcribedData = await uploadTranscribedText({ fileId: file.id, transcribedText: transcriptText })
//           return true;
//         }
//       };

//       const actionHandler = actions[action.value as keyof typeof actions];
//       if (actionHandler) {
//         success = await actionHandler();
//       }

//     } catch (error) {
//       console.error("Action failed:", error);
//     } finally {
//       setIsLoading(false)

//       if (action.value === "transcribe") {
//         setShowTranscriptionResult(true)
//       } else {
//         closeAllModals()
//       }
//     }
//   }

//   const handleRemoveUser = async (email: string) => {
//     const updatedEmails = emails.filter((e) => e !== email)

//     const success = await updateFileUsers({
//       fileId: file.id,
//       emailsToRemove: [email],
//       path
//     })

//     if (success)
//       setEmails(updatedEmails)
//   }

//   const renderDialogContent = () => {
//     if (!action) return null

//     const { value, label } = action

//     return (
//       <DialogContent className='shad-dialog button'>
//         <DialogHeader className='flex flex-col gap-3'>
//           <DialogTitle className='text-center text-light-100'>
//             {label}
//           </DialogTitle>

//           {showTranscriptionResult ? (
//             <TranscribedText file={file} />
//           ) : (
//             <>
//               {value === "rename" && (
//                 <Input
//                   type='text'
//                   value={fileName}
//                   onChange={(e) => setFileName(e.target.value)}
//                 />
//               )}

//               {value === "details" && (<FileDetails file={file} />)}

//               {value === "transcribe" && (
//                 <p className='delete-confirmation'>
//                   Are you sure you want to transcribe{' '}
//                   <span className='delete-file-name'>{file.name}</span>?
//                 </p>
//               )}

//               {value === "share" && (
//                 <ShareInput
//                   file={file}
//                   onInputChange={setEmails}
//                   onRemove={handleRemoveUser}
//                 />
//               )}

//               {value === "delete" && (
//                 <p className='delete-confirmation'>
//                   Are you sure you want to delete{' '}
//                   <span className='delete-file-name'>{file.name}</span>?
//                 </p>
//               )}
//             </>
//           )}
//         </DialogHeader>

//         {!showTranscriptionResult && ["rename", "delete", "share", "transcribe"].includes(value) && (
//           <DialogFooter className='flex flex-col gap-3 md:flex-row'>
//             <Button
//               onClick={closeAllModals}
//               className='modal-cancel-button'
//             >
//               Cancel
//             </Button>
//             <Button
//               onClick={handleAction}
//               className='modal-submit-button'
//             >
//               <p className='capitalize'>{value}</p>
//               {isLoading && (
//                 <Image
//                   src={"/assets/icons/loader.svg"}
//                   alt='loader'
//                   width={24}
//                   height={24}
//                   className='animate-spin'
//                 />
//               )}
//             </Button>
//           </DialogFooter>
//         )}
//       </DialogContent>
//     )
//   }

//   return (
//     <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
//       <DropdownMenu open={isDropDownOpen} onOpenChange={setIsDropDownOpen}>
//         <DropdownMenuTrigger className='shad-no-focus'>
//           <Image
//             src={"/assets/icons/dots.svg"}
//             alt='dots'
//             width={34}
//             height={34}
//           />
//         </DropdownMenuTrigger>
//         <DropdownMenuContent>
//           <DropdownMenuLabel className='max-w-[200px] truncate'>
//             {file.name}
//           </DropdownMenuLabel>
//           <DropdownMenuSeparator />
//           {actionsDropdownItems.map((actionItem) => (
//             <DropdownMenuItem
//               key={actionItem.value}
//               className='shad-dropdown-item'
//               onClick={() => {
//                 setAction(actionItem)
//                 setShowTranscriptionResult(false)

//                 if (["rename", "share", "details", "delete", "transcribe"].includes(actionItem.value)) {
//                   setIsModalOpen(true)
//                 }
//               }}
//             >
//               {actionItem.value === "download" ? (
//                 <Link
//                   href={constructDownloadUrl(file.url)}
//                   download={file.name}
//                   className='flex items-center gap-2'
//                 >
//                   <Image
//                     src={actionItem.icon}
//                     alt={actionItem.label}
//                     width={30}
//                     height={30}
//                   />
//                   {actionItem.label}
//                 </Link>
//               ) : (
//                 <div className='flex items-center gap-2'>
//                   <Image
//                     src={actionItem.icon}
//                     alt={actionItem.label}
//                     width={30}
//                     height={30}
//                   />
//                   {actionItem.label}
//                 </div>
//               )}
//             </DropdownMenuItem>
//           ))}
//         </DropdownMenuContent>
//       </DropdownMenu>

//       {renderDialogContent()}
//     </Dialog>
//   )
// }

// export default ActionDropdown

"use client"

import React, { useId, useState } from 'react'
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
import { renameFile, updateFileUsers } from '@/app/actions/File actions/rename-file-action'
import { usePathname } from 'next/navigation'
import { FileDetails, ShareInput, TranscribedText } from './Modal/ActionsModalContent'
import { deleteFile } from '@/app/actions/File actions/delete-file-action'
import { AssemblyAI, TranscriptParams } from 'assemblyai';
import { toast } from 'sonner'
import { uploadTranscribedText } from '@/app/actions/File actions/upload-transcribed-text'

const client = new AssemblyAI({
  // apiKey: '5f5eba2119924ec5a92e5a56aa640026',
  apiKey: 'e7f5f0ddd9ef42acaf24f19449379d04',
});

const ActionDropdown = ({ file }: { file: SupabaseFile }) => {

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDropDownOpen, setIsDropDownOpen] = useState(false)
  const [action, setAction] = useState<ActionType | null>(null)
  const [fileName, setFileName] = useState(file.name)
  const [isLoading, setIsLoading] = useState(false)
  const [emails, setEmails] = useState<string[]>([])
  const [showTranscriptionResult, setShowTranscriptionResult] = useState(false)

  const toastId = useId()
  const path = usePathname()

  const closeAllModals = () => {
    setIsModalOpen(false)
    setIsDropDownOpen(false)
    setAction(null)
    setFileName(file.name)
    setShowTranscriptionResult(false)
  }

  const handleAction = async () => {
    if (!action) return;

    setIsLoading(true);

    try {
      let success = false;

      const actions = {
        rename: async () => {
          const oldFileName = file.name

          const updatedFile = await renameFile({
            fileId: file.id,
            name: fileName,
            extension: file.extension,
            path,
          });

          if (updatedFile) {
            setFileName(fileName);
            toast.success(`"${oldFileName}" was successfully changed to "${fileName}.${file.extension}"`, { id: toastId })
            return true;
          } else {
            toast.error('Failed to rename file', { id: toastId })
          }
          return false;
        },
        share: async () => {
          const fileShared = await updateFileUsers({ fileId: file.id, emailsToAdd: emails, path })

          if (fileShared) {
            toast.success(`${file.name} shared with - "${emails}" successfully!`, { id: toastId })
            return true
          } else {
            toast.error(`Failed to share ${file.name} with "${emails}"!`, { id: toastId })
          }
          return false
        },
        delete: async () => {
          const deletedFile = await deleteFile({ fileId: file.id, fileName: file.name, path })

          if (deletedFile) {
            toast.success(`${file.name} deleted successfully!`, { id: toastId })
            return true;
          } else {
            toast.error(`${file.name} deletion failed!`, { id: toastId })
          }
          return false;
        },
        transcribe: async () => {
          if (!file.transcription) {
            const data: TranscriptParams = {
              audio_url: file.url,
              speech_model: 'nano',
              language_detection: true,
            }
            const transcript = await client.transcripts.transcribe(data);
            const transcriptText = transcript.text;

            await uploadTranscribedText({ fileId: file.id, transcribedText: transcriptText })


            if (file.transcription) {
              toast.success(`Transcription for ${file.name} completed`, { id: toastId })
            }
            else {
              toast.error(`Failed to upload transcription`, { id: toastId })
              return false
            }

            return true
          }

          return true
        }
      };

      const actionHandler = actions[action.value as keyof typeof actions];
      if (actionHandler) {
        success = await actionHandler();
      }

    } catch (error) {
      console.error("Action failed:", error);
    } finally {
      setIsLoading(false)

      if (action.value === "transcribe") {
        setShowTranscriptionResult(true)
      } else {
        closeAllModals()
      }
    }
  }

  const handleRemoveUser = async (email: string) => {
    const updatedEmails = emails.filter((e) => e !== email)

    const success = await updateFileUsers({
      fileId: file.id,
      emailsToRemove: [email],
      path
    })

    if (success)
      setEmails(updatedEmails)
  }

  const renderDialogContent = () => {
    if (!action) return null

    const { value, label } = action

    return (
      <DialogContent className='shad-dialog button'>
        <DialogHeader className='flex flex-col gap-3'>
          <DialogTitle className='text-center text-light-100'>
            {label}
          </DialogTitle>

          {showTranscriptionResult ? (
            <TranscribedText file={file} />
          ) : (
            <>
              {value === "rename" && (
                <Input
                  type='text'
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                />
              )}

              {value === "details" && (<FileDetails file={file} />)}

              {value === "transcribe" && (
                <p className='delete-confirmation'>
                  Are you sure you want to transcribe{' '}
                  <span className='delete-file-name'>{file.name}</span>?
                </p>
              )}

              {value === "share" && (
                <ShareInput
                  file={file}
                  onInputChange={setEmails}
                  onRemove={handleRemoveUser}
                />
              )}

              {value === "delete" && (
                <p className='delete-confirmation'>
                  Are you sure you want to delete{' '}
                  <span className='delete-file-name'>{file.name}</span>?
                </p>
              )}
            </>
          )}
        </DialogHeader>

        {!showTranscriptionResult && ["rename", "delete", "share", "transcribe"].includes(value) && (
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
              <p className='capitalize'>{value}</p>
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
        )}
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
                setShowTranscriptionResult(false)

                if (["rename", "share", "details", "delete", "transcribe"].includes(actionItem.value)) {
                  setIsModalOpen(true)
                }
              }}
            >
              {actionItem.value === "download" ? (
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
                </Link>
              ) : (
                <div className='flex items-center gap-2'>
                  <Image
                    src={actionItem.icon}
                    alt={actionItem.label}
                    width={30}
                    height={30}
                  />
                  {actionItem.label}
                </div>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {renderDialogContent()}
    </Dialog>
  )
}

export default ActionDropdown
