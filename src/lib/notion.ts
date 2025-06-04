import { Client } from "@notionhq/client";
import { NotionAPI } from "notion-client";

const notion = new Client({ auth: process.env.NOTION_TOKEN });

const notionCache: Record<string, any> = {};

export async function getDatabase(databaseId: string) {
  const response = await notion.databases.query({ database_id: databaseId });
  return response.results;
}

export async function getPage(pageId: string) {
  return await notion.pages.retrieve({ page_id: pageId });
}

export async function getPageBlocks(pageId: string) {
  const blocks = [];
  let cursor;
  do {
    const { results, next_cursor } = await notion.blocks.children.list({
      block_id: pageId,
      start_cursor: cursor,
    });
    blocks.push(...results);
    cursor = next_cursor;
  } while (cursor);
  return blocks;
}

export async function getNotionRecordMap(pageId: string) {
  console.log('getNotionRecordMap called with:', pageId);
  const cleanPageId = pageId.replace(/-/g, "");
  if (notionCache[cleanPageId]) {
    console.log(`getNotionRecordMap (cache hit) for ${cleanPageId}`);
    return notionCache[cleanPageId];
  }
  const notion = new NotionAPI();
  const start = Date.now();

  // 加超时
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Notion API 请求超时')), 10000)
  );
  let data;
  try {
    data = await Promise.race([
      notion.getPage(cleanPageId),
      timeoutPromise
    ]);
  } catch (e) {
    console.error('Notion API 请求失败:', e);
    throw e;
  }

  console.log(`getNotionRecordMap for ${cleanPageId} took ${Date.now() - start}ms`);
  if (typeof data === 'object' && data !== null) {
    const keys = Object.keys(data as Record<string, any>);
    console.log('recordMap keys:', keys);
  }
  notionCache[cleanPageId] = data;
  return data;
}
