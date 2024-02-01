import { Models } from "appwrite";

import UserCard from "./UserCard";
type GridUserListProps = {
    users: Models.Document[];
};

const GridUserList = ({
    users,

}: GridUserListProps) => {

    return (
        <ul className="user-grid">
            {users.map((user: Models.Document) => (
                <li key={user.$id} className="flex-1 min-w-[200px] w-full">
                    <UserCard user={user} />
                </li>
            ))}
        </ul>
    );
};

export default GridUserList;
