import { useState, useEffect } from 'react';
import { useFollowUser, useGetCurrentUser } from "@/lib/react-query/queries";
import { Button } from "../ui/button";
import Loader from "@/components/shared/Loader";
import { Models } from "appwrite";

type FollowButtonProps = {
    userToFollow: Models.Document;
    userIdToFollow: string;
    onFollowChange?: (isFollowed: boolean) => void;
};

const FollowingButton = ({ userToFollow, userIdToFollow, onFollowChange }: FollowButtonProps) => {

    const { data: currentUser } = useGetCurrentUser();
    const { mutateAsync: followUser, isLoading } = useFollowUser();

    const [isFollowing, setIsFollowing] = useState(false);
    const [followingList, setFollowingList] = useState<string[]>([]);

    useEffect(() => {
        if (currentUser) {
            setFollowingList(currentUser.following || []);
            setIsFollowing(currentUser.following.includes(userIdToFollow));
        }
    }, [currentUser, userIdToFollow]);

    const handleFollowUser = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation();
        if (currentUser) {
            let updatedFollowingList = [...followingList];
            let updatedFollowList = [...userToFollow.follower];

            if (isFollowing) {
                updatedFollowingList = updatedFollowingList.filter(id => id !== userIdToFollow);
                updatedFollowList = updatedFollowList.filter(id => id !== currentUser.$id);
            } else {
                updatedFollowingList.push(userIdToFollow);
                updatedFollowList.push(currentUser.$id);
            }

            // Update the state
            setFollowingList(updatedFollowingList);
            setIsFollowing(!isFollowing);

            // Notify about follow/unfollow
            onFollowChange && onFollowChange(!isFollowing);

            try {

                let result = await followUser({
                    currentUserId: currentUser.$id,
                    userIdToFollow: userIdToFollow,
                    followingArray: updatedFollowingList,
                    followerArray: updatedFollowList
                });

                if (!result) throw Error;

            } catch (error) {
                console.log({ error })
            }


        }
    };
    return (
        <Button type="button"
            size="sm"
            className="shad-button_primary px-5"
            onClick={handleFollowUser}
            disabled={isLoading}>
            {isLoading ? (
                <div className="flex-center gap-2">
                    <Loader /> Loading...
                </div>
            ) : isFollowing ? (
                "Unfollow"
            ) : (
                'Follow'
            )}
        </Button>

    );
};


export default FollowingButton