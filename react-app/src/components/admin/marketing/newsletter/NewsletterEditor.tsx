import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Send, Eye } from 'lucide-react';

interface NewsletterEditorProps {
    onBack: () => void;
    editingNewsletter?: any;
}

interface HeliosNewsletterTemplate {
    id: string;
    name: string;
    description: string;
    greeting: string;
    content: string;
    showOfferBanner: boolean;
    offerImageUrl?: string;
    offerLink?: string;
    ctaText: string;
    ctaLink: string;
    category: string;
    createdAt: Date;
    updatedAt: Date;
}

// Simplified template data
const DEFAULT_TEMPLATES: HeliosNewsletterTemplate[] = [
    {
        id: 'welcome',
        name: 'Willkommen',
        description: 'Begrüßung für neue Kunden',
        greeting: 'Guten Tag {firstName},',
        content: 'Willkommen bei Helios Energy! Wir freuen uns, Sie als neuen Kunden begrüßen zu dürfen.',
        showOfferBanner: false,
        ctaText: 'Anrufen',
        ctaLink: 'tel:+4989123456789',
        category: 'newsletter',
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: 'offer',
        name: 'Angebot',
        description: 'Template für Sonderangebote',
        greeting: 'Liebe Kundinnen und Kunden,',
        content: 'Nutzen Sie unser exklusives Angebot für Ihre neue Heizungsanlage.',
        showOfferBanner: true,
        offerImageUrl: '/assets/offer.png',
        offerLink: 'https://helios-energygmbh.de/angebot',
        ctaText: 'Jetzt Angebot sichern',
        ctaLink: 'https://helios-energygmbh.de/angebot',
        category: 'offer',
        createdAt: new Date(),
        updatedAt: new Date()
    }
];

// Simple template generator
const generateSimpleHTML = (template: HeliosNewsletterTemplate): string => {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Helios Energy Newsletter</title>
</head>
<body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
    <!-- Header -->
    <div style="background-color: #F1C40F; padding: 20px; text-align: center;">
      <h1 style="margin: 0; color: #333; font-size: 24px;">Helios Energy</h1>
      <p style="margin: 5px 0 0 0; color: #333; font-style: italic;">Think intelligent. Think yellow.</p>
    </div>
    
    <!-- Content -->
    <div style="padding: 30px;">
      <p style="margin: 0 0 20px 0; font-size: 16px; color: #333;">${template.greeting}</p>
      <div style="line-height: 1.6; color: #555; margin-bottom: 30px;">
        ${template.content}
      </div>
      
      ${template.showOfferBanner ? `
      <div style="background-color: #FFF3CD; border: 1px solid #F1C40F; border-radius: 8px; padding: 20px; margin-bottom: 20px; text-align: center;">
        <h3 style="margin: 0 0 10px 0; color: #D97706;">Sonderangebot!</h3>
        <p style="margin: 0; color: #666;">Jetzt profitieren Sie von unserem exklusiven Angebot.</p>
      </div>
      ` : ''}
      
      <!-- CTA Button -->
      <div style="text-align: center; margin-top: 30px;">
        <a href="${template.ctaLink}" style="display: inline-block; background-color: #F1C40F; color: #333; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
          ${template.ctaText}
        </a>
      </div>
    </div>
    
    <!-- Footer -->
    <div style="background-color: #f8f9fa; padding: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #666; text-align: center;">
      <p style="margin: 0;">Helios Energy GmbH | Musterstraße 123, 80331 München</p>
      <p style="margin: 5px 0 0 0;">Tel: +49 (0)89 123 456 789 | info@helios-energygmbh.de</p>
    </div>
  </div>
</body>
</html>`;
};

const NewsletterEditor: React.FC<NewsletterEditorProps> = ({ onBack, editingNewsletter }) => {
    const [subject, setSubject] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState<HeliosNewsletterTemplate>(DEFAULT_TEMPLATES[0]);
    const [greeting, setGreeting] = useState('Guten Tag {firstName},');
    const [content, setContent] = useState('');
    const [showOfferBanner, setShowOfferBanner] = useState(false);
    const [offerImageUrl, setOfferImageUrl] = useState('');
    const [offerLink, setOfferLink] = useState('');
    const [ctaText, setCtaText] = useState('Anrufen');
    const [ctaLink, setCtaLink] = useState('tel:+4989123456789');
    const [category, setCategory] = useState('newsletter');
    const [campaign, setCampaign] = useState('');

    // Load template data when selectedTemplate changes
    useEffect(() => {
        if (selectedTemplate) {
            setGreeting(selectedTemplate.greeting);
            setContent(selectedTemplate.content);
            setShowOfferBanner(selectedTemplate.showOfferBanner);
            setOfferImageUrl(selectedTemplate.offerImageUrl || '');
            setOfferLink(selectedTemplate.offerLink || '');
            setCtaText(selectedTemplate.ctaText);
            setCtaLink(selectedTemplate.ctaLink);
            setCategory(selectedTemplate.category);
        }
    }, [selectedTemplate]);

    // Generate current template
    const currentTemplate: HeliosNewsletterTemplate = {
        id: 'current',
        name: 'Current',
        description: 'Current editing template',
        greeting,
        content,
        showOfferBanner,
        offerImageUrl,
        offerLink,
        ctaText,
        ctaLink,
        category,
        createdAt: new Date(),
        updatedAt: new Date()
    };

    // Generate preview HTML
    const previewHTML = generateSimpleHTML(currentTemplate);

    // Replace placeholder variables with sample data for preview
    const previewHTMLWithData = previewHTML
        .replace(/{firstName}/g, 'Max')
        .replace(/{lastName}/g, 'Mustermann')
        .replace(/{email}/g, 'max.mustermann@example.com');

    const handleSave = () => {
        console.log('Saving newsletter:', {
            subject,
            content: previewHTML,
            category,
            campaign,
            status: 'draft'
        });
    };

    const handleSend = () => {
        console.log('Sending newsletter immediately');
    };

    return (
        <div className="admin-section">
            <div className="content-header">
                <div>
                    <button className="back-btn" onClick={onBack}>
                        <ArrowLeft size={16} />
                        Zurück zur Übersicht
                    </button>
                    <h1>✏️ Newsletter Editor</h1>
                    <p className="subtitle">Erstellen Sie professionelle Newsletter mit dem Helios Energy Design</p>
                </div>
                <div className="header-actions">
                    <button className="secondary-btn" onClick={handleSave}>
                        <Save size={16} />
                        Als Entwurf speichern
                    </button>
                    <button className="primary-btn" onClick={handleSend}>
                        <Send size={16} />
                        Sofort senden
                    </button>
                </div>
            </div>

            <div className="editor-layout" style={{ display: 'flex', gap: '20px', height: 'calc(100vh - 200px)' }}>

                {/* Editor Panel */}
                <div className="editor-panel" style={{ flex: '1', minWidth: '400px' }}>
                    <div className="content-card">
                        <h3>📝 Newsletter bearbeiten</h3>

                        {/* Template Selection */}
                        <div className="form-group">
                            <label className="form-label">Vorlage auswählen</label>
                            <select
                                className="form-input"
                                value={selectedTemplate.id}
                                onChange={(e) => {
                                    const template = DEFAULT_TEMPLATES.find(t => t.id === e.target.value);
                                    if (template) setSelectedTemplate(template);
                                }}
                            >
                                {DEFAULT_TEMPLATES.map(template => (
                                    <option key={template.id} value={template.id}>
                                        {template.name} - {template.description}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Basic Info */}
                        <div className="form-group">
                            <label className="form-label">Betreff</label>
                            <input
                                type="text"
                                className="form-input"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="Newsletter Betreff..."
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Kategorie</label>
                                <select
                                    className="form-input"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                >
                                    <option value="newsletter">Newsletter</option>
                                    <option value="offer">Angebot</option>
                                    <option value="news">Neuigkeiten</option>
                                    <option value="maintenance">Wartung</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Kampagne (optional)</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={campaign}
                                    onChange={(e) => setCampaign(e.target.value)}
                                    placeholder="z.B. Frühjahrs-Aktion 2025"
                                />
                            </div>
                        </div>

                        {/* Content Editing */}
                        <div className="form-group">
                            <label className="form-label">Begrüßung</label>
                            <input
                                type="text"
                                className="form-input"
                                value={greeting}
                                onChange={(e) => setGreeting(e.target.value)}
                                placeholder="Guten Tag {firstName},"
                            />
                            <small className="form-help">Verwenden Sie {'{firstName}'} für automatische Personalisierung</small>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Hauptinhalt</label>
                            <textarea
                                className="form-textarea"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Ihr Newsletter-Inhalt..."
                                rows={8}
                            />
                        </div>

                        {/* Offer Banner */}
                        <div className="form-group">
                            <label className="form-checkbox">
                                <input
                                    type="checkbox"
                                    checked={showOfferBanner}
                                    onChange={(e) => setShowOfferBanner(e.target.checked)}
                                />
                                <span>Angebots-Banner anzeigen</span>
                            </label>
                        </div>

                        {showOfferBanner && (
                            <>
                                <div className="form-group">
                                    <label className="form-label">Angebots-Bild URL</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={offerImageUrl}
                                        onChange={(e) => setOfferImageUrl(e.target.value)}
                                        placeholder="https://example.com/offer-image.jpg"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Angebots-Link</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={offerLink}
                                        onChange={(e) => setOfferLink(e.target.value)}
                                        placeholder="https://helios-energygmbh.de/angebot"
                                    />
                                </div>
                            </>
                        )}

                        {/* Call-to-Action */}
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Button-Text</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={ctaText}
                                    onChange={(e) => setCtaText(e.target.value)}
                                    placeholder="Anrufen"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Button-Link</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={ctaLink}
                                    onChange={(e) => setCtaLink(e.target.value)}
                                    placeholder="tel:+4989123456789"
                                />
                            </div>
                        </div>

                        {/* Variables Help */}
                        <div className="help-section" style={{ marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
                            <h4>🔧 Verfügbare Variablen:</h4>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
                                {['{firstName}', '{lastName}', '{email}', '{company}'].map(variable => (
                                    <span key={variable} style={{
                                        background: '#e3f2fd',
                                        color: '#1976d2',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        fontFamily: 'monospace',
                                        fontSize: '12px'
                                    }}>
                                        {variable}
                                    </span>
                                ))}
                            </div>
                            <p style={{ fontSize: '12px', color: '#666', margin: '10px 0 0 0' }}>
                                Diese Variablen werden automatisch mit den Daten der Empfänger ersetzt.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Preview Panel */}
                <div className="preview-panel" style={{ flex: '1', minWidth: '400px' }}>
                    <div className="content-card" style={{ height: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                            <Eye size={16} />
                            <h3>👀 Live-Vorschau</h3>
                        </div>

                        <div className="preview-container" style={{
                            height: 'calc(100% - 60px)',
                            border: '1px solid #e0e0e0',
                            borderRadius: '8px',
                            overflow: 'auto',
                            background: '#f5f5f5'
                        }}>
                            <iframe
                                srcDoc={previewHTMLWithData}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    border: 'none',
                                    borderRadius: '8px'
                                }}
                                title="Newsletter Preview"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewsletterEditor;
