import ScrollToTopOnMount from "../../../components/ScrollToTop";
import ClientArticle from "./ClientArticle";

type Props = {
  params: { category: string; articleId: string };
};

const Article = ({ params }: Props) => {
  return (
    <div className="article-page">
      <ScrollToTopOnMount />
      <div className="spacer" />
      <ClientArticle category={params.category} articleId={params.articleId} />
    </div>
  );
};

export default Article;
