import Lottie from "lottie-react";
import congrates from "../../../lottiefiles/congrates.json";
import error from "../../../lottiefiles/error.json";
import loading from "../../../lottiefiles/loading.json";
import noBookings from "../../../lottiefiles/noBookings.json";


const lottieFilesMap = {
  congrates,
  error,
  loading,
  noBookings,
};

type LottieHandlerProps = {
  type: keyof typeof lottieFilesMap ;
  message?: string | { error?: string; message?: string }; // Allow object for compatibility
  className?: string;
};

// Utility to extract string from message
const getErrorMessage = (message: LottieHandlerProps["message"]): string => {
  if (typeof message === "string") return message;
  if (typeof message === "object" && message !== null) {
    return message.error || message.message || "An error occurred";
  }
  return "An error occurred";
};

const LottieHandler = ({
  type,
  message,
  className = "",
}: LottieHandlerProps) => {
  const lottie = lottieFilesMap[type];
  const messageStyle =
    type === "error"
      ? { fontSize: "19px", color: "red" }
      : { fontSize: "19px", marginTop: "30px" };

  const displayMessage = getErrorMessage(message);

  return (
    <div
      className={`flex flex-col justify-center items-center ${className}`}
    >
      <Lottie animationData={lottie} style={{ width: "400px" }} />
      {displayMessage && <h3 style={messageStyle}>{displayMessage}</h3>}
    </div>
  );
};

export default LottieHandler;
