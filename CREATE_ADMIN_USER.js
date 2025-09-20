// Test User Creator für Admin
// In Browser Console ausführen nach Firebase Auth Setup

async function createTestAdmin() {
  const { createUser } = require('./hooks/useAuth');
  
  try {
    await createUser(
      'admin@helios-energy.de',
      'admin123456',
      'admin',
      'Test Administrator',
      'IT'
    );
    console.log('✅ Admin User erstellt!');
  } catch (error) {
    console.error('❌ Fehler:', error);
  }
}

// Für Console:
// createTestAdmin();
