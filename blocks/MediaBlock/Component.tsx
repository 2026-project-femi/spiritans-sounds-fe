import type { StaticImageData } from 'next/image'

import React from 'react'
import RichText from '@/components/RichText'

import type { MediaBlock as MediaBlockProps } from '@/payload-types'

import { Media } from '../../components/Media'
import { cn } from '@/payload/utilities/ui'
import { hasTextContent } from '@/payload/utilities/hasTextContent'

type Props = MediaBlockProps & {
  breakout?: boolean
  caption?: any
  captionClassName?: string
  className?: string
  enableGutter?: boolean
  imgClassName?: string
  staticImage?: StaticImageData
  disableInnerContainer?: boolean
}

export const MediaBlock: React.FC<Props> = (props) => {
  const {
    captionClassName,
    className,
    enableGutter = true,
    imgClassName,
    media,
    staticImage,
    disableInnerContainer,
  } = props

  let caption = (props as any).caption || (media && typeof media === 'object' ? media.caption : undefined)

  const showCaption = hasTextContent(caption)

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
      {(media || staticImage) && (
        <Media
          imgClassName={cn('border border-border rounded-[0.8rem]', imgClassName)}
          resource={media}
          src={staticImage}
        />
      )}
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
