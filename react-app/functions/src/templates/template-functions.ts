// ===================================
// TEMPLATE MANAGEMENT FUNCTIONS
// Professional Email Templates with Signature Integration
// ===================================

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { EmailTemplate, ApiResponse } from '../shared/types';
import { isAuthenticated, isAdmin } from '../shared/auth';

const db = admin.firestore();

// Confirmation Email Template
export const BUDERUS_CONFIRMATION_TEMPLATE = `
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Newsletter-Anmeldung bestätigen</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f5f5;font-family:Arial,sans-serif;">
    <table width="100%" style="background-color:#f5f5f5;padding:20px 0;">
        <tr>
            <td align="center">
                <table width="600" style="background-color:#ffffff;border-radius:8px;padding:40px;">
                    <tr>
                        <td>
                            <h1 style="color:#2d5a87;margin:0 0 20px 0;">{{salutation}},</h1>
                            <p style="font-size:16px;line-height:24px;color:#333;margin:0 0 20px 0;">
                                vielen Dank für Ihre Anmeldung zu unserem Newsletter! 
                                Um Ihre E-Mail-Adresse zu bestätigen, klicken Sie bitte auf den folgenden Button:
                            </p>
                            <div style="text-align:center;margin:30px 0;">
                                <a href="{{confirmationLink}}" style="background-color:#2d5a87;color:#ffffff;padding:15px 30px;text-decoration:none;border-radius:5px;font-weight:bold;">
                                    Newsletter-Anmeldung bestätigen
                                </a>
                            </div>
                            <p style="font-size:14px;color:#666;margin:20px 0 0 0;">
                                Falls der Button nicht funktioniert, kopieren Sie diesen Link: {{confirmationLink}}
                            </p>
                            <hr style="margin:30px 0;border:none;border-top:1px solid #eee;">
                            <p style="font-size:12px;color:#999;">
                                Buderus Systeme GmbH<br>
                                Diese E-Mail wurde an {{email}} gesendet.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;

export const BUDERUS_CONFIRMATION_TEXT = `
{{salutation}},

vielen Dank für Ihre Anmeldung zu unserem Newsletter!

Um Ihre E-Mail-Adresse zu bestätigen, öffnen Sie bitte diesen Link:
{{confirmationLink}}

Mit freundlichen Grüßen
Ihr Team von Buderus Systeme GmbH

Diese E-Mail wurde an {{email}} gesendet.
`;

// Welcome Email Template  
export const BUDERUS_WELCOME_TEMPLATE = `
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Willkommen bei Buderus Systeme</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f5f5;font-family:Arial,sans-serif;">
    <table width="100%" style="background-color:#f5f5f5;padding:20px 0;">
        <tr>
            <td align="center">
                <table width="600" style="background-color:#ffffff;border-radius:8px;padding:40px;">
                    <tr>
                        <td>
                            <h1 style="color:#2d5a87;margin:0 0 20px 0;">{{salutation}},</h1>
                            <p style="font-size:16px;line-height:24px;color:#333;margin:0 0 20px 0;">
                                herzlich willkommen bei unserem Newsletter! Ihre Anmeldung wurde erfolgreich bestätigt.
                            </p>
                            <p style="font-size:16px;line-height:24px;color:#333;margin:0 0 20px 0;">
                                Sie erhalten ab sofort regelmäßig Informationen über:
                            </p>
                            <ul style="font-size:16px;line-height:24px;color:#333;margin:0 0 20px 20px;">
                                <li>Neue Heizungsanlagen und Technologien</li>
                                <li>Wartungstipps und Energiespar-Ratschläge</li>
                                <li>Exklusive Angebote und Aktionen</li>
                                <li>Termine und Veranstaltungen</li>
                            </ul>
                            <hr style="margin:30px 0;border:none;border-top:1px solid #eee;">
                            <p style="font-size:12px;color:#999;">
                                Sie können sich jederzeit abmelden: <a href="{{unsubscribeLink}}" style="color:#2d5a87;">Abmelden</a><br>
                                Buderus Systeme GmbH<br>
                                Diese E-Mail wurde an {{email}} gesendet.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;

export const BUDERUS_WELCOME_TEXT = `
{{salutation}},

herzlich willkommen bei unserem Newsletter! Ihre Anmeldung wurde erfolgreich bestätigt.

Sie erhalten ab sofort regelmäßig Informationen über:
- Neue Heizungsanlagen und Technologien
- Wartungstipps und Energiespar-Ratschläge  
- Exklusive Angebote und Aktionen
- Termine und Veranstaltungen

Abmelden: {{unsubscribeLink}}

Mit freundlichen Grüßen
Ihr Team von Buderus Systeme GmbH

Diese E-Mail wurde an {{email}} gesendet.
`;

/**
 * Template abrufen (vereinfacht für Newsletter Functions)
 */
export async function getTemplate(templateId: string): Promise<{ html: string; text?: string }> {
  try {
    // Statische Templates für Newsletter System
    const templates: { [key: string]: { html: string; text?: string } } = {
      'newsletter-confirmation': {
        html: BUDERUS_CONFIRMATION_TEMPLATE,
        text: BUDERUS_CONFIRMATION_TEXT
      },
      'newsletter-welcome': {
        html: BUDERUS_WELCOME_TEMPLATE,
        text: BUDERUS_WELCOME_TEXT
      },
      'newsletter-base': {
        html: BUDERUS_SIGNATURE_TEMPLATE
      }
    };

    if (templates[templateId]) {
      return templates[templateId];
    }

    // Fallback: Aus Firestore laden
    const templateDoc = await db.collection('templates').doc(templateId).get();
    if (templateDoc.exists) {
      const data = templateDoc.data();
      return {
        html: data?.html || '',
        text: data?.text
      };
    }

    throw new Error(`Template ${templateId} nicht gefunden`);

  } catch (error) {
    console.error('Fehler beim Laden des Templates:', error);
    throw error;
  }
}

// Default Buderus Signature Template (based on your Helios template)
export const BUDERUS_SIGNATURE_TEMPLATE = `
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{companyName}} Newsletter</title>
    <!--[if mso]>
    <xml>
        <o:OfficeDocumentSettings>
            <o:AllowPNG/>
            <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
    </xml>
    <![endif]-->
    <style>
        @media only screen and (max-width: 770px) {
            .email-container { width: 100% !important; max-width: 770px !important; }
        }
        @media only screen and (max-width: 600px) {
            .email-container { width: 100% !important; }
            .mobile-padding { padding: 15px !important; }
            .mobile-header { padding: 15px 20px !important; font-size: 18px !important; line-height: 24px !important; }
            .mobile-content { padding: 20px !important; }
            .mobile-footer { padding: 15px 20px !important; }
            .mobile-logo { width: 60px !important; height: 60px !important; }
            .mobile-offer { width: 100% !important; max-width: 300px !important; }
            .footer-contact td { display: block !important; width: 100% !important; }
        }
    </style>
</head>
<body style="margin:0;padding:0;background-color:#f5f5f5;">

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f5f5f5;">
    <tr>
        <td align="center" style="padding:20px 0;">

<!-- Buderus Newsletter Template – responsive 770px -->
<table role="presentation" width="770" align="center" cellpadding="0" cellspacing="0" border="0" class="email-container" style="width:770px;font-family:Arial,Helvetica,sans-serif;background-color:#ffffff;box-shadow:0 4px 12px rgba(0,0,0,0.1);">

  <!-- HEADER -->
  <tr>
    <td bgcolor="{{brandColor}}" class="mobile-header" style="padding:20px 24px 20px;color:#ffffff;">
      <div style="font-size:22px;line-height:28px;font-weight:500;letter-spacing:.2px;">
        {{headerText}}
      </div>
    </td>
  </tr>

  <!-- LOGO -->
  <tr>
    <td bgcolor="#F7F7F8" style="padding:8px 24px 0;">
      <table role="presentation" width="100%"><tr>
        <td></td>
        <td align="right" style="padding:0;">
          <img src="{{logoUrl}}" width="120" height="120" alt="{{companyName}}" class="mobile-logo" style="display:block;border:0;width:120px;height:120px;object-fit:contain;">
        </td>
      </tr></table>
    </td>
  </tr>

  <!-- NEWSLETTER CONTENT -->
  <tr>
    <td bgcolor="#F7F7F8" class="mobile-content" style="padding:24px;color:#1F2937;">
      {{newsletterContent}}
    </td>
  </tr>

  <!-- OFFER BANNER (if provided) -->
  {{#if offerImageUrl}}
  <tr>
    <td bgcolor="#F7F7F8" align="center" style="padding:12px 24px 14px;">
      <a href="{{offerUrl}}" target="_blank" style="text-decoration:none;">
        <img src="{{offerImageUrl}}" width="372" alt="{{offerAltText}}" class="mobile-offer"
             style="display:block;border:0;width:372px;height:auto;max-width:100%;border-radius:14px;box-shadow:0 6px 14px rgba(0,0,0,0.15);">
      </a>
    </td>
  </tr>
  {{/if}}

  <!-- CTA BUTTON (if provided) -->
  {{#if ctaText}}
  <tr>
    <td bgcolor="#F7F7F8" align="center" style="padding:6px 24px 16px;">
      <a href="{{ctaUrl}}"
         style="display:inline-block;background:{{ctaColor}};padding:12px 26px;border-radius:999px;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;">
        {{ctaText}}
      </a>
    </td>
  </tr>
  {{/if}}

  <!-- FOOTER -->
  <tr>
    <td bgcolor="#ECEDEF" style="padding:15px 24px 18px;color:#6B7280;border-top:1px solid #E5E7EB;">
      <div style="font-weight:700;color:#111827;margin-bottom:2px;">{{companyName}}</div>
      <div style="color:#4B5563;margin-bottom:8px;">{{companyTagline}}</div>
      
      <!-- Contact Person and Logo -->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="vertical-align:top;width:60%;">
            <div style="font-weight:700;color:#111827;margin-bottom:2px;font-size:14px;">{{contactName}}</div>
            <div style="color:#4B5563;margin-bottom:8px;font-size:13px;">{{contactTitle}}</div>
          </td>
          <td align="right" style="vertical-align:top;width:40%;">
            <img src="{{logoUrl}}" width="80" height="80" alt="{{companyName}}" style="display:block;border:0;object-fit:contain;">
          </td>
        </tr>
      </table>
      
      <!-- Separator -->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0;">
        <tr><td height="1" style="background:{{brandColor}};font-size:0;line-height:0;">&nbsp;</td></tr>
      </table>
      
      <!-- Contact Information -->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="footer-contact">
        <tr>
          <td style="font-size:12px;line-height:16px;width:50%;vertical-align:top;">
            {{companyAddress}}<br>
            {{companyCity}}<br>
            {{companyCountry}}
          </td>
          <td style="font-size:12px;line-height:16px;width:50%;vertical-align:top;">
            <a href="mailto:{{contactEmail}}" style="color:#6B7280;text-decoration:underline;">{{contactEmail}}</a><br>
            <a href="tel:{{contactPhone}}" style="color:#6B7280;text-decoration:underline;">{{contactPhone}}</a><br>
            <a href="{{websiteUrl}}" style="color:{{brandColor}};text-decoration:underline;">{{websiteDomain}}</a>
          </td>
        </tr>
      </table>
      
      <!-- Copyright & Unsubscribe -->
      <div style="margin-top:8px;font-size:11px;color:#9CA3AF;">
        © {{companyName}} {{currentYear}} – {{copyrightText}}<br>
        <a href="{{unsubscribeUrl}}" style="color:#9CA3AF;text-decoration:underline;">Newsletter abbestellen</a>
      </div>
      
      <!-- Tracking Pixel -->
      <img src="{{trackingPixelUrl}}" width="1" height="1" style="display:block;border:0;" alt="">
    </td>
  </tr>
</table>

        </td>
    </tr>
</table>

</body>
</html>
`;

/**
 * Create a new email template
 */
export const createTemplate = functions.https.onCall(async (data, context) => {
  try {
    const uid = await isAuthenticated(context);
    await isAdmin(uid);

    const {
      name,
      description,
      type = 'newsletter',
      htmlContent,
      textContent,
      variables = [],
      isPublic = false
    } = data;

    if (!name || !htmlContent) {
      throw new functions.https.HttpsError('invalid-argument', 'Name und HTML-Inhalt sind erforderlich');
    }

    const templateId = db.collection('email_templates').doc().id;
    const now = admin.firestore.FieldValue.serverTimestamp();

    const template: Partial<EmailTemplate> = {
      id: templateId,
      name,
      description,
      type,
      htmlContent,
      textContent,
      variables,
      isDefault: false,
      isPublic,
      createdAt: now as any,
      updatedAt: now as any,
      createdBy: uid
    };

    await db.collection('email_templates').doc(templateId).set(template);

    return {
      success: true,
      data: { id: templateId, ...template },
      message: 'Template erfolgreich erstellt'
    } as ApiResponse<EmailTemplate>;

  } catch (error) {
    console.error('Create Template Error:', error);
    throw new functions.https.HttpsError('internal', 'Fehler beim Erstellen des Templates');
  }
});

/**
 * Get all templates
 */
export const getTemplates = functions.https.onCall(async (data, context) => {
  try {
    const uid = await isAuthenticated(context);
    
    const { type, limit = 50, offset = 0 } = data;

    let query = db.collection('email_templates')
      .where('isPublic', '==', true)
      .orderBy('createdAt', 'desc');

    // Add user's private templates if authenticated
    if (uid) {
      query = db.collection('email_templates')
        .where('createdBy', '==', uid)
        .orderBy('createdAt', 'desc');
    }

    if (type) {
      query = query.where('type', '==', type);
    }

    const snapshot = await query.limit(limit).offset(offset).get();
    const templates: EmailTemplate[] = [];

    snapshot.forEach(doc => {
      const data = doc.data();
      templates.push({
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate()
      } as EmailTemplate);
    });

    return {
      success: true,
      data: templates,
      message: `${templates.length} Templates gefunden`
    } as ApiResponse<EmailTemplate[]>;

  } catch (error) {
    console.error('Get Templates Error:', error);
    throw new functions.https.HttpsError('internal', 'Fehler beim Abrufen der Templates');
  }
});

/**
 * Render template with variables
 */
export const renderTemplate = functions.https.onCall(async (data, context) => {
  try {
    await isAuthenticated(context);

    const { templateId, variables = {}, newsletterContent = '' } = data;

    if (!templateId) {
      throw new functions.https.HttpsError('invalid-argument', 'Template ID erforderlich');
    }

    const templateDoc = await db.collection('email_templates').doc(templateId).get();
    
    if (!templateDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Template nicht gefunden');
    }

    const template = templateDoc.data() as EmailTemplate;
    let renderedHtml = template.htmlContent;

    // Add newsletter content
    variables.newsletterContent = newsletterContent;

    // Add system variables
    variables.currentYear = new Date().getFullYear();
    variables.unsubscribeUrl = `${functions.config().app.domain}/unsubscribe?token={{unsubscribeToken}}`;
    variables.trackingPixelUrl = `${functions.config().app.domain}/track/open?id={{trackingPixelId}}`;

    // Simple template variable replacement
    Object.keys(variables).forEach(key => {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      renderedHtml = renderedHtml.replace(regex, variables[key] || '');
    });

    // Handle conditional blocks (simple {{#if variable}} ... {{/if}} support)
    renderedHtml = renderedHtml.replace(/{{#if\s+(\w+)}}([\s\S]*?){{\/if}}/g, (match, varName, content) => {
      return variables[varName] ? content : '';
    });

    return {
      success: true,
      data: {
        renderedHtml,
        variables: variables
      },
      message: 'Template erfolgreich gerendert'
    } as ApiResponse;

  } catch (error) {
    console.error('Render Template Error:', error);
    throw new functions.https.HttpsError('internal', 'Fehler beim Rendern des Templates');
  }
});

/**
 * Initialize default Buderus templates
 */
export const initializeDefaultTemplates = functions.https.onCall(async (data, context) => {
  try {
    const uid = await isAuthenticated(context);
    await isAdmin(uid);

    const templates = [
      {
        name: 'Buderus Standard Signature',
        description: 'Professional Buderus newsletter template with signature',
        type: 'signature',
        htmlContent: BUDERUS_SIGNATURE_TEMPLATE,
        variables: [
          { name: 'companyName', type: 'text', defaultValue: 'Buderus Systeme', required: true },
          { name: 'brandColor', type: 'text', defaultValue: '#FFD700', required: true },
          { name: 'headerText', type: 'text', defaultValue: 'Think intelligent.<br>Think blue.', required: true },
          { name: 'logoUrl', type: 'image', defaultValue: '/assets/logo.png', required: true },
          { name: 'companyTagline', type: 'text', defaultValue: 'Intelligente Heizsysteme', required: false },
          { name: 'contactName', type: 'text', defaultValue: 'Max Mustermann', required: true },
          { name: 'contactTitle', type: 'text', defaultValue: 'Geschäftsführer', required: true },
          { name: 'contactEmail', type: 'text', defaultValue: 'info@buderus-systeme.de', required: true },
          { name: 'contactPhone', type: 'text', defaultValue: '+49 123 456 789', required: true },
          { name: 'companyAddress', type: 'text', defaultValue: 'Musterstraße 123', required: true },
          { name: 'companyCity', type: 'text', defaultValue: '12345 Musterstadt', required: true },
          { name: 'companyCountry', type: 'text', defaultValue: 'Deutschland', required: true },
          { name: 'websiteUrl', type: 'link', defaultValue: 'https://buderus-systeme.de', required: true },
          { name: 'websiteDomain', type: 'text', defaultValue: 'buderus-systeme.de', required: true },
          { name: 'copyrightText', type: 'text', defaultValue: 'Intelligente Heizsysteme', required: false },
          { name: 'offerImageUrl', type: 'image', defaultValue: '', required: false },
          { name: 'offerUrl', type: 'link', defaultValue: '', required: false },
          { name: 'offerAltText', type: 'text', defaultValue: 'Aktuelles Angebot', required: false },
          { name: 'ctaText', type: 'text', defaultValue: '', required: false },
          { name: 'ctaUrl', type: 'link', defaultValue: '', required: false },
          { name: 'ctaColor', type: 'text', defaultValue: '#FFD700', required: false }
        ],
        isDefault: true,
        isPublic: true
      }
    ];

    const results = [];
    for (const template of templates) {
      const templateId = db.collection('email_templates').doc().id;
      const now = admin.firestore.FieldValue.serverTimestamp();

      await db.collection('email_templates').doc(templateId).set({
        id: templateId,
        ...template,
        createdAt: now,
        updatedAt: now,
        createdBy: uid
      });

      results.push({ id: templateId, name: template.name });
    }

    return {
      success: true,
      data: results,
      message: `${results.length} Standard-Templates erstellt`
    } as ApiResponse;

  } catch (error) {
    console.error('Initialize Templates Error:', error);
    throw new functions.https.HttpsError('internal', 'Fehler beim Initialisieren der Templates');
  }
});
