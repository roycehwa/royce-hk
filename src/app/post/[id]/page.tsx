import { getPage, getPageBlocks, getNotionRecordMap } from "@/lib/notion";
import NotionRenderer from "@/components/NotionXRenderer";
import NotionXRenderer from "@/components/NotionXRenderer";
import NavTabs from "@/components/NavTabs";
import ArticleList from "@/components/ArticleList";

export default async function PostPage({ params }: { params: { id: string } }) {
  console.log('详情页收到的 id:', params.id);
  const { id } = params;
  const recordMap = await getNotionRecordMap(id);

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="flex items-center justify-between py-6">
        <div>
          <div className="text-5xl font-bold leading-none">微言</div>
          <div className="text-xl text-blue-700 font-serif font-bold">Vākcitra</div>
        </div>
        <div className="flex-1 flex justify-end">
          <NavTabs />
        </div>
      </div>
      <hr className="mt-1 mb-6 border-gray-200" />
      <NotionXRenderer recordMap={recordMap} />
    </div>
  );
}
