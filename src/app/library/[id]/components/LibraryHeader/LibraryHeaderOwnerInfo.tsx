import { FC } from 'react';

interface LibraryHeaderOwnerInfoProps {
  owner: {
    id: number;
    username: string;
  };
}

export const LibraryHeaderOwnerInfo: FC<LibraryHeaderOwnerInfoProps> = ({
  owner,
}) => {
  return (
    <p className="text-sm text-gray-500">
      <span className="font-medium text-gray-700">{owner.username}</span>
      님의 서재
    </p>
  );
};
