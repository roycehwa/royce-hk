"use client";
import React, { useState } from "react";
import { NotionRenderer } from "react-notion-x";
import "react-notion-x/src/styles.css";

type NotionBlock = {
  id: string;
  type: string;
  [key: string]: any;
};

function ImageWithFallback({ src, alt, className }: { src: string; alt?: string; className?: string }) {
  const [error, setError] = useState(false);
  return error ? (
    <img
      src="/placeholder.png" // 你可以自定义占位图
      alt="图片加载失败"
      className={className}
    />
  ) : (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  );
}

export default function NotionXRenderer({ recordMap }: { recordMap: any }) {
  return (
    <div>
      <NotionRenderer recordMap={recordMap} fullPage={false} darkMode={false} />
    </div>
  );
}
