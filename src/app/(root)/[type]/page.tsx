import { getFiles } from '@/app/actions/File actions/get-files-actions'
import { GetUserInfo } from '@/app/actions/user-actions'
import Card from '@/components/Card '
import Sort from '@/components/Sort'
import { getFileTypesParams } from '@/lib/utils'
import { redirect } from 'next/navigation'
import React from 'react'

const page = async ({ searchParams, params }: SearchParamProps) => {

    const type = (await params)?.type as string

    const searchText = ((await searchParams)?.query as string) || ""
    const sort = ((await searchParams)?.sort as string) || ""

    const types = getFileTypesParams(type) as FileType[]

    const { success, data: currentUser, error } = await GetUserInfo()

    if (!success || !currentUser) {
        console.error(error)
        return redirect("/login")
    }

    const { email, fullName, userId } = currentUser

    const files = await getFiles({types, searchText, sort})

    return (
        <div className='page-container'>
            <section className='w-full'>
                <h1 className='h1 capitalize'>
                    {type}
                </h1>

                <div className='total-size-section'>
                    <p className='body-1'>
                        Total: <span className='h5'>0MB</span>

                    </p>

                    <div className='sort-container'>
                        <p className='body-1 hidden sm:block text-light-200'>
                            Sort by:
                        </p>

                        <Sort />
                    </div>
                </div>
            </section>

            {/* Render files dynamically */}
            {files && files.length > 0 ? (
                <section className="file-list">
                    {files.map((file: SupabaseFile) => (
                        <Card key={file.id} file={file} />
                    ))}
                </section>
            ) : (
                <p className="empty-list">No files uploaded</p>
            )}
        </div>
    )
}

export default page
