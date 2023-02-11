import NoSSR from "../NoSSR";
import yearTextStyles from "../../../styles/Common/Date/YearText.module.css";

const YearText = () => {
  let currentYear = new Date().getFullYear();
  return (
    <NoSSR>
      <div className={yearTextStyles.year}>{currentYear}</div>
    </NoSSR>
  );
};

export default YearText;
