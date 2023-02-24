import styles from "./SubmitModal.module.scss";
import { useLetterFormStore } from "../../../../store/useLetterFormStore";

const SubmitModal = () => {
  const { text, audio, title, setTitle } = useLetterFormStore((state) => state);
  return (
    <div className={styles.submit}>
      <div className={styles.description}>쪽지 남기기</div>
      {!text && !audio ? (
        <div className={styles.noContent}>
          쪽지를 남기려면 <br /> 내용을 입력하세요
        </div>
      ) : (
        <>
          <div className={styles.pleaseWrite}>당신의 쪽지를 한 줄로 소개하세요!</div>
          <input
            className={styles.writeInput}
            value={title ? title : ""}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className={styles.status}>
            <div>{text ? "글" : ""}</div>
            <div>{audio ? "음성" : ""}</div>
          </div>
          <div className={styles.youLeft}>을 쪽지에 담았습니다!</div>
          <button
            className={styles.confirmButton}
            onClick={() => {
              if (!title) {
                alert("한 줄 소개를 입력하세요");
              } else {
                alert("쪽지를 남겼습니다");
              }
            }}
          >
            남기기
          </button>
        </>
      )}
    </div>
  );
};

export default SubmitModal;