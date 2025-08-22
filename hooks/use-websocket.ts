"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import type { WebSocketMessage, TickEvent, PairStatsEvent } from "@/types/scanner"

interface UseWebSocketProps {
  onTick: (data: TickEvent["data"]) => void
  onPairStats: (data: PairStatsEvent["data"]) => void
  onScannerPairs: (data: any) => void
}

export function useWebSocket({ onTick, onPairStats, onScannerPairs }: UseWebSocketProps) {
  const [connected, setConnected] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>()

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return

    try {
      const ws = new WebSocket("wss://api-rs.dexcelerate.com/ws")

      ws.onopen = () => {
        setConnected(true)
        console.log("WebSocket connected")
      }

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data)

          switch (message.event) {
            case "tick":
              onTick(message.data)
              break
            case "pair-stats":
              onPairStats(message.data)
              break
            case "scanner-pairs":
              onScannerPairs(message.data)
              break
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error)
        }
      }

      ws.onclose = () => {
        setConnected(false)
        console.log("WebSocket disconnected")

        reconnectTimeoutRef.current = setTimeout(() => {
          connect()
        }, 3000)
      }

      ws.onerror = (error) => {
        console.error("WebSocket error:", error)
      }

      wsRef.current = ws
    } catch (error) {
      console.error("Failed to connect WebSocket:", error)
    }
  }, [onTick, onPairStats, onScannerPairs])

  const subscribe = useCallback((event: string, data: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ event, data }))
    }
  }, [])

  const unsubscribe = useCallback((event: string, data: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const unsubscribeEvent = event === "scanner-filter" ? "unsubscribe-scanner-filter" : `unsubscribe-${event}`
      wsRef.current.send(JSON.stringify({ event: unsubscribeEvent, data }))
    }
  }, [])

  useEffect(() => {
    connect()

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [connect])

  return { connected, subscribe, unsubscribe }
}
