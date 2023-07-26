import styles from "./Send.module.scss";
import React from "react";
import LocationSection from "../../components/Send/LocationSection/LocationSection";
import TextSection from "../../components/Send/TextSection/TextSection";
import ImageSection from "../../components/Send/ImageSection/ImageSection";
import VoiceSection from "../../components/Send/VoiceSection/VoiceSection";
import SubmitSection from "../../components/Send/SubmitSection/SubmitSection";

const Send = () => {
  return (
    <div className={styles["send"]}>
      <header className={styles["header"]}>
        <div className={styles["title"]}>끄적이기</div>
        <button className={styles["pasteButton"]}>붙이기</button>
      </header>
      <LocationSection />
      <TextSection />
      <ImageSection />
      <VoiceSection />
      <SubmitSection />
    </div>
  );
};

export default Send;
