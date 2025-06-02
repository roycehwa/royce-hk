"use client";
import Link from "next/link";
import { useEffect } from "react";

export default function ArticleList({ posts }: { posts: any[] }) {
  useEffect(() => {
    console.log("ArticleList mounted");
  }, []);

  return (
    <ul className="space-y-8">
      {posts.map((post: any) => (
        <li key={post.id} className="mb-8">
          <h3 className="text-lg font-bold mb-1">
            {post.properties?.标题?.title?.[0]?.plain_text || "无标题"}
          </h3>
          <div className="flex items-center justify-between text-gray-500 text-sm mb-1">
            <span>{post.properties?.日期?.date?.start || ""}</span>
            <a href={`/post/${post.id}`} className="text-blue-600 hover:underline text-sm ml-2">
              阅读原文 &gt;
            </a>
          </div>
          <div className="text-base mb-2">
            {post.properties?.正文?.rich_text?.[0]?.plain_text || ""}
          </div>
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
  );
}
