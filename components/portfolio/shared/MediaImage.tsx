'use client'

import Image, { type ImageProps } from 'next/image'

function isOptimizedHost(src: string): boolean {
  if (src.startsWith('/') || src.startsWith('data:')) return true
  try {
    const host = new URL(src).hostname
    return host.endsWith('supabase.co') || host.endsWith('supabase.in') || host === 'images.unsplash.com'
  } catch {
    return false
  }
}

type MediaImageProps = Omit<ImageProps, 'src'> & { src: string }

/** Uses next/image when the host is allowlisted; otherwise a plain img. */
export function MediaImage({ src, alt, ...props }: MediaImageProps) {
  if (!isOptimizedHost(src)) {
    const { fill, width, height, style, className, priority } = props
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        style={{
          ...(fill ? { position: 'absolute', inset: 0, width: '100%', height: '100%' } : {}),
          ...style,
        }}
        width={typeof width === 'number' ? width : undefined}
        height={typeof height === 'number' ? height : undefined}
        loading={priority ? 'eager' : 'lazy'}
      />
    )
  }

  return <Image src={src} alt={alt} {...props} />
}
