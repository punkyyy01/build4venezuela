import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function ProjectMarkdown({ markdown }: { markdown: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        a: ({ children, ...props }) => (
          <a
            className="text-primary underline decoration-primary/40 underline-offset-4 transition hover:text-accent"
            rel="noreferrer"
            target="_blank"
            {...props}
          >
            {children}
          </a>
        ),
        h1: ({ children }) => (
          <h1 className="mt-10 font-mono text-4xl font-black uppercase tracking-[-0.04em] first:mt-0">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="mt-9 font-mono text-3xl font-black uppercase tracking-[-0.03em]">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="mt-8 font-mono text-2xl font-bold uppercase tracking-[0.02em]">
            {children}
          </h3>
        ),
        p: ({ children }) => (
          <p className="mt-5 text-base leading-8 tracking-[0.04em] text-foreground/78">
            {children}
          </p>
        ),
        ul: ({ children }) => (
          <ul className="mt-5 list-disc space-y-2 pl-6">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="mt-5 list-decimal space-y-2 pl-6">{children}</ol>
        ),
        li: ({ children }) => (
          <li className="text-base leading-7 tracking-[0.04em] text-foreground/78">
            {children}
          </li>
        ),
        blockquote: ({ children }) => (
          <blockquote className="mt-6 border-accent border-l-4 pl-5 text-foreground/75 italic">
            {children}
          </blockquote>
        ),
        code: ({ children }) => (
          <code className="border border-border bg-secondary px-1.5 py-0.5 text-sm text-primary">
            {children}
          </code>
        ),
        pre: ({ children }) => (
          <pre className="mt-6 overflow-x-auto border border-border bg-secondary p-4 text-sm leading-6">
            {children}
          </pre>
        ),
      }}
    >
      {markdown}
    </ReactMarkdown>
  );
}
