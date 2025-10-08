
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { JobFilter, JobStatus } from "@/types";

interface FilterBarProps {
  filter: JobFilter;
  onFilterChange: (filter: JobFilter) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ filter, onFilterChange }) => {
  const handleStatusChange = (value: string) => {
    onFilterChange({
      ...filter,
      status: value === "all" ? undefined : (value as JobStatus),
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filter,
      search: e.target.value,
    });
  };

  const handleSortChange = (value: string) => {
    const [sortBy, sortDirection] = value.split("-") as [
      "dateApplied" | "companyName" | "lastUpdated",
      "asc" | "desc"
    ];
    
    onFilterChange({
      ...filter,
      sortBy,
      sortDirection,
    });
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search company or job title..."
          className="pl-10"
          value={filter.search || ""}
          onChange={handleSearchChange}
        />
      </div>
      
      <div className="flex gap-2">
        <Select 
          value={filter.status || "all"}
          onValueChange={handleStatusChange}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="interested">Interested</SelectItem>
            <SelectItem value="applied">Applied</SelectItem>
            <SelectItem value="interview">Interview</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="offer">Offer</SelectItem>
          </SelectContent>
        </Select>
        
        <Select 
          value={`${filter.sortBy || "dateApplied"}-${filter.sortDirection || "desc"}`}
          onValueChange={handleSortChange}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dateApplied-desc">Newest First</SelectItem>
            <SelectItem value="dateApplied-asc">Oldest First</SelectItem>
            <SelectItem value="companyName-asc">Company (A-Z)</SelectItem>
            <SelectItem value="companyName-desc">Company (Z-A)</SelectItem>
            <SelectItem value="lastUpdated-desc">Recently Updated</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default FilterBar;
