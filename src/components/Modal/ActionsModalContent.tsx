import React from 'react'
import Thumbnail from '../Thumbnail'
import FormattedDateTime from '../FormattedDateTime'
import { convertFileSize, formatDateTime } from '@/lib/utils'

const ImageThumbnail = ({ file }: { file: SupabaseFile }) => (
  <div className='file-details-thumbnail'>
    <Thumbnail
      type={file.type}
      extension={file.extension}
      url={file.url}
    />

    <div className='flex flex-col'>
      <p className='subtitle-2 mb-1'>
        {file.name}
      </p>

      <FormattedDateTime
        date={file.created_at}
        className='caption'
      />
    </div>
  </div>
)

const DetailRow = ({ label, value }: { label: string, value: string }) => (
  <div className='flex'>
    <p className='file-details-label'>
      {label}
    </p>
    <p className='file-details-value'>
      {value}
    </p>
  </div>
)

export const FileDetails = ({ file }: { file: SupabaseFile }) => {
  return (
    <>
      <ImageThumbnail file={file} />
      <DetailRow label='Format: ' value={file.extension} />
      <DetailRow label='Size: ' value={convertFileSize(file.size)} />
      <DetailRow label='Owner: ' value={file.fullname} />
      <DetailRow label='Last edited: ' value={formatDateTime(file.updated_at)} />
    </>
  )
}
