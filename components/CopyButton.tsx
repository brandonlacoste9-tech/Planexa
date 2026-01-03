'use client'

interface CopyButtonProps {
  text: string
}

export default function CopyButton({ text }: CopyButtonProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(text)
  }

  return (
    <button
      onClick={handleCopy}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
    >
      Copier
    </button>
  )
}
