import type { StaticImageData } from 'next/image'

import React from 'react'
import RichText from '@/components/RichText'

import type { MediaBlock as MediaBlockProps } from '@/payload-types'

import { Media } from '../../components/Media'
import { ImageLightbox } from '../../components/Media/ImageLightbox'
import { cn } from '@/payload/utilities/ui'
import { hasTextContent } from '@/payload/utilities/hasTextContent'
import { getMediaUrl } from '@/payload/utilities/getMediaUrl'

type Props = MediaBlockProps & {
  breakout?: boolean
  caption?: any
  captionClassName?: string
  className?: string
  enableGutter?: boolean
  enableLightbox?: boolean
  imgClassName?: string
  linkUrl?: string | null
  openInNewTab?: boolean | null
  staticImage?: StaticImageData
  disableInnerContainer?: boolean
}

export const MediaBlock: React.FC<Props> = (props) => {
  const {
    captionClassName,
    className,
    enableGutter = true,
    enableLightbox = true,
    imgClassName,
    linkUrl,
    media,
    openInNewTab,
    staticImage,
    disableInnerContainer,
  } = props

  let caption = (props as any).caption || (media && typeof media === 'object' ? media.caption : undefined)

  const showCaption = hasTextContent(caption)

  const mediaDoc = media && typeof media === 'object' ? media : undefined
  const imageSrc = staticImage?.src || (mediaDoc ? getMediaUrl(mediaDoc.url, mediaDoc.updatedAt) : '')
  const imageAlt = mediaDoc?.alt || ''
  const isImageMedia = mediaDoc
    ? mediaDoc.mimeType
      ? mediaDoc.mimeType.startsWith('image')
      : /\.(avif|gif|jpe?g|png|svg|webp)$/i.test(mediaDoc.url || '')
    : Boolean(staticImage)
  const canActivateImage = enableLightbox && isImageMedia && Boolean(imageSrc)

  const image = (media || staticImage) && (
    <Media
      htmlElement={canActivateImage ? null : undefined}
      imgClassName={cn('border border-border rounded-[0.8rem]', imgClassName)}
      resource={media}
      src={staticImage}
    />
  )

  const renderedImage = canActivateImage ? (
    <ImageLightbox alt={imageAlt} href={linkUrl} newTab={openInNewTab} src={imageSrc}>
      {image}
    </ImageLightbox>
  ) : (
    image
  )

  return (
    <figure
      className={cn(
        '',
        {
          container: enableGutter,
        },
        className,
      )}
    >
      {renderedImage}
      {showCaption && caption && (
        <figcaption
          className={cn(
            'mt-3 text-center text-sm italic text-gray-500',
            {
              container: !disableInnerContainer,
            },
            captionClassName,
          )}
        >
          {typeof caption === 'string' ? (
            <p>{caption}</p>
          ) : (
            <RichText data={caption as any} enableGutter={false} enableProse={false} />
          )}
        </figcaption>
      )}
    </figure>
  )
}
