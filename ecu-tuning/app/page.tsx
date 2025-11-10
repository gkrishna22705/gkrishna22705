"use client"

import { useState } from 'react'
import FuelMap from '@/components/FuelMap'
import IgnitionTiming from '@/components/IgnitionTiming'
import EngineParameters from '@/components/EngineParameters'
import DataLogger from '@/components/DataLogger'
import PerformanceMetrics from '@/components/PerformanceMetrics'

export default function Home() {
  const [activeTab, setActiveTab] = useState('fuel')
  const [ecuData, setEcuData] = useState({
    fuelMap: Array(16).fill(0).map(() => Array(16).fill(14.7)),
    ignitionMap: Array(16).fill(0).map(() => Array(16).fill(15)),
    parameters: {
      boostPressure: 0,
      afr: 14.7,
      rpm: 0,
      throttle: 0,
      coolantTemp: 90,
      intakeTemp: 25,
      lambda: 1.0,
      injectorDuration: 0
    }
  })

  const tabs = [
    { id: 'fuel', label: 'Fuel Map', icon: '⛽' },
    { id: 'ignition', label: 'Ignition Timing', icon: '⚡' },
    { id: 'parameters', label: 'Engine Parameters', icon: '⚙️' },
    { id: 'logger', label: 'Data Logger', icon: '📊' },
    { id: 'metrics', label: 'Performance', icon: '🏁' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🏎️</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">ECU Tuning Suite</h1>
                <p className="text-sm text-gray-400">Professional Engine Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="px-4 py-2 bg-green-500/20 border border-green-500/50 rounded-lg">
                <span className="text-green-400 text-sm font-semibold">● CONNECTED</span>
              </div>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                Save Tune
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-gray-900/30 backdrop-blur-sm border-b border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 font-medium transition-all ${
                  activeTab === tab.id
                    ? 'text-white border-b-2 border-blue-500 bg-gray-800/50'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/30'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {activeTab === 'fuel' && (
          <FuelMap 
            fuelMap={ecuData.fuelMap} 
            setFuelMap={(map) => setEcuData({...ecuData, fuelMap: map})}
          />
        )}
        {activeTab === 'ignition' && (
          <IgnitionTiming 
            ignitionMap={ecuData.ignitionMap}
            setIgnitionMap={(map) => setEcuData({...ecuData, ignitionMap: map})}
          />
        )}
        {activeTab === 'parameters' && (
          <EngineParameters 
            parameters={ecuData.parameters}
            setParameters={(params) => setEcuData({...ecuData, parameters: params})}
          />
        )}
        {activeTab === 'logger' && <DataLogger />}
        {activeTab === 'metrics' && <PerformanceMetrics />}
      </main>
    </div>
  )
}
