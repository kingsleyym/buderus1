import React, { useState, useEffect } from 'react';
import { X, Mail, User, Building, Tag } from 'lucide-react';
import { Subscriber } from '../shared/types';

interface SubscriberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (subscriber: Omit<Subscriber, 'id' | 'createdAt'>) => void;
  subscriber?: Subscriber | null;
  mode: 'add' | 'edit';
}

const SubscriberModal: React.FC<SubscriberModalProps> = ({
  isOpen,
  onClose,
  onSave,
  subscriber,
  mode
}) => {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    company: '',
    confirmed: false,
    source: 'manual' as 'website' | 'manual' | 'import' | 'api',
    tags: [] as string[],
    confirmedAt: null as Date | null,
    lastActivity: null as Date | null
  });

  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (subscriber && mode === 'edit') {
      setFormData({
        email: subscriber.email,
        firstName: subscriber.firstName,
        lastName: subscriber.lastName,
        company: subscriber.company || '',
        confirmed: subscriber.confirmed,
        source: subscriber.source,
        tags: subscriber.tags,
        confirmedAt: subscriber.confirmedAt || null,
        lastActivity: subscriber.lastActivity || null
      });
    } else {
      // Reset form for add mode
      setFormData({
        email: '',
        firstName: '',
        lastName: '',
        company: '',
        confirmed: false,
        source: 'manual',
        tags: [],
        confirmedAt: null,
        lastActivity: null
      });
    }
    setErrors({});
  }, [subscriber, mode, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'E-Mail ist erforderlich';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Ungültige E-Mail-Adresse';
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Vorname ist erforderlich';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Nachname ist erforderlich';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const subscriberData = {
      ...formData,
      confirmedAt: formData.confirmed ? (formData.confirmedAt || new Date()) : null
    };

    onSave(subscriberData);
    onClose();
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {mode === 'add' ? 'Neuen Abonnenten hinzufügen' : 'Abonnent bearbeiten'}
          </h2>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {/* Email */}
          <div className="form-group">
            <label className="form-label">
              <Mail size={16} />
              E-Mail-Adresse *
            </label>
            <input
              type="email"
              className={`form-input ${errors.email ? 'error' : ''}`}
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="beispiel@email.com"
            />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          {/* Name */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">
                <User size={16} />
                Vorname *
              </label>
              <input
                type="text"
                className={`form-input ${errors.firstName ? 'error' : ''}`}
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                placeholder="Max"
              />
              {errors.firstName && <span className="form-error">{errors.firstName}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Nachname *</label>
              <input
                type="text"
                className={`form-input ${errors.lastName ? 'error' : ''}`}
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                placeholder="Mustermann"
              />
              {errors.lastName && <span className="form-error">{errors.lastName}</span>}
            </div>
          </div>

          {/* Company */}
          <div className="form-group">
            <label className="form-label">
              <Building size={16} />
              Firma (optional)
            </label>
            <input
              type="text"
              className="form-input"
              value={formData.company}
              onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
              placeholder="Firma GmbH"
            />
          </div>

          {/* Status & Source */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-input"
                value={formData.confirmed ? 'confirmed' : 'unconfirmed'}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  confirmed: e.target.value === 'confirmed' 
                }))}
              >
                <option value="unconfirmed">Unbestätigt</option>
                <option value="confirmed">Bestätigt</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Quelle</label>
              <select
                className="form-input"
                value={formData.source}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  source: e.target.value as any 
                }))}
              >
                <option value="manual">Manuell</option>
                <option value="website">Website</option>
                <option value="import">Import</option>
                <option value="api">API</option>
              </select>
            </div>
          </div>

          {/* Tags */}
          <div className="form-group">
            <label className="form-label">
              <Tag size={16} />
              Tags
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <input
                type="text"
                className="form-input"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Tag hinzufügen..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <button
                type="button"
                className="btn btn-secondary"
                onClick={addTag}
              >
                Hinzufügen
              </button>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {formData.tags.map((tag, index) => (
                <span key={index} className="tag">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="tag-remove"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </form>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Abbrechen
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            onClick={handleSubmit}
          >
            {mode === 'add' ? 'Hinzufügen' : 'Speichern'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriberModal;
