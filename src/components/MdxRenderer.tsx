"use client";
import { MDXProvider } from "@mdx-js/react";
import * as runtime from "react/jsx-runtime";
import React, { useState, useEffect } from "react";

export default function MdxRenderer({ code }: { code: string }) {
  const [MDXContent, setMDXContent] = useState<any>(null);
  useEffect(() => {
    // eslint-disable-next-line no-new-func
    const fn = new Function("React", "runtime", `${code}; return MDXContent;`);
    setMDXContent(() => fn(React, runtime));
  }, [code]);
  if (!MDXContent) return <div>加载中...</div>;
  return (
    <MDXProvider>
      <article className="prose prose-blue max-w-none">
        <MDXContent />
      </article>
    </MDXProvider>
  );
} 