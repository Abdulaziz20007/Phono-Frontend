import styled from "styled-components";

export const ColorOptions = styled.div`
  width: 342px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
`;

export const ColorOption = styled.div<{ selected: boolean }>`
  width: 72px;
  height: 48px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: ${(props) =>
    props.selected ? "3px solid #007bff" : "2px solid #ddd"};

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: scale(0.95);
  }
`;
