# 📁 SmartWash File Guide

Complete reference for all files and folders in your SmartWash project.

---

## 📚 Documentation Files (Read These First!)

| File | Purpose | When to Read |
|------|---------|--------------|
| **START_HERE.md** | Main entry point, overview | 👉 **READ FIRST** |
| **QUICK_START.md** | 5-step quick setup | If you're experienced |
| **SETUP.md** | Detailed step-by-step setup | If you need guidance |
| **EXTRACT_HELP.md** | ZIP extraction troubleshooting | Having extraction issues |
| **DEPLOYMENT.md** | Deploy to production | Ready to go live |
| **TROUBLESHOOTING.md** | Common issues & solutions | Something's not working |
| **TRANSFER_CHECKLIST.md** | Complete checklist | Systematic setup |
| **FILE_GUIDE.md** | This file - project overview | Understanding structure |
| **README.md** | Feature overview | Learning about features |

---

## 🚀 Quick Start Scripts

| File | Purpose | How to Use |
|------|---------|------------|
| **start.bat** | Windows launch script | Double-click to start |
| **start.sh** | Mac/Linux launch script | `./start.sh` in terminal |

These scripts automatically:
- Check if Node.js is installed
- Install dependencies if needed
- Start the development server

---

## ⚙️ Configuration Files

### Essential Config

| File | Purpose | Should You Edit? |
|------|---------|------------------|
| **package.json** | Dependencies & scripts | ⚠️ Only if adding packages |
| **tsconfig.json** | TypeScript settings | ❌ No, leave as-is |
| **vite.config.ts** | Vite build config | ⚠️ Only for ports/paths |
| **postcss.config.js** | PostCSS/Tailwind config | ❌ No, leave as-is |

### Code Quality

| File | Purpose | Should You Edit? |
|------|---------|------------------|
| **.eslintrc.json** | ESLint rules | ⚠️ Only if you know ESLint |
| **.prettierrc** | Code formatting rules | ⚠️ Only if you need custom style |
| **.gitignore** | Git ignore patterns | ✅ Add more ignores as needed |

### VS Code Settings

| File | Purpose | Should You Edit? |
|------|---------|------------------|
| **.vscode/settings.json** | Editor settings | ⚠️ Customize if needed |
| **.vscode/extensions.json** | Recommended extensions | ✅ Add your favorites |

---

## 🎨 Source Code Files

### Entry Points

| File | Purpose | Should You Edit? |
|------|---------|------------------|
| **index.html** | HTML template | ⚠️ Only for metadata/title |
| **main.tsx** | App entry point | ❌ Rarely |
| **App.tsx** | Main component | ✅ Yes, main app logic |

### Styles

| File | Purpose | Should You Edit? |
|------|---------|------------------|
| **styles/globals.css** | Global styles | ✅ Yes, customize theme |

### Components (components/)

#### Main Features

| File | Purpose | Edit? |
|------|---------|-------|
| **AdminDashboard.tsx** | Admin panel | ✅ Yes |
| **AdminLogin.tsx** | Admin authentication | ✅ Yes |
| **BookingModal.tsx** | Booking form | ✅ Yes |
| **CustomerLogin.tsx** | Customer auth | ✅ Yes |
| **MyAccount.tsx** | Customer dashboard | ✅ Yes |
| **Receipt.tsx** | Digital receipt | ✅ Yes |

#### Layout Components

| File | Purpose | Edit? |
|------|---------|-------|
| **Header.tsx** | Navigation header | ✅ Yes |
| **Hero.tsx** | Landing section | ✅ Yes |
| **AboutUs.tsx** | About page | ✅ Yes |
| **Services.tsx** | Services list | ✅ Yes |

#### UI Library (components/ui/)

30+ reusable components including:
- **button.tsx** - Button component
- **input.tsx** - Input fields
- **dialog.tsx** - Modal dialogs
- **table.tsx** - Data tables
- **card.tsx** - Card layouts
- And many more...

**Edit?** ⚠️ Only if you need to customize base components

#### Figma Components (components/figma/)

| File | Purpose | Edit? |
|------|---------|-------|
| **ImageWithFallback.tsx** | Image handling | ❌ No, protected |

---

## 📦 Generated Folders (Don't Edit)

### node_modules/
- **Purpose:** All npm packages
- **Size:** ~500MB
- **Edit?** ❌ NEVER! Deleted and regenerated via `npm install`
- **In Git?** No (in .gitignore)

### dist/
- **Purpose:** Production build output
- **Created by:** `npm run build`
- **Edit?** ❌ No, auto-generated
- **In Git?** No (in .gitignore)

---

## 🗂️ Complete File Tree

```
smartwash/
│
├── 📚 Documentation
│   ├── START_HERE.md               👈 Read this first!
│   ├── QUICK_START.md              Fast setup
│   ├── SETUP.md                    Detailed setup
│   ├── EXTRACT_HELP.md             ZIP issues
│   ├── DEPLOYMENT.md               Deploy guide
│   ├── TROUBLESHOOTING.md          Fix issues
│   ├── TRANSFER_CHECKLIST.md       Step-by-step checklist
│   ├── FILE_GUIDE.md               This file
│   ├── README.md                   Feature overview
│   └── Attributions.md             Credits (can ignore)
│
├── 🚀 Quick Start Scripts
│   ├── start.bat                   Windows launcher
│   └── start.sh                    Mac/Linux launcher
│
├── ⚙️ Configuration
│   ├── package.json                Dependencies
│   ├── tsconfig.json               TypeScript
│   ├── vite.config.ts              Vite config
│   ├── postcss.config.js           PostCSS
│   ├── .eslintrc.json              ESLint
│   ├── .prettierrc                 Prettier
│   ├── .gitignore                  Git ignores
│   └── .vscode/
│       ├── settings.json           VS Code settings
│       └── extensions.json         Recommended extensions
│
├── 🎯 Entry Points
│   ├── index.html                  HTML template
│   ├── main.tsx                    App entry
│   └── App.tsx                     Main component
│
├── 🎨 Styles
│   └── styles/
│       └── globals.css             Global styles
│
├── 📦 Components
│   ├── components/
│   │   ├── AdminDashboard.tsx      Admin panel
│   │   ├── AdminLogin.tsx          Admin auth
│   │   ├── BookingModal.tsx        Booking form
│   │   ├── CustomerLogin.tsx       Customer auth
│   │   ├── MyAccount.tsx           Customer account
│   │   ├── Receipt.tsx             Digital receipt
│   │   ├── Header.tsx              Navigation
│   │   ├── Hero.tsx                Landing hero
│   │   ├── AboutUs.tsx             About page
│   │   ├── Services.tsx            Services list
│   │   │
│   │   ├── figma/
│   │   │   └── ImageWithFallback.tsx  Image component
│   │   │
│   │   └── ui/                     30+ UI components
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       ├── dialog.tsx
│   │       ├── table.tsx
│   │       └── ... (many more)
│   │
│   └── guidelines/
│       └── Guidelines.md           System guidelines (ignore)
│
└── 📂 Generated (Don't Edit)
    ├── node_modules/               npm packages
    └── dist/                       Build output
```

---

## 🎯 What to Edit for Customization

### ✅ Safe to Edit (Common Changes)

**Branding & Content:**
- `App.tsx` - Main app structure
- `components/Header.tsx` - Logo, navigation
- `components/Hero.tsx` - Landing page content
- `components/AboutUs.tsx` - About information
- `components/Services.tsx` - Service listings
- `styles/globals.css` - Colors, fonts

**Features:**
- `components/BookingModal.tsx` - Booking form logic
- `components/AdminDashboard.tsx` - Admin features
- `components/MyAccount.tsx` - Customer dashboard

**Styling:**
- `styles/globals.css` - Global theme
- Any component file - Tailwind classes

### ⚠️ Edit Carefully

**Configuration:**
- `package.json` - Only add dependencies
- `vite.config.ts` - Only if changing port/paths
- `.eslintrc.json` - Only if you know linting rules

**Entry Points:**
- `main.tsx` - Only for global setup
- `index.html` - Only for meta tags/title

### ❌ Don't Edit

**Protected/Generated:**
- `components/figma/ImageWithFallback.tsx` - Protected
- `node_modules/` - Auto-generated
- `dist/` - Build output
- `package-lock.json` - Auto-generated

**System Config (unless you know what you're doing):**
- `tsconfig.json`
- `postcss.config.js`

---

## 📏 File Size Reference

**Before npm install:**
- Source code: ~50-100 KB
- Config files: ~10 KB
- Documentation: ~100 KB
- **Total:** ~200 KB

**After npm install:**
- node_modules: ~500 MB
- **Total:** ~500 MB

**After npm build:**
- dist folder: ~500 KB (optimized)

---

## 🔍 Finding Specific Features

| Want to Change | Edit This File |
|----------------|----------------|
| App title | `index.html` (line 7) |
| Navigation links | `components/Header.tsx` |
| Landing page | `components/Hero.tsx` |
| Services offered | `components/Services.tsx` |
| Booking form fields | `components/BookingModal.tsx` |
| Admin dashboard | `components/AdminDashboard.tsx` |
| Admin credentials | `components/CustomerLogin.tsx` |
| Color scheme | `styles/globals.css` |
| Font styles | `styles/globals.css` |
| Button styles | `components/ui/button.tsx` |

---

## 📋 File Types Explained

| Extension | Type | Purpose |
|-----------|------|---------|
| **.tsx** | TypeScript + JSX | React components |
| **.ts** | TypeScript | TypeScript files |
| **.css** | CSS | Stylesheets |
| **.json** | JSON | Configuration |
| **.md** | Markdown | Documentation |
| **.html** | HTML | HTML template |
| **.js** | JavaScript | Config files |
| **.bat** | Batch | Windows script |
| **.sh** | Shell | Unix script |

---

## 🗂️ Folder Organization

```
Project Root
│
├── 📄 Docs at root level (easy to find)
├── ⚙️ Config at root level (standard convention)
├── 🎯 Entry files at root level (index.html, main.tsx, App.tsx)
│
├── components/
│   ├── 📦 Feature components (top level)
│   ├── ui/ (reusable components)
│   └── figma/ (special components)
│
├── styles/
│   └── 📝 All stylesheets
│
├── .vscode/
│   └── ⚙️ VS Code specific settings
│
└── node_modules/
    └── 📦 All dependencies (don't touch!)
```

---

## 💡 Pro Tips

### For Developers

1. **Start here:**
   - Read START_HERE.md
   - Open App.tsx
   - Explore components/

2. **Making changes:**
   - Edit component files in components/
   - See changes instantly (hot reload)
   - Check console for errors (F12)

3. **Adding features:**
   - Create new component in components/
   - Import in App.tsx
   - Use existing UI components from components/ui/

### For Customization

1. **Change colors:**
   - Edit `styles/globals.css`
   - Modify CSS variables

2. **Change layout:**
   - Edit component files
   - Modify Tailwind classes

3. **Add pages:**
   - Create new component
   - Add to routing in App.tsx

---

## 🚫 Files You Can Delete

**Optional to keep:**
- `Attributions.md` - Credits (nice to keep)
- `guidelines/Guidelines.md` - System file (ignore)

**Don't delete anything else!** All other files are needed for the app to run.

---

## 📦 Dependencies Overview

**Main Dependencies (package.json):**
- **react** - UI framework
- **react-dom** - React rendering
- **lucide-react** - Icons
- **date-fns** - Date handling
- **sonner** - Notifications
- **Tailwind utilities** - Styling helpers

**Dev Dependencies:**
- **vite** - Build tool
- **typescript** - Type checking
- **eslint** - Code linting
- **prettier** - Code formatting
- **tailwindcss** - CSS framework

---

## ✅ Checklist Before Editing

Before modifying files, ensure:

- [ ] You understand what the file does
- [ ] You have a backup (or Git commit)
- [ ] Dev server is running to see changes
- [ ] You know how to undo changes
- [ ] File is safe to edit (check table above)

---

## 🆘 Accidentally Deleted Something?

**If you deleted a source file:**
1. Check if you have backup
2. Re-extract from ZIP
3. Copy the file back

**If you deleted node_modules:**
- No problem! Run `npm install` to restore

**If you deleted dist:**
- No problem! Run `npm run build` to rebuild

**If you deleted package-lock.json:**
- No problem! Run `npm install` to regenerate

---

## 📚 Learning Path

**Day 1:** Read START_HERE.md → Get app running  
**Day 2:** Read component files → Understand structure  
**Day 3:** Make small changes → Test hot reload  
**Day 4:** Customize styling → Add your brand  
**Day 5:** Add features → Extend functionality  

---

**Quick Reference:**
- 🟢 **Safe to edit** - Go ahead!
- 🟡 **Edit carefully** - Know what you're doing
- 🔴 **Don't edit** - Will break things

When in doubt, make a backup first! 🎯
