interface TypographyProps {
  children: React.ReactNode;
}

export function Heading1({ children }: TypographyProps) {
  return (
    <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
      {children}
    </h1>
  );
}

export function Heading2({ children }: TypographyProps) {
  return (
    <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
      {children}
    </h2>
  );
}

export function Heading3({ children }: TypographyProps) {
  return (
    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
      {children}
    </h3>
  );
}

export function Heading4({ children }: TypographyProps) {
  return (
    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
      {children}
    </h4>
  );
}

export function Text({ children }: TypographyProps) {
  return <p className="leading-7 [&:not(:first-child)]:mt-6">{children}</p>;
}

export function Blockquote({ children }: TypographyProps) {
  return (
    <blockquote className="mt-6 border-l-2 pl-6 italic">{children}</blockquote>
  );
}

export function List({ children }: TypographyProps) {
  return <ul className="my-6 ml-6 list-disc [&>li]:mt-2">{children}</ul>;
}

export function Code({ children }: TypographyProps) {
  return (
    <code className="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
      {children}
    </code>
  );
}

export function Lead({ children }: TypographyProps) {
  return <p className="text-muted-foreground text-xl">{children}</p>;
}

export function Large({ children }: TypographyProps) {
  return <div className="text-lg font-semibold">{children}</div>;
}

export function Small({ children }: TypographyProps) {
  return <small className="text-sm leading-none font-medium">{children}</small>;
}

export function Muted({ children }: TypographyProps) {
  return <p className="text-muted-foreground text-sm">{children}</p>;
}
