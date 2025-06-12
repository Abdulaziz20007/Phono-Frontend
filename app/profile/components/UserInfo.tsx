import styled from "styled-components";
import Image from "next/image";
import { UserProfile } from "../types";
import { FaUserEdit } from "react-icons/fa";

interface UserInfoProps {
  user: UserProfile | null;
  onEditClick: () => void;
}

const UserInfoContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Avatar = styled(Image)`
  border-radius: 50%;
  margin-right: 20px;
  object-fit: cover;
`;

const UserDetails = styled.div`
  flex-grow: 1;
  h2 {
    margin: 0 0 5px 0;
    font-size: 1.4em;
    color: #333;
  }
  p {
    margin: 0;
    color: #666;
    font-size: 0.9em;
  }
`;

const EditButton = styled.button`
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  color: #555;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9em;
  display: flex;
  align-items: center;
  gap: 5px;

  &:hover {
    background-color: #e7e7e7;
  }
`;

export default function UserInfo({ user, onEditClick }: UserInfoProps) {
  if (!user) {
    return <UserInfoContainer>Загрузка...</UserInfoContainer>;
  }

  return (
    <UserInfoContainer>
      <Avatar
        src={user.avatar || "/images/default-avatar.png"}
        alt={`${user.name} ${user.surname}`}
        width={80}
        height={80}
        priority
      />
      <UserDetails>
        <h2>{`${user.name} ${user.surname}`}</h2>
        <p>Баланс: {user.balance.toLocaleString("ru-RU")} сум</p>
      </UserDetails>
      <EditButton onClick={onEditClick}>
        <FaUserEdit /> Редактировать
      </EditButton>
    </UserInfoContainer>
  );
}
