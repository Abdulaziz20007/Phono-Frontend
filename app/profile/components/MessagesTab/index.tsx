// app/profile/components/MessagesTab/index.tsx
import React from "react";
import styled from "styled-components";

const MessagesContainer = styled.div`
  background-color: #fff;
  padding: 40px 20px; // Bo'sh bo'lgani uchun ko'proq padding
  border-radius: 0 0 8px 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  text-align: center;
  color: #777;
  min-height: 200px; // Minimal balandlik
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PlaceholderText = styled.p`
  font-size: 1.1em;
`;

export default function MessagesTab() {
  return (
    <MessagesContainer>
      <PlaceholderText>У вас пока нет сообщений.</PlaceholderText>
    </MessagesContainer>
  );
}
