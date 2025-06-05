import React from 'react';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from "next/link";
import ArticleList from "@/components/ArticleList";

const articlesDir = path.join(process.cwd(), 'content', 'articles');
const witsDir = path.join(process.cwd(), 'content', 'wits');

function getAllArticles() {
  const files = fs.readdirSync(articlesDir).filter(f => f.endsWith('.md') || f.endsWith('.mdx'));
  return files.map(filename => {
    const filePath = path.join(articlesDir, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContents);
    return {
      id: filename.replace(/\.(md|mdx)$/, ''),
      ...data,
    } as { id: string; date?: string; title?: string; tags?: string[]; summary?: string };
  }).sort((a, b) => (b.date || '').localeCompare(a.date || ''));
}

function getAllWits() {
  const files = fs.readdirSync(witsDir).filter(f => f.endsWith('.md') || f.endsWith('.mdx'));
  return files.map(filename => {
    const filePath = path.join(witsDir, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);
    return {
      ...data,
      content: content.trim(),
    };
  }).sort((a, b) => (b.date || '').localeCompare(a.date || ''));
}

export const revalidate = 60;

export default async function Home() {
  const posts = getAllArticles();
  const witList = getAllWits().slice(0, 5); // 取最新5条

  // 你原有的 mediaList 和 tags 保留
  const mediaList = [
    { title: '夜的钢琴曲', type: 'audio', thumb: '/media/audio1.jpg', url: '#', date: '2024-06-01', src: '/media/sample.mp3' },
    { title: '浮世绘一', type: 'image', thumb: '/media/img1.jpg', url: '#', date: '2024-05-30' },
    { title: '赛博之夜', type: 'video', thumb: '/media/video1.jpg', url: '#', date: '2024-05-29' },
    { title: '晨光', type: 'audio', thumb: '/media/audio2.jpg', url: '#', date: '2024-05-28' },
    { title: '蓝色回响', type: 'image', thumb: '/media/img2.jpg', url: '#', date: '2024-05-27' },
  ];
  const latestMedia = [...mediaList].sort((a, b) => b.date.localeCompare(a.date))[0];
  const tags = [
    '随笔', '诗句', '音乐', '摄影', '灵感', '生活', '旅行', '思考', '阅读', '科技'
  ];

  return (
    <div className="min-h-screen bg-white font-serif text-neutral-900">
      {/* 顶部导航，左侧为大标题，右侧为栏目 */}
      <nav className="w-full border-b border-neutral-200 py-4 px-6 flex items-center justify-between text-base font-medium bg-white sticky top-0 z-20">
        <div className="flex flex-col items-start">
          <span className="text-3xl md:text-5xl font-extrabold tracking-widest leading-none">微言</span>
          <span className="text-lg md:text-2xl text-blue-700 font-semibold tracking-wider leading-tight">Vākcitra</span>
        </div>
        <div className="flex gap-8 items-center">
          <a href="#" className="hover:text-blue-700">首页</a>
          <a href="#" className="hover:text-blue-700">文章</a>
          <a href="#" className="hover:text-blue-700">宥言</a>
          <a href="#" className="hover:text-blue-700">声色</a>
          <a href="#" className="hover:text-blue-700">关于</a>
        </div>
      </nav>
      {/* 主内容区，两栏布局 */}
      <main className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12 px-4 mt-8">
        {/* 左侧：最新文章 */}
        <section className="flex-1 mb-12 md:mb-0">
          <h2 className="text-2xl font-extrabold mb-8">最新文章</h2>
          <ArticleList posts={posts} total={posts.length} />
        </section>
        {/* 右侧：宥言 + 声色 + 标签栏 */}
        <aside className="w-full md:w-[320px] flex flex-col gap-8">
          {/* 宥言区块 */}
          <section className="bg-neutral-50 rounded-xl shadow p-6 border-l-4 border-blue-200">
            <h2 className="text-lg font-bold text-blue-700 mb-4">宥言</h2>
            <ul className="space-y-3 text-base text-blue-900">
              {witList.map((w, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-300 rounded-full inline-block"></span>
                  <span>{w.content}</span>
                  <span className="ml-auto text-xs text-gray-400">{w.date}</span>
                </li>
              ))}
            </ul>
          </section>
          {/* 声色区块 */}
          <section className="bg-white rounded-xl shadow p-6 border-l-4 border-indigo-200 flex flex-col gap-3">
            <h2 className="text-lg font-bold text-indigo-700 mb-2">声色</h2>
            {latestMedia && latestMedia.type === 'audio' && (
              <audio controls className="w-full mb-2">
                <source src={latestMedia.src} type="audio/mp3" />
              </audio>
            )}
            {latestMedia && latestMedia.type === 'video' && (
              <video controls className="w-full mb-2">
                <source src={latestMedia.src} type="video/mp4" />
              </video>
            )}
            <div className="text-base text-neutral-700">{latestMedia?.title}</div>
            <a href="#" className="text-blue-600 hover:underline text-sm mt-2">前往声色详情 &gt;</a>
            {/* 标签栏 */}
            <div className="mt-6 flex flex-wrap gap-3">
              {tags.map((t, i) => (
                <a key={i} href="#" className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm hover:bg-blue-100 transition">{t}</a>
              ))}
            </div>
          </section>
        </aside>
      </main>
    </div>
  );
}