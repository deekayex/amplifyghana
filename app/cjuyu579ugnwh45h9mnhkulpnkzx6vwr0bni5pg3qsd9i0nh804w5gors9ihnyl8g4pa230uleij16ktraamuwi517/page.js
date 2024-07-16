import {
  fetchCenteredStates,
  fetchEditorsData,
  fetchHighlightedEditors,
  fetchNewsData,
  handleSetHighlight,
  handleToggleClick,
} from "@/context/utils";
import { database } from "@/firebase/firebase";
import EditorsPicks from "../../components/editors-picks/page";
import News from "../../components/news/News";
import { Suspense } from "react";
// import LoadingScreen from "@/context/loading/LoadingScreen";
import LoadingArticles from "@/context/loading/ArticlesLoad/LoadingArticles";
import AdminLayout from "@/components/admin/AdminLayout";

const ArticleList = async () => {
  const highlightedEditors = await fetchHighlightedEditors(database);
  const editorsData = await fetchEditorsData(database);
  const centeredStates = await fetchCenteredStates(database);

  const newsArticles = await fetchNewsData(database);
  return (
    <AdminLayout>
    <div className="page-limiter">
      <div>
        <Suspense fallback={<LoadingArticles/>}>
        <News isAllArticlesPage={true} initialNewsArticles={newsArticles}
        />
        </Suspense>
        <EditorsPicks
          isAllArticlesPage={true}
          initialNewsArticles={newsArticles}
          highlightedEditors={highlightedEditors}
          editorsArticles={editorsData}
          handleToggleClick={handleToggleClick}
          centeredStates={centeredStates}
          handleSetHighlight={handleSetHighlight}
        />
      </div>
    </div>
    </AdminLayout>
  );
};

export default ArticleList;
