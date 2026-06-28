interface RichTextNode {
  type?: string;
  text?: string;
  children?: RichTextNode[];
  format?: number;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  tag?: string;
  listType?: string;
  url?: string;
  rel?: string;
  target?: string;
}

/**
 * Recursively renders Lexical JSON nodes to React elements.
 * Server-compatible — no client JS needed.
 * Handles: root, paragraph, heading, text (bold/italic/underline/strikethrough),
 *          link, list (bullet/numbered), quote, code, upload (image).
 */
export function renderLexical(node: RichTextNode, key?: number): React.ReactNode {
  if (!node) return null;

  // Leaf text node
  if (node.text !== undefined) {
    let text: React.ReactNode = node.text;
    if (node.bold) text = <strong key={key}>{text}</strong>;
    if (node.italic) text = <em key={key}>{text}</em>;
    if (node.underline) text = <u key={key}>{text}</u>;
    if (node.strikethrough) text = <s key={key}>{text}</s>;
    return text;
  }

  const children = node.children?.map((child, i) => renderLexical(child, i)) ?? null;
  const keyAttr = key !== undefined ? key : undefined;

  switch (node.type) {
    case 'root':
      return <div key={keyAttr}>{children}</div>;

    case 'paragraph':
      return <p key={keyAttr} className="mb-4 last:mb-0">{children}</p>;

    case 'heading': {
      const Tag = (node.tag as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6') || 'h2';
      const headingClasses: Record<string, string> = {
        h1: 'text-3xl md:text-4xl font-display font-medium mt-10 mb-6',
        h2: 'text-2xl md:text-3xl font-display font-medium mt-8 mb-4',
        h3: 'text-xl md:text-2xl font-display font-medium mt-6 mb-3',
        h4: 'text-lg font-display font-medium mt-4 mb-2',
        h5: 'text-base font-display font-medium mt-4 mb-2',
        h6: 'text-sm font-display font-medium mt-4 mb-2',
      };
      return <Tag key={keyAttr} className={headingClasses[Tag] || 'font-display font-medium mt-6 mb-3'}>{children}</Tag>;
    }

    case 'list': {
      const ListTag = node.listType === 'bullet' ? 'ul' : 'ol';
      const listClasses = node.listType === 'bullet'
        ? 'list-disc list-inside mb-4 space-y-1'
        : 'list-decimal list-inside mb-4 space-y-1';
      return <ListTag key={keyAttr} className={listClasses}>{children}</ListTag>;
    }

    case 'listitem':
      return <li key={keyAttr} className="text-muted-foreground">{children}</li>;

    case 'link':
      return (
        <a
          key={keyAttr}
          href={node.url || '#'}
          target={node.target || '_blank'}
          rel={node.rel || 'noopener noreferrer'}
          className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
        >
          {children}
        </a>
      );

    case 'quote':
      return (
        <blockquote key={keyAttr} className="border-l-4 border-primary/30 pl-6 py-2 mb-4 italic text-muted-foreground">
          {children}
        </blockquote>
      );

    case 'code':
      return (
        <pre key={keyAttr} className="bg-neutral-100 rounded-lg p-4 mb-4 overflow-x-auto text-sm font-mono">
          <code>{children}</code>
        </pre>
      );

    case 'upload': {
      // Inline upload — currently unused in MVP; shows caption if present
      return <figure key={keyAttr} className="mb-4">{children}</figure>;
    }

    default:
      // Unknown node type — render children if any, or null
      return children || null;
  }
}

/**
 * Full rich text renderer component.
 * Wraps rendered content in a prose container for typography.
 */
export function RichText({ data, className = '' }: { data: any; className?: string }) {
  if (!data) return null;
  const root: RichTextNode = data.root || data;
  return (
    <div className={`prose prose-neutral prose-lg max-w-none ${className}`}>
      {renderLexical(root)}
    </div>
  );
}
