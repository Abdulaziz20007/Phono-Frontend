// app/profile/components/SettingsTab/modals/OtpInputModal.tsx
import React, { useState, useRef, ChangeEvent, KeyboardEvent } from "react"; // <<<--- ChangeEvent, KeyboardEvent qo'shildi
import styled from "styled-components";
import {
  ModalBackdrop,
  ModalContent,
  ModalCloseButton,
  Button,
} from "../../../components/ui/SharedComponents";

interface OtpInputModalProps {
  title: string;
  description: string;
  digits: number;
  onClose: () => void;
  onSubmit: (otp: string) => void;
}

const OtpInputContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 20px 0;
`;

const OtpDigitInput = styled.input`
  // Bu oddiy input bo'lgani uchun forwardRef shart emas
  width: 40px;
  height: 50px;
  text-align: center;
  font-size: 1.5em;
  border: 1px solid #ccc;
  border-radius: 4px;
  &:focus {
    outline: none;
    border-color: #6a1b9a;
    box-shadow: 0 0 0 2px rgba(106, 27, 154, 0.2);
  }
`;

const ResendCodeLink = styled.a`
  display: block;
  text-align: center;
  font-size: 0.9em;
  color: #6a1b9a;
  cursor: pointer;
  margin-bottom: 20px;
  &:hover {
    text-decoration: underline;
  }
`;

const OtpInputModal: React.FC<OtpInputModalProps> = ({
  title,
  description,
  digits,
  onClose,
  onSubmit,
}) => {
  const [otp, setOtp] = useState<string[]>(new Array(digits).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>(
    new Array(digits).fill(null)
  ); // <<<--- Boshlang'ich qiymatni to'g'riladim

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return; // Faqat raqamlar, return false o'rniga return

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Keyingi inputga o'tish
    if (element.value !== "" && index < digits - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    // <<<--- Tipni aniqlashtirdim
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length === digits) {
      onSubmit(enteredOtp);
    } else {
      alert(`Iltimos, ${digits} xonali kodni kiriting.`);
    }
  };

  return (
    <ModalBackdrop onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalCloseButton onClick={onClose}>×</ModalCloseButton>
        <h2>{title}</h2>
        <p style={{ textAlign: "center", color: "#555", fontSize: "0.95em" }}>
          {description}
        </p>
        <OtpInputContainer>
          {otp.map((data, index) => (
            <OtpDigitInput
              key={index}
              type="text" // "text" turi raqamlarni ham, harflarni ham qabul qiladi, "tel" yoki "number" yaxshiroq
              inputMode="numeric" // Mobil qurilmalarda raqamli klaviaturani ochadi
              pattern="[0-9]*" // Faqat raqamlarni kiritishga yordam beradi (HTML5 validatsiyasi)
              maxLength={1}
              value={data}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleChange(e.target, index)
              } // <<<--- Tipni aniqlashtirdim
              onKeyDown={(e: KeyboardEvent<HTMLInputElement>) =>
                handleKeyDown(e, index)
              } // <<<--- Tipni aniqlashtirdim
              onFocus={(e) => e.target.select()}
              ref={(el: HTMLInputElement | null) => {
                // <<<--- Ref callback tipini aniqlashtirdim
                inputRefs.current[index] = el;
              }}
            />
          ))}
        </OtpInputContainer>
        <ResendCodeLink onClick={() => console.log("Resend OTP")}>
          Не получили код? Отправить заново
        </ResendCodeLink>
        <Button $primary onClick={handleSubmit} style={{ width: "100%" }}>
          Подтвердить
        </Button>
      </ModalContent>
    </ModalBackdrop>
  );
};

export default OtpInputModal;
