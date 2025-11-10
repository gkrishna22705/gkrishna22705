"use client"

import { useState } from 'react'

interface IgnitionTimingProps {
  ignitionMap: number[][]
  setIgnitionMap: (map: number[][]) => void
}

export default function IgnitionTiming({ ignitionMap, setIgnitionMap }: IgnitionTimingProps) {
  const [selectedCell, setSelectedCell] = useState<{row: number, col: number} | null>(null)
  const [editValue, setEditValue] = useState('')

  const rpmLabels = ['1000', '1500', '2000', '2500', '3000', '3500', '4000', '4500', '5000', '5500', '6000', '6500', '7000', '7500', '8000', '8500']
  const loadLabels = ['10', '20', '30', '40', '50', '60', '70', '80', '90', '100', '110', '120', '130', '140', '150', '160']

  const updateCell = (row: number, col: number, value: number) => {
    const newMap = ignitionMap.map((r, i) => 
      i === row ? r.map((c, j) => j === col ? value : c) : r
    )
    setIgnitionMap(newMap)
  }

  const getCellColor = (value: number) => {
    if (value < 10) return 'bg-purple-600'
    if (value < 15) return 'bg-blue-600'
    if (value < 20) return 'bg-cyan-600'
    if (value < 25) return 'bg-green-600'
    if (value < 30) return 'bg-yellow-600'
    if (value < 35) return 'bg-orange-600'
    return 'bg-red-600'
  }

  const adjustMap = (amount: number) => {
    const newMap = ignitionMap.map(row => row.map(cell => 
      Math.max(0, Math.min(40, cell + amount))
    ))
    setIgnitionMap(newMap)
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-4">Ignition Timing Map</h2>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => adjustMap(-1)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Retard All (-1°)
          </button>
          <button
            onClick={() => adjustMap(1)}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
          >
            Advance All (+1°)
          </button>
          <button
            onClick={() => setIgnitionMap(Array(16).fill(0).map(() => Array(16).fill(15)))}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Reset to 15° BTDC
          </button>
          <div className="flex items-center space-x-2 ml-auto">
            <span className="text-gray-400 text-sm">Timing Range:</span>
            <div className="flex space-x-1">
              <div className="w-4 h-4 bg-purple-600 rounded"></div>
              <span className="text-xs text-gray-400">Retarded</span>
              <div className="w-4 h-4 bg-green-600 rounded ml-2"></div>
              <span className="text-xs text-gray-400">Optimal</span>
              <div className="w-4 h-4 bg-red-600 rounded ml-2"></div>
              <span className="text-xs text-gray-400">Advanced</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ignition Map Grid */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 overflow-x-auto">
        <div className="inline-block min-w-full">
          <div className="flex">
            <div className="flex flex-col">
              <div className="w-20 h-10 flex items-center justify-center text-gray-400 text-sm font-semibold">
                Load %
              </div>
              {loadLabels.map((label, i) => (
                <div key={i} className="w-20 h-10 flex items-center justify-center text-gray-300 text-sm font-medium">
                  {label}
                </div>
              ))}
            </div>
            <div className="flex-1">
              <div className="flex">
                {rpmLabels.map((label, i) => (
                  <div key={i} className="flex-1 min-w-[60px] h-10 flex items-center justify-center text-gray-400 text-xs font-semibold">
                    {label}
                  </div>
                ))}
              </div>
              {ignitionMap.map((row, rowIndex) => (
                <div key={rowIndex} className="flex">
                  {row.map((cell, colIndex) => (
                    <div
                      key={colIndex}
                      onClick={() => {
                        setSelectedCell({row: rowIndex, col: colIndex})
                        setEditValue(cell.toFixed(1))
                      }}
                      className={`flex-1 min-w-[60px] h-10 flex items-center justify-center text-white text-xs font-medium cursor-pointer border border-gray-700 hover:border-blue-500 transition-all ${getCellColor(cell)} ${
                        selectedCell?.row === rowIndex && selectedCell?.col === colIndex ? 'ring-2 ring-blue-500' : ''
                      }`}
                    >
                      {cell.toFixed(1)}°
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 text-center text-gray-400 text-sm font-semibold">
            RPM
          </div>
        </div>
      </div>

      {/* Cell Editor */}
      {selectedCell && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-bold text-white mb-4">
            Edit Cell: Load {loadLabels[selectedCell.row]}% @ {rpmLabels[selectedCell.col]} RPM
          </h3>
          <div className="flex items-center space-x-4">
            <input
              type="number"
              step="0.5"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
            <span className="text-gray-400">° BTDC</span>
            <button
              onClick={() => {
                const value = parseFloat(editValue)
                if (!isNaN(value)) {
                  updateCell(selectedCell.row, selectedCell.col, value)
                }
              }}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Apply
            </button>
            <button
              onClick={() => setSelectedCell(null)}
              className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Warning */}
      <div className="bg-yellow-900/30 border border-yellow-600/50 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <h4 className="text-yellow-400 font-semibold mb-1">Caution</h4>
            <p className="text-yellow-200/80 text-sm">
              Excessive ignition advance can cause engine knock and damage. Always monitor knock sensors and adjust conservatively.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
