import React from 'react';
import { getDatabase, getPage, getPageBlocks } from "@/lib/notion";
import NotionRenderer from "@/components/NotionXRenderer";
import Link from "next/link";
import ArticleList from "@/components/ArticleList";

// 假数据
const articles = [
  { title: '摘：《Aus meiner Kindheit und Jugendzeit》', date: '2025-05-31', summary: '“史怀哲《我的童年和青年时代》”' },
  { title: '摘：《天生有罪》', date: '2025-05-30', summary: '“罪从何处来？”' },
  { title: '摘：《许渊冲百岁自述》', date: '2025-05-30', summary: '“我们一生，无可辩驳。”' },
  { title: '入蜀记 06', date: '2025-05-30', summary: '“石化。”' },
  { title: '入蜀记 04', date: '2025-05-30', summary: '“行李来了。”' },
];

const witList = [
  { content: '人生如逆旅，我亦是行人。', date: '2024-06-01' },
  { content: '一念花开，一念花落。', date: '2024-05-30' },
  { content: '夜色温柔，心事如水。', date: '2024-05-29' },
  { content: '浮生若梦，为欢几何。', date: '2024-05-28' },
  { content: '山川异域，风月同天。', date: '2024-05-27' },
];

const mediaList = [
  { title: '夜的钢琴曲', type: 'audio', thumb: '/media/audio1.jpg', url: '#', date: '2024-06-01', src: '/media/sample.mp3' },
  { title: '浮世绘一', type: 'image', thumb: '/media/img1.jpg', url: '#', date: '2024-05-30' },
  { title: '赛博之夜', type: 'video', thumb: '/media/video1.jpg', url: '#', date: '2024-05-29' },
  { title: '晨光', type: 'audio', thumb: '/media/audio2.jpg', url: '#', date: '2024-05-28' },
  { title: '蓝色回响', type: 'image', thumb: '/media/img2.jpg', url: '#', date: '2024-05-27' },
];

const tags = [
  '随笔', '诗句', '音乐', '摄影', '灵感', '生活', '旅行', '思考', '阅读', '科技'
];

export default async function Home() {
  // 读取 Notion 文章数据库
  const posts = await getDatabase(process.env.NOTION_DATABASE_ID!);

  // 按时间倒序取最新5条 wit
  const latestWit = [...witList].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  // 最新媒体内容一条
  const latestMedia = [...mediaList].sort((a, b) => b.date.localeCompare(a.date))[0];

  console.log('首页传递的 pageId:', process.env.NOTION_DATABASE_ID);

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
          <ArticleList posts={posts} />
        </section>
        {/* 右侧：宥言 + 声色 + 标签栏 */}
        <aside className="w-full md:w-[320px] flex flex-col gap-8">
          {/* 宥言区块 */}
          <section className="bg-neutral-50 rounded-xl shadow p-6 border-l-4 border-blue-200">
            <h2 className="text-lg font-bold text-blue-700 mb-4">宥言</h2>
            <ul className="space-y-3 text-base text-blue-900">
              {latestWit.map((w, i) => (
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