import React, { useEffect, useState, useMemo } from "react";
import { getAllTags } from "./problemApi";

interface Tag {
  tag: string;
  count: number;
}

interface TagSelectorProps {
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
}

const TagSelector: React.FC<TagSelectorProps> = ({ selectedTags, onTagToggle }) => {
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tags = await getAllTags();
        setAvailableTags(tags);
      } catch (err) {
        console.error("Error fetching tags:", err);
        setAvailableTags([]);
      }
    };

    fetchTags();
  }, []);

  const filteredAndSortedTags = useMemo(() => {
    const filteredTags = availableTags.filter(
      (tag) => 
        tag.tag && 
        tag.tag.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !selectedTags.includes(tag.tag)
    );

    return filteredTags
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [availableTags, searchQuery, selectedTags]);

  const handleTagsChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = event.target.value;
    onTagToggle(selectedOption);
  };

  return (
    <div>
      <label className="text-white font-thin italic">Tags</label>

      <input
        type="text"
        placeholder="Search tags..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-2 my-2 text-black"
      />

      <div
        className="tags-container"
        style={{ maxHeight: "200px", overflowY: "auto" }}
      >
        <select
          id="tags"
          name="tags"
          multiple
          value={selectedTags}
          onChange={handleTagsChange}
          className="w-full p-2 my-2 text-black"
        >
          {filteredAndSortedTags.length === 0 ? (
            <option disabled>No matching tags</option>
          ) : (
            filteredAndSortedTags.map((tag) => (
              <option key={tag.tag} value={tag.tag}>
                {tag.tag}
              </option>
            ))
          )}
        </select>
      </div>

      <div className="selected-tags flex flex-wrap gap-2 mb-3">
        {selectedTags.map((tag, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-blue-500 text-white rounded cursor-pointer"
            style={{
              maxWidth: "100%",
            }}
            onClick={() => onTagToggle(tag)}
          >
            {tag} ✕
          </span>
        ))}
      </div>
    </div>
  );
};

export default TagSelector;