import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { compile } from '@mdx-js/mdx';
import { toString } from 'mdast-util-to-string';
import { VFile } from 'vfile';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import { MDXProvider } from '@mdx-js/react';
import * as runtime from 'react/jsx-runtime';
import MdxRenderer from '@/components/MdxRenderer';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { serialize } from 'next-mdx-remote/serialize';
import remarkBreaks from 'remark-breaks';

export default async function PostPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const filePathMd = path.join(process.cwd(), 'content', 'articles', `${id}.md`);
  const filePathMdx = path.join(process.cwd(), 'content', 'articles', `${id}.mdx`);
  let fileContents = '';
  let isMdx = false;
  if (fs.existsSync(filePathMd)) {
    fileContents = fs.readFileSync(filePathMd, 'utf8');
  } else if (fs.existsSync(filePathMdx)) {
    fileContents = fs.readFileSync(filePathMdx, 'utf8');
    isMdx = true;
  } else {
    notFound();
  }
  const { data, content } = matter(fileContents);

  let html = '';
  let mdxSource: any = null;
  if (!isMdx) {
    // 用 unified 处理 Markdown 到 HTML
    const file = new VFile({ value: content });
    html = String(
      await unified()
        .use(remarkParse)
        .use(remarkBreaks)
        .use(remarkRehype)
        .use(rehypeStringify)
        .process(file)
    );
  } else {
    mdxSource = await serialize(content, {
      mdxOptions: {
        remarkPlugins: [remarkBreaks],
      },
    });
  }

  return (
    <div className="min-h-screen bg-white font-serif text-neutral-900">
      {/* 顶部导航栏 */}
      <nav className="w-full border-b border-neutral-200 py-4 px-6 flex items-center justify-between text-base font-medium bg-white sticky top-0 z-20">
        <div className="flex flex-col items-start">
          <span className="text-3xl md:text-5xl font-extrabold tracking-widest leading-none">微言</span>
          <span className="text-lg md:text-2xl text-blue-700 font-semibold tracking-wider leading-tight">Vākcitra</span>
        </div>
        <div className="flex gap-8 items-center">
          <a href="#" className="hover:text-blue-700">文章</a>
          <a href="#" className="hover:text-blue-700">宥言</a>
          <a href="#" className="hover:text-blue-700">声色</a>
        </div>
      </nav>
      {/* 正文内容区域 */}
      <main className="max-w-3xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-2">{data.title || id}</h1>
        <div className="flex items-center text-gray-500 text-sm mb-4">
          <span>{data.date}</span>
          {data.tags && Array.isArray(data.tags) && (
            <span className="ml-4 flex flex-wrap gap-2">
              {data.tags.map((tag: string, i: number) => (
                <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs">{tag}</span>
              ))}
            </span>
          )}
        </div>
        {data.summary && <div className="mb-4 text-lg text-gray-700">{data.summary}</div>}
        {!isMdx ? (
          <article className="prose prose-blue max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          <div className="prose prose-blue max-w-none">
            <MDXRemote source={content} />
          </div>
        )}
        <div className="mt-10">
          <Link href="/" className="text-blue-600 hover:underline inline-block">← 返回首页</Link>
        </div>
      </main>
    </div>
  );
} 