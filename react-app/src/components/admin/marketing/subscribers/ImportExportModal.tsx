import React, { useState, useRef } from 'react';
import { X, Upload, Download, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { Subscriber } from '../shared/types';

interface ImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (subscribers: Omit<Subscriber, 'id' | 'createdAt'>[]) => void;
  onExport: () => void;
  subscribers: Subscriber[];
  mode: 'import' | 'export';
}

const ImportExportModal: React.FC<ImportExportModalProps> = ({
  isOpen,
  onClose,
  onImport,
  onExport,
  subscribers,
  mode
}) => {
  const [importData, setImportData] = useState('');
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setImportData(text);
      parseCSV(text);
    };
    reader.readAsText(file);
  };

  const parseCSV = (csvText: string) => {
    try {
      const lines = csvText.trim().split('\n');
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      
      const requiredFields = ['email', 'firstname', 'lastname'];
      const missingFields = requiredFields.filter(field => !headers.includes(field));
      
      if (missingFields.length > 0) {
        setImportErrors([`Fehlende Pflichtfelder: ${missingFields.join(', ')}`]);
        return;
      }

      const data = [];
      const errors = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        if (values.length !== headers.length) {
          errors.push(`Zeile ${i + 1}: Falsche Anzahl Spalten`);
          continue;
        }

        const row: any = {};
        headers.forEach((header, index) => {
          row[header] = values[index];
        });

        // Validate email
        if (!row.email || !/\S+@\S+\.\S+/.test(row.email)) {
          errors.push(`Zeile ${i + 1}: Ungültige E-Mail "${row.email}"`);
          continue;
        }

        // Transform to subscriber format
        const subscriber = {
          email: row.email,
          firstName: row.firstname || row.first_name || '',
          lastName: row.lastname || row.last_name || '',
          company: row.company || row.firma || '',
          confirmed: row.confirmed === 'true' || row.confirmed === '1',
          source: 'import' as const,
          tags: row.tags ? row.tags.split(';').filter(Boolean) : [],
          confirmedAt: null as Date | null,
          lastActivity: null as Date | null
        };

        data.push(subscriber);
      }

      setPreviewData(data);
      setImportErrors(errors);
    } catch (error) {
      setImportErrors(['Fehler beim Parsen der CSV-Datei']);
    }
  };

  const handleImport = async () => {
    if (previewData.length === 0) return;
    
    setIsProcessing(true);
    try {
      await onImport(previewData);
      onClose();
    } catch (error) {
      setImportErrors(['Fehler beim Importieren der Daten']);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExport = () => {
    const csvHeaders = ['email', 'firstname', 'lastname', 'company', 'confirmed', 'source', 'tags', 'created_at'];
    const csvRows = subscribers.map(sub => [
      sub.email,
      sub.firstName,
      sub.lastName,
      sub.company || '',
      sub.confirmed ? 'true' : 'false',
      sub.source,
      sub.tags.join(';'),
      sub.createdAt.toISOString().split('T')[0]
    ]);

    const csvContent = [csvHeaders, ...csvRows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `abonnenten_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    onClose();
  };

  const resetModal = () => {
    setImportData('');
    setImportErrors([]);
    setPreviewData([]);
    setIsProcessing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {mode === 'import' ? (
              <>
                <Upload size={20} />
                Abonnenten importieren
              </>
            ) : (
              <>
                <Download size={20} />
                Abonnenten exportieren
              </>
            )}
          </h2>
          <button className="modal-close" onClick={() => { onClose(); resetModal(); }}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {mode === 'import' ? (
            <>
              {/* Import Instructions */}
              <div className="info-box">
                <FileText size={16} />
                <div>
                  <h4>CSV-Format erforderlich</h4>
                  <p>Pflichtfelder: email, firstname, lastname</p>
                  <p>Optionale Felder: company, confirmed, tags (durch ; getrennt)</p>
                </div>
              </div>

              {/* File Upload */}
              <div className="form-group">
                <label className="form-label">CSV-Datei auswählen</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="form-input"
                />
              </div>

              {/* Manual Input */}
              <div className="form-group">
                <label className="form-label">Oder CSV-Daten direkt eingeben</label>
                <textarea
                  className="form-textarea"
                  rows={8}
                  value={importData}
                  onChange={(e) => {
                    setImportData(e.target.value);
                    if (e.target.value.trim()) {
                      parseCSV(e.target.value);
                    }
                  }}
                  placeholder="email,firstname,lastname,company,confirmed,tags&#10;max@example.com,Max,Mustermann,Firma GmbH,true,kunde;premium"
                />
              </div>

              {/* Errors */}
              {importErrors.length > 0 && (
                <div className="error-box">
                  <AlertCircle size={16} />
                  <div>
                    <h4>Importfehler</h4>
                    <ul>
                      {importErrors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Preview */}
              {previewData.length > 0 && (
                <div className="preview-box">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <CheckCircle size={16} style={{ color: 'var(--success-color)' }} />
                    <h4>Vorschau ({previewData.length} Abonnenten)</h4>
                  </div>
                  <div className="table-container" style={{ maxHeight: '300px', overflow: 'auto' }}>
                    <table>
                      <thead>
                        <tr>
                          <th>E-Mail</th>
                          <th>Name</th>
                          <th>Firma</th>
                          <th>Status</th>
                          <th>Tags</th>
                        </tr>
                      </thead>
                      <tbody>
                        {previewData.slice(0, 10).map((item, index) => (
                          <tr key={index}>
                            <td>{item.email}</td>
                            <td>{item.firstName} {item.lastName}</td>
                            <td>{item.company || '-'}</td>
                            <td>
                              <span className={`status-badge ${item.confirmed ? 'confirmed' : 'unconfirmed'}`}>
                                {item.confirmed ? 'Bestätigt' : 'Unbestätigt'}
                              </span>
                            </td>
                            <td>{item.tags.join(', ') || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {previewData.length > 10 && (
                      <p style={{ textAlign: 'center', margin: '1rem 0', color: 'var(--text-muted)' }}>
                        ... und {previewData.length - 10} weitere
                      </p>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Export Mode */
            <div>
              <div className="info-box">
                <Download size={16} />
                <div>
                  <h4>Export bereit</h4>
                  <p>{subscribers.length} Abonnenten werden als CSV-Datei exportiert</p>
                  <p>Format: E-Mail, Vorname, Nachname, Firma, Status, Quelle, Tags, Erstellungsdatum</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={() => { onClose(); resetModal(); }}
          >
            Abbrechen
          </button>
          
          {mode === 'import' ? (
            <button 
              type="button" 
              className="btn btn-primary"
              onClick={handleImport}
              disabled={previewData.length === 0 || importErrors.length > 0 || isProcessing}
            >
              {isProcessing ? 'Importiere...' : `${previewData.length} Abonnenten importieren`}
            </button>
          ) : (
            <button 
              type="button" 
              className="btn btn-primary"
              onClick={handleExport}
            >
              <Download size={16} />
              CSV herunterladen
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImportExportModal;
