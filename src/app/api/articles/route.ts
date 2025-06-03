import { NextRequest, NextResponse } from 'next/server';

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;
const PAGE_SIZE = 15;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const start_cursor = searchParams.get('cursor') || undefined;

  if (!NOTION_TOKEN || !NOTION_DATABASE_ID) {
    return NextResponse.json({ error: 'Notion token or database id not set' }, { status: 500 });
  }

  // 构造 Notion API 请求
  const notionUrl = 'https://api.notion.com/v1/databases/' + NOTION_DATABASE_ID + '/query';
  const headers = {
    'Authorization': `Bearer ${NOTION_TOKEN}`,
    'Notion-Version': '2022-06-28',
    'Content-Type': 'application/json',
  };

  const body: any = {
    page_size: PAGE_SIZE,
  };
  if (start_cursor) body.start_cursor = start_cursor;

  const res = await fetch(notionUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to fetch Notion data' }, { status: 500 });
  }
  const data = await res.json();

  // 查询总数（可选，Notion API 目前不直接返回总数，需单独实现）
  let total = 0;
  try {
    const countRes = await fetch(notionUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({ page_size: 1 }),
    });
    if (countRes.ok) {
      const countData = await countRes.json();
      total = countData.total || 0;
    }
  } catch (e) {
    total = 0;
  }

  return NextResponse.json({
    articles: data.results,
    next_cursor: data.next_cursor,
    has_more: data.has_more,
    total,
  });
} 