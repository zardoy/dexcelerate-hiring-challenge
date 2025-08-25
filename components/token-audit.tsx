"use client"

import { TokenData } from "@/types/scanner"
import { AuditCheck } from "./ui/audit-check"

interface TokenAuditProps {
  audit: TokenData["audit"]
}

const AUDIT_CHECKS = [
  {
    key: "contractVerified",
    validTitle: "Contract Verified",
    invalidTitle: "Contract Not Verified",
    bgValid: "bg-blue-500/20 text-blue-400",
    bgInvalid: "bg-slate-600/30 text-slate-500",
    getValue: (audit: TokenData["audit"]) => audit.contractVerified
  },
  {
    key: "mintable",
    validTitle: "Mint Authority Renounced",
    invalidTitle: "Mintable (Risk)",
    bgValid: "bg-green-500/20 text-green-400",
    bgInvalid: "bg-orange-500/20 text-orange-400",
    getValue: (audit: TokenData["audit"]) => !audit.mintable
  },
  {
    key: "freezable",
    validTitle: "Freeze Authority Renounced",
    invalidTitle: "Freezable (Risk)",
    bgValid: "bg-yellow-500/20 text-yellow-400",
    bgInvalid: "bg-purple-500/20 text-purple-400",
    getValue: (audit: TokenData["audit"]) => !audit.freezable
  },
  {
    key: "honeypot",
    validTitle: "Not a Honeypot",
    invalidTitle: "Honeypot Detected (High Risk)",
    bgValid: "bg-orange-500/20 text-orange-400",
    bgInvalid: "bg-red-500/20 text-red-400",
    getValue: (audit: TokenData["audit"]) => !audit.honeypot
  }
]

export function TokenAudit({ audit }: TokenAuditProps) {
  return (
    <td className="px-4 py-3">
      <div className="flex items-center gap-1 justify-center">
        {AUDIT_CHECKS.map(check => {
          const isValid = check.getValue(audit)
          return (
            <AuditCheck
              key={check.key}
              title={isValid ? check.validTitle : check.invalidTitle}
              isValid={isValid}
              bgValid={check.bgValid}
              bgInvalid={check.bgInvalid}
            />
          )
        })}
      </div>
    </td>
  )
}
