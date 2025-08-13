// Kontakt speichern Funktionalität
function saveContact() {
    // vCard Daten - passen Sie diese an Ihre Daten an
    const vCardData = `BEGIN:VCARD
VERSION:3.0
FN:Max Mustermann
N:Mustermann;Max;;;
ORG:Ihr Unternehmen
TITLE:Senior Webentwickler & UI/UX Designer
TEL;TYPE=CELL:+49 123 456789
EMAIL;TYPE=INTERNET:max.mustermann@example.com
URL:https://www.ihre-website.com
END:VCARD`;

    // Erstelle Blob mit vCard Daten
    const blob = new Blob([vCardData], { type: 'text/vcard;charset=utf-8' });
    
    // Erstelle Download Link
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Max_Mustermann.vcf';
    
    // Temporär zum DOM hinzufügen und klicken
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // URL wieder freigeben
    URL.revokeObjectURL(link.href);
}

// Event Listener für den Button
document.addEventListener('DOMContentLoaded', function() {
    const contactButton = document.querySelector('.main-button');
    if (contactButton) {
        contactButton.addEventListener('click', saveContact);
    }
});

// Telefon anrufen
function makeCall() {
    window.location.href = 'tel:+49123456789'; // Ihre Telefonnummer hier eintragen
}

// E-Mail senden
function sendEmail() {
    window.location.href = 'mailto:max.mustermann@example.com?subject=Kontakt%20von%20Website'; // Ihre E-Mail hier eintragen
}

// Event Listener für die anderen Buttons
document.addEventListener('DOMContentLoaded', function() {
    const phoneButton = document.querySelector('.phone-button');
    const emailButton = document.querySelector('.email-button');
    
    if (phoneButton) {
        phoneButton.addEventListener('click', makeCall);
    }
    
    if (emailButton) {
        emailButton.addEventListener('click', sendEmail);
    }
});
