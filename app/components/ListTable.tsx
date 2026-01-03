'use server';
import Link from 'next/link';

export default async function ListTable(
  {  children, createUrl, labelNew, title }: 
  { children?: React.ReactNode; createUrl: string; labelNew: string, title: string }
) {

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl">{title}</h1>
        <Link
          href={createUrl}
          className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <span>{labelNew}</span>
        </Link>
      </div>
      <div className="mt-6 flow-root">
        <div className="inline-block min-w-full align-middle">
          <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
            <table className="responsive-table min-w-full text-gray-900 md:table">
              {children}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
