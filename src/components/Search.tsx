"use client"

import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { Input } from './ui/input'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { getFiles } from '@/app/actions/File actions/get-files-actions'
import Thumbnail from './Thumbnail'
import FormattedDateTime from './FormattedDateTime'
import { useDebounce } from "use-debounce";

const Search = () => {
  const [query, setQuery] = useState("")
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get("query") || ""
  const [results, setResults] = useState<SupabaseFile[]>([])
  const [open, setOpen] = useState(false)

  const path = usePathname()
  const router = useRouter()
  const [debouncedQuery] = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery.length === 0) {
      setResults([])
      setOpen(false)
      return router.push(path.replace(searchParams.toString(), ""))
    }

    const fetchFiles = async () => {
      try {
        const files = await getFiles({ searchText: debouncedQuery })
        setResults(files)
        setOpen(true)
      } catch (error) {
        console.error("Error fetching files:", error)
        setResults([])
      }
    }

    fetchFiles()
  }, [debouncedQuery])

  useEffect(() => {
    if (!searchQuery) {
      setQuery("")
    }
  }, [searchQuery])

  const handleClickItem = (file: SupabaseFile) => {
    setOpen(false)
    setResults([])

    router.push(`/${(file.type === "video" || file.type === "audio") ? "media" : file.type + 's'}?query=${query}`)
  }

  return (
    <div className='search'>
      <div className='search-input-wrapper'>
        <Image
          src={"/assets/icons/search.svg"}
          alt='search'
          width={24}
          height={24}
        />

        <Input
          value={query}
          placeholder='Search...'
          className='search-input'
          onChange={(e) => setQuery(e.target.value)}
        />

        {open && (
          <ul className='search-result'>
            {results && results.length > 0 ? (
              results.map((file) => (
                // <li
                //   key={file.id}
                //   className='flex items-center justify-start gap-4'
                // >
                //   <div className='flex cursor-pointer items-center gap-4'>
                //     <Thumbnail
                //       type={file.type}
                //       extension={file.extension}
                //       url={file.url}
                //       className='size-9 min-w-9'
                //     />

                //   </div>
                //   <p className='subtitle-2 truncate block text-light-100'>
                //     {file.name}
                //   </p>

                //   <FormattedDateTime
                //     date={file.created_at}
                //     className='caption line-clamp-1 text-light-200'
                //   />
                // </li>

                <li
                  className="flex items-center justify-between w-full px-4"
                  key={file.id}
                  onClick={() => handleClickItem(file)}
                >
                  <div className="flex items-center gap-4 min-w-0 flex-1 cursor-pointer">
                    <Thumbnail
                      type={file.type}
                      extension={file.extension}
                      url={file.url}
                      className="size-9 min-w-9 flex-shrink-0"
                    />
                    <p className="subtitle-2 truncate text-light-100 min-w-0">
                      {file.name}
                    </p>
                  </div>

                  <FormattedDateTime
                    date={file.created_at}
                    className="caption text-light-200 flex-shrink-0 ml-4"
                  />
                </li>
              ))
            ) : (
              <p>No files found</p>
            )}
          </ul>
        )}
      </div>
    </div>
  )
}

export default Search