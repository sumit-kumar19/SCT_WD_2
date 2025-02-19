"use client"
import { useEffect, useState } from "react"

export default function Stopwatch() {
    const [time, setTime] = useState(0)
    const [isRunning, setIsRunning] = useState(false)
    const [laps, setLaps] = useState([])

    // Format time helper function
    function formatTime(ms) {
        const hours = Math.floor(ms / 3600000)
        const minutes = Math.floor((ms % 3600000) / 60000)
        const seconds = Math.floor((ms % 60000) / 1000)
        const centiseconds = Math.floor((ms % 1000) / 10)

        return `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}:${centiseconds
            .toString()
            .padStart(2, "0")}`
    }

    // Load from localStorage
    useEffect(() => {
        const savedTime = localStorage.getItem("stopwatchTime")
        const savedLaps = localStorage.getItem("stopwatchLaps")
        if (savedTime) {
            const t = Number.parseInt(savedTime)
            setTime(t)
        }
        if (savedLaps) setLaps(JSON.parse(savedLaps))
    }, [])

    // Save to localStorage
    useEffect(() => {
        localStorage.setItem("stopwatchTime", time.toString())
        localStorage.setItem("stopwatchLaps", JSON.stringify(laps))
    }, [time, laps])

    // Run stopwatch timer
    useEffect(() => {
        let intervalId
        if (isRunning) {
            intervalId = setInterval(() => {
                setTime((prev) => prev + 10)
            }, 10)
        }
        return () => clearInterval(intervalId)
    }, [isRunning])

    // Button handlers
    const handleStart = () => setIsRunning(true)
    const handlePause = () => setIsRunning(false)
    const handleReset = () => {
        setIsRunning(false)
        setTime(0)
    }
    const handleRestart = () => {
        setTime(0)
        setIsRunning(true)
    }
    const handleLap = () => setLaps((prev) => [...prev, time])
    const handleResetLaps = () => setLaps([])

    const buttonStyle =
        "px-4 py-2 bg-gray-800 text-purple-500 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"

    const formattedTime = formatTime(time)

    return (
        <>
            <div className="min-h-screen p-4 flex bg-black">
                <div className="flex-1 flex items-center justify-center">
                    <div className="border-4 border-white rounded-lg p-8 bg-navy/80 backdrop-blur-sm">
                        <div className="text-9xl font-mono text-purple-500 mb-12 text-center">
                            {formattedTime}
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-4">
                            <button className={buttonStyle} onClick={handleStart} disabled={isRunning}>
                                Start
                            </button>
                            <button className={buttonStyle} onClick={handlePause} disabled={!isRunning}>
                                Pause
                            </button>
                            <button className={buttonStyle} onClick={handleReset}>
                                Reset
                            </button>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <button className={buttonStyle} onClick={handleRestart}>
                                Restart
                            </button>
                            <button className={buttonStyle} onClick={handleLap} disabled={!isRunning}>
                                Lap
                            </button>
                            <button className={buttonStyle} onClick={handleResetLaps} disabled={laps.length === 0}>
                                Reset Laps
                            </button>
                        </div>
                    </div>
                </div>

                <div className="w-64 h-screen border-l border-gray-700 pl-4 bg-black/50 backdrop-blur-sm">
                    {laps.length > 0 && (
                        <div>
                            <h3 className="text-purple-500 mb-2">Laps</h3>
                            <div className="max-h-80 overflow-y-auto">
                                {laps.map((lapTime, index) => (
                                    <div key={index} className="text-purple-500 font-mono text-2xl my-2">
                                        Lap {index + 1}: {formatTime(lapTime)}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
