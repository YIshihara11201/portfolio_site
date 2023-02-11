import resumeButtonStyles from "../../../styles/Common/Nav/ResumeButton.module.css";

const ResumeButton = () => {
  return (
    <div className={resumeButtonStyles.resume}>
      <button>
        <a href="https://drive.google.com/file/d/1LDYYngU9fNAYTXMpx3U0FhyOLBXitiDy/view?usp=sharing">
          Resume
        </a>
      </button>
    </div>
  );
};

export default ResumeButton;
