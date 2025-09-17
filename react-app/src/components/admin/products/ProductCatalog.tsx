// Produktkatalog-Verwaltung für Admin-Bereich
import React, { useState, useEffect } from 'react';
import { Product, ProductCategory, ProductFilters } from '../../../types/Product';
import buderusProducts from '../../../data/buderusProducts';
import viessmannProducts from '../../../data/viessmannProducts';
import { formatPrice, getProductDisplayName, getAvailableQuantity } from '../../../types/Product';

interface ProductCatalogProps {}

const ProductCatalog: React.FC<ProductCatalogProps> = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<ProductFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Alle Produkte laden
  useEffect(() => {
    const allProducts = [...buderusProducts, ...viessmannProducts];
    setProducts(allProducts);
    setFilteredProducts(allProducts);
  }, []);

  // Filterung anwenden
  useEffect(() => {
    let filtered = products;

    // Nach Suchbegriff filtern
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.manufacturer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Nach Kategorie filtern
    if (filters.category) {
      filtered = filtered.filter(product => product.category === filters.category);
    }

    // Nach Hersteller filtern
    if (filters.manufacturer) {
      filtered = filtered.filter(product => product.manufacturer.id === filters.manufacturer);
    }

    // Nach Verfügbarkeit filtern
    if (filters.inStock) {
      filtered = filtered.filter(product => getAvailableQuantity(product) > 0);
    }

    // Nach Förderung filtern
    if (filters.fundingEligible) {
      filtered = filtered.filter(product => product.eligible.bafaFunding || product.eligible.kfwFunding);
    }

    // Nach Preisbereich filtern
    if (filters.priceRange) {
      filtered = filtered.filter(product => 
        product.pricing.salesPrice >= (filters.priceRange?.min || 0) &&
        product.pricing.salesPrice <= (filters.priceRange?.max || Infinity)
      );
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, filters]);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setShowDetails(true);
  };

  const getStockStatus = (product: Product) => {
    const available = getAvailableQuantity(product);
    if (available <= 0) return { status: 'Nicht verfügbar', color: 'text-red-600' };
    if (available <= product.inventory.minStock) return { status: 'Niedrig', color: 'text-orange-600' };
    return { status: 'Verfügbar', color: 'text-green-600' };
  };

  const getHeatPumpTypeLabel = (type: string) => {
    const labels = {
      'air_water': 'Luft-Wasser',
      'ground_water': 'Sole-Wasser',
      'water_water': 'Wasser-Wasser',
      'air_air': 'Luft-Luft'
    };
    return labels[type as keyof typeof labels] || type;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Produktkatalog</h1>
          <p className="text-gray-600">Verwaltung der Buderus & Viessmann Produkte</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Neues Produkt
        </button>
      </div>

      {/* Filter & Suche */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          {/* Suchfeld */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Suche
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Produktname, SKU, Hersteller..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

          {/* Kategorie Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kategorie
            </label>
            <select
              value={filters.category || ''}
              onChange={(e) => setFilters({...filters, category: e.target.value as ProductCategory || undefined})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="">Alle Kategorien</option>
              <option value="heat_pump">Wärmepumpen</option>
              <option value="solar_pv">PV-Anlagen</option>
              <option value="solar_thermal">Solarthermie</option>
            </select>
          </div>

          {/* Hersteller Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hersteller
            </label>
            <select
              value={filters.manufacturer || ''}
              onChange={(e) => setFilters({...filters, manufacturer: e.target.value || undefined})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="">Alle Hersteller</option>
              <option value="buderus">Buderus</option>
              <option value="viessmann">Viessmann</option>
            </select>
          </div>

          {/* Verfügbarkeit Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.inStock || false}
                  onChange={(e) => setFilters({...filters, inStock: e.target.checked || undefined})}
                  className="mr-2"
                />
                Nur verfügbare
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.fundingEligible || false}
                  onChange={(e) => setFilters({...filters, fundingEligible: e.target.checked || undefined})}
                  className="mr-2"
                />
                Förderungsfähig
              </label>
            </div>
          </div>
        </div>

        {/* Statistiken */}
        <div className="border-t pt-4">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{filteredProducts.length}</div>
              <div className="text-sm text-gray-600">Produkte</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {filteredProducts.filter(p => getAvailableQuantity(p) > 0).length}
              </div>
              <div className="text-sm text-gray-600">Verfügbar</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {filteredProducts.filter(p => p.eligible.bafaFunding).length}
              </div>
              <div className="text-sm text-gray-600">BAFA-fähig</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {formatPrice(filteredProducts.reduce((sum, p) => sum + p.pricing.salesPrice * getAvailableQuantity(p), 0))}
              </div>
              <div className="text-sm text-gray-600">Lagerwert</div>
            </div>
          </div>
        </div>
      </div>

      {/* Produktliste */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produkt
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Typ & Leistung
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Preise
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lager
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aktionen
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product);
                return (
                  <tr 
                    key={product.id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleProductClick(product)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <img 
                            className="h-12 w-12 rounded-lg object-cover" 
                            src={product.images[0] || '/assets/placeholder-product.png'} 
                            alt={product.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {getProductDisplayName(product)}
                          </div>
                          <div className="text-sm text-gray-500">
                            SKU: {product.sku}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.specifications.heatPump && (
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {getHeatPumpTypeLabel(product.specifications.heatPump.type)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {product.specifications.heatPump.heatingCapacity} kW
                          </div>
                          <div className="text-sm text-gray-500">
                            JAZ: {product.specifications.heatPump.jahresarbeitszahl}
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          VK: {formatPrice(product.pricing.salesPrice)}
                        </div>
                        <div className="text-sm text-gray-500">
                          EK: {formatPrice(product.pricing.purchasePrice)}
                        </div>
                        <div className="text-sm text-green-600">
                          {product.pricing.margin.toFixed(1)}% Marge
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {getAvailableQuantity(product)} verfügbar
                        </div>
                        <div className="text-sm text-gray-500">
                          {product.inventory.reserved} reserviert
                        </div>
                        <div className="text-sm text-gray-500">
                          LZ: {product.inventory.leadTime} Tage
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <span className={`text-sm font-medium ${stockStatus.color}`}>
                          {stockStatus.status}
                        </span>
                        {product.eligible.bafaFunding && (
                          <div className="text-xs text-blue-600">BAFA</div>
                        )}
                        {product.eligible.kfwFunding && (
                          <div className="text-xs text-purple-600">KfW</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProductClick(product);
                        }}
                      >
                        Details
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        Bearbeiten
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Produkt-Details Modal */}
      {showDetails && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {getProductDisplayName(selectedProduct)}
              </h2>
              <button 
                onClick={() => setShowDetails(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Produktinfo */}
              <div>
                <h3 className="font-semibold mb-2">Produktinformationen</h3>
                <div className="space-y-2 text-sm">
                  <div><strong>SKU:</strong> {selectedProduct.sku}</div>
                  <div><strong>Beschreibung:</strong> {selectedProduct.description}</div>
                  <div><strong>Kategorie:</strong> {selectedProduct.category}</div>
                  
                  {selectedProduct.specifications.heatPump && (
                    <>
                      <div><strong>Typ:</strong> {getHeatPumpTypeLabel(selectedProduct.specifications.heatPump.type)}</div>
                      <div><strong>Heizleistung:</strong> {selectedProduct.specifications.heatPump.heatingCapacity} kW</div>
                      <div><strong>JAZ:</strong> {selectedProduct.specifications.heatPump.jahresarbeitszahl}</div>
                      <div><strong>Max. Vorlauf:</strong> {selectedProduct.specifications.heatPump.maxFlowTemperature}°C</div>
                      <div><strong>Kältemittel:</strong> {selectedProduct.specifications.heatPump.refrigerant}</div>
                      <div><strong>Schallpegel:</strong> {selectedProduct.specifications.heatPump.soundLevel} dB(A)</div>
                    </>
                  )}
                </div>
              </div>

              {/* Preise & Lager */}
              <div>
                <h3 className="font-semibold mb-2">Preise & Verfügbarkeit</h3>
                <div className="space-y-2 text-sm">
                  <div><strong>Verkaufspreis:</strong> {formatPrice(selectedProduct.pricing.salesPrice)}</div>
                  <div><strong>Einkaufspreis:</strong> {formatPrice(selectedProduct.pricing.purchasePrice)}</div>
                  <div><strong>Marge:</strong> {selectedProduct.pricing.margin.toFixed(1)}%</div>
                  <div><strong>Verfügbar:</strong> {getAvailableQuantity(selectedProduct)} Stück</div>
                  <div><strong>Reserviert:</strong> {selectedProduct.inventory.reserved} Stück</div>
                  <div><strong>Lieferzeit:</strong> {selectedProduct.inventory.leadTime} Tage</div>
                </div>

                <h3 className="font-semibold mb-2 mt-4">Förderungen</h3>
                <div className="space-y-1 text-sm">
                  {selectedProduct.eligible.bafaFunding && <div className="text-blue-600">✓ BAFA-förderfähig</div>}
                  {selectedProduct.eligible.kfwFunding && <div className="text-purple-600">✓ KfW-förderfähig</div>}
                  {selectedProduct.eligible.certifications.map(cert => (
                    <div key={cert} className="text-green-600">✓ {cert}</div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex space-x-3">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Zu Lead hinzufügen
              </button>
              <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
                Bearbeiten
              </button>
              <button 
                onClick={() => setShowDetails(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Schließen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCatalog;
