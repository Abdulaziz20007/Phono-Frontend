// app/profile/components/AdsTab/AdsSearchFilter.tsx
import styled from "styled-components";
import { Input, Button } from "../../components/ui/SharedComponents"; // Shared components
import { FaSearch, FaFilter } from "react-icons/fa";

interface AdsSearchFilterProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onFilterClick: () => void;
}

const SearchFilterContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  align-items: center;
`;

const SearchInputWrapper = styled.div`
  position: relative;
  flex-grow: 1;
  svg {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #aaa;
  }
  input {
    padding-left: 35px;
  }
`;

export default function AdsSearchFilter({
  searchTerm,
  onSearchChange,
  onFilterClick,
}: AdsSearchFilterProps) {
  return (
    <SearchFilterContainer>
      <SearchInputWrapper>
        <FaSearch />
        <Input
          type="text"
          placeholder="Например, S22 Ultra"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </SearchInputWrapper>
      <Button onClick={onFilterClick} style={{ flexShrink: 0 }}>
        {" "}
        <FaFilter style={{ marginRight: "5px" }} /> Поиск
      </Button>
      <Button
        onClick={onFilterClick}
        style={{ backgroundColor: "#eee", color: "#555" }}
      >
        <FaFilter />
      </Button>
    </SearchFilterContainer>
  );
}
