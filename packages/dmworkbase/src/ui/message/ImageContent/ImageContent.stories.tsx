import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import SingleImage from './SingleImage'
import MultiImage from './MultiImage'

const singleMeta: Meta<typeof SingleImage> = {
  title: 'ui/message/ImageContent/SingleImage',
  component: SingleImage,
  tags: ['autodocs'],
}

const multiMeta: Meta<typeof MultiImage> = {
  title: 'ui/message/ImageContent/MultiImage',
  component: MultiImage,
  tags: ['autodocs'],
}

export default singleMeta

type SingleStory = StoryObj<typeof SingleImage>
type MultiStory = StoryObj<typeof MultiImage>

// SingleImage Stories
export const SingleDefault: SingleStory = {
  args: {
    src: 'https://picsum.photos/800/600',
    width: 800,
    height: 600,
    onClick: () => alert('查看大图'),
  },
}

export const SingleSending: SingleStory = {
  args: {
    src: 'https://picsum.photos/800/600?random=sending',
    width: 800,
    height: 600,
    transferState: {
      status: 'sending',
    },
  },
}

export const SingleUploading: SingleStory = {
  args: {
    src: 'https://picsum.photos/1200/900?random=uploading',
    width: 1200,
    height: 900,
    transferState: {
      status: 'uploading',
      progress: 48,
    },
  },
}

export const SingleUploadFailed: SingleStory = {
  args: {
    src: 'https://picsum.photos/800/600?random=failed',
    width: 800,
    height: 600,
    transferState: {
      status: 'failed',
      onRetry: () => alert('重试上传'),
    },
  },
}

export const SingleLarge: SingleStory = {
  args: {
    src: 'https://picsum.photos/1200/900',
    width: 1200,
    height: 900,
    onClick: () => alert('查看大图'),
  },
}

export const SinglePortrait: SingleStory = {
  args: {
    src: 'https://picsum.photos/600/800',
    width: 600,
    height: 800,
  },
}

// MultiImage Stories
const mockImages = [
  { src: 'https://picsum.photos/400/400?random=1', width: 400, height: 400 },
  { src: 'https://picsum.photos/400/400?random=2', width: 400, height: 400 },
  { src: 'https://picsum.photos/400/400?random=3', width: 400, height: 400 },
  { src: 'https://picsum.photos/400/400?random=4', width: 400, height: 400 },
  { src: 'https://picsum.photos/400/400?random=5', width: 400, height: 400 },
]

export const MultiTwoImages: MultiStory = {
  render: () => (
    <MultiImage
      images={mockImages.slice(0, 2)}
      onImageClick={(i) => alert(`点击第 ${i + 1} 张`)}
    />
  ),
}

export const MultiThreeImages: MultiStory = {
  render: () => (
    <MultiImage
      images={mockImages.slice(0, 3)}
      onImageClick={(i) => alert(`点击第 ${i + 1} 张`)}
    />
  ),
}

export const MultiFourImages: MultiStory = {
  render: () => (
    <MultiImage
      images={mockImages.slice(0, 4)}
      onImageClick={(i) => alert(`点击第 ${i + 1} 张`)}
    />
  ),
}

export const MultiFiveImages: MultiStory = {
  render: () => (
    <MultiImage
      images={mockImages}
      onImageClick={(i) => alert(`点击第 ${i + 1} 张`)}
    />
  ),
}

export const MultiSending: MultiStory = {
  render: () => (
    <MultiImage
      images={mockImages.slice(0, 3)}
      transferState={{ status: 'sending' }}
      onImageClick={(i) => alert(`点击第 ${i + 1} 张`)}
    />
  ),
}
