import titleCaptionStyle from "../../../styles/Common/Caption/TitleCaption.module.css";

const TitleCaption = ({ title, width }) => {
  return (
    <div className={titleCaptionStyle.caption_container} style={{ width }}>
      <div className={titleCaptionStyle.caption_left_box}></div>
      <div className={titleCaptionStyle.caption_right_box}>{title}</div>
    </div>
  );
};

export default TitleCaption;
