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
  const cleanPageId = pageId.replace(/-/g, "");
  if (notionCache[cleanPageId]) {
    return notionCache[cleanPageId];
  }
  const notion = new NotionAPI();
  const start = Date.now();
  const data = await notion.getPage(cleanPageId);
  console.log(`getNotionRecordMap for ${cleanPageId} took ${Date.now() - start}ms`);
  notionCache[cleanPageId] = data;
  return data;
}
