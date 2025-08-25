"use client"

import { motion } from "framer-motion"
import * as Tooltip from '@radix-ui/react-tooltip'

interface AuditCheckProps {
  title: string
  isValid: boolean
  bgValid: string
  bgInvalid: string
}

export function AuditCheck({ title, isValid, bgValid, bgInvalid }: AuditCheckProps) {
  return (
    <Tooltip.Provider delayDuration={300} skipDelayDuration={0}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <motion.div
            whileHover={{ scale: 1.1 }}
            className={`px-1.5 py-0.5 rounded text-xs font-medium transition-all duration-300 ${
              isValid ? bgValid : bgInvalid
            } border border-blue-500/30`}
          >
            {isValid ? "✓" : "✗"}
          </motion.div>
        </Tooltip.Trigger>
        <Tooltip.Portal container={document.body}>
          <Tooltip.Content
            className="rounded-md bg-slate-900 px-3 py-2 text-xs text-slate-200 shadow-lg z-50"
            sideOffset={5}
            side="top"
            align="center"
          >
            {title}
            <Tooltip.Arrow className="fill-slate-900" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  )
}
