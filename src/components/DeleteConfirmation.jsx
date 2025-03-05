import { useEffect, useState } from "react";
import ProgressBar from "./ProgressBar";

const TIME = 3000;

export default function DeleteConfirmation({ onConfirm, onCancel }) {
  
  useEffect(() => {
    console.log("Timer set");
    const timer = setTimeout(() => {
      onConfirm();
    }, TIME);

    // effect 함수가 다시 작동하기 바로 전에 실행
    // 컴포넌트가 사라지기 바로 전에 실행(DOM에서 삭제되기 전에 실행된다.)
    return () => {
      clearTimeout(timer);
    };
  }, [onConfirm]);

  return (
    <div id="delete-confirmation">
      <h2>Are you sure?</h2>
      <p>Do you really want to remove this place?</p>
      <div id="confirmation-actions">
        <button onClick={onCancel} className="button-text">
          No
        </button>
        <button onClick={onConfirm} className="button">
          Yes
        </button>
      </div>
      <ProgressBar timer={TIME} />
    </div>
  );
}
