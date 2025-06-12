// app/profile/components/SettingsTab/LanguageSection.tsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FaChevronDown, FaChevronUp, FaGlobe } from "react-icons/fa";

interface LanguageSectionProps {
  currentLanguage: "ru" | "en" | "uz";
  onLanguageChange: (language: "ru" | "en" | "uz") => void;
}

// --- Styled Components ---
const SectionCard = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 20px;
  overflow: hidden;
`;

const SectionHeader = styled.div`
  background-color: #f7f7f7;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  border-bottom: 1px solid #e0e0e0;
  h3 {
    margin: 0;
    font-size: 1.1em;
    color: #333;
    display: flex;
    align-items: center;
  } // Flex qo'shildi
`;

const SectionContent = styled.div<{ $isOpen: boolean }>`
  padding: 20px;
  display: ${(props) => (props.$isOpen ? "block" : "none")};
`;

const LanguageOptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px 5px; // Padding biroz kamaytirildi
  border-radius: 4px;
  transition: background-color 0.2s;
  position: relative; // Kerak bo'lishi mumkin

  &:hover {
    background-color: #f9f9f9;
  }

  input[type="radio"] {
    margin-right: 10px;
    accent-color: #6a1b9a;
    // Agar kerak bo'lsa, radio buttonni custom stil bilan yasash mumkin
    // opacity: 0; // Original radio buttonni yashirish
    // position: absolute;
  }
  span {
    font-size: 1em;
    color: #333;
  }
`;

const CurrentLanguageDisplay = styled.span`
  color: #6a1b9a;
  font-weight: 500;
  margin-left: auto;
  padding-right: 5px;
`;

const languages = [
  { code: "ru", name: "Русский" },
  { code: "en", name: "English" },
  { code: "uz", name: "O‘zbek" },
] as const;

export default function LanguageSection({
  currentLanguage,
  onLanguageChange,
}: LanguageSectionProps) {
  const [isOpen, setIsOpen] = useState(true); // Accordion state

  useEffect(() => {
    console.log(
      "LanguageSection: currentLanguage prop updated to:",
      currentLanguage
    ); // DEBUG 6
  }, [currentLanguage]);

  const handleLangChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newLang = event.target.value as "ru" | "en" | "uz";
    console.log("LanguageSection: Radio changed, new lang selected:", newLang); // DEBUG 1
    onLanguageChange(newLang); // Bu prop orqali kelgan funksiyani chaqiradi
  };

  const getCurrentLanguageName = () => {
    return (
      languages.find((lang) => lang.code === currentLanguage)?.name ||
      currentLanguage
    );
  };

  console.log(
    "LanguageSection rendering. Current language prop:",
    currentLanguage,
    "isOpen:",
    isOpen
  ); // DEBUG 7

  return (
    <SectionCard>
      <SectionHeader
        onClick={() => {
          console.log(
            "LanguageSection: Header clicked, toggling isOpen from",
            isOpen
          ); // DEBUG 8
          setIsOpen(!isOpen);
        }}
      >
        <h3>
          <FaGlobe style={{ marginRight: "8px" }} />
          Язык приложения
        </h3>
        {!isOpen && (
          <CurrentLanguageDisplay>
            {getCurrentLanguageName()}
          </CurrentLanguageDisplay>
        )}
        {isOpen ? <FaChevronUp /> : <FaChevronDown />}
      </SectionHeader>
      <SectionContent $isOpen={isOpen}>
        <LanguageOptionsContainer>
          {languages.map((lang) => {
            const isChecked = currentLanguage === lang.code;
            return (
              <RadioLabel key={lang.code}>
                <input
                  type="radio"
                  name="language"
                  value={lang.code}
                  checked={isChecked}
                  onChange={handleLangChange}
                />
                <span>{lang.name}</span>
              </RadioLabel>
            );
          })}
        </LanguageOptionsContainer>
      </SectionContent>
    </SectionCard>
  );
}
