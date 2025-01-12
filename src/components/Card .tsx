import Link from 'next/link'
import React from 'react'
import Thumbnail from './Thumbnail'
import { convertFileSize } from '@/lib/utils'
import FormatterDateTime from './FormattedDateTime'
import ActionDropdown from './ActionDropdown'

interface SupabaseFile {
    id: string
    url: string
    name: string
    type: string
    size: number
    extension: string
    created_at: string
    fullname: string
}

const Card = ({ file }: { file: SupabaseFile }) => {
    return (
        <Link
            href={file.url}
            target='_blank'
            className='file-card'
        >
            <div className='flex justify-between'>
                <Thumbnail
                    type={file.type}
                    extension={file.extension}
                    url={file.url}
                    className='!size-20'
                    imageClassName='!size-11'
                />

                <div className='flex flex-col items-end justify-between'>
                    <ActionDropdown file={file} />

                    <p className='body-1'>
                        {convertFileSize(file.size)}

                    </p>
                </div>
            </div>

            <div className='file-card-details'>
                <p className='subtitle-2 truncate block'>
                    {file.name}
                </p>

                <FormatterDateTime
                    date={file.created_at}
                    className='body-2 text-light-100'
                />

                <p className='caption truncate block text-light-200'>
                    By: {file.fullname}
                </p>

            </div>
        </Link>
    )
}

export default Card 
