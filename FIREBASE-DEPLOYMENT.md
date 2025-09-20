# Firebase Hosting - Multi-Domain Deployment

## 1. Firebase Hosting Targets erstellen
```bash
cd /Users/lucaschweiger/Documents/Clients/Buderus_Systeme/Website/buderus/buderus

# Backup original firebase.json
cp firebase.json firebase-original.json

# Replace with multi-domain config
cp firebase-multi-domain.json firebase.json

# Configure hosting targets
firebase target:apply hosting main helios-energy
firebase target:apply hosting login login-helios-energy  
firebase target:apply hosting admin admin-helios-energy
firebase target:apply hosting employee employee-helios-energy
```

## 2. React App Build & Deploy
```bash
# Build React app
cd react-app
npm run build

# Deploy all targets
cd ..
firebase deploy --only hosting
```

## 3. Test URLs (nach Deployment)
- **Login**: `https://login-helios-energy.web.app` 
- **Admin**: `https://admin-helios-energy.web.app`
- **Employee**: `https://employee-helios-energy.web.app`
- **Main**: `https://helios-energy.web.app`

## 4. Custom Domains (später hinzufügen)
```bash
firebase hosting:sites:create login-helios-nrg
firebase hosting:sites:create admin-helios-nrg  
firebase hosting:sites:create employee-helios-nrg

# In Firebase Console Custom Domains hinzufügen:
# login.helios-nrg.de → login-helios-nrg
# admin.helios-nrg.de → admin-helios-nrg
# employee.helios-nrg.de → employee-helios-nrg
```

## 5. Test Users erstellen
```bash
# Firebase Console → Authentication → Users → Add User
# oder via Code in useAuth.ts admin function
```

## Domain Detection Update
React App erkennt automatisch:
- `login-*` domains → LoginPage
- `admin-*` domains → Admin Dashboard  
- `employee-*` domains → Employee Portal
- localhost → alle drei funktional
