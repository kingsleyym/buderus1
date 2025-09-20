import React, { useState, useEffect } from 'react';
import {
    Search,
    Plus,
    RefreshCw,
    Filter,
    Grid,
    List,
    Eye,
    Edit,
    Trash2,
    Package,
    Building2
} from 'lucide-react';
import { Product, ProductCategory } from '../../../types/ProductNew';
import { mockProducts } from '../../../data/productsMock';
import ProductCreateDialog from './ProductCreateDialog';

const ProductCatalog: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [manufacturerFilter, setManufacturerFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        setLoading(true);
        try {
            // Lade Mock-Daten
            setProducts(mockProducts);
        } catch (error) {
            console.error('Fehler beim Laden der Produkte:', error);
        } finally {
            setLoading(false);
        }
    };

    const getFilteredProducts = () => {
        return products.filter(product => {
            const matchesSearch = !searchTerm ||
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));

            const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
            const matchesManufacturer = manufacturerFilter === 'all' || product.manufacturer.id === manufacturerFilter;
            const matchesStatus = statusFilter === 'all' || 
                (statusFilter === 'active' && product.isActive) ||
                (statusFilter === 'inactive' && !product.isActive) ||
                (statusFilter === 'inStock' && product.availability.inStock) ||
                (statusFilter === 'outOfStock' && !product.availability.inStock);

            return matchesSearch && matchesCategory && matchesManufacturer && matchesStatus;
        });
    };

    const getCategoryCounts = () => {
        const categoryCounts: Record<string, number> = { all: products.length };
        products.forEach(product => {
            categoryCounts[product.category] = (categoryCounts[product.category] || 0) + 1;
        });
        return categoryCounts;
    };

    const getStatusCounts = () => {
        return {
            all: products.length,
            active: products.filter(p => p.isActive).length,
            inactive: products.filter(p => !p.isActive).length,
            inStock: products.filter(p => p.availability.inStock).length,
            outOfStock: products.filter(p => !p.availability.inStock).length
        };
    };

    const getManufacturerCounts = () => {
        const manufacturerCounts: Record<string, number> = { all: products.length };
        products.forEach(product => {
            manufacturerCounts[product.manufacturer.id] = (manufacturerCounts[product.manufacturer.id] || 0) + 1;
        });
        return manufacturerCounts;
    };

    // Product Actions
    const handleProductView = (product: Product) => {
        console.log('View product:', product);
        // TODO: Öffne Product Detail Modal
    };

    const handleProductEdit = (product: Product) => {
        console.log('Edit product:', product);
        // TODO: Öffne Product Edit Modal
    };

    const handleProductDelete = (product: Product) => {
        console.log('Delete product:', product);
        // TODO: Lösche Produkt
    };

    const handleCreateProduct = (newProductData: Partial<Product>) => {
        console.log('Create new product:', newProductData);
        // TODO: Speichere neues Produkt
        // Temporär zu Mock-Daten hinzufügen
        const newProduct = newProductData as Product;
        setProducts(prev => [...prev, newProduct]);
    };

    const categoryLabels: Record<ProductCategory, string> = {
        heatpump: 'Wärmepumpen',
        solar: 'Solar',
        boiler: 'Heizkessel',
        storage: 'Speicher',
        control: 'Steuerungen',
        accessory: 'Zubehör'
    };

    const filteredProducts = getFilteredProducts();
    const categoryCounts = getCategoryCounts();
    const statusCounts = getStatusCounts();
    const manufacturerCounts = getManufacturerCounts();

    return (
        <>
            <div className="dashboard-header">
                <h1 className="dashboard-title">Produktkatalog</h1>
                <p className="dashboard-subtitle">Produktpalette verwalten und organisieren</p>
            </div>

            {/* Header Actions */}
            <div className="content-card" style={{ marginBottom: '1.5rem' }}>
                <div className="card-content" style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <button 
                                className="btn btn-primary"
                                onClick={() => setIsCreateDialogOpen(true)}
                            >
                                <Plus size={16} style={{ marginRight: '8px' }} />
                                Neues Produkt
                            </button>
                            <button className="btn btn-secondary" onClick={loadProducts}>
                                <RefreshCw size={16} style={{ marginRight: '8px' }} />
                                Aktualisieren
                            </button>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            {/* View Mode Toggle */}
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button
                                    className={`btn ${viewMode === 'grid' ? 'btn-primary' : 'btn-secondary'}`}
                                    onClick={() => setViewMode('grid')}
                                    style={{ padding: '0.5rem' }}
                                >
                                    <Grid size={16} />
                                </button>
                                <button
                                    className={`btn ${viewMode === 'list' ? 'btn-primary' : 'btn-secondary'}`}
                                    onClick={() => setViewMode('list')}
                                    style={{ padding: '0.5rem' }}
                                >
                                    <List size={16} />
                                </button>
                            </div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                {filteredProducts.length} von {products.length} Produkten
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="content-card" style={{ marginBottom: '1.5rem' }}>
                <div className="card-header">
                    <h3 className="card-title">
                        <Filter size={18} style={{ marginRight: '8px' }} />
                        Filter & Suche
                    </h3>
                </div>
                <div className="card-content">
                    {/* Search */}
                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <div style={{ position: 'relative' }}>
                            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                            <input
                                type="text"
                                placeholder="Produktname, Modell oder Beschreibung suchen..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ paddingLeft: '40px' }}
                            />
                        </div>
                    </div>

                    {/* Category Filter */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.5rem', marginBottom: '1rem' }}>
                        <button
                            className={`btn ${categoryFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => setCategoryFilter('all')}
                            style={{ fontSize: '0.8rem', padding: '0.5rem' }}
                        >
                            Alle ({categoryCounts.all || 0})
                        </button>
                        {Object.entries(categoryLabels).map(([key, label]) => (
                            <button
                                key={key}
                                className={`btn ${categoryFilter === key ? 'btn-primary' : 'btn-secondary'}`}
                                onClick={() => setCategoryFilter(key)}
                                style={{ fontSize: '0.8rem', padding: '0.5rem' }}
                            >
                                {label} ({categoryCounts[key] || 0})
                            </button>
                        ))}
                    </div>

                    {/* Status Filter */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.5rem', marginBottom: '1rem' }}>
                        {[
                            { value: 'all', label: `Alle (${statusCounts.all})` },
                            { value: 'active', label: `Aktiv (${statusCounts.active})` },
                            { value: 'inactive', label: `Inaktiv (${statusCounts.inactive})` },
                            { value: 'inStock', label: `Lagernd (${statusCounts.inStock})` },
                            { value: 'outOfStock', label: `Nicht lagernd (${statusCounts.outOfStock})` }
                        ].map(filter => (
                            <button
                                key={filter.value}
                                className={`btn ${statusFilter === filter.value ? 'btn-primary' : 'btn-secondary'}`}
                                onClick={() => setStatusFilter(filter.value)}
                                style={{ fontSize: '0.8rem', padding: '0.5rem' }}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>

                    {/* Manufacturer Filter */}
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <button
                            className={`btn ${manufacturerFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => setManufacturerFilter('all')}
                            style={{ fontSize: '0.8rem', padding: '0.5rem' }}
                        >
                            Alle Hersteller
                        </button>
                        {Array.from(new Set(products.map(p => p.manufacturer.id))).map((manufacturerId) => {
                            const manufacturer = products.find(p => p.manufacturer.id === manufacturerId)?.manufacturer;
                            return manufacturer ? (
                                <button
                                    key={manufacturerId}
                                    className={`btn ${manufacturerFilter === manufacturerId ? 'btn-primary' : 'btn-secondary'}`}
                                    onClick={() => setManufacturerFilter(manufacturerId)}
                                    style={{ fontSize: '0.8rem', padding: '0.5rem' }}
                                >
                                    {manufacturer.name} ({manufacturerCounts[manufacturerId] || 0})
                                </button>
                            ) : null;
                        })}
                    </div>
                </div>
            </div>

            {/* Product List */}
            {loading ? (
                <div className="content-card">
                    <div className="card-content">
                        <div style={{ textAlign: 'center', padding: '3rem' }}>
                            <RefreshCw className="spin" size={32} style={{ color: 'var(--text-secondary)' }} />
                            <p>Produkte werden geladen...</p>
                        </div>
                    </div>
                </div>
            ) : filteredProducts.length === 0 ? (
                <div className="content-card">
                    <div className="card-content">
                        <div style={{ textAlign: 'center', padding: '3rem' }}>
                            <Package size={48} style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }} />
                            <h3>Keine Produkte gefunden</h3>
                            <p>Keine Produkte entsprechen den Filterkriterien.</p>
                        </div>
                    </div>
                </div>
            ) : viewMode === 'grid' ? (
                // Grid View (Kachelansicht)
                <div className="content-card">
                    <div className="card-content">
                        <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
                            gap: '1.5rem'
                        }}>
                            {filteredProducts.map(product => (
                                <div key={product.id} className="stat-card" style={{ 
                                    padding: '1.5rem',
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                                }}
                                onClick={() => handleProductView(product)}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '';
                                }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                                        <div style={{
                                            width: '48px',
                                            height: '48px',
                                            borderRadius: '8px',
                                            backgroundColor: 'var(--primary-color)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: 'bold',
                                            fontSize: '1.2rem',
                                            marginRight: '1rem',
                                            color: 'white'
                                        }}>
                                            <Package size={24} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <h4 style={{ margin: '0 0 4px 0', fontWeight: '600' }}>{product.name}</h4>
                                            <p style={{ margin: '0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                                {product.model} • {categoryLabels[product.category]}
                                            </p>
                                        </div>
                                        <div style={{
                                            padding: '4px 8px',
                                            borderRadius: '12px',
                                            fontSize: '0.8rem',
                                            fontWeight: '500',
                                            backgroundColor: product.isActive ? '#28A74520' : '#DC354520',
                                            color: product.isActive ? '#28A745' : '#DC3545'
                                        }}>
                                            {product.isActive ? 'Aktiv' : 'Inaktiv'}
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
                                        <p style={{ margin: '0 0 8px 0', color: 'var(--text-secondary)' }}>
                                            {product.description}
                                        </p>
                                        
                                        <div style={{ marginBottom: '4px', display: 'flex', alignItems: 'center' }}>
                                            <Building2 size={12} style={{ marginRight: '6px', color: 'var(--text-secondary)' }} />
                                            <span>{product.manufacturer.name}</span>
                                        </div>
                                        
                                        <div style={{ marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ color: 'var(--text-secondary)' }}>Preis:</span>
                                            <span style={{ fontWeight: '600', color: 'var(--primary-color)' }}>
                                                {product.pricing.retail.toLocaleString('de-DE')} {product.pricing.currency}
                                            </span>
                                        </div>
                                        
                                        {product.availability.inStock && (
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={{ color: 'var(--text-secondary)' }}>Lager:</span>
                                                <span style={{ color: '#28A745', fontWeight: '500' }}>
                                                    {product.availability.quantity} Stück
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }} onClick={(e) => e.stopPropagation()}>
                                        <button 
                                            className="btn btn-secondary"
                                            onClick={() => handleProductView(product)}
                                            style={{ fontSize: '0.8rem', padding: '0.5rem 0.75rem' }}
                                        >
                                            <Eye size={14} style={{ marginRight: '4px' }} />
                                            Details
                                        </button>

                                        <button 
                                            className="btn btn-secondary"
                                            onClick={() => handleProductEdit(product)}
                                            style={{ fontSize: '0.8rem', padding: '0.5rem 0.75rem' }}
                                        >
                                            <Edit size={14} style={{ marginRight: '4px' }} />
                                            Bearbeiten
                                        </button>

                                        <button 
                                            className="btn btn-secondary"
                                            onClick={() => handleProductDelete(product)}
                                            style={{ 
                                                fontSize: '0.8rem', 
                                                padding: '0.5rem 0.75rem',
                                                color: 'var(--danger-color)',
                                                borderColor: 'var(--danger-color)'
                                            }}
                                        >
                                            <Trash2 size={14} style={{ marginRight: '4px' }} />
                                            Löschen
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                // List View - Responsive Listenansicht
                <div className="content-card">
                    <div className="card-content" style={{ padding: '0', overflowX: 'auto' }}>
                        {/* Desktop Table Header */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '60px 1fr 150px 120px 150px 120px 200px',
                            gap: '1rem',
                            padding: '1rem',
                            borderBottom: '1px solid var(--border-color)',
                            backgroundColor: 'var(--background-secondary)',
                            fontWeight: '600',
                            fontSize: '0.9rem',
                            color: 'var(--text-secondary)',
                            minWidth: '1000px'
                        }}>
                            <div></div>
                            <div>PRODUKT</div>
                            <div>KATEGORIE</div>
                            <div>HERSTELLER</div>
                            <div>PREIS</div>
                            <div>LAGER</div>
                            <div style={{ textAlign: 'center' }}>AKTIONEN</div>
                        </div>

                        {/* Product Rows */}
                        {filteredProducts.map(product => (
                            <div key={product.id} style={{
                                display: 'grid',
                                gridTemplateColumns: '60px 1fr 150px 120px 150px 120px 200px',
                                gap: '1rem',
                                padding: '1rem',
                                borderBottom: '1px solid var(--border-color)',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s ease',
                                minWidth: '1000px'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--background-secondary)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            onClick={() => handleProductView(product)}
                            >
                                {/* Icon */}
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '8px',
                                        backgroundColor: 'var(--primary-color)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white'
                                    }}>
                                        <Package size={20} />
                                    </div>
                                </div>

                                {/* Product Info */}
                                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <div style={{ fontWeight: '600', marginBottom: '2px' }}>{product.name}</div>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{product.model}</div>
                                </div>

                                {/* Category */}
                                <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.9rem' }}>
                                    {categoryLabels[product.category]}
                                </div>

                                {/* Manufacturer */}
                                <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.9rem' }}>
                                    {product.manufacturer.name}
                                </div>

                                {/* Price */}
                                <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.9rem', fontWeight: '600', color: 'var(--primary-color)' }}>
                                    {product.pricing.retail.toLocaleString('de-DE')} {product.pricing.currency}
                                </div>

                                {/* Stock */}
                                <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.9rem' }}>
                                    {product.availability.inStock ? (
                                        <span style={{ color: '#28A745', fontWeight: '500' }}>
                                            {product.availability.quantity} Stück
                                        </span>
                                    ) : (
                                        <span style={{ color: 'var(--danger-color)' }}>Nicht verfügbar</span>
                                    )}
                                </div>

                                {/* Actions */}
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }} onClick={(e) => e.stopPropagation()}>
                                    <button 
                                        className="btn btn-secondary"
                                        onClick={() => handleProductView(product)}
                                        style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem' }}
                                    >
                                        <Eye size={12} />
                                    </button>
                                    <button 
                                        className="btn btn-secondary"
                                        onClick={() => handleProductEdit(product)}
                                        style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem' }}
                                    >
                                        <Edit size={12} />
                                    </button>
                                    <button 
                                        className="btn btn-secondary"
                                        onClick={() => handleProductDelete(product)}
                                        style={{ 
                                            fontSize: '0.7rem', 
                                            padding: '0.25rem 0.5rem',
                                            color: 'var(--danger-color)',
                                            borderColor: 'var(--danger-color)'
                                        }}
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Product Create Dialog */}
            <ProductCreateDialog
                isOpen={isCreateDialogOpen}
                onClose={() => setIsCreateDialogOpen(false)}
                onSave={handleCreateProduct}
            />
        </>
    );
};

export default ProductCatalog;
