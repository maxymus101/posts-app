import React from "react";
import css from "./SearchBox.module.css";
import { useDebouncedCallback } from "use-debounce";

interface SearchBoxProps {
  query: string;
  onSearch: (searchText: string) => void;
}

export default function SearchBox({ query, onSearch }: SearchBoxProps) {
  const handleChange = useDebouncedCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onSearch(e.target.value),
    300
  );

  return (
    <input
      className={css.input}
      defaultValue={query}
      onChange={handleChange}
      type="text"
      placeholder="Search posts"
    />
  );
}
