import TitleCaption from "./TitleCaption";
import CaptionBorder from "./CaptionBorder";
import borderedTitleCaptionStyles from "../../../styles/Common/Caption/BorderedTitleCaption.module.css";

const BorderedTitleCaption = ({ title, captionWidth, borderWidth }) => {
  return (
    <div className={borderedTitleCaptionStyles.container}>
      <TitleCaption title={title} width={captionWidth}></TitleCaption>
      <CaptionBorder width={borderWidth}></CaptionBorder>
    </div>
  );
};

export default BorderedTitleCaption;
