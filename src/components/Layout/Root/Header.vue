<template>
    <header class="sticky w-full top-0 left-0 right-0 z-50">
        <div class="w-full mx-auto px-4">
            <div class="flex w-full h-16 items-center">
                <div class="flex items-center w-60">
                    <div class="flex-shrink-0 flex items-center">
                        <div class="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center">
                            <img class="h-8 w-8" src="/apple-touch-icon.png" alt="Logo" />
                        </div>
                        <span class="ml-3 font-400 text-xl text-gray-600">Eco Stream</span>
                    </div>
                </div>
                <div class="flex-1">
                    <div
                        class="bg-[#e9eef6] rounded-full flex items-center w-full max-w-2xl px-4 py-3 transition relative">
                        <i class="i-mdi:magnify text-gray-600 mr-3 text-2xl"></i>
                        <input type="text" placeholder="Tìm kiếm hình ảnh, người dùng" name="search"
                            class="flex-1 bg-transparent outline-none w-full !placeholder-gray-500 text-gray-800" />
                        <button 
                            class="rounded-full cursor-pointer hover:bg-gray-300 transition absolute right-2 py-2 px-3">
                            <i class="i-mdi:tune text-gray-600 text-2xl"></i>
                        </button>
                    </div>
                </div>

                <div class="flex items-center space-x-4">
                    <div class="relative">
                        <button
                            class="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            <img class="h-10 w-10 rounded-full ring-2 ring-white"
                                src="https://picsum.photos/seed/user123/40/40.jpg" alt="User avatar" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </header>
</template>