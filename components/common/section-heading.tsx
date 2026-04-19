interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      {eyebrow ? (
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-3 text-3xl font-semibold text-slate-900 md:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base text-slate-600 md:text-lg">{description}</p>
      ) : null}
    </div>
  );
}
