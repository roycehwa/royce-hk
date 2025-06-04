"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Pagination from "./Pagination";

const PAGE_SIZE = 15;

export default function ArticleList({ posts: initialPosts = [], total: initialTotal = 0, nextCursor: initialNextCursor }: { posts: any[]; total: number; nextCursor?: string }) {
  const [posts, setPosts] = useState(initialPosts);
  const [total, setTotal] = useState(initialTotal);
  const [currentPage, setCurrentPage] = useState(1);
  const [cursorStack, setCursorStack] = useState<(string | undefined)[]>([undefined]); // 第一页cursor为undefined
  const [nextCursor, setNextCursor] = useState(initialNextCursor);
  const [loading, setLoading] = useState(false);

  // 下一页
  const goToNextPage = async () => {
    if (!nextCursor) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/articles?cursor=${nextCursor}`);
      const data = await res.json();
      setPosts(data.articles || []);
      setNextCursor(data.next_cursor);
      setCurrentPage((prev) => prev + 1);
      setCursorStack((prev) => [...prev, nextCursor]);
      if (typeof data.total === "number") setTotal(data.total);
    } finally {
      setLoading(false);
    }
  };

  // 上一页
  const goToPrevPage = async () => {
    if (currentPage <= 1) return;
    setLoading(true);
    try {
      // 上一页的cursor是 cursorStack[currentPage - 2]
      const prevCursor = cursorStack[currentPage - 2];
      const res = await fetch(`/api/articles?cursor=${prevCursor || ""}`);
      const data = await res.json();
      setPosts(data.articles || []);
      setNextCursor(data.next_cursor);
      setCurrentPage((prev) => prev - 1);
      setCursorStack((prev) => prev.slice(0, -1));
      if (typeof data.total === "number") setTotal(data.total);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPosts(initialPosts);
    setTotal(initialTotal);
    setCurrentPage(1);
    setCursorStack([undefined]);
    setNextCursor(initialNextCursor);
  }, [initialPosts, initialTotal, initialNextCursor]);

  return (
    <div>
      {loading && <div className="text-center text-gray-400 mb-4">加载中...</div>}
      <ul className="space-y-8">
        {(posts || []).map((post: any) => (
          <li key={post.id} className="mb-8">
            <Link href={`/post/${post.id}`} className="block hover:bg-blue-50 rounded-lg p-4 transition">
              <h3 className="text-lg font-bold mb-1">
                {post.properties?.标题?.title?.[0]?.plain_text || "无标题"}
              </h3>
              <div className="flex items-center justify-between text-gray-500 text-sm mb-1">
                <span>{post.properties?.日期?.date?.start || ""}</span>
                <span className="text-blue-600 hover:underline text-sm ml-2">
                  阅读原文 &gt;
                </span>
              </div>
              <div className="text-base mb-2">
                {post.properties?.正文?.rich_text?.[0]?.plain_text || ""}
              </div>
            </Link>
            <div className="flex flex-wrap gap-2 mt-2">
              {(post.properties?.标签?.multi_select || []).map((tag: any) => (
                <a
                  key={tag.id}
                  href={`/tag/${encodeURIComponent(tag.name)}`}
                  className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs hover:bg-blue-100"
                >
                  {tag.name}
                </a>
              ))}
            </div>
          </li>
        ))}
      </ul>
      <div className="flex justify-center gap-4 mt-6">
        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          onClick={goToPrevPage}
          disabled={currentPage === 1 || loading}
        >
          上一页
        </button>
        <span className="px-2 py-1 text-gray-600">第 {currentPage} 页</span>
        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          onClick={goToNextPage}
          disabled={!nextCursor || loading}
        >
          下一页
        </button>
      </div>
      <div>
        <Link href="/post/test" className="text-red-600 underline">测试跳转</Link>
      </div>
    </div>
  );
}
