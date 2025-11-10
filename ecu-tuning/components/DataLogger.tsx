"use client"

import { useState, useEffect } from 'react'

interface LogEntry {
  timestamp: string
  rpm: number
  boost: number
  afr: number
  timing: number
  throttle: number
}

export default function DataLogger() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [isLogging, setIsLogging] = useState(false)
  const [logInterval, setLogInterval] = useState(100)

  useEffect(() => {
    if (!isLogging) return

    const interval = setInterval(() => {
      const newLog: LogEntry = {
        timestamp: new Date().toLocaleTimeString(),
        rpm: Math.floor(Math.random() * 5000) + 2000,
        boost: Math.random() * 20,
        afr: 12 + Math.random() * 3,
        timing: 15 + Math.random() * 10,
        throttle: Math.floor(Math.random() * 100)
      }
      setLogs(prev => [newLog, ...prev].slice(0, 100))
    }, logInterval)

    return () => clearInterval(interval)
  }, [isLogging, logInterval])

  const exportLogs = () => {
    const csv = [
      'Timestamp,RPM,Boost (PSI),AFR,Timing (°),Throttle (%)',
      ...logs.map(log => 
        `${log.timestamp},${log.rpm},${log.boost.toFixed(2)},${log.afr.toFixed(2)},${log.timing.toFixed(2)},${log.throttle}`
      )
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ecu-log-${Date.now()}.csv`
    a.click()
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-4">Data Logger</h2>
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={() => setIsLogging(!isLogging)}
            className={`px-6 py-2 rounded-lg transition-colors font-semibold ${
              isLogging 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {isLogging ? '⏸️ Stop Logging' : '▶️ Start Logging'}
          </button>
          
          <button
            onClick={() => setLogs([])}
            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Clear Logs
          </button>

          <button
            onClick={exportLogs}
            disabled={logs.length === 0}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            📥 Export CSV
          </button>

          <div className="flex items-center space-x-2 ml-auto">
            <label className="text-gray-400 text-sm">Log Interval:</label>
            <select
              value={logInterval}
              onChange={(e) => setLogInterval(parseInt(e.target.value))}
              className="px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            >
              <option value={50}>50ms</option>
              <option value={100}>100ms</option>
              <option value={250}>250ms</option>
              <option value={500}>500ms</option>
              <option value={1000}>1s</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
          <div className="text-gray-400 text-sm mb-1">Total Entries</div>
          <div className="text-3xl font-bold text-white">{logs.length}</div>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
          <div className="text-gray-400 text-sm mb-1">Avg RPM</div>
          <div className="text-3xl font-bold text-blue-400">
            {logs.length > 0 ? Math.floor(logs.reduce((sum, log) => sum + log.rpm, 0) / logs.length) : 0}
          </div>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
          <div className="text-gray-400 text-sm mb-1">Avg Boost</div>
          <div className="text-3xl font-bold text-purple-400">
            {logs.length > 0 ? (logs.reduce((sum, log) => sum + log.boost, 0) / logs.length).toFixed(1) : 0} PSI
          </div>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
          <div className="text-gray-400 text-sm mb-1">Avg AFR</div>
          <div className="text-3xl font-bold text-orange-400">
            {logs.length > 0 ? (logs.reduce((sum, log) => sum + log.afr, 0) / logs.length).toFixed(2) : 0}
          </div>
        </div>
      </div>

      {/* Log Table */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900/50">
              <tr>
                <th className="px-4 py-3 text-left text-gray-400 text-sm font-semibold">Timestamp</th>
                <th className="px-4 py-3 text-left text-gray-400 text-sm font-semibold">RPM</th>
                <th className="px-4 py-3 text-left text-gray-400 text-sm font-semibold">Boost (PSI)</th>
                <th className="px-4 py-3 text-left text-gray-400 text-sm font-semibold">AFR</th>
                <th className="px-4 py-3 text-left text-gray-400 text-sm font-semibold">Timing (°)</th>
                <th className="px-4 py-3 text-left text-gray-400 text-sm font-semibold">Throttle (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    No log entries. Start logging to see data.
                  </td>
                </tr>
              ) : (
                logs.map((log, index) => (
                  <tr key={index} className="hover:bg-gray-700/30 transition-colors">
                    <td className="px-4 py-3 text-gray-300 text-sm">{log.timestamp}</td>
                    <td className="px-4 py-3 text-white font-medium">{log.rpm}</td>
                    <td className="px-4 py-3 text-purple-400 font-medium">{log.boost.toFixed(2)}</td>
                    <td className="px-4 py-3 text-orange-400 font-medium">{log.afr.toFixed(2)}</td>
                    <td className="px-4 py-3 text-cyan-400 font-medium">{log.timing.toFixed(2)}</td>
                    <td className="px-4 py-3 text-green-400 font-medium">{log.throttle}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info */}
      <div className="bg-blue-900/30 border border-blue-600/50 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <span className="text-2xl">ℹ️</span>
          <div>
            <h4 className="text-blue-400 font-semibold mb-1">Data Logging</h4>
            <p className="text-blue-200/80 text-sm">
              The data logger captures real-time engine parameters at your specified interval. Export logs as CSV for analysis in external tools.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
