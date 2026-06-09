'use client'

import dynamic from 'next/dynamic'

const WhatsAppChatbot = dynamic(() => import('@/components/WhatsAppChatbot'), { ssr: false })
const ChatBot = dynamic(() => import('@/components/ChatBot'), { ssr: false })

export default function DeferredWidgets() {
  return (
    <>
      <WhatsAppChatbot />
      <ChatBot />
    </>
  )
}
