// NFC und Link Sharing Funktionalität
class ContactSharing {
    constructor() {
        this.websiteUrl = window.location.origin + window.location.pathname;
        this.contactData = {
            name: "Max Mustermann",
            title: "Senior Webentwickler & UI/UX Designer",
            phone: "+49123456789",
            email: "max.mustermann@buderus-systeme.com",
            website: "https://buderus-systeme.com"
        };
    }

    // Web Share API (funktioniert auf mobilen Geräten)
    async shareContact() {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: this.contactData.name,
                    text: `${this.contactData.name} - ${this.contactData.title}`,
                    url: this.websiteUrl
                });
                console.log('Erfolgreich geteilt');
            } catch (error) {
                console.log('Teilen abgebrochen', error);
                this.fallbackShare();
            }
        } else {
            this.fallbackShare();
        }
    }

    // NFC (experimentell - nur auf unterstützten Geräten)
    async shareViaNCF() {
        if ('NDEFWriter' in window) {
            try {
                const ndef = new NDEFWriter();
                await ndef.write({
                    records: [
                        {
                            recordType: "url",
                            data: this.websiteUrl
                        },
                        {
                            recordType: "text",
                            data: `${this.contactData.name} - ${this.contactData.title}`
                        }
                    ]
                });
                alert('NFC Tag beschrieben! Halten Sie ein anderes Gerät an Ihr Telefon.');
            } catch (error) {
                console.error('NFC Fehler:', error);
                alert('NFC wird von Ihrem Gerät nicht unterstützt.');
            }
        } else {
            alert('NFC wird von Ihrem Browser nicht unterstützt.');
        }
    }

    // Fallback: Link kopieren
    fallbackShare() {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(this.websiteUrl).then(() => {
                alert('Link wurde in die Zwischenablage kopiert!');
            });
        } else {
            // Alter Fallback
            const textArea = document.createElement('textarea');
            textArea.value = this.websiteUrl;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert('Link wurde in die Zwischenablage kopiert!');
        }
    }

    // QR Code für Link-Sharing
    generateQRCode() {
        // Der QR Code in Ihrem assets/qr.png sollte bereits den Link zu Ihrer Website enthalten
        // Wenn Nutzer den QR Code scannen, öffnet sich automatisch die Website
        console.log('QR Code zeigt auf:', this.websiteUrl);
    }
}

// Initialisierung
document.addEventListener('DOMContentLoaded', function() {
    const sharing = new ContactSharing();
    
    // QR Code klickbar machen für Sharing-Optionen
    const qrCode = document.querySelector('.qr-code img');
    if (qrCode) {
        qrCode.style.cursor = 'pointer';
        qrCode.addEventListener('click', function() {
            // Zeige Sharing-Optionen
            if (confirm('Möchten Sie diese Kontakt-Seite teilen?')) {
                sharing.shareContact();
            }
        });
    }

    // Optional: Double-tap für NFC (experimentell)
    let tapCount = 0;
    if (qrCode) {
        qrCode.addEventListener('click', function() {
            tapCount++;
            setTimeout(() => {
                if (tapCount === 2) {
                    sharing.shareViaNCF();
                }
                tapCount = 0;
            }, 300);
        });
    }
});
