import Image from "next/image";
import imageWrapperStyles from "../../../styles/Common/Markdown/ImageWrapper.module.css";
import NoSSR from "../NoSSR";

const ImageWrapper = ({ src, alt, aspectRatio, maxWidth }) => {
  const [aspectW, aspectH] = aspectRatio.split("/").map((str) => Number(str));
  const width = Number(maxWidth);
  return (
    <NoSSR>
      <div className={imageWrapperStyles.container}>
        <Image
          src={src}
          alt={alt}
          width={width}
          height={(width / aspectW) * aspectH}
        />
      </div>
    </NoSSR>
  );
};

export default ImageWrapper;
