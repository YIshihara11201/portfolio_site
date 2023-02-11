import Link from "next/link";
import ProjectCard from "../components/Works/ProjectCard";
import BorderedTitleCaption from "../components/Common/Caption/BorderedTitleCaption";
import { getAllPostsForSubfolder } from "../lib/staticPostProps";
import workStyles from "../styles/Works/Works.module.css";

const Works = ({ posts }) => {
  return (
    <div className={workStyles.container}>
      <div className={workStyles.caption}>
        <BorderedTitleCaption
          title={"Works"}
          captionWidth={120}
          borderWidth={200}
        />
      </div>
      <div className={workStyles.inner_container}>
        {posts.map((post, key) => (
          <div key={key} className={workStyles.card_container}>
            <Link href={`/posts/${post.id}`}>
              <a>
                <ProjectCard
                  imagePath={post.frontmatter.image}
                  jenre={"iOS"}
                  projectTitle={post.frontmatter.title}
                />
              </a>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export const getStaticProps = () => {
  const posts = getAllPostsForSubfolder({ subFolder: "works" });
  return {
    props: {
      posts,
    },
  };
};

export default Works;
