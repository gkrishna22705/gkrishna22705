"use client"

import { useState, useEffect } from 'react'

export default function PerformanceMetrics() {
  const [metrics, setMetrics] = useState({
    horsepower: 0,
    torque: 0,
    zeroToSixty: 0,
    quarterMile: 0,
    topSpeed: 0,
    fuelEfficiency: 0
  })

  const [dynoRun, setDynoRun] = useState<{rpm: number, hp: number, torque: number}[]>([])
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    if (!isRunning) return

    let rpm = 1000
    const interval = setInterval(() => {
      if (rpm > 8000) {
        setIsRunning(false)
        return
      }

      const hp = Math.max(0, -0.00005 * Math.pow(rpm - 6000, 2) + 450 + Math.random() * 20)
      const torque = (hp * 5252) / rpm

      setDynoRun(prev => [...prev, { rpm, hp, torque }])
      rpm += 200
    }, 100)

    return () => clearInterval(interval)
  }, [isRunning])

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics({
        horsepower: 420 + Math.random() * 30,
        torque: 380 + Math.random() * 20,
        zeroToSixty: 3.5 + Math.random() * 0.3,
        quarterMile: 11.2 + Math.random() * 0.4,
        topSpeed: 180 + Math.random() * 10,
        fuelEfficiency: 18 + Math.random() * 3
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const startDynoRun = () => {
    setDynoRun([])
    setIsRunning(true)
  }

  const maxHp = dynoRun.length > 0 ? Math.max(...dynoRun.map(d => d.hp)) : 0
  const maxTorque = dynoRun.length > 0 ? Math.max(...dynoRun.map(d => d.torque)) : 0

  return (
    <div className="space-y-6">
      {/* Performance Stats */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-6">Performance Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 rounded-xl p-6 border border-blue-700/50">
            <div className="text-blue-400 text-sm mb-2">Peak Horsepower</div>
            <div className="text-4xl font-bold text-white mb-1">{metrics.horsepower.toFixed(0)}</div>
            <div className="text-blue-300 text-sm">HP @ 6000 RPM</div>
          </div>

          <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 rounded-xl p-6 border border-purple-700/50">
            <div className="text-purple-400 text-sm mb-2">Peak Torque</div>
            <div className="text-4xl font-bold text-white mb-1">{metrics.torque.toFixed(0)}</div>
            <div className="text-purple-300 text-sm">lb-ft @ 4500 RPM</div>
          </div>

          <div className="bg-gradient-to-br from-green-900/50 to-green-800/30 rounded-xl p-6 border border-green-700/50">
            <div className="text-green-400 text-sm mb-2">0-60 MPH</div>
            <div className="text-4xl font-bold text-white mb-1">{metrics.zeroToSixty.toFixed(2)}</div>
            <div className="text-green-300 text-sm">seconds</div>
          </div>

          <div className="bg-gradient-to-br from-orange-900/50 to-orange-800/30 rounded-xl p-6 border border-orange-700/50">
            <div className="text-orange-400 text-sm mb-2">Quarter Mile</div>
            <div className="text-4xl font-bold text-white mb-1">{metrics.quarterMile.toFixed(2)}</div>
            <div className="text-orange-300 text-sm">seconds @ 125 MPH</div>
          </div>

          <div className="bg-gradient-to-br from-red-900/50 to-red-800/30 rounded-xl p-6 border border-red-700/50">
            <div className="text-red-400 text-sm mb-2">Top Speed</div>
            <div className="text-4xl font-bold text-white mb-1">{metrics.topSpeed.toFixed(0)}</div>
            <div className="text-red-300 text-sm">MPH</div>
          </div>

          <div className="bg-gradient-to-br from-cyan-900/50 to-cyan-800/30 rounded-xl p-6 border border-cyan-700/50">
            <div className="text-cyan-400 text-sm mb-2">Fuel Economy</div>
            <div className="text-4xl font-bold text-white mb-1">{metrics.fuelEfficiency.toFixed(1)}</div>
            <div className="text-cyan-300 text-sm">MPG Combined</div>
          </div>
        </div>
      </div>

      {/* Dyno Chart */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Virtual Dyno</h2>
          <button
            onClick={startDynoRun}
            disabled={isRunning}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRunning ? '🔄 Running...' : '▶️ Start Dyno Run'}
          </button>
        </div>

        {dynoRun.length > 0 && (
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div className="bg-blue-900/30 border border-blue-600/50 rounded-lg p-4">
              <div className="text-blue-400 text-sm">Peak Horsepower</div>
              <div className="text-2xl font-bold text-white">{maxHp.toFixed(1)} HP</div>
            </div>
            <div className="bg-purple-900/30 border border-purple-600/50 rounded-lg p-4">
              <div className="text-purple-400 text-sm">Peak Torque</div>
              <div className="text-2xl font-bold text-white">{maxTorque.toFixed(1)} lb-ft</div>
            </div>
          </div>
        )}

        <div className="relative h-96 bg-gray-900/50 rounded-lg p-4 border border-gray-700">
          {dynoRun.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center text-gray-500">
              Start a dyno run to see power curves
            </div>
          ) : (
            <svg className="w-full h-full" viewBox="0 0 800 400">
              {/* Grid */}
              {[0, 1, 2, 3, 4, 5].map(i => (
                <line
                  key={`h-${i}`}
                  x1="50"
                  y1={50 + i * 60}
                  x2="750"
                  y2={50 + i * 60}
                  stroke="#374151"
                  strokeWidth="1"
                />
              ))}
              {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
                <line
                  key={`v-${i}`}
                  x1={50 + i * 100}
                  y1="50"
                  x2={50 + i * 100}
                  y2="350"
                  stroke="#374151"
                  strokeWidth="1"
                />
              ))}

              {/* HP Curve */}
              <polyline
                points={dynoRun.map((d, i) => 
                  `${50 + (i / dynoRun.length) * 700},${350 - (d.hp / 500) * 300}`
                ).join(' ')}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="3"
              />

              {/* Torque Curve */}
              <polyline
                points={dynoRun.map((d, i) => 
                  `${50 + (i / dynoRun.length) * 700},${350 - (d.torque / 500) * 300}`
                ).join(' ')}
                fill="none"
                stroke="#a855f7"
                strokeWidth="3"
              />

              {/* Labels */}
              <text x="400" y="390" textAnchor="middle" fill="#9ca3af" fontSize="14">
                RPM
              </text>
              <text x="20" y="200" textAnchor="middle" fill="#9ca3af" fontSize="14" transform="rotate(-90 20 200)">
                HP / Torque
              </text>

              {/* Legend */}
              <line x1="600" y1="30" x2="640" y2="30" stroke="#3b82f6" strokeWidth="3" />
              <text x="650" y="35" fill="#3b82f6" fontSize="14">Horsepower</text>
              
              <line x1="600" y1="50" x2="640" y2="50" stroke="#a855f7" strokeWidth="3" />
              <text x="650" y="55" fill="#a855f7" fontSize="14">Torque</text>
            </svg>
          )}
        </div>
      </div>

      {/* Comparison */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-4">Tune Comparison</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900/50">
              <tr>
                <th className="px-4 py-3 text-left text-gray-400 text-sm font-semibold">Configuration</th>
                <th className="px-4 py-3 text-left text-gray-400 text-sm font-semibold">HP</th>
                <th className="px-4 py-3 text-left text-gray-400 text-sm font-semibold">Torque</th>
                <th className="px-4 py-3 text-left text-gray-400 text-sm font-semibold">0-60</th>
                <th className="px-4 py-3 text-left text-gray-400 text-sm font-semibold">Gain</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              <tr className="hover:bg-gray-700/30">
                <td className="px-4 py-3 text-white">Stock</td>
                <td className="px-4 py-3 text-gray-300">350 HP</td>
                <td className="px-4 py-3 text-gray-300">320 lb-ft</td>
                <td className="px-4 py-3 text-gray-300">4.8s</td>
                <td className="px-4 py-3 text-gray-500">-</td>
              </tr>
              <tr className="hover:bg-gray-700/30">
                <td className="px-4 py-3 text-white">Stage 1</td>
                <td className="px-4 py-3 text-blue-400">390 HP</td>
                <td className="px-4 py-3 text-blue-400">360 lb-ft</td>
                <td className="px-4 py-3 text-blue-400">4.2s</td>
                <td className="px-4 py-3 text-green-400">+40 HP</td>
              </tr>
              <tr className="hover:bg-gray-700/30 bg-blue-900/20">
                <td className="px-4 py-3 text-white font-semibold">Current Tune ✓</td>
                <td className="px-4 py-3 text-blue-400 font-semibold">{metrics.horsepower.toFixed(0)} HP</td>
                <td className="px-4 py-3 text-blue-400 font-semibold">{metrics.torque.toFixed(0)} lb-ft</td>
                <td className="px-4 py-3 text-blue-400 font-semibold">{metrics.zeroToSixty.toFixed(1)}s</td>
                <td className="px-4 py-3 text-green-400 font-semibold">+{(metrics.horsepower - 350).toFixed(0)} HP</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
