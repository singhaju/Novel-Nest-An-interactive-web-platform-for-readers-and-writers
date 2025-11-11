"use client"

interface NovelCoverImageProps {
  coverImage: string | null
  title: string
  size?: "small" | "large"
}

export function NovelCoverImage({ coverImage, title, size = "large" }: NovelCoverImageProps) {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget
    img.style.display = "none"
    const placeholder = img.nextElementSibling as HTMLElement
    if (placeholder) {
      placeholder.style.display = "flex"
    }
  }

  const textSize = size === "large" ? "text-2xl" : "text-lg"
  const subTextSize = size === "large" ? "text-lg" : "text-sm"

  return (
    <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-gradient-to-br from-blue-100 to-green-100">
      {coverImage ? (
        <>
          <img
            src={coverImage}
            alt={title}
            className="w-full h-full object-cover"
            onError={handleImageError}
            loading="lazy"
          />
          <div className="hidden h-full items-center justify-center">
            <div className="text-center p-4">
              <p className={`${textSize} font-bold text-foreground`}>{title}</p>
              <p className={`${subTextSize} text-muted-foreground`}>Cover Image</p>
            </div>
          </div>
        </>
      ) : (
        <div className="flex h-full items-center justify-center">
          <div className="text-center p-4">
            <p className={`${textSize} font-bold text-foreground`}>{title}</p>
            <p className={`${subTextSize} text-muted-foreground`}>Cover Image</p>
          </div>
        </div>
      )}
    </div>
  )
}
