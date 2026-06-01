import { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'

export interface TourStep {
  title: string
  description: string
  sectionId: string
  position?: 'left' | 'right'
  offsetTop?: string
}

interface TourGuideProps {
  steps: TourStep[]
  onComplete: () => void
  onSkip: () => void
}

export function TourGuide({ steps, onComplete, onSkip }: TourGuideProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const currentStepRef = useRef(currentStep)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const isScrollingRef = useRef(false)
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    currentStepRef.current = currentStep
  }, [currentStep])

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (isScrollingRef.current) return
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible.length > 0) {
          const idx = steps.findIndex(s => s.sectionId === visible[0].target.id)
          if (idx !== -1 && idx > currentStepRef.current) setCurrentStep(idx)
        }
      },
      { threshold: [0.3, 0.4, 0.5, 0.6, 0.7] }
    )

    steps.forEach(s => {
      const el = document.getElementById(s.sectionId)
      if (el) observerRef.current?.observe(el)
    })

    return () => observerRef.current?.disconnect()
  }, [steps])

  const scrollToStep = useCallback((index: number) => {
    const el = document.getElementById(steps[index].sectionId)
    if (el) {
      isScrollingRef.current = true
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      scrollTimeoutRef.current = setTimeout(() => {
        isScrollingRef.current = false
      }, 1000)
    }
  }, [steps])

  function handleNext() {
    if (currentStep < steps.length - 1) {
      const next = currentStep + 1
      setCurrentStep(next)
      scrollToStep(next)
    } else {
      onComplete()
    }
  }

  function handlePrev() {
    if (currentStep > 0) {
      const prev = currentStep - 1
      setCurrentStep(prev)
      scrollToStep(prev)
    }
  }

  const isLastStep = currentStep === steps.length - 1
  const isFirstStep = currentStep === 0

  return (
    <div className={`fixed top-1/2 -translate-y-1/2 z-50 w-full max-w-sm ${steps[currentStep]?.position === 'left' ? 'left-8' : 'right-8'}`}
      style={{ marginTop: steps[currentStep]?.offsetTop ?? '-50px' }}>
      <div className="bg-card border-t-2 border-t-arcade-blue rounded-xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-2 w-2 rounded-full transition-colors ${
                  i <= currentStep ? 'bg-arcade-blue' : 'bg-muted-foreground/30'
                }`}
              />
            ))}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground">
              Passo {currentStep + 1} de {steps.length}
            </span>
            <button
              onClick={onSkip}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
            >
              Pular
            </button>
          </div>
        </div>

        <h3 className="text-base font-semibold mb-1">{steps[currentStep].title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {steps[currentStep].description}
        </p>

        <div className="flex items-center justify-between mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrev}
            disabled={isFirstStep}
          >
            ← Anterior
          </Button>
          <Button size="sm" onClick={handleNext}>
            {isLastStep ? 'Finalizar →' : 'Próximo →'}
          </Button>
        </div>
      </div>
    </div>
  )
}
