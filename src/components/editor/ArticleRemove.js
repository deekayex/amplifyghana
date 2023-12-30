import React, { useState } from 'react';

const ArticleRemover = ({ articles, onDelete }) => {
  const [selectedArticles, setSelectedArticles] = useState([]);

  const handleSelect = (articleId) => {
    // Toggle the selected state of the article
    setSelectedArticles((prevSelected) => {
      if (prevSelected.includes(articleId)) {
        // If already selected, remove from the list
        return prevSelected.filter((id) => id !== articleId);
      } else {
        // If not selected, add to the list
        return [...prevSelected, articleId];
      }
    });
  };

  const handleDeleteSelected = () => {
    // Call the onDelete function with the selected article IDs
    onDelete(selectedArticles);

    // Clear the selection
    setSelectedArticles([]);
  };

  return (
    <div className="article-management">
      <h2>Article Remover</h2>
      <button onClick={handleDeleteSelected} disabled={selectedArticles.length === 0}>
        Delete Selected Articles
      </button>
      <ul>
        {articles.map((article) => (
          <li key={article.id}>
            <label>
              <input
                type="checkbox"
                checked={selectedArticles.includes(article.id)}
                onChange={() => handleSelect(article.id)}
              />
              {article.title}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ArticleRemover;
