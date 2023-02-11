/* eslint-disable @next/next/no-img-element */
import { getSinglePost } from "../lib/staticPostProps";
import ReactMarkdown from "react-markdown";
import MarkdownComponent from "../components/Common/Markdown/MarkdownComponent";
import BorderedTitleCaption from "../components/Common/Caption/BorderedTitleCaption";
import aboutStyles from "../styles/About/About.module.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false; /* eslint-disable import/first */
const aboutFolder = "about";

const About = ({ posts }) => {
  return (
    <div className={aboutStyles.container}>
      <div className={aboutStyles.hello_message}>
        <h1>Hello, I&apos;m Yusuke Ishihara</h1>
      </div>
      <div className={aboutStyles.image_summary_container}>
        <div className={aboutStyles.img_container}>
          <img src="/monochrome.png" alt="" width={170} />
        </div>

        <div className={aboutStyles.cap_summarydesc_container}>
          <div className={aboutStyles.caption}>
            <BorderedTitleCaption
              title={"About Me"}
              captionWidth={150}
              borderWidth={250}
            />
          </div>
          <div className={aboutStyles.summary_container}>
            <ReactMarkdown
              components={MarkdownComponent}
              className={aboutStyles.summary}
            >
              {posts.summary.content}
            </ReactMarkdown>
          </div>
        </div>
      </div>

      <div className={aboutStyles.exp_skill_container}>
        <div className={aboutStyles.cap_skill_container}>
          <div className={aboutStyles.caption}>
            <BorderedTitleCaption
              title={"Skills"}
              captionWidth={150}
              borderWidth={250}
            />
          </div>
          <ReactMarkdown
            components={MarkdownComponent}
            className={aboutStyles.skills}
          >
            {posts.skills.content}
          </ReactMarkdown>
        </div>

        <div className={aboutStyles.cap_exp_container}>
          <div className={aboutStyles.caption}>
            <BorderedTitleCaption
              title={"Experience"}
              captionWidth={150}
              borderWidth={250}
            />
          </div>
          <ReactMarkdown
            components={MarkdownComponent}
            className={aboutStyles.experience}
          >
            {posts.experience.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export const getStaticProps = () => {
  const summary = getSinglePost({ subFolder: aboutFolder, id: "summary" });
  const experience = getSinglePost({
    subFolder: aboutFolder,
    id: "experience",
  });
  const skills = getSinglePost({ subFolder: aboutFolder, id: "skills" });

  return {
    props: {
      posts: { summary, experience, skills },
    },
  };
};

export default About;
