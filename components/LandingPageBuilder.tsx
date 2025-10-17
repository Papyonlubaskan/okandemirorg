'use client'

import { useState } from 'react'
import Image from 'next/image'

interface Section {
  id: string
  type: 'hero' | 'features' | 'cta' | 'testimonial' | 'pricing'
  title: string
  content: string
  buttonText?: string
  buttonLink?: string
  image?: string
}

const templates = [
  {
    id: 'digital-marketing',
    name: 'Dijital Pazarlama',
    color: 'from-blue-500 to-cyan-500',
    sections: [
      {
        id: '1',
        type: 'hero' as const,
        title: 'Dijital Pazarlama ile Satışlarınızı Katla',
        content: 'Google Ads, Meta Ads ve sosyal medya ile hedef kitlenize ulaşın',
        buttonText: 'Ücretsiz Analiz',
        buttonLink: '/iletisim',
        image: '/digital-marketing-bg.png',
      },
      {
        id: '2',
        type: 'features' as const,
        title: 'Neler Sunuyoruz?',
        content: 'Google Ads • Meta Ads • TikTok Ads • LinkedIn Ads • SEO • Social Media',
      },
      {
        id: '3',
        type: 'cta' as const,
        title: 'Hemen Başlayın!',
        content: 'İlk kampanyanız için %20 indirim',
        buttonText: 'İletişime Geç',
        buttonLink: '/iletisim',
      },
    ],
  },
  {
    id: 'web-design',
    name: 'Web Tasarım',
    color: 'from-purple-500 to-pink-500',
    sections: [
      {
        id: '1',
        type: 'hero' as const,
        title: 'Modern ve Profesyonel Web Tasarım',
        content: 'Markanızı dijital dünyada en iyi şekilde temsil edin',
        buttonText: 'Portföyü İncele',
        buttonLink: '/projeler',
      },
      {
        id: '2',
        type: 'features' as const,
        title: 'Özelllikler',
        content: 'Responsive Design • SEO Optimized • Fast Loading • Custom Design',
      },
      {
        id: '3',
        type: 'cta' as const,
        title: 'Projenizi Başlatalım',
        content: 'Ücretsiz danışmanlık için iletişime geçin',
        buttonText: 'Randevu Al',
        buttonLink: '/iletisim',
      },
    ],
  },
]

export default function LandingPageBuilder() {
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0])
  const [customSections, setCustomSections] = useState<Section[]>(selectedTemplate.sections)
  const [previewMode, setPreviewMode] = useState(false)

  const renderSection = (section: Section) => {
    switch (section.type) {
      case 'hero':
        return (
          <div className={`relative py-20 bg-gradient-to-br ${selectedTemplate.color} text-white overflow-hidden`}>
            <div className="container mx-auto px-4 relative z-10">
              <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-5xl md:text-6xl font-black mb-6">
                  {section.title}
                </h1>
                <p className="text-xl md:text-2xl mb-8 font-medium">
                  {section.content}
                </p>
                {section.buttonText && (
                  <a
                    href={section.buttonLink}
                    className="inline-block bg-white text-blue-600 px-8 py-4 rounded-full font-black text-lg hover:shadow-2xl transition-all hover:scale-105"
                  >
                    {section.buttonText}
                  </a>
                )}
              </div>
            </div>
            {section.image && (
              <div className="absolute inset-0 opacity-20">
                <Image src={section.image} alt="Background" fill className="object-cover" />
              </div>
            )}
          </div>
        )

      case 'features':
        return (
          <div className="py-20 bg-white">
            <div className="container mx-auto px-4">
              <h2 className="text-4xl font-black text-gray-900 text-center mb-12">
                {section.title}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {section.content.split('•').map((feature, idx) => (
                  <div
                    key={idx}
                    className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl text-center hover:shadow-lg transition-shadow"
                  >
                    <div className="text-3xl mb-3">✨</div>
                    <div className="font-bold text-gray-900">{feature.trim()}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'cta':
        return (
          <div className={`py-20 bg-gradient-to-r ${selectedTemplate.color} text-white`}>
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-4xl md:text-5xl font-black mb-6">
                {section.title}
              </h2>
              <p className="text-xl mb-8 font-medium max-w-2xl mx-auto">
                {section.content}
              </p>
              {section.buttonText && (
                <a
                  href={section.buttonLink}
                  className="inline-block bg-white text-blue-600 px-8 py-4 rounded-full font-black text-lg hover:shadow-2xl transition-all hover:scale-105"
                >
                  {section.buttonText}
                </a>
              )}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {!previewMode ? (
        <div className="py-8 px-4">
          <div className="max-w-7xl mx-auto">
            {/* Builder Header */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h1 className="text-3xl font-black text-gray-900 mb-4">
                🏗️ Landing Page Builder
              </h1>
              
              {/* Template Selection */}
              <div className="mb-6">
                <label className="block font-bold text-gray-700 mb-3">Şablon Seçin:</label>
                <div className="grid md:grid-cols-3 gap-4">
                  {templates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => {
                        setSelectedTemplate(template)
                        setCustomSections(template.sections)
                      }}
                      className={`p-6 rounded-lg border-2 transition-all ${
                        selectedTemplate.id === template.id
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`h-32 rounded bg-gradient-to-br ${template.color} mb-4`}></div>
                      <div className="font-black text-gray-900">{template.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setPreviewMode(true)}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-black text-lg hover:shadow-lg transition-all"
              >
                👁️ Önizleme
              </button>
            </div>

            {/* Sections Editor */}
            <div className="space-y-4">
              {customSections.map((section, idx) => (
                <div key={section.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-black text-gray-900 text-lg">
                      Section {idx + 1}: {section.type}
                    </h3>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-bold">
                      {section.type}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) => {
                        const updated = [...customSections]
                        updated[idx].title = e.target.value
                        setCustomSections(updated)
                      }}
                      className="w-full px-4 py-2 border rounded-lg font-medium"
                      placeholder="Başlık"
                    />
                    <textarea
                      value={section.content}
                      onChange={(e) => {
                        const updated = [...customSections]
                        updated[idx].content = e.target.value
                        setCustomSections(updated)
                      }}
                      className="w-full px-4 py-2 border rounded-lg font-medium"
                      rows={3}
                      placeholder="İçerik"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div>
          {/* Preview Mode */}
          <div className="fixed top-4 right-4 z-50">
            <button
              onClick={() => setPreviewMode(false)}
              className="bg-white text-gray-900 px-6 py-3 rounded-full font-black shadow-xl hover:shadow-2xl transition-all"
            >
              ✏️ Düzenle
            </button>
          </div>
          
          {customSections.map((section) => (
            <div key={section.id}>
              {renderSection(section)}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

