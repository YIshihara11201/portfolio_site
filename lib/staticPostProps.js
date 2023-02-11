import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = "posts";

export const getSinglePost = ({ subFolder, id }) => {
  const fullPath = path.join(postsDirectory + "/" + subFolder, `${id}.md`);
  const markdownWithMeta = fs.readFileSync(fullPath, "utf-8");

  const { data: frontmatter, content } = matter(markdownWithMeta);
  return {
    id,
    frontmatter,
    content,
  };
};

export const getAllPostsForSubfolder = ({ subFolder }) => {
  const subFolderPath = path.join(postsDirectory + "/" + subFolder);
  const files = fs.readdirSync(subFolderPath);
  const posts = files.map((filename) => {
    const markdownWithMeta = fs.readFileSync(
      path.join(subFolderPath + "/" + filename),
      "utf-8"
    );

    const { data: frontmatter, content } = matter(markdownWithMeta);

    return {
      id: filename.replace(".md", ""),
      frontmatter,
      content,
    };
  });

  return posts;
};

export const getPathsForSubfolder = ({ subFolder }) => {
  const fullPath = path.join(postsDirectory + "/" + subFolder);
  const files = fs.readdirSync(fullPath);

  const paths = files.map((filename) => ({
    params: {
      id: filename.replace(".md", ""),
    },
  }));

  return paths;
};
