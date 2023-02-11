import {
  Card,
  CardMedia,
  CardContent,
  CardActionArea,
  Chip,
  Typography,
} from "@mui/material";
import projectCardStyles from "../../styles/Works/ProjectCard.module.css";

const cardStyle = { width: "230px", margin: "20px" };

// const ProjectCard = ({ post }) => {
const ProjectCard = ({ imagePath, jenre, projectTitle }) => {
  return (
    <Card style={cardStyle}>
      <CardActionArea>
        <CardMedia
          component="img"
          alt=""
          image={imagePath}
          //   image={post.frontmatter.imagePath}
          className={projectCardStyles.image}
          sx={{
            objectFit: "contain",
          }}
        />
        <CardContent
          sx={{
            backgroundColor: "#f9fbe7",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* <Chip label={post.frontmatter.jenre} /> */}
          <Chip label={jenre} sx={{ flexBasis: "30%" }} />
          <Typography
            variant="h7"
            align="center"
            sx={{
              fontSize: "16px",
              flexBasis: "70%",
            }}
          >
            {/* {post.frontmatter.projectTitle} */}
            {projectTitle}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ProjectCard;
