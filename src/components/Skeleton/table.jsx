import React from 'react'

function TableSkeleton() {
  return (
    
<div role="status" class="w-full p-4 space-y-4 border border-gray-200 divide-y divide-gray-200 rounded shadow-sm animate-pulse">
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
        <div class="h-2.5 bg-gray-300 rounded-full  w-12"></div>
    </div>
    <div class="flex items-center justify-between pt-4">
        <div>
            <div class="h-2.5 bg-gray-300 rounded-full  w-24 mb-2.5"></div>
            <div class="w-32 h-2 bg-gray-200 rounded-full "></div>
        </div>
        <div class="h-2.5 bg-gray-300 rounded-full w-12"></div>
    </div>
    <div class="flex items-center justify-between pt-4">
        <div>
            <div class="h-2.5 bg-gray-300 rounded-full w-24 mb-2.5"></div>
            <div class="w-32 h-2 bg-gray-200 rounded-full "></div>
        </div>
        <div class="h-2.5 bg-gray-300 rounded-full w-12"></div>
    </div>
    <span class="sr-only">Loading...</span>
</div>

  )
}

export default TableSkeleton