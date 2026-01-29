import  { createContext, useContext, useState, type PropsWithChildren,  } from "react";
import React from "react"

type SearchContextType = {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
};

export const SearchContext = createContext<SearchContextType | null>(null);

export const SearchProvider = ({ children }: PropsWithChildren) => {
  const [search, setSearch] = useState("");

  return (
    <SearchContext.Provider value={{ search, setSearch }}>
      {children}
    </SearchContext.Provider>
  );
};


