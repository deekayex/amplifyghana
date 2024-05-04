import React from 'react'
import News from '../news/News'
import EditorsPicks from '../editorsPicks/EditorsPicks'

const ArticleList = () => {
  return (
    <div className='page-limiter'>
      <div>
        <News isAllArticlesPage={true}/>
        <EditorsPicks isAllArticlesPage={true}/>
      </div>
    </div>
  )
}

export default ArticleList