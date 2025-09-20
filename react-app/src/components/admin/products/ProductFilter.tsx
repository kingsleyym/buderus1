import React, { useState } from 'react';
import { X, Filter, RotateCcw } from 'lucide-react';
import { ProductCategory } from '../../../types/ProductNew';

interface ProductFilterProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterOptions) => void;
  onReset: () => void;
}

export interface FilterOptions {
  categories: ProductCategory[];
  manufacturers: string[];
  priceRange: {
    min: number;
    max: number;
  };
  inStockOnly: boolean;
  activeOnly: boolean;
}

const CATEGORY_OPTIONS = [
  { value: 'heatpump', label: 'Wärmepumpen', icon: '🔥' },
  { value: 'solar', label: 'Solar', icon: '☀️' },
  { value: 'boiler', label: 'Heizkessel', icon: '🏠' },
  { value: 'storage', label: 'Speicher', icon: '📦' },
  { value: 'control', label: 'Steuerungen', icon: '🎛️' },
  { value: 'accessory', label: 'Zubehör', icon: '🔧' }
] as const;

const MANUFACTURER_OPTIONS = [
  { value: 'buderus', label: 'Buderus' },
  { value: 'viessmann', label: 'Viessmann' }
];

const ProductFilter: React.FC<ProductFilterProps> = ({
  isOpen,
  onClose,
  onApply,
  onReset
}) => {
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    manufacturers: [],
    priceRange: { min: 0, max: 50000 },
    inStockOnly: false,
    activeOnly: true
  });

  const handleCategoryChange = (category: ProductCategory) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handleManufacturerChange = (manufacturer: string) => {
    setFilters(prev => ({
      ...prev,
      manufacturers: prev.manufacturers.includes(manufacturer)
        ? prev.manufacturers.filter(m => m !== manufacturer)
        : [...prev.manufacturers, manufacturer]
    }));
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters: FilterOptions = {
      categories: [],
      manufacturers: [],
      priceRange: { min: 0, max: 50000 },
      inStockOnly: false,
      activeOnly: true
    };
    setFilters(resetFilters);
    onReset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal admin-modal-md">
        {/* Header */}
        <div className="admin-modal-header">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-buderus-blue" />
            <h2 className="admin-modal-title">Produktfilter</h2>
          </div>
          <button onClick={onClose} className="admin-modal-close">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="admin-modal-content space-y-6">
          
          {/* Kategorien */}
          <div className="admin-form-section">
            <label className="admin-form-label">Kategorien</label>
            <div className="grid grid-cols-2 gap-3">
              {CATEGORY_OPTIONS.map((category) => (
                <label key={category.value} className="admin-checkbox-label">
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(category.value as ProductCategory)}
                    onChange={() => handleCategoryChange(category.value as ProductCategory)}
                    className="admin-checkbox"
                  />
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{category.icon}</span>
                    <span>{category.label}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Hersteller */}
          <div className="admin-form-section">
            <label className="admin-form-label">Hersteller</label>
            <div className="space-y-2">
              {MANUFACTURER_OPTIONS.map((manufacturer) => (
                <label key={manufacturer.value} className="admin-checkbox-label">
                  <input
                    type="checkbox"
                    checked={filters.manufacturers.includes(manufacturer.value)}
                    onChange={() => handleManufacturerChange(manufacturer.value)}
                    className="admin-checkbox"
                  />
                  <span>{manufacturer.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Preisbereich */}
          <div className="admin-form-section">
            <label className="admin-form-label">Preisbereich (EUR)</label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="admin-form-sublabel">Von</label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={filters.priceRange.min}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    priceRange: { ...prev.priceRange, min: Number(e.target.value) }
                  }))}
                  className="admin-form-input"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="admin-form-sublabel">Bis</label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={filters.priceRange.max}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    priceRange: { ...prev.priceRange, max: Number(e.target.value) }
                  }))}
                  className="admin-form-input"
                  placeholder="50000"
                />
              </div>
            </div>
          </div>

          {/* Status Filter */}
          <div className="admin-form-section">
            <label className="admin-form-label">Status</label>
            <div className="space-y-2">
              <label className="admin-checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.activeOnly}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    activeOnly: e.target.checked
                  }))}
                  className="admin-checkbox"
                />
                <span>Nur aktive Produkte</span>
              </label>
              
              <label className="admin-checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.inStockOnly}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    inStockOnly: e.target.checked
                  }))}
                  className="admin-checkbox"
                />
                <span>Nur verfügbare Produkte</span>
              </label>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="admin-modal-footer">
          <button onClick={handleReset} className="admin-btn-secondary">
            <RotateCcw className="w-4 h-4" />
            Zurücksetzen
          </button>
          <div className="flex space-x-2">
            <button onClick={onClose} className="admin-btn-secondary">
              Abbrechen
            </button>
            <button onClick={handleApply} className="admin-btn-primary">
              <Filter className="w-4 h-4" />
              Filter anwenden
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFilter;
