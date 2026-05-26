import { Button } from '@/components/ui/button'
import { Upload } from 'lucide-react'
import { useState, useRef } from 'react'
import { cn } from '@/lib/utils'

interface ImageUploadProps {
  onChange: (file: File) => void
}

export function ImageUpload({ onChange }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFile(file: File) {
    if (file.type !== 'image/jpeg') {
      alert('Apenas imagens JPEG são aceitas.')
      return
    }
    onChange(file)

    const reader = new FileReader()
    reader.onload = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    setIsDragOver(true)
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault()
    setIsDragOver(false)
  }

  function handleRemove() {
    setPreview(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  function handleClickZone() {
    inputRef.current?.click()
  }

  return (
    <div className="space-y-4">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg"
        onChange={handleInputChange}
        className="hidden"
      />
      {!preview ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClickZone}
          className={cn(
            "flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-8 text-center cursor-pointer transition-colors",
            isDragOver
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/30 bg-muted/20 hover:border-muted-foreground/50"
          )}
        >
          <Upload className="size-8 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">Arraste a imagem aqui</p>
            <p className="text-sm text-muted-foreground">ou</p>
          </div>
          <Button type="button" variant="secondary" size="sm" onClick={(e) => { e.stopPropagation(); handleClickZone(); }}>
            Selecionar
          </Button>
          <p className="text-xs text-muted-foreground">JPEG apenas</p>
        </div>
      ) : (
        <div className="relative rounded-md border overflow-hidden">
          <img src={preview} alt="Preview" className="w-full max-h-[300px] object-contain bg-muted/30" />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 text-xs bg-background/80 px-2 py-1 rounded"
          >
            Remover
          </button>
        </div>
      )}
    </div>
  )
}
