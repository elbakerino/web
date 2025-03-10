import { useCallback } from 'react';
import Link from 'next/link';
import slugify from '@sindresorhus/slugify';
import { cn } from '@xyflow/xy-ui';

type PropsTableProps = {
  props: {
    name: string;
    type?: string;
    default?: string;
    description?: string;
    example?: string;
  }[];
  links?: Record<string, string>;
  info?: Record<string, string>;
  deeplinkPrefix?: string;
};

function PropsTable({ props: data, links = {} }: PropsTableProps) {
  // We can hide the default column entirely if none of the props have a default
  // value to document.
  const showDefaultColumn = data.some((prop) => !!prop.default);

  // This function takes a string representing some type and attempts to turn any
  // types referenced inside into links, either internal or external.
  const linkify = useCallback(
    (type: string | undefined) =>
      type?.match(/(\w+|\W+)/g)?.map((chunk, i) =>
        chunk in links ? (
          <Link
            key={`${chunk}-${i}`}
            href={links[chunk] ?? ''}
            className="text-primary"
          >
            {chunk}
          </Link>
        ) : (
          chunk
        ),
      ),
    [links],
  );

  return (
    <table className="w-full my-8 text-sm">
      <thead className="hidden lg:table-header-group text-left border-b border-gray-200">
        <tr className="[&>th]:p-1.5">
          <th>Name</th>
          <th>Type</th>
          {showDefaultColumn && <th>Default</th>}
        </tr>
      </thead>
      {data.map((prop) => {
        const slug = slugify(prop.name);
        const isHeading = !prop.type && !prop.description && !prop.default;

        return (
          <tbody
            key={slug}
            id={slug}
            className="group hover:bg-gray-50 max-lg:[&>tr]:block max-lg:block bg-gray-100 lg:bg-transparent rounded-xl border border-gray-200 lg:border-none mb-5"
          >
            <tr className="[&>td]:p-3 max-lg:[&>td]:block border-b border-gray-200">
              <td className="lg:!pl-0">
                <div className="relative">
                  <Link
                    href={`#${slug}`}
                    className="flex lg:w-[25px] items-center absolute right-0 text-lg font-black lg:right-auto lg:left-0 lg:top-1/2 lg:-translate-x-[22px] lg:-translate-y-1/2 group-hover:opacity-100 lg:opacity-0"
                  >
                    #
                  </Link>
                  {prop.name &&
                    (isHeading ? (
                      <span className="px-1.5 py-0.5 font-bold">
                        {prop.name}
                      </span>
                    ) : (
                      <code className="bg-gray-50 px-1.5 py-0.5 border border-gray-200 rounded-sm">
                        {prop.name}
                      </code>
                    ))}
                </div>
              </td>
              <td>
                <div>
                  <code className="break-all">{linkify(prop.type)}</code>
                </div>
                {prop.description && (
                  <div className="mt-2 max-w-md">{prop.description}</div>
                )}
                {prop.example && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg mt-2">
                    <pre>
                      <code>{prop.example}</code>
                    </pre>
                  </div>
                )}
              </td>
              {showDefaultColumn && (
                // For the mobile view, we want to hide the default column entirely
                // if there is no content for it. We want this because otherwise
                // the default padding applied to table cells will add some extra
                // blank space we don't want.
                <td
                  className={cn(
                    '!px-0',
                    prop.default ? '' : '!hidden lg:table-cell',
                  )}
                >
                  <pre className="inline-block bg-gray-50 !px-1.5 py-0.5 border border-gray-200 rounded-sm">
                    <code className="text-xs">{linkify(prop.default)}</code>
                  </pre>
                </td>
              )}
            </tr>
          </tbody>
        );
      })}
    </table>
  );
}

export { PropsTable, type PropsTableProps };
