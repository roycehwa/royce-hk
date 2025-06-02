"use client";

import Link from "next/link";

export default function NavTabs() {
  return (
    <nav className="flex items-center justify-end space-x-12 py-4">
      <Link href="/" className="text-gray-500 hover:text-blue-600">首页</Link>
      <Link href="/media" className="text-gray-500 hover:text-blue-600">声色</Link>
      <Link href="/youyan" className="text-gray-500 hover:text-blue-600">宥言</Link>
    </nav>
  );
}