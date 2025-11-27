import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { BLOCKS, INLINES, MARKS, Document } from '@contentful/rich-text-types'
import Image from 'next/image'

// Custom rendering options for Contentful rich text
export const richTextRenderOptions = {
  renderMark: {
    [MARKS.BOLD]: (text: React.ReactNode) => (
      <strong className="font-bold text-gray-900">{text}</strong>
    ),
    [MARKS.ITALIC]: (text: React.ReactNode) => (
      <em className="italic">{text}</em>
    ),
    [MARKS.CODE]: (text: React.ReactNode) => (
      <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-accent-700">
        {text}
      </code>
    ),
  },
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node: any, children: React.ReactNode) => (
      <p className="mb-6 text-lg leading-relaxed text-gray-700">{children}</p>
    ),
    [BLOCKS.HEADING_1]: (node: any, children: React.ReactNode) => (
      <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6 mt-10">
        {children}
      </h1>
    ),
    [BLOCKS.HEADING_2]: (node: any, children: React.ReactNode) => (
      <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-5 mt-8">
        {children}
      </h2>
    ),
    [BLOCKS.HEADING_3]: (node: any, children: React.ReactNode) => (
      <h3 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-4 mt-6">
        {children}
      </h3>
    ),
    [BLOCKS.HEADING_4]: (node: any, children: React.ReactNode) => (
      <h4 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3 mt-5">
        {children}
      </h4>
    ),
    [BLOCKS.HEADING_5]: (node: any, children: React.ReactNode) => (
      <h5 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 mt-4">
        {children}
      </h5>
    ),
    [BLOCKS.HEADING_6]: (node: any, children: React.ReactNode) => (
      <h6 className="text-base md:text-lg font-semibold text-gray-900 mb-2 mt-3">
        {children}
      </h6>
    ),
    [BLOCKS.UL_LIST]: (node: any, children: React.ReactNode) => (
      <ul className="list-disc list-inside mb-6 space-y-2 text-gray-700 ml-4">
        {children}
      </ul>
    ),
    [BLOCKS.OL_LIST]: (node: any, children: React.ReactNode) => (
      <ol className="list-decimal list-inside mb-6 space-y-2 text-gray-700 ml-4">
        {children}
      </ol>
    ),
    [BLOCKS.LIST_ITEM]: (node: any, children: React.ReactNode) => (
      <li className="mb-2 leading-relaxed">{children}</li>
    ),
    [BLOCKS.QUOTE]: (node: any, children: React.ReactNode) => (
      <blockquote className="border-l-4 border-accent-500 pl-6 py-4 my-6 bg-accent-50 rounded-r-lg italic text-gray-800">
        {children}
      </blockquote>
    ),
    [BLOCKS.HR]: () => (
      <hr className="my-8 border-t-2 border-gray-200" />
    ),
    [BLOCKS.EMBEDDED_ASSET]: (node: any) => {
      const { file, title, description } = node.data.target.fields
      const imageUrl = file.url.startsWith('//') ? `https:${file.url}` : file.url

      if (file.contentType.startsWith('image/')) {
        return (
          <div className="my-8">
            <div className="relative w-full h-auto rounded-xl overflow-hidden shadow-lg">
              <img
                src={imageUrl}
                alt={title || description || 'Blog image'}
                className="w-full h-auto"
              />
            </div>
            {(title || description) && (
              <p className="text-sm text-gray-600 text-center mt-2 italic">
                {title || description}
              </p>
            )}
          </div>
        )
      }

      // For non-image assets, provide download link
      return (
        <div className="my-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <a
            href={imageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-600 hover:text-accent-700 font-semibold flex items-center gap-2"
          >
            📎 {title || 'Download attachment'}
          </a>
        </div>
      )
    },
    [INLINES.HYPERLINK]: (node: any, children: React.ReactNode) => (
      <a
        href={node.data.uri}
        target="_blank"
        rel="noopener noreferrer"
        className="text-accent-600 hover:text-accent-700 font-semibold underline"
      >
        {children}
      </a>
    ),
    [INLINES.ASSET_HYPERLINK]: (node: any, children: React.ReactNode) => {
      const { file, title } = node.data.target.fields
      const fileUrl = file.url.startsWith('//') ? `https:${file.url}` : file.url

      return (
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent-600 hover:text-accent-700 font-semibold underline"
        >
          {children || title || 'Download'}
        </a>
      )
    },
  },
}

// Helper function to render rich text content
export function renderRichText(content: Document) {
  return documentToReactComponents(content, richTextRenderOptions)
}
