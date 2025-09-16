// ===================================
// EMAIL SERVICE
// SMTP Service für Newsletter System
// ===================================

import * as nodemailer from 'nodemailer';
import { getTemplate } from '../templates/template-functions';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
}

export interface PersonalizationData {
  firstName?: string;
  lastName?: string;
  company?: string;
  [key: string]: any;
}

export class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    this.initializeTransporter();
  }

  /**
   * SMTP Transporter initialisieren
   * Flexibel zwischen Jonas SMTP und Hetzner Server
   */
  private async initializeTransporter(): Promise<void> {
    try {
      // SMTP Konfiguration aus Environment oder Firestore
      const smtpConfig = await this.getSMTPConfig();

      this.transporter = nodemailer.createTransport({
        host: smtpConfig.host,
        port: smtpConfig.port,
        secure: smtpConfig.secure,
        auth: {
          user: smtpConfig.user,
          pass: smtpConfig.password
        },
        pool: true,
        maxConnections: 5,
        maxMessages: 100
      });

      // Verbindung testen
      if (this.transporter) {
        await this.transporter.verify();
      }
      console.log('SMTP Transporter erfolgreich initialisiert');

    } catch (error) {
      console.error('SMTP Transporter Initialisierung fehlgeschlagen:', error);
      // Fallback auf lokalen SMTP oder Test-Modus
      this.createFallbackTransporter();
    }
  }

  /**
   * SMTP Konfiguration abrufen
   */
  private async getSMTPConfig(): Promise<any> {
    // TODO: Aus Environment Variables oder Firestore Config laden
    // Aktuell: Jonas SMTP, später: Hetzner Server
    return {
      host: process.env.SMTP_HOST || 'mail.yourdomain.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      user: process.env.SMTP_USER || 'noreply@buderus-systeme.de',
      password: process.env.SMTP_PASSWORD || ''
    };
  }

  /**
   * Fallback Transporter für Tests
   */
  private createFallbackTransporter(): void {
    console.log('Erstelle Fallback Transporter (Test-Modus)');
    this.transporter = nodemailer.createTransport({
      jsonTransport: true
    });
  }

  /**
   * E-Mail senden
   */
  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      if (!this.transporter) {
        await this.initializeTransporter();
      }

      if (!this.transporter) {
        throw new Error('E-Mail Transporter nicht verfügbar');
      }

      const mailOptions = {
        from: options.from || 'Buderus Systeme <noreply@buderus-systeme.de>',
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
        replyTo: options.replyTo || 'info@buderus-systeme.de'
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('E-Mail erfolgreich gesendet:', result.messageId);
      
      return true;

    } catch (error) {
      console.error('Fehler beim Senden der E-Mail:', error);
      return false;
    }
  }

  /**
   * Bestätigungs-E-Mail senden (Double Opt-In)
   */
  async sendConfirmationEmail(
    email: string, 
    confirmationToken: string, 
    personalization: PersonalizationData
  ): Promise<boolean> {
    try {
      const template = await getTemplate('newsletter-confirmation');
      
      // Template personalisieren
      const personalizedHtml = this.personalizeTemplate(template.html, {
        ...personalization,
        confirmationLink: `https://buderus-systeme.de/newsletter/confirm?token=${confirmationToken}`,
        email: email
      });

      const personalizedText = this.personalizeTemplate(template.text || '', {
        ...personalization,
        confirmationLink: `https://buderus-systeme.de/newsletter/confirm?token=${confirmationToken}`,
        email: email
      });

      return await this.sendEmail({
        to: email,
        subject: 'Newsletter-Anmeldung bestätigen - Buderus Systeme',
        html: personalizedHtml,
        text: personalizedText
      });

    } catch (error) {
      console.error('Fehler beim Senden der Bestätigungs-E-Mail:', error);
      return false;
    }
  }

  /**
   * Willkommens-E-Mail senden
   */
  async sendWelcomeEmail(
    email: string, 
    personalization: PersonalizationData
  ): Promise<boolean> {
    try {
      const template = await getTemplate('newsletter-welcome');
      
      const personalizedHtml = this.personalizeTemplate(template.html, {
        ...personalization,
        unsubscribeLink: `https://buderus-systeme.de/newsletter/unsubscribe?email=${encodeURIComponent(email)}`,
        email: email
      });

      const personalizedText = this.personalizeTemplate(template.text || '', {
        ...personalization,
        unsubscribeLink: `https://buderus-systeme.de/newsletter/unsubscribe?email=${encodeURIComponent(email)}`,
        email: email
      });

      return await this.sendEmail({
        to: email,
        subject: 'Willkommen im Newsletter - Buderus Systeme',
        html: personalizedHtml,
        text: personalizedText
      });

    } catch (error) {
      console.error('Fehler beim Senden der Willkommens-E-Mail:', error);
      return false;
    }
  }

  /**
   * Newsletter versenden
   */
  async sendNewsletter(
    email: string,
    subject: string,
    htmlContent: string,
    personalization: PersonalizationData,
    textContent?: string
  ): Promise<boolean> {
    try {
      // Template personalisieren
      const personalizedHtml = this.personalizeTemplate(htmlContent, {
        ...personalization,
        unsubscribeLink: `https://buderus-systeme.de/newsletter/unsubscribe?email=${encodeURIComponent(email)}`,
        email: email
      });

      const personalizedText = textContent ? 
        this.personalizeTemplate(textContent, personalization) : 
        undefined;

      return await this.sendEmail({
        to: email,
        subject: subject,
        html: personalizedHtml,
        text: personalizedText
      });

    } catch (error) {
      console.error('Fehler beim Senden des Newsletters:', error);
      return false;
    }
  }

  /**
   * Template mit Variablen personalisieren
   */
  private personalizeTemplate(template: string, data: PersonalizationData): string {
    let personalized = template;

    // Standard-Variablen ersetzen
    Object.keys(data).forEach(key => {
      const value = data[key] || '';
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      personalized = personalized.replace(regex, value);
    });

    // Vollständigen Namen zusammensetzen
    const fullName = [data.firstName, data.lastName].filter(Boolean).join(' ');
    personalized = personalized.replace(/{{[\s]*fullName[\s]*}}/g, fullName);

    // Anrede generieren
    const salutation = data.firstName ? `Hallo ${data.firstName}` : 'Hallo';
    personalized = personalized.replace(/{{[\s]*salutation[\s]*}}/g, salutation);

    // Datum formatieren
    const currentDate = new Date().toLocaleDateString('de-DE');
    personalized = personalized.replace(/{{[\s]*currentDate[\s]*}}/g, currentDate);

    // Firmen-spezifische Variablen
    personalized = personalized.replace(/{{[\s]*companyName[\s]*}}/g, 'Buderus Systeme GmbH');
    personalized = personalized.replace(/{{[\s]*websiteUrl[\s]*}}/g, 'https://buderus-systeme.de');

    return personalized;
  }

  /**
   * Transporter Status prüfen
   */
  async isHealthy(): Promise<boolean> {
    try {
      if (!this.transporter) {
        await this.initializeTransporter();
      }
      
      if (!this.transporter) {
        return false;
      }

      await this.transporter.verify();
      return true;

    } catch (error) {
      console.error('E-Mail Service Gesundheitscheck fehlgeschlagen:', error);
      return false;
    }
  }
}
