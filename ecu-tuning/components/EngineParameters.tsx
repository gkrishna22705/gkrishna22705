"use client"

import { useEffect, useState } from 'react'

interface Parameters {
  boostPressure: number
  afr: number
  rpm: number
  throttle: number
  coolantTemp: number
  intakeTemp: number
  lambda: number
  injectorDuration: number
}

interface EngineParametersProps {
  parameters: Parameters
  setParameters: (params: Parameters) => void
}

export default function EngineParameters({ parameters, setParameters }: EngineParametersProps) {
  const [limits, setLimits] = useState({
    maxRpm: 8500,
    maxBoost: 25,
    maxCoolantTemp: 110,
    minAfr: 10.5,
    maxAfr: 16.0
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setParameters({
        ...parameters,
        rpm: Math.floor(Math.random() * 3000) + 1000,
        throttle: Math.floor(Math.random() * 100),
        boostPressure: Math.random() * 15,
        afr: 13.5 + Math.random() * 2,
        lambda: 0.9 + Math.random() * 0.2,
        injectorDuration: Math.random() * 20,
        coolantTemp: 85 + Math.random() * 10,
        intakeTemp: 20 + Math.random() * 15
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const updateLimit = (key: keyof typeof limits, value: number) => {
    setLimits({ ...limits, [key]: value })
  }

  const parameterCards = [
    {
      title: 'Engine Speed',
      value: parameters.rpm,
      unit: 'RPM',
      max: limits.maxRpm,
      color: 'blue',
      icon: '⚙️'
    },
    {
      title: 'Throttle Position',
      value: parameters.throttle,
      unit: '%',
      max: 100,
      color: 'green',
      icon: '🎚️'
    },
    {
      title: 'Boost Pressure',
      value: parameters.boostPressure,
      unit: 'PSI',
      max: limits.maxBoost,
      color: 'purple',
      icon: '💨'
    },
    {
      title: 'Air/Fuel Ratio',
      value: parameters.afr,
      unit: 'AFR',
      max: limits.maxAfr,
      color: 'orange',
      icon: '⛽'
    },
    {
      title: 'Lambda',
      value: parameters.lambda,
      unit: 'λ',
      max: 1.2,
      color: 'cyan',
      icon: '🔬'
    },
    {
      title: 'Injector Duration',
      value: parameters.injectorDuration,
      unit: 'ms',
      max: 25,
      color: 'pink',
      icon: '💉'
    },
    {
      title: 'Coolant Temp',
      value: parameters.coolantTemp,
      unit: '°C',
      max: limits.maxCoolantTemp,
      color: 'red',
      icon: '🌡️'
    },
    {
      title: 'Intake Temp',
      value: parameters.intakeTemp,
      unit: '°C',
      max: 60,
      color: 'teal',
      icon: '🌡️'
    }
  ]

  const getColorClass = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      purple: 'from-purple-500 to-purple-600',
      orange: 'from-orange-500 to-orange-600',
      cyan: 'from-cyan-500 to-cyan-600',
      pink: 'from-pink-500 to-pink-600',
      red: 'from-red-500 to-red-600',
      teal: 'from-teal-500 to-teal-600'
    }
    return colors[color] || colors.blue
  }

  return (
    <div className="space-y-6">
      {/* Real-time Parameters */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-6">Real-Time Engine Parameters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {parameterCards.map((param, index) => (
            <div key={index} className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">{param.title}</span>
                <span className="text-2xl">{param.icon}</span>
              </div>
              <div className="mb-3">
                <div className={`text-3xl font-bold bg-gradient-to-r ${getColorClass(param.color)} bg-clip-text text-transparent`}>
                  {param.value.toFixed(1)}
                </div>
                <div className="text-gray-500 text-sm">{param.unit}</div>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full bg-gradient-to-r ${getColorClass(param.color)} transition-all duration-300`}
                  style={{ width: `${Math.min((param.value / param.max) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Engine Limits Configuration */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-6">Engine Protection Limits</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Max RPM Limit</label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="6000"
                max="10000"
                step="100"
                value={limits.maxRpm}
                onChange={(e) => updateLimit('maxRpm', parseInt(e.target.value))}
                className="flex-1"
              />
              <input
                type="number"
                value={limits.maxRpm}
                onChange={(e) => updateLimit('maxRpm', parseInt(e.target.value))}
                className="w-24 px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">Max Boost Pressure (PSI)</label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="10"
                max="40"
                step="1"
                value={limits.maxBoost}
                onChange={(e) => updateLimit('maxBoost', parseInt(e.target.value))}
                className="flex-1"
              />
              <input
                type="number"
                value={limits.maxBoost}
                onChange={(e) => updateLimit('maxBoost', parseInt(e.target.value))}
                className="w-24 px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">Max Coolant Temperature (°C)</label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="90"
                max="120"
                step="1"
                value={limits.maxCoolantTemp}
                onChange={(e) => updateLimit('maxCoolantTemp', parseInt(e.target.value))}
                className="flex-1"
              />
              <input
                type="number"
                value={limits.maxCoolantTemp}
                onChange={(e) => updateLimit('maxCoolantTemp', parseInt(e.target.value))}
                className="w-24 px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">Min AFR (Richest)</label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="9"
                max="12"
                step="0.1"
                value={limits.minAfr}
                onChange={(e) => updateLimit('minAfr', parseFloat(e.target.value))}
                className="flex-1"
              />
              <input
                type="number"
                step="0.1"
                value={limits.minAfr}
                onChange={(e) => updateLimit('minAfr', parseFloat(e.target.value))}
                className="w-24 px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`rounded-xl p-4 border ${parameters.rpm > limits.maxRpm ? 'bg-red-900/30 border-red-600/50' : 'bg-green-900/30 border-green-600/50'}`}>
          <div className="flex items-center justify-between">
            <span className="text-white font-semibold">RPM Status</span>
            <span className={parameters.rpm > limits.maxRpm ? 'text-red-400' : 'text-green-400'}>
              {parameters.rpm > limits.maxRpm ? '⚠️ OVER LIMIT' : '✓ NORMAL'}
            </span>
          </div>
        </div>

        <div className={`rounded-xl p-4 border ${parameters.boostPressure > limits.maxBoost ? 'bg-red-900/30 border-red-600/50' : 'bg-green-900/30 border-green-600/50'}`}>
          <div className="flex items-center justify-between">
            <span className="text-white font-semibold">Boost Status</span>
            <span className={parameters.boostPressure > limits.maxBoost ? 'text-red-400' : 'text-green-400'}>
              {parameters.boostPressure > limits.maxBoost ? '⚠️ OVER LIMIT' : '✓ NORMAL'}
            </span>
          </div>
        </div>

        <div className={`rounded-xl p-4 border ${parameters.coolantTemp > limits.maxCoolantTemp ? 'bg-red-900/30 border-red-600/50' : 'bg-green-900/30 border-green-600/50'}`}>
          <div className="flex items-center justify-between">
            <span className="text-white font-semibold">Temp Status</span>
            <span className={parameters.coolantTemp > limits.maxCoolantTemp ? 'text-red-400' : 'text-green-400'}>
              {parameters.coolantTemp > limits.maxCoolantTemp ? '⚠️ OVER LIMIT' : '✓ NORMAL'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
