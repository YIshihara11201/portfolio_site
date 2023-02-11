import ReactMarkdown from "react-markdown";
import { getSinglePost, getPathsForSubfolder } from "../../lib/staticPostProps";
import MarkdownComponent from "../../components/Common/Markdown/MarkdownComponent";
import BorderedTitleCaption from "../../components/Common/Caption/BorderedTitleCaption";
import articleStyles from "../../styles/Posts/Article.module.css";

const worksFolder = "works";

const Article = ({ post }) => {
  return (
    <div className={articleStyles.container}>
      <div className={articleStyles.inner_container}>
        {/* <div>{post.frontmatter.title}</div> */}
        {/* <div>{post.frontmatter.date}</div> */}
        {/* <div>{post.frontmatter.description}</div> */}
        <div className={articleStyles.caption}>
          <BorderedTitleCaption
            title={post.frontmatter.title}
            captionWidth={180}
            borderWidth={240}
          />
        </div>
        <ReactMarkdown components={MarkdownComponent}>
          {post.content}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export const getStaticPaths = () => {
  const paths = getPathsForSubfolder({ subFolder: worksFolder });

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = ({ params: { id } }) => {
  const post = getSinglePost({ subFolder: worksFolder, id });

  return {
    props: {
      post,
    },
  };
};

export default Article;
