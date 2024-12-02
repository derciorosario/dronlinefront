import React from 'react'

function CardSkeleton({replicate}) {
  return (
    <div className="flex gap-2 flex-wrap">
    {Array.from({ length: replicate || 1 }, () => []).map(()=>(
        <div role='status' class='md:max-w-sm w-full border border-gray-300 rounded-lg p-4'>
        <div class="animate-pulse w-full bg-gray-300 h-48 rounded-lg mb-5 flex justify-center items-center">
         
        </div>
        <div class=' w-full flex justify-between items-start animate-pulse'>
          <div class="block">
              <h3 class='h-3 bg-gray-300 rounded-full  w-48 mb-4'></h3>
              <p class='h-2 bg-gray-300 rounded-full w-32 mb-2.5'></p>
          </div>
          <span class="h-2 bg-gray-300 rounded-full w-16 "></span>
        </div>
        </div>
    ))}
    </div>
  )
}

export default CardSkeleton