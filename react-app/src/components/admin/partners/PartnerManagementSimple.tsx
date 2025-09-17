import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Eye, Edit, Building2 } from 'lucide-react';
import { Partner } from './partner-types-simple';
import { mockPartnersSimple } from '../../../data/mockPartnersSimple';
import './partners-simple.css';

const PartnerManagementSimple: React.FC = () => {
  const [partners] = useState<Partner[]>(mockPartnersSimple);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPartners = partners.filter(partner => 
    partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="partners-simple">
      {/* Clean Header */}
      <div className="page-header">
        <h1>Fachpartner</h1>
        <button className="btn-add">
          <Plus size={16} />
          Neuer Partner
        </button>
      </div>

      {/* Simple Search */}
      <div className="search-bar">
        <Search size={16} />
        <input
          type="text"
          placeholder="Partner suchen..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Clean Table List */}
      <div className="partners-table">
        <div className="table-header">
          <div>Name</div>
          <div>Typ</div>
          <div>Email</div>
          <div>Status</div>
          <div>Produkte</div>
          <div>Aktionen</div>
        </div>
        
        {filteredPartners.map((partner) => (
          <div key={partner.id} className="table-row">
            <div className="partner-name">
              <Building2 size={16} />
              {partner.name}
            </div>
            <div className="partner-type">
              {partner.type === 'manufacturer' ? 'Hersteller' : 
               partner.type === 'distributor' ? 'Händler' : 'Service'}
            </div>
            <div className="partner-email">{partner.email}</div>
            <div className={`status ${partner.status}`}>
              {partner.status === 'active' ? 'Aktiv' : 
               partner.status === 'inactive' ? 'Inaktiv' : 'Pending'}
            </div>
            <div className="product-count">{partner.productIds.length}</div>
            <div className="actions">
              <Link to={`/admin/partners/${partner.id}`} className="btn-view">
                <Eye size={14} />
              </Link>
              <Link to={`/admin/partners/${partner.id}/edit`} className="btn-edit">
                <Edit size={14} />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredPartners.length === 0 && (
        <div className="empty-state">
          <p>Keine Partner gefunden</p>
        </div>
      )}
    </div>
  );
};

export default PartnerManagementSimple;
