import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

const CONSENT_KEY = 'ga-consent'

export function LgpdConsentBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY)
    if (!stored) {
      setVisible(true)
    }
  }, [])

  function acceptFull() {
    localStorage.setItem(CONSENT_KEY, 'full')
    setVisible(false)
    window.location.reload()
  }

  function acceptEssential() {
    localStorage.setItem(CONSENT_KEY, 'essential')
    setVisible(false)
    window.location.reload()
  }

  function refuse() {
    localStorage.setItem(CONSENT_KEY, 'refused')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white p-4 shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <p className="text-sm text-black">
          Usamos cookies para entender como você usa o site. Escolha seu nível de
          consentimento:
        </p>
        <div className="flex gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={refuse}>
            Recusar
          </Button>
          <Button variant="outline" size="sm" onClick={acceptEssential}>
            Apenas Essenciais
          </Button>
          <Button size="sm" onClick={acceptFull}>
            Aceitar Completo
          </Button>
        </div>
      </div>
    </div>
  )
}
