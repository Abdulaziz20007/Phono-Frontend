import styled from "styled-components";
import { ActiveProfileTab } from "../types";

interface ProfileTabsProps {
  activeTab: ActiveProfileTab;
  onTabClick: (tab: ActiveProfileTab) => void;
}

const TabsContainer = styled.div`
  display: flex;
  margin-bottom: 20px;
  border-bottom: 1px solid #e0e0e0;
  background-color: #fff;
  padding: 0 10px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
`;

const TabButton = styled.button<{ $isActive: boolean }>`
  padding: 15px 20px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 1em;
  color: ${(props) => (props.$isActive ? "#6a1b9a" : "#555")};
  border-bottom: ${(props) =>
    props.$isActive ? "3px solid #6a1b9a" : "3px solid transparent"};
  font-weight: ${(props) => (props.$isActive ? "600" : "normal")};
  transition: all 0.2s ease-in-out;

  &:hover {
    color: #6a1b9a;
  }
`;

const tabs: { key: ActiveProfileTab; label: string }[] = [
  { key: "ads", label: "Объявления" },
  { key: "messages", label: "Сообщения" },
  { key: "favorites", label: "Избранное" },
  { key: "settings", label: "Настройки" },
];

export default function ProfileTabs({
  activeTab,
  onTabClick,
}: ProfileTabsProps) {
  return (
    <TabsContainer>
      {tabs.map((tab) => (
        <TabButton
          key={tab.key}
          $isActive={activeTab === tab.key}
          onClick={() => onTabClick(tab.key)}
        >
          {tab.label}
        </TabButton>
      ))}
    </TabsContainer>
  );
}
