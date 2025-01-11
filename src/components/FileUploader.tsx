"use client"

import React, { useCallback, useId, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from './ui/button'
import { cn, convertFileToUrl, getFileType } from '@/lib/utils'
import Image from 'next/image'
import Thumbnail from './Thumbnail'
import { MAX_FILE_SIZE } from '@/constants/constants'
import { toast } from 'sonner'
import { uploadFile } from '@/app/actions/file-actions'
import { usePathname } from 'next/navigation'
import { useRouter } from "next/navigation";

interface Props {
  userId: string,
  className?: string
}

const FileUploader = ({ userId, className }: Props) => {

  const router = useRouter()

  const path = usePathname()

  const toastId = useId()

  const [files, setFiles] = useState<File[]>([])

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setFiles(acceptedFiles);

      const uploadPromises = acceptedFiles.map(async (file) => {
        if (file.size > MAX_FILE_SIZE) {
          setFiles((prevFiles) =>
            prevFiles.filter((f) => f.name !== file.name),
          )

          toast.error(String(`${file.name} is too large. Max file size is 50MB.`), { id: toastId })
        }

        return uploadFile({ file, userId, path }).then(
          (uploadedFile) => {
            if (uploadedFile) {
              setFiles((prevFiles) =>
                prevFiles.filter((f) => f.name !== file.name)
              );

              toast.success(`${file.name} uploaded successfully!`, { id: toastId })

              router.push(path);
            }
          },
        );
      });

      await Promise.all(uploadPromises);

    },
    [userId, path],
  );

  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  const handleRemoveFile = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>,
    fileName: string
  ) => {
    e.stopPropagation()

    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName))
  }

  return (
    <div {...getRootProps()} className='cursor-pointer'>
      <input {...getInputProps()} />
      <Button
        type='button'
        className={cn("uploader-button")}
      >
        <Image
          src={"/assets/icons/upload.svg"}
          alt='upload'
          width={24}
          height={24}
        />
        <p>Upload</p>
      </Button>

      {files.length > 0 && (
        <ul className='uploader-preview-list'>
          <h4 className='h4 text-light-100'>
            Uploading
          </h4>

          {files.map((file, index) => {
            const { type, extension } = getFileType(file.name)

            return (
              <li
                key={`${file.name}-${index}`}
                className='uploader-preview-item'
              >
                <div className='flex items-center gap-3'>
                  <Thumbnail
                    type={type}
                    extension={extension}
                    url={convertFileToUrl(file)}
                  />

                  <div className='preview-item-name'>
                    {file.name}

                    <Image
                      src={"/assets/icons/file-loader.gif"}
                      alt='loader'
                      width={80}
                      height={26}
                    />
                  </div>
                </div>

                <Image
                  src={"/assets/icons/remove.svg"}
                  alt='remove'
                  width={24}
                  height={24}
                  onClick={(e) => handleRemoveFile(e, file.name)}
                />
              </li>
            )
          })}

        </ul>
      )}
    </div>
  )
}

export default FileUploader