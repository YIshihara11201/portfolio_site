import captionBorderStyles from "../../../styles/Common/Caption/CaptionBorder.module.css";

const CaptionBorder = ({ width }) => {
  return (
    <div className={captionBorderStyles.caption_border} style={{ width }}></div>
  );
};

export default CaptionBorder;
