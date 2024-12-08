import React from 'react'

export default function DashboardSkeleton() {
  return (

     <>
        <div className="w-full flex items-center mb-2">
            {Array.from({ length: 3 }, () => []).map((_,_i)=>(
                <div class={`border shadow rounded-md p-4 max-w-sm w-full m-1 max-md:${_i==2 ? 'hidden':''}`}>
                    <div class="animate-pulse flex space-x-4">
                    <div class="rounded-full bg-gray-300 h-10 w-10"></div>
                    <div class="flex-1 space-y-6 py-1">
                        <div class="h-2 bg-gray-300 rounded"></div>
                        <div class="space-y-3">
                        <div class="grid grid-cols-3 gap-4">
                            <div class="h-2 bg-gray-300 rounded col-span-2"></div>
                            <div class="h-2 bg-gray-300 rounded col-span-1"></div>
                        </div>
                        <div class="h-2 bg-gray-300 rounded"></div>
                        </div>
                    </div>
                    </div>
              </div>
            ))}
        </div>
        <div role="status" class="w-full p-4 space-y-4 border border-gray-200 divide-y divide-gray-200 rounded shadow animate-pulse">
            <div class="flex items-center justify-between">
                <div>
                    <div class="h-2.5 bg-gray-300 rounded-full w-24 mb-2.5"></div>
                    <div class="w-32 h-2 bg-gray-200 rounded-full"></div>
                </div>
                <div class="h-2.5 bg-gray-300 rounded-full w-12"></div>
            </div>
            <div class="flex items-center justify-between pt-4">
                <div>
                    <div class="h-2.5 bg-gray-300 rounded-full w-24 mb-2.5"></div>
                    <div class="w-32 h-2 bg-gray-200 rounded-full"></div>
                </div>
                <div class="h-2.5 bg-gray-300 rounded-full  w-12"></div>
            </div>
            <div class="flex items-center justify-between pt-4">
                <div>
                    <div class="h-2.5 bg-gray-300 rounded-full  w-24 mb-2.5"></div>
                    <div class="w-32 h-2 bg-gray-200 rounded-full"></div>
                </div>
                <div class="h-2.5 bg-gray-300 rounded-full w-12"></div>
            </div>
            <div class="flex items-center justify-between pt-4">
                <div>
                    <div class="h-2.5 bg-gray-300 rounded-full w-24 mb-2.5"></div>
                    <div class="w-32 h-2 bg-gray-200 rounded-full"></div>
                </div>
                <div class="h-2.5 bg-gray-300 rounded-full  w-12"></div>
            </div>
            <div class="flex items-center justify-between pt-4">
                <div>
                    <div class="h-2.5 bg-gray-300 rounded-full  w-24 mb-2.5"></div>
                    <div class="w-32 h-2 bg-gray-200 rounded-full"></div>
                </div>
                <div class="h-2.5 bg-gray-300 rounded-full  w-12"></div>
            </div>
            <span class="sr-only">Loading...</span>
        </div>

    </>
   

  )
}
