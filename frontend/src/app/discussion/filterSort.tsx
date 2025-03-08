import React, { useState } from 'react';

export interface Filter {
  sort: 'latest' | 'popular';
  tag: string;
}

interface FilterSortProps {
  filter: Filter;
  onFilterChange: (filter: Filter) => void;
}

const FilterSort: React.FC<FilterSortProps> = ({ filter, onFilterChange }) => {
  const [sort, setSort] = useState<Filter['sort']>(filter.sort);
  const [tag, setTag] = useState<Filter['tag']>(filter.tag);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSort(e.target.value as Filter['sort']);
    onFilterChange({ sort: e.target.value as Filter['sort'], tag });
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTag(e.target.value);
    onFilterChange({ sort, tag: e.target.value });
  };

  return (
    <div>
      <select
        value={sort}
        onChange={handleSortChange}
      >
        <option value="latest">Latest</option>
        <option value="popular">Popular</option>
      </select>
      <input
        type="text"
        value={tag}
        onChange={handleTagChange}
        placeholder="Filter with Tags"
      />
    </div>
  );
};

export default FilterSort;
