import React, { useState, useEffect } from 'react';
import {
    X,
    ChevronRight,
    ChevronLeft,
    Save,
    ArrowLeft,
    Package,
    Thermometer,
    Sun,
    Database,
    Settings,
    Wrench,
    Check
} from 'lucide-react';
import { Product, ProductCategory, ProductManufacturer } from '../../../types/ProductNew';

interface ProductCreateDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (product: Partial<Product>) => void;
}

interface StepProps {
    currentStep: number;
    totalSteps: number;
}

// Kategorie-Icons und Labels
const categoryConfig = {
    heatpump: {
        icon: Thermometer,
        label: 'Wärmepumpe',
        description: 'Luft-, Wasser- oder Erdwärmepumpen',
        color: '#E74C3C'
    },
    solar: {
        icon: Sun,
        label: 'Solar',
        description: 'Solarthermie und Photovoltaik',
        color: '#F39C12'
    },
    storage: {
        icon: Database,
        label: 'Speicher',
        description: 'Warmwasserspeicher und Pufferspeicher',
        color: '#3498DB'
    },
    control: {
        icon: Settings,
        label: 'Steuerung',
        description: 'Regelungen und Smart-Home Integration',
        color: '#9B59B6'
    },
    accessory: {
        icon: Wrench,
        label: 'Zubehör',
        description: 'Montage-Material, Schrauben, Rohre etc.',
        color: '#2ECC71'
    },
    boiler: {
        icon: Package,
        label: 'Heizkessel',
        description: 'Gas-, Öl- und Brennstoffkessel',
        color: '#E67E22'
    }
};

// Verfügbare Hersteller
const manufacturers: ProductManufacturer[] = [
    { id: 'buderus', name: 'Buderus', brand: 'Buderus' },
    { id: 'viessmann', name: 'Viessmann', brand: 'Viessmann' },
    { id: 'vaillant', name: 'Vaillant', brand: 'Vaillant' },
    { id: 'wolf', name: 'Wolf', brand: 'Wolf' },
    { id: 'daikin', name: 'Daikin', brand: 'Daikin' },
    { id: 'mitsubishi', name: 'Mitsubishi', brand: 'Mitsubishi' },
    { id: 'bosch', name: 'Bosch', brand: 'Bosch' }
];

const ProductCreateDialog: React.FC<ProductCreateDialogProps> = ({ isOpen, onClose, onSave }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(null);
    const [selectedManufacturer, setSelectedManufacturer] = useState<ProductManufacturer | null>(null);
    const [productData, setProductData] = useState<Partial<Product>>({
        name: '',
        model: '',
        description: '',
        type: 'main_product',
        isActive: true,
        pricing: {
            retail: 0,
            wholesale: 0,
            currency: 'EUR'
        },
        availability: {
            inStock: true,
            quantity: 0,
            leadTime: '1-2 Wochen'
        }
    });

    // Separate state für technische Daten
    const [heatPumpData, setHeatPumpData] = useState({
        heatPumpType: '',
        heatingCapacityA7W35: 0,
        heatingCapacityA2W35: 0,
        heatingCapacityAMinus7W35: 0,
        copA7W35: 0,
        copA2W35: 0,
        copAMinus7W35: 0,
        scop: 0,
        energyLabel: '',
        refrigerant: '',
        soundLevelOutdoor: 0,
        maxFlowTemperature: 0
    });

    const [solarData, setSolarData] = useState({
        solarType: '',
        nominalPower: 0,
        efficiency: 0,
        cellType: '',
        voltageOpenCircuit: 0,
        currentShortCircuit: 0,
        collectorArea: 0,
        absorberArea: 0,
        fluidVolume: 0,
        maxPressure: 0,
        width: 0,
        height: 0,
        thickness: 0,
        weight: 0
    });

    const totalSteps = 4;

    // Reset bei Schließen
    useEffect(() => {
        if (!isOpen) {
            setCurrentStep(1);
            setSelectedCategory(null);
            setSelectedManufacturer(null);
            setProductData({
                name: '',
                model: '',
                description: '',
                type: 'main_product',
                isActive: true,
                pricing: {
                    retail: 0,
                    wholesale: 0,
                    currency: 'EUR'
                },
                availability: {
                    inStock: true,
                    quantity: 0,
                    leadTime: '1-2 Wochen'
                }
            });
            setHeatPumpData({
                heatPumpType: '',
                heatingCapacityA7W35: 0,
                heatingCapacityA2W35: 0,
                heatingCapacityAMinus7W35: 0,
                copA7W35: 0,
                copA2W35: 0,
                copAMinus7W35: 0,
                scop: 0,
                energyLabel: '',
                refrigerant: '',
                soundLevelOutdoor: 0,
                maxFlowTemperature: 0
            });
            setSolarData({
                solarType: '',
                nominalPower: 0,
                efficiency: 0,
                cellType: '',
                voltageOpenCircuit: 0,
                currentShortCircuit: 0,
                collectorArea: 0,
                absorberArea: 0,
                fluidVolume: 0,
                maxPressure: 0,
                width: 0,
                height: 0,
                thickness: 0,
                weight: 0
            });
        }
    }, [isOpen]);

    const handleNext = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleCategorySelect = (category: ProductCategory) => {
        setSelectedCategory(category);
        setProductData(prev => ({ ...prev, category }));
        handleNext();
    };

    const handleManufacturerSelect = (manufacturer: ProductManufacturer) => {
        setSelectedManufacturer(manufacturer);
        setProductData(prev => ({ ...prev, manufacturer }));
        handleNext();
    };

    const handleSave = () => {
        if (selectedCategory && selectedManufacturer && productData.name && productData.model) {
            let technicalData: any = undefined;

            // Erstelle technische Daten basierend auf Kategorie
            if (selectedCategory === 'heatpump') {
                technicalData = {
                    heatPumpType: heatPumpData.heatPumpType as any,
                    performance: {
                        heatingCapacity: {
                            at7_35: heatPumpData.heatingCapacityA7W35,
                            at2_35: heatPumpData.heatingCapacityA2W35,
                            atMinus7_35: heatPumpData.heatingCapacityAMinus7W35
                        },
                        cop: {
                            at7_35: heatPumpData.copA7W35,
                            at2_35: heatPumpData.copA2W35,
                            atMinus7_35: heatPumpData.copAMinus7W35
                        },
                        scop: heatPumpData.scop
                    },
                    energyLabel: heatPumpData.energyLabel,
                    refrigerant: {
                        type: heatPumpData.refrigerant,
                        amount: 0,
                        gwp: 0
                    },
                    soundLevel: {
                        outdoor: heatPumpData.soundLevelOutdoor
                    },
                    operatingLimits: {
                        water: {
                            heating: { min: 25, max: heatPumpData.maxFlowTemperature }
                        }
                    }
                };
            } else if (selectedCategory === 'solar') {
                technicalData = {
                    solarType: solarData.solarType as any,
                    ...(solarData.solarType === 'photovoltaic' ? {
                        photovoltaic: {
                            nominalPower: solarData.nominalPower,
                            efficiency: solarData.efficiency,
                            cellType: solarData.cellType,
                            electricalData: {
                                voltage: {
                                    openCircuit: solarData.voltageOpenCircuit,
                                    maxPower: 0
                                },
                                current: {
                                    shortCircuit: solarData.currentShortCircuit,
                                    maxPower: 0
                                }
                            }
                        }
                    } : {}),
                    ...(solarData.solarType === 'thermal' ? {
                        thermal: {
                            collectorArea: solarData.collectorArea,
                            absorberArea: solarData.absorberArea,
                            efficiency: solarData.efficiency,
                            fluidData: {
                                volume: solarData.fluidVolume,
                                maxPressure: solarData.maxPressure,
                                antifreeze: ''
                            }
                        }
                    } : {}),
                    dimensions: {
                        width: solarData.width,
                        height: solarData.height,
                        thickness: solarData.thickness,
                        weight: solarData.weight
                    }
                };
            }

            const newProduct: Partial<Product> = {
                ...productData,
                id: `prod_${Date.now()}`,
                category: selectedCategory,
                manufacturer: selectedManufacturer,
                technicalData,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            onSave(newProduct);
            onClose();
        }
    };

    const handleInputChange = (field: string, value: any) => {
        setProductData(prev => ({ ...prev, [field]: value }));
    };

    const handlePricingChange = (field: string, value: number) => {
        setProductData(prev => ({
            ...prev,
            pricing: { ...prev.pricing!, [field]: value }
        }));
    };

    const handleAvailabilityChange = (field: string, value: any) => {
        setProductData(prev => ({
            ...prev,
            availability: { ...prev.availability!, [field]: value }
        }));
    };

    const handleHeatPumpDataChange = (field: string, value: any) => {
        setHeatPumpData(prev => ({ ...prev, [field]: value }));
    };

    const handleSolarDataChange = (field: string, value: any) => {
        setSolarData(prev => ({ ...prev, [field]: value }));
    };

    if (!isOpen) return null;

    const StepIndicator: React.FC<StepProps> = ({ currentStep, totalSteps }) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
                <React.Fragment key={step}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: step <= currentStep ? 'var(--primary-color)' : 'var(--border-color)',
                        color: step <= currentStep ? 'white' : 'var(--text-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '600',
                        fontSize: '0.9rem'
                    }}>
                        {step < currentStep ? <Check size={20} /> : step}
                    </div>
                    {step < totalSteps && (
                        <div style={{
                            flex: 1,
                            height: '2px',
                            backgroundColor: step < currentStep ? 'var(--primary-color)' : 'var(--border-color)',
                            borderRadius: '1px'
                        }} />
                    )}
                </React.Fragment>
            ))}
        </div>
    );

    return (
        <div style={{
            position: 'fixed',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            {/* Full-Screen Dialog */}
            <div style={{
                width: '95vw',
                height: '95vh',
                backgroundColor: 'white',
                borderRadius: '12px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
            }}>
                {/* Header */}
                <div style={{
                    padding: '1.5rem 2rem',
                    borderBottom: '1px solid #e0e0e0',
                    backgroundColor: '#f8f9fa',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button
                            onClick={onClose}
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '0.5rem',
                                borderRadius: '6px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                color: 'var(--text-secondary)',
                                fontSize: '0.9rem'
                            }}
                        >
                            <ArrowLeft size={20} />
                            Zurück zum Katalog
                        </button>
                    </div>

                    <h1 style={{
                        margin: '0',
                        fontSize: '1.5rem',
                        fontWeight: '600',
                        color: '#333'
                    }}>
                        Neues Produkt erstellen
                    </h1>

                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '0.5rem',
                            borderRadius: '6px',
                            color: 'var(--text-secondary)'
                        }}
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div style={{
                    flex: 1,
                    padding: '2rem',
                    overflowY: 'auto'
                }}>
                    <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />

                    {/* Step 1: Kategorie auswählen */}
                    {currentStep === 1 && (
                        <div>
                            <h2 style={{ marginBottom: '1rem', fontSize: '1.3rem' }}>Produktkategorie auswählen</h2>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                                Wählen Sie die passende Kategorie für Ihr neues Produkt
                            </p>

                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                                gap: '1.5rem'
                            }}>
                                {Object.entries(categoryConfig).map(([key, config]) => {
                                    const IconComponent = config.icon;
                                    return (
                                        <div
                                            key={key}
                                            onClick={() => handleCategorySelect(key as ProductCategory)}
                                            style={{
                                                padding: '2rem',
                                                border: '2px solid var(--border-color)',
                                                borderRadius: '12px',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease',
                                                backgroundColor: 'var(--background-primary)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '1rem'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.borderColor = config.color;
                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                                e.currentTarget.style.boxShadow = `0 8px 25px ${config.color}20`;
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.borderColor = 'var(--border-color)';
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.boxShadow = 'none';
                                            }}
                                        >
                                            <div style={{
                                                width: '60px',
                                                height: '60px',
                                                borderRadius: '12px',
                                                backgroundColor: config.color,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'white'
                                            }}>
                                                <IconComponent size={28} />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>{config.label}</h3>
                                                <p style={{ margin: '0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                                    {config.description}
                                                </p>
                                            </div>
                                            <ChevronRight size={24} style={{ color: 'var(--text-secondary)' }} />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Step 2: Hersteller auswählen */}
                    {currentStep === 2 && selectedCategory && (
                        <div>
                            <h2 style={{ marginBottom: '1rem', fontSize: '1.3rem' }}>Hersteller auswählen</h2>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                                Kategorie: <strong>{categoryConfig[selectedCategory].label}</strong> - Wählen Sie den Hersteller
                            </p>

                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                                gap: '1rem'
                            }}>
                                {manufacturers.map((manufacturer) => (
                                    <div
                                        key={manufacturer.id}
                                        onClick={() => handleManufacturerSelect(manufacturer)}
                                        style={{
                                            padding: '1.5rem',
                                            border: '2px solid var(--border-color)',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            backgroundColor: 'var(--background-primary)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.borderColor = 'var(--primary-color)';
                                            e.currentTarget.style.backgroundColor = 'var(--background-secondary)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.borderColor = 'var(--border-color)';
                                            e.currentTarget.style.backgroundColor = 'var(--background-primary)';
                                        }}
                                    >
                                        <div>
                                            <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem' }}>{manufacturer.name}</h3>
                                            <p style={{ margin: '0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                                {manufacturer.brand}
                                            </p>
                                        </div>
                                        <ChevronRight size={20} style={{ color: 'var(--text-secondary)' }} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 3: Produktdetails */}
                    {currentStep === 3 && selectedCategory && selectedManufacturer && (
                        <div>
                            <h2 style={{ marginBottom: '1rem', fontSize: '1.3rem' }}>Produktdetails eingeben</h2>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                                {categoryConfig[selectedCategory].label} von <strong>{selectedManufacturer.name}</strong>
                            </p>

                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '2rem',
                                maxWidth: '1200px'
                            }}>
                                {/* Basis-Produktdaten */}
                                <div className="form-group">
                                    <label>Produktname *</label>
                                    <input
                                        type="text"
                                        value={productData.name || ''}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        placeholder={`z.B. ${selectedManufacturer.name} Wärmepumpe XL`}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Modellnummer *</label>
                                    <input
                                        type="text"
                                        value={productData.model || ''}
                                        onChange={(e) => handleInputChange('model', e.target.value)}
                                        placeholder="z.B. WP-2024-15kW"
                                    />
                                </div>

                                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                    <label>Beschreibung</label>
                                    <textarea
                                        value={productData.description || ''}
                                        onChange={(e) => handleInputChange('description', e.target.value)}
                                        placeholder="Kurze Beschreibung des Produkts..."
                                        rows={3}
                                    />
                                </div>

                                {/* Kategorie-spezifische Felder für Wärmepumpen */}
                                {selectedCategory === 'heatpump' && (
                                    <>
                                        <div style={{ gridColumn: '1 / -1', margin: '2rem 0 1rem 0' }}>
                                            <h3 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>
                                                Technische Daten - Wärmepumpe
                                            </h3>
                                        </div>

                                        <div className="form-group">
                                            <label>Wärmepumpen-Typ</label>
                                            <select
                                                value={heatPumpData.heatPumpType}
                                                onChange={(e) => handleHeatPumpDataChange('heatPumpType', e.target.value)}
                                            >
                                                <option value="">Bitte wählen</option>
                                                <option value="air_water">Luft-Wasser</option>
                                                <option value="ground_water">Sole-Wasser (Erdwärme)</option>
                                                <option value="water_water">Wasser-Wasser</option>
                                                <option value="air_air">Luft-Luft</option>
                                            </select>
                                        </div>

                                        <div className="form-group">
                                            <label>Heizleistung A7/W35 (kW)</label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                value={heatPumpData.heatingCapacityA7W35}
                                                onChange={(e) => handleHeatPumpDataChange('heatingCapacityA7W35', parseFloat(e.target.value) || 0)}
                                                placeholder="12.5"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Heizleistung A2/W35 (kW)</label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                value={heatPumpData.heatingCapacityA2W35}
                                                onChange={(e) => handleHeatPumpDataChange('heatingCapacityA2W35', parseFloat(e.target.value) || 0)}
                                                placeholder="10.8"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Heizleistung A-7/W35 (kW)</label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                value={heatPumpData.heatingCapacityAMinus7W35}
                                                onChange={(e) => handleHeatPumpDataChange('heatingCapacityAMinus7W35', parseFloat(e.target.value) || 0)}
                                                placeholder="8.2"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>COP A7/W35</label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                value={heatPumpData.copA7W35}
                                                onChange={(e) => handleHeatPumpDataChange('copA7W35', parseFloat(e.target.value) || 0)}
                                                placeholder="4.5"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>COP A2/W35</label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                value={heatPumpData.copA2W35}
                                                onChange={(e) => handleHeatPumpDataChange('copA2W35', parseFloat(e.target.value) || 0)}
                                                placeholder="3.8"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>COP A-7/W35</label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                value={heatPumpData.copAMinus7W35}
                                                onChange={(e) => handleHeatPumpDataChange('copAMinus7W35', parseFloat(e.target.value) || 0)}
                                                placeholder="2.9"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>SCOP (Jahresarbeitszahl)</label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                value={heatPumpData.scop}
                                                onChange={(e) => handleHeatPumpDataChange('scop', parseFloat(e.target.value) || 0)}
                                                placeholder="4.2"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Energielabel</label>
                                            <select
                                                value={heatPumpData.energyLabel}
                                                onChange={(e) => handleHeatPumpDataChange('energyLabel', e.target.value)}
                                            >
                                                <option value="">Bitte wählen</option>
                                                <option value="A+++">A+++</option>
                                                <option value="A++">A++</option>
                                                <option value="A+">A+</option>
                                                <option value="A">A</option>
                                            </select>
                                        </div>

                                        <div className="form-group">
                                            <label>Kältemittel</label>
                                            <select
                                                value={heatPumpData.refrigerant}
                                                onChange={(e) => handleHeatPumpDataChange('refrigerant', e.target.value)}
                                            >
                                                <option value="">Bitte wählen</option>
                                                <option value="R290">R290 (Propan)</option>
                                                <option value="R32">R32</option>
                                                <option value="R410A">R410A</option>
                                                <option value="R407C">R407C</option>
                                            </select>
                                        </div>

                                        <div className="form-group">
                                            <label>Schallpegel Außengerät (dB)</label>
                                            <input
                                                type="number"
                                                value={heatPumpData.soundLevelOutdoor}
                                                onChange={(e) => handleHeatPumpDataChange('soundLevelOutdoor', parseFloat(e.target.value) || 0)}
                                                placeholder="55"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Max. Vorlauftemperatur (°C)</label>
                                            <input
                                                type="number"
                                                value={heatPumpData.maxFlowTemperature}
                                                onChange={(e) => handleHeatPumpDataChange('maxFlowTemperature', parseFloat(e.target.value) || 0)}
                                                placeholder="65"
                                            />
                                        </div>
                                    </>
                                )}

                                {/* Kategorie-spezifische Felder für Solar */}
                                {selectedCategory === 'solar' && (
                                    <>
                                        <div style={{ gridColumn: '1 / -1', margin: '2rem 0 1rem 0' }}>
                                            <h3 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>
                                                Technische Daten - Solar
                                            </h3>
                                        </div>

                                        <div className="form-group">
                                            <label>Solar-Typ</label>
                                            <select
                                                value={solarData.solarType}
                                                onChange={(e) => handleSolarDataChange('solarType', e.target.value)}
                                            >
                                                <option value="">Bitte wählen</option>
                                                <option value="photovoltaic">Photovoltaik (PV)</option>
                                                <option value="thermal">Solarthermie</option>
                                            </select>
                                        </div>

                                        {solarData.solarType === 'photovoltaic' && (
                                            <>
                                                <div className="form-group">
                                                    <label>Nennleistung (Wp)</label>
                                                    <input
                                                        type="number"
                                                        value={solarData.nominalPower}
                                                        onChange={(e) => handleSolarDataChange('nominalPower', parseFloat(e.target.value) || 0)}
                                                        placeholder="400"
                                                    />
                                                </div>

                                                <div className="form-group">
                                                    <label>Modulwirkungsgrad (%)</label>
                                                    <input
                                                        type="number"
                                                        step="0.1"
                                                        value={solarData.efficiency}
                                                        onChange={(e) => handleSolarDataChange('efficiency', parseFloat(e.target.value) || 0)}
                                                        placeholder="20.5"
                                                    />
                                                </div>

                                                <div className="form-group">
                                                    <label>Zelltyp</label>
                                                    <select
                                                        value={solarData.cellType}
                                                        onChange={(e) => handleSolarDataChange('cellType', e.target.value)}
                                                    >
                                                        <option value="">Bitte wählen</option>
                                                        <option value="Monokristallin">Monokristallin</option>
                                                        <option value="Polykristallin">Polykristallin</option>
                                                        <option value="Dünnschicht">Dünnschicht</option>
                                                    </select>
                                                </div>

                                                <div className="form-group">
                                                    <label>Spannung Leerlauf (Voc)</label>
                                                    <input
                                                        type="number"
                                                        step="0.1"
                                                        value={solarData.voltageOpenCircuit}
                                                        onChange={(e) => handleSolarDataChange('voltageOpenCircuit', parseFloat(e.target.value) || 0)}
                                                        placeholder="49.2"
                                                    />
                                                </div>

                                                <div className="form-group">
                                                    <label>Strom Kurzschluss (Isc)</label>
                                                    <input
                                                        type="number"
                                                        step="0.1"
                                                        value={solarData.currentShortCircuit}
                                                        onChange={(e) => handleSolarDataChange('currentShortCircuit', parseFloat(e.target.value) || 0)}
                                                        placeholder="10.8"
                                                    />
                                                </div>
                                            </>
                                        )}

                                        {solarData.solarType === 'thermal' && (
                                            <>
                                                <div className="form-group">
                                                    <label>Kollektorfläche (m²)</label>
                                                    <input
                                                        type="number"
                                                        step="0.1"
                                                        value={solarData.collectorArea}
                                                        onChange={(e) => handleSolarDataChange('collectorArea', parseFloat(e.target.value) || 0)}
                                                        placeholder="2.5"
                                                    />
                                                </div>

                                                <div className="form-group">
                                                    <label>Absorberfläche (m²)</label>
                                                    <input
                                                        type="number"
                                                        step="0.1"
                                                        value={solarData.absorberArea}
                                                        onChange={(e) => handleSolarDataChange('absorberArea', parseFloat(e.target.value) || 0)}
                                                        placeholder="2.3"
                                                    />
                                                </div>

                                                <div className="form-group">
                                                    <label>Kollektorwirkungsgrad (%)</label>
                                                    <input
                                                        type="number"
                                                        step="0.1"
                                                        value={solarData.efficiency}
                                                        onChange={(e) => handleSolarDataChange('efficiency', parseFloat(e.target.value) || 0)}
                                                        placeholder="85"
                                                    />
                                                </div>

                                                <div className="form-group">
                                                    <label>Fluidvolumen (Liter)</label>
                                                    <input
                                                        type="number"
                                                        step="0.1"
                                                        value={solarData.fluidVolume}
                                                        onChange={(e) => handleSolarDataChange('fluidVolume', parseFloat(e.target.value) || 0)}
                                                        placeholder="1.8"
                                                    />
                                                </div>

                                                <div className="form-group">
                                                    <label>Max. Betriebsdruck (bar)</label>
                                                    <input
                                                        type="number"
                                                        value={solarData.maxPressure}
                                                        onChange={(e) => handleSolarDataChange('maxPressure', parseFloat(e.target.value) || 0)}
                                                        placeholder="10"
                                                    />
                                                </div>
                                            </>
                                        )}

                                        <div className="form-group">
                                            <label>Modulbreite (mm)</label>
                                            <input
                                                type="number"
                                                value={solarData.width}
                                                onChange={(e) => handleSolarDataChange('width', parseFloat(e.target.value) || 0)}
                                                placeholder="1134"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Modulhöhe (mm)</label>
                                            <input
                                                type="number"
                                                value={solarData.height}
                                                onChange={(e) => handleSolarDataChange('height', parseFloat(e.target.value) || 0)}
                                                placeholder="1722"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Moduldicke (mm)</label>
                                            <input
                                                type="number"
                                                value={solarData.thickness}
                                                onChange={(e) => handleSolarDataChange('thickness', parseFloat(e.target.value) || 0)}
                                                placeholder="35"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Gewicht (kg)</label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                value={solarData.weight}
                                                onChange={(e) => handleSolarDataChange('weight', parseFloat(e.target.value) || 0)}
                                                placeholder="22.5"
                                            />
                                        </div>
                                    </>
                                )}

                                {/* Basis-Preis und Verfügbarkeitsdaten */}
                                <div style={{ gridColumn: '1 / -1', margin: '2rem 0 1rem 0' }}>
                                    <h3 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>
                                        Preis & Verfügbarkeit
                                    </h3>
                                </div>

                                <div className="form-group">
                                    <label>Verkaufspreis (EUR)</label>
                                    <input
                                        type="number"
                                        value={productData.pricing?.retail || 0}
                                        onChange={(e) => handlePricingChange('retail', parseFloat(e.target.value) || 0)}
                                        placeholder="15000"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Händlerpreis (EUR)</label>
                                    <input
                                        type="number"
                                        value={productData.pricing?.wholesale || 0}
                                        onChange={(e) => handlePricingChange('wholesale', parseFloat(e.target.value) || 0)}
                                        placeholder="12000"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Lagermenge</label>
                                    <input
                                        type="number"
                                        value={productData.availability?.quantity || 0}
                                        onChange={(e) => handleAvailabilityChange('quantity', parseInt(e.target.value) || 0)}
                                        placeholder="10"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Lieferzeit</label>
                                    <input
                                        type="text"
                                        value={productData.availability?.leadTime || ''}
                                        onChange={(e) => handleAvailabilityChange('leadTime', e.target.value)}
                                        placeholder="1-2 Wochen"
                                    />
                                </div>

                                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <input
                                        type="checkbox"
                                        checked={productData.isActive || false}
                                        onChange={(e) => handleInputChange('isActive', e.target.checked)}
                                        id="isActive"
                                    />
                                    <label htmlFor="isActive" style={{ margin: 0 }}>Produkt ist aktiv</label>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Zusammenfassung */}
                    {currentStep === 4 && (
                        <div>
                            <h2 style={{ marginBottom: '1rem', fontSize: '1.3rem' }}>Zusammenfassung</h2>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                                Überprüfen Sie Ihre Eingaben vor dem Speichern
                            </p>

                            <div className="content-card" style={{ maxWidth: '600px' }}>
                                <div className="card-content">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                        {selectedCategory && (
                                            <div style={{
                                                width: '60px',
                                                height: '60px',
                                                borderRadius: '12px',
                                                backgroundColor: categoryConfig[selectedCategory].color,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'white'
                                            }}>
                                                {React.createElement(categoryConfig[selectedCategory].icon, { size: 28 })}
                                            </div>
                                        )}
                                        <div>
                                            <h3 style={{ margin: '0 0 0.25rem 0' }}>{productData.name}</h3>
                                            <p style={{ margin: '0', color: 'var(--text-secondary)' }}>
                                                {productData.model} • {selectedManufacturer?.name}
                                            </p>
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gap: '0.75rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ color: 'var(--text-secondary)' }}>Kategorie:</span>
                                            <span>{selectedCategory && categoryConfig[selectedCategory].label}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ color: 'var(--text-secondary)' }}>Verkaufspreis:</span>
                                            <span style={{ fontWeight: '600', color: 'var(--primary-color)' }}>
                                                {productData.pricing?.retail?.toLocaleString('de-DE')} EUR
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ color: 'var(--text-secondary)' }}>Lagermenge:</span>
                                            <span>{productData.availability?.quantity} Stück</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ color: 'var(--text-secondary)' }}>Status:</span>
                                            <span style={{
                                                padding: '2px 8px',
                                                borderRadius: '12px',
                                                fontSize: '0.8rem',
                                                fontWeight: '500',
                                                backgroundColor: productData.isActive ? '#28A74520' : '#DC354520',
                                                color: productData.isActive ? '#28A745' : '#DC3545'
                                            }}>
                                                {productData.isActive ? 'Aktiv' : 'Inaktiv'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div style={{
                    padding: '1.5rem 2rem',
                    borderTop: '1px solid #e0e0e0',
                    backgroundColor: '#f8f9fa',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        {currentStep > 1 && (
                            <button
                                onClick={handlePrevious}
                                className="btn btn-secondary"
                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                            >
                                <ChevronLeft size={16} />
                                Zurück
                            </button>
                        )}
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button onClick={onClose} className="btn btn-secondary">
                            Abbrechen
                        </button>

                        {currentStep < totalSteps ? (
                            <button
                                onClick={handleNext}
                                className="btn btn-primary"
                                disabled={
                                    (currentStep === 1 && !selectedCategory) ||
                                    (currentStep === 2 && !selectedManufacturer)
                                }
                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                            >
                                Weiter
                                <ChevronRight size={16} />
                            </button>
                        ) : (
                            <button
                                onClick={handleSave}
                                className="btn btn-primary"
                                disabled={!productData.name || !productData.model}
                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                            >
                                <Save size={16} />
                                Produkt erstellen
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCreateDialog;
