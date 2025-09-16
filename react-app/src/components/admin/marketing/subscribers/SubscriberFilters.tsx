import React from 'react';
import { Search } from 'lucide-react';
import { FilterStatus, FilterSource } from '../shared/types';

interface SubscriberFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterStatus: FilterStatus;
  setFilterStatus: (status: FilterStatus) => void;
  filterSource: FilterSource;
  setFilterSource: (source: FilterSource) => void;
}

const SubscriberFilters: React.FC<SubscriberFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  filterSource,
  setFilterSource
}) => {
  return (
    <div className="content-card" style={{ marginBottom: '1.5rem' }}>
      <div className="filter-toolbar">
        {/* Search */}
        <div className="search-container">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Suche nach E-Mail, Name oder Firma..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="filter-group">
          <div className="filter-item">
            <label className="filter-label">Status</label>
            <select 
              className="filter-select"
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
            >
              <option value="all">Alle Status</option>
              <option value="confirmed">Bestätigt</option>
              <option value="unconfirmed">Unbestätigt</option>
            </select>
          </div>

          <div className="filter-item">
            <label className="filter-label">Quelle</label>
            <select 
              className="filter-select"
              value={filterSource} 
              onChange={(e) => setFilterSource(e.target.value as FilterSource)}
            >
              <option value="all">Alle Quellen</option>
              <option value="website">Website</option>
              <option value="manual">Manuell</option>
              <option value="import">Import</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriberFilters;
