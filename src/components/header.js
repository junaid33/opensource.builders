import React from "react"
import { Link } from "gatsby"
import { Box, PseudoBox } from "@chakra-ui/core"

export default function Header({ children }) {
  return (
    <Box
      bg="white"
      boxShadow="0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)"
    >
      <Box px={{ md: "2rem" }}>
        <Box
          as="nav"
          position="relative"
          display="flex"
          flexWrap="wrap"
          justifyContent="space-between"
          alignItems="center"
          p="1rem"
        >
          <Box
            as="img"
            w="2rem"
            h="2rem"
            mb="0"
            src="https://polished-sunset-0ex44e5cb9xt.tailwindcss.com/img/example-logo.svg"
            alt=""
          />
          <Box display="flex">
            <Link to="/">
              <PseudoBox
                fontSize=".875rem"
                color="#1a202c"
                fontWeight="500"
                _hover={{ color: "#4A5568" }}
                px={2}
              >
                Alternatives
              </PseudoBox>
            </Link>
            <Link to="/shopify">
              <PseudoBox
                fontSize=".875rem"
                color="#1a202c"
                fontWeight="500"
                _hover={{ color: "#4A5568" }}
                px={2}
              >
                Requests
              </PseudoBox>
            </Link>
            <Link to="/shopify">
              <PseudoBox
                fontSize=".875rem"
                color="#1a202c"
                fontWeight="500"
                _hover={{ color: "#4A5568" }}
                px={2}
              >
                About
              </PseudoBox>
            </Link>
          </Box>

          {/* <div class="flex-shrink-0 pr-4 md:hidden">
            <button
              type="button"
              class="block text-gray-600 focus:outline-none focus:text-gray-900"
              aria-label="Menu"
            >
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 6C3 5.44772 3.44772 5 4 5H20C20.5523 5 21 5.44772 21 6C21 6.55228 20.5523 7 20 7H4C3.44772 7 3 6.55228 3 6Z" />
                <path d="M3 12C3 11.4477 3.44772 11 4 11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13H4C3.44772 13 3 12.5523 3 12Z" />
                <path d="M4 17C3.44772 17 3 17.4477 3 18C3 18.5523 3.44772 19 4 19H20C20.5523 19 21 18.5523 21 18C21 17.4477 20.5523 17 20 17H4Z" />
              </svg>
            </button>
          </div>
          <div class="hidden md:block md:ml-10 md:flex md:items-baseline md:justify-between md:bg-transparent">
            <div class="lg:absolute inset-0 flex items-center justify-center">
              <a
                href="#"
                class="text-sm font-medium text-gray-900 hover:text-gray-700"
              >
                Products
              </a>
              <a
                href="#"
                class="ml-10 text-sm font-medium text-gray-900 hover:text-gray-700"
              >
                Marketplace
              </a>
              <a
                href="#"
                class="ml-10 text-sm font-medium text-gray-900 hover:text-gray-700"
              >
                Partners
              </a>
              <a
                href="#"
                class="ml-10 text-sm font-medium text-gray-900 hover:text-gray-700"
              >
                About
              </a>
            </div>
            <div class="ml-10 relative flex items-baseline">
              <a
                href="#"
                class="text-sm font-medium text-gray-900 hover:text-gray-700"
              >
                Log in
              </a>
              <a
                href="#"
                class="ml-8 px-3 py-2 font-medium text-center text-sm rounded-lg bg-gray-300 text-gray-900 hover:bg-gray-400 focus:outline-none focus:bg-gray-400"
              >
                Create Account
              </a>
            </div>
          </div> */}
        </Box>
      </Box>
    </Box>

    // <div class="md:hidden">
    //   <transition
    //     enter-class="opacity-0"
    //     enter-active-class="ease-out transition-medium"
    //     enter-to-class="opacity-100"
    //     leave-class="opacity-100"
    //     leave-active-class="ease-out transition-medium"
    //     leave-to-class="opacity-0"
    //     appear
    //   >
    //     <div v-show="isOpen" class="z-10 fixed inset-0 transition-opacity">
    //       <div
    //         class="absolute inset-0 bg-black opacity-50"
    //         tabindex="-1"
    //       ></div>
    //     </div>
    //   </transition>

    //   <transition
    //     enter-class="translate-x-full"
    //     enter-active-class="ease-out transition-slow"
    //     enter-to-class="translate-x-0"
    //     leave-class="translate-x-0"
    //     leave-active-class="ease-in transition-medium"
    //     leave-to-class="translate-x-full"
    //     appear
    //   >
    //     <div
    //       v-show="isOpen"
    //       class="z-10 fixed inset-y-0 right-0 max-w-xs w-full bg-white transition-transform overflow-y-auto"
    //     >
    //       <div class="relative z-10 bg-white">
    //         <div
    //           //   :class="isOpen ? 'block' : 'hidden'"
    //           class="absolute top-0 right-0 p-4"
    //         >
    //           <button
    //             // @click="close"
    //             type="button"
    //             class="text-gray-600 focus:outline-none focus:text-gray-900"
    //             aria-label="Close"
    //           >
    //             <svg
    //               class="h-6 w-6"
    //               fill="currentColor"
    //               viewBox="0 0 24 24"
    //             >
    //               <path d="M18.2929 19.7071C18.6834 20.0976 19.3166 20.0976 19.7071 19.7071C20.0976 19.3166 20.0976 18.6834 19.7071 18.2929L13.4142 12L19.7071 5.70711C20.0976 5.31658 20.0976 4.68342 19.7071 4.29289C19.3166 3.90237 18.6834 3.90237 18.2929 4.29289L12 10.5858L5.70711 4.29289C5.31658 3.90237 4.68342 3.90237 4.29289 4.29289C3.90237 4.68342 3.90237 5.31658 4.29289 5.70711L10.5858 12L4.29289 18.2929C3.90237 18.6834 3.90237 19.3166 4.29289 19.7071C4.68342 20.0976 5.31658 20.0976 5.70711 19.7071L12 13.4142L18.2929 19.7071Z" />
    //             </svg>
    //           </button>
    //         </div>
    //         <div class="px-4 pt-4 pb-6">
    //           <img class="h-8 w-8" src="/img/example-logo.svg" alt="" />
    //           <a
    //             href="#"
    //             class="mt-8 block text-xs font-semibold text-gray-600 uppercase tracking-wider"
    //           >
    //             Products
    //           </a>
    //           <a
    //             href="#"
    //             class="mt-4 block font-medium text-gray-900 hover:text-gray-700"
    //           >
    //             Checkout
    //           </a>
    //           <a
    //             href="#"
    //             class="mt-4 block font-medium text-gray-900 hover:text-gray-700"
    //           >
    //             Payments
    //           </a>
    //           <a
    //             href="#"
    //             class="mt-4 block font-medium text-gray-900 hover:text-gray-700"
    //           >
    //             Billing
    //           </a>
    //           <a
    //             href="#"
    //             class="mt-4 block font-medium text-gray-900 hover:text-gray-700"
    //           >
    //             Insights
    //           </a>
    //         </div>
    //         <div class="border-t-2 border-gray-200 px-4 pt-6">
    //           <a
    //             href="#"
    //             class="block font-medium text-gray-900 hover:text-gray-700"
    //           >
    //             Marketplace
    //           </a>
    //           <a
    //             href="#"
    //             class="mt-4 block font-medium text-gray-900 hover:text-gray-700"
    //           >
    //             Partners
    //           </a>
    //           <a
    //             href="#"
    //             class="mt-4 block font-medium text-gray-900 hover:text-gray-700"
    //           >
    //             About
    //           </a>
    //         </div>
    //       </div>
    //       <div class="relative bg-white">
    //         <div class="px-4 pt-4 pb-6">
    //           <a
    //             href="#"
    //             class="block font-medium text-gray-900 hover:text-gray-700"
    //           >
    //             Log in
    //           </a>
    //         </div>
    //         <div class="p-4">
    //           <a
    //             href="#"
    //             class="block px-3 py-3 font-medium text-center bg-gray-300 rounded-lg text-gray-900 hover:bg-gray-400 focus:outline-none focus:bg-gray-400"
    //           >
    //             Create Account
    //           </a>
    //         </div>
    //       </div>
    //     </div>
    //   </transition>
    // </div>
  )
}
