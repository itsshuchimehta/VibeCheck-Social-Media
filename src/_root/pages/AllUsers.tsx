import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Loader, GridUserList } from "@/components/shared";
import { useGetUsers, useSearchUsers } from "@/lib/react-query/queries";
import { Input } from "@/components/ui";
import useDebounce from "@/hooks/useDebounce";

export type SearchResultProps = {
  isSearchFetching: boolean;
  searchedUsers: any;
};

const SearchResults = ({ isSearchFetching, searchedUsers }: SearchResultProps) => {

  if (isSearchFetching) {
    return <Loader />;
  } else if (searchedUsers && searchedUsers.documents.length > 0) {
    return <GridUserList users={searchedUsers.documents} />;
  } else {
    return (
      <p className="text-light-4 mt-10 text-center w-full">No results found</p>
    );
  }
};

const AllUsers = () => {
  // const { ref, inView } = useInView();
  const { toast } = useToast();


  const { data: creators, isLoading, isError: isErrorCreators } = useGetUsers();
  if (isErrorCreators) {
    toast({ title: "Something went wrong." });

    return;
  }
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue, 500);
  const { data: searchedUsers, isFetching: isSearchFetching } = useSearchUsers(debouncedSearch);


  if (!creators)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );
  // console.log(creators)
  const shouldShowSearchResults = searchValue !== "";
  const shouldShowUsers = !shouldShowSearchResults &&
    creators.documents.length === 0;
  // console.log(shouldShowUsers)


  return (
    <div className="explore-container common-container">
      <div className="explore-inner_container">
        <h2 className="h3-bold md:h2-bold w-full">Search People</h2>
        <div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4">
          <img
            src="/assets/icons/search.svg"
            width={24}
            height={24}
            alt="search"
          />
          <Input
            type="text"
            placeholder="Search"
            className="explore-search"
            value={searchValue}
            onChange={(e) => {
              const { value } = e.target;
              setSearchValue(value);
            }}
          />
        </div>
      </div>
      <div className="user-container">

        <div className="flex flex-wrap gap-9 w-full max-w-5xl">
          <h2 className="h3-bold md:h2-bold text-left w-full"> {shouldShowSearchResults ? 'Search Result' : 'All Users'}</h2>
          {shouldShowSearchResults ? (
            <SearchResults
              isSearchFetching={isSearchFetching}
              searchedUsers={searchedUsers}
            />
          ) : shouldShowUsers ? (
            <p className="text-light-4 mt-10 text-center w-full">End of users</p>
          ) : isLoading && !creators ? (
            <Loader />
          ) : (
            <GridUserList users={creators.documents} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AllUsers;
