'use client'

import { useState } from 'react'

interface Project {
  id: string
  name: string
  client: string
  status: 'planning' | 'in-progress' | 'review' | 'completed'
  priority: 'low' | 'medium' | 'high'
  progress: number
  startDate: string
  deadline: string
  budget: number
  tasks: number
  completedTasks: number
}

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'E-Ticaret Web Sitesi',
    client: 'TechMart A.Ş.',
    status: 'in-progress',
    priority: 'high',
    progress: 65,
    startDate: '2025-10-01',
    deadline: '2025-11-15',
    budget: 25000,
    tasks: 20,
    completedTasks: 13,
  },
  {
    id: '2',
    name: 'Dijital Pazarlama Kampanyası',
    client: 'Fashion Boutique',
    status: 'in-progress',
    priority: 'medium',
    progress: 80,
    startDate: '2025-10-10',
    deadline: '2025-11-01',
    budget: 15000,
    tasks: 15,
    completedTasks: 12,
  },
  {
    id: '3',
    name: 'Kurumsal Kimlik Tasarımı',
    client: 'Kaya İnşaat',
    status: 'review',
    priority: 'high',
    progress: 95,
    startDate: '2025-09-15',
    deadline: '2025-10-30',
    budget: 12000,
    tasks: 10,
    completedTasks: 10,
  },
]

export default function ProjectsManagement() {
  const [projects] = useState<Project[]>(mockProjects)
  const [filter, setFilter] = useState<string>('all')

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(p => p.status === filter)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-gray-100 text-gray-800'
      case 'in-progress': return 'bg-blue-100 text-blue-800'
      case 'review': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'planning': return '📋 Planlama'
      case 'in-progress': return '⚡ Devam Ediyor'
      case 'review': return '👀 İnceleme'
      case 'completed': return '✅ Tamamlandı'
      default: return status
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600'
      case 'medium': return 'text-yellow-600'
      case 'low': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  const stats = {
    total: projects.length,
    inProgress: projects.filter(p => p.status === 'in-progress').length,
    completed: projects.filter(p => p.status === 'completed').length,
    review: projects.filter(p => p.status === 'review').length,
    totalBudget: projects.reduce((acc, p) => acc + p.budget, 0),
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-gray-900 mb-2">
            💼 Proje Yönetim Paneli
          </h1>
          <p className="text-gray-600 font-medium">
            Tüm projelerinizi tek yerden yönetin ve takip edin
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-bold text-gray-600 mb-2">Toplam Proje</div>
            <div className="text-3xl font-black text-blue-600">{stats.total}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-bold text-gray-600 mb-2">Devam Eden</div>
            <div className="text-3xl font-black text-blue-600">{stats.inProgress}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-bold text-gray-600 mb-2">İncelemede</div>
            <div className="text-3xl font-black text-yellow-600">{stats.review}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-bold text-gray-600 mb-2">Tamamlanan</div>
            <div className="text-3xl font-black text-green-600">{stats.completed}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-bold text-gray-600 mb-2">Toplam Bütçe</div>
            <div className="text-2xl font-black text-purple-600">
              ₺{(stats.totalBudget / 1000).toFixed(0)}K
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-bold transition-all ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tümü ({projects.length})
            </button>
            <button
              onClick={() => setFilter('in-progress')}
              className={`px-4 py-2 rounded-lg font-bold transition-all ${
                filter === 'in-progress'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ⚡ Devam Eden
            </button>
            <button
              onClick={() => setFilter('review')}
              className={`px-4 py-2 rounded-lg font-bold transition-all ${
                filter === 'review'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              👀 İnceleme
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg font-bold transition-all ${
                filter === 'completed'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ✅ Tamamlanan
            </button>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-lg shadow hover:shadow-xl transition-shadow p-6"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-black text-gray-900 mb-1">
                    {project.name}
                  </h3>
                  <p className="text-sm text-gray-600 font-medium">
                    👤 {project.client}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(project.status)}`}>
                  {getStatusLabel(project.status)}
                </span>
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-gray-700">İlerleme</span>
                  <span className="text-lg font-black text-blue-600">{project.progress}%</span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-xs font-medium text-gray-500 mb-1">Başlangıç</div>
                  <div className="font-bold text-gray-900">
                    {new Date(project.startDate).toLocaleDateString('tr-TR')}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-500 mb-1">Bitiş</div>
                  <div className="font-bold text-gray-900">
                    {new Date(project.deadline).toLocaleDateString('tr-TR')}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-500 mb-1">Bütçe</div>
                  <div className="font-bold text-purple-600">₺{project.budget.toLocaleString('tr-TR')}</div>
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-500 mb-1">Öncelik</div>
                  <div className={`font-bold ${getPriorityColor(project.priority)}`}>
                    {project.priority === 'high' && '🔴 Yüksek'}
                    {project.priority === 'medium' && '🟡 Orta'}
                    {project.priority === 'low' && '🟢 Düşük'}
                  </div>
                </div>
              </div>

              {/* Tasks */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📋</span>
                  <span className="font-bold text-gray-700">
                    {project.completedTasks} / {project.tasks} Görev
                  </span>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors text-sm">
                  Detaylar
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 font-medium text-xl">Bu kategoride proje yok</p>
          </div>
        )}
      </div>
    </div>
  )
}

