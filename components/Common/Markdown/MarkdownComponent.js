import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import ImageWrapper from "./ImageWrapper";
import codeBlockStyles from "../../../styles/Common/Markdown/CodeBlock.module.css";

const paragraphConverter = (paragraph) => {
  const { node } = paragraph;

  if (node.children[0].tagName === "img") {
    const image = node.children[0];
    const metaString = image.properties.alt;
    const alt = metaString.replace(/ *{[\d:\/]+} */g, "");
    const matchResult = metaString.match(/{((\d+):)?(\d+\/\d+)}/);
    const aspectRatio = matchResult?.[3] || "16/9";
    const maxWidth = matchResult?.[2] || "300";

    return (
      <ImageWrapper
        src={image.properties.src}
        alt={alt}
        aspectRatio={aspectRatio}
        maxWidth={maxWidth}
      />
    );
  } else {
    return <p>{paragraph.children}</p>;
  }
};

const imageConverter = (image) => {
  const metaString = image.alt;
  const alt = metaString.replace(/ *{[\d:\/]+} */g, "");
  const matchResult = metaString.match(/{((\d+):)?(\d+\/\d+)}/);
  const aspectRatio = matchResult?.[3] || "16/9";
  const maxWidth = matchResult?.[2] || "300";

  return (
    <ImageWrapper
      src={image.src}
      alt={alt}
      aspectRatio={aspectRatio}
      maxWidth={maxWidth}
    />
  );
};

const codeBlockConverter = ({ inline, className, children, ...props }) => {
  if (inline) {
    return <code className={codeBlockStyles.inline_code}>{children}</code>;
  }
  const match = /language-(\w+)/.exec(className || "");
  const lang = match && match[1] ? match[1] : "";

  return (
    <div className={codeBlockStyles.code_block_container}>
      <SyntaxHighlighter
        style={oneDark}
        language={lang}
        className={codeBlockStyles.code_block}
      >
        {String(children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    </div>
  );
};

const MarkdownComponent = {
  p: paragraphConverter,
  code: codeBlockConverter,
  img: imageConverter,
};

export default MarkdownComponent;
