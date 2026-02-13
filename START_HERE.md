# 🚀 START HERE - SmartWash Setup

Welcome to **SmartWash** - Professional Laundry Management System!

This is your main guide to get started. Choose the path that fits your needs.

---

## 📋 Choose Your Path

### 🏃 **Path 1: I Want to Get Started Quickly** (5 minutes)

→ Read **QUICK_START.md**

Perfect for: Developers familiar with Node.js and React

### 📚 **Path 2: I Need Detailed Instructions** (15 minutes)

→ Read **SETUP.md**

Perfect for: First-time users or those who want step-by-step guidance

### 📦 **Path 3: I'm Having ZIP Extraction Issues**

→ Read **EXTRACT_HELP.md**

Perfect for: If you can't extract the ZIP file

### 🚀 **Path 4: I Want to Deploy Online**

→ Read **DEPLOYMENT.md**

Perfect for: Deploying to production after development is done

---

## ⚡ Super Quick Start (For Experts)

Already have Node.js and VS Code?

```bash
# 1. Extract ZIP file
# 2. Open folder in VS Code
# 3. Run in terminal:
npm install
npm run dev
```

Open: http://localhost:5173

**Admin access:** Press `Ctrl+Alt+P` on login page  
Username: `admin` | Password: `admin123`

---

## 🎯 What is SmartWash?

A complete laundry shop management system with:

### Customer Features
✅ User registration & login  
✅ Book laundry services  
✅ Choose service types (Wash, Dry, Fold, etc.)  
✅ Delivery with distance-based pricing  
✅ Multiple payment options  
✅ Track booking status  
✅ View digital receipts  
✅ Manage account  

### Admin Features
✅ Secure dashboard  
✅ View all bookings  
✅ Update booking statuses  
✅ Search & filter bookings  
✅ Business statistics  
✅ Customer management  

---

## 📁 What's Included?

- **Working application** with customer and admin interfaces
- **Complete source code** (React + TypeScript + Tailwind CSS)
- **Development server** (Vite)
- **UI components** library
- **Responsive design** for desktop
- **Local data storage** (localStorage)

---

## 💻 System Requirements

### Minimum Requirements
- **Operating System:** Windows 10/11, macOS 10.15+, or Linux
- **Node.js:** Version 18 or higher
- **RAM:** 4GB minimum (8GB recommended)
- **Disk Space:** 1GB free space
- **Browser:** Chrome, Firefox, Safari, or Edge (latest version)

### Recommended Setup
- **Visual Studio Code** (free code editor)
- **Node.js LTS** version (v20 recommended)
- **8GB RAM** or more
- **Good internet connection** (for initial setup)

---

## 🛠️ Setup Overview

### Step 1: Prerequisites ✅
- [ ] Node.js installed → [Download](https://nodejs.org/)
- [ ] Visual Studio Code installed → [Download](https://code.visualstudio.com/)
- [ ] Project files extracted

### Step 2: Installation ⚙️
- [ ] Open project in VS Code
- [ ] Install VS Code extensions (prompted automatically)
- [ ] Run `npm install` in terminal

### Step 3: Run Application 🚀
- [ ] Run `npm run dev`
- [ ] Open http://localhost:5173
- [ ] Test customer login
- [ ] Test admin access (Ctrl+Alt+P)

### Step 4: Customize (Optional) 🎨
- [ ] Modify components
- [ ] Update styles
- [ ] Add your branding

### Step 5: Deploy (Optional) 🌐
- [ ] Build: `npm run build`
- [ ] Deploy to Netlify, Vercel, etc.

---

## 🎬 Quick Test After Setup

1. **Customer Registration**
   - Click "Register"
   - Fill in: First name, Last name, Email, Password, Phone (11 digits)
   - Click "Register"

2. **Create a Booking**
   - Click "Book Now"
   - Select services
   - Choose pickup date/time
   - Add delivery info (optional)
   - Select payment method
   - Submit

3. **Check Admin Panel**
   - Go back to login page
   - Press `Ctrl+Alt+P`
   - Login: admin / admin123
   - View bookings
   - Update status
   - View statistics

---

## 📖 Documentation Map

| File | Purpose | Read When |
|------|---------|-----------|
| **START_HERE.md** | Overview (this file) | First! |
| **QUICK_START.md** | Fast 5-step setup | You're experienced |
| **SETUP.md** | Detailed instructions | You need guidance |
| **EXTRACT_HELP.md** | ZIP extraction help | Having extract issues |
| **DEPLOYMENT.md** | Deploy to production | Ready to go live |
| **README.md** | Feature overview | Want to learn features |

---

## 🔧 Available Scripts

Run these in the terminal:

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Check code quality
npm run lint

# Format code
npm run format
```

### Easy Scripts (Windows)

Double-click: **`start.bat`**
- Installs dependencies if needed
- Starts development server

### Easy Scripts (Mac/Linux)

```bash
chmod +x start.sh
./start.sh
```

---

## 🎯 Default Login Credentials

### Customer Account
Create new account with:
- First Name
- Last Name
- Email
- Password
- Phone (11 digits, e.g., 09171234567)

### Admin Account
- **Access:** Press `Ctrl+Alt+P` on login page
- **Username:** `admin`
- **Password:** `admin123`

⚠️ **Important:** Change admin password before deploying to production!

---

## 🔍 Project Structure Quick Reference

```
smartwash/
├── components/              # All React components
│   ├── ui/                 # Reusable UI components
│   ├── AdminDashboard.tsx  # Admin panel
│   ├── BookingModal.tsx    # Booking form
│   ├── CustomerLogin.tsx   # Login/Register
│   └── ...
├── styles/
│   └── globals.css         # Global styles
├── App.tsx                 # Main component
├── main.tsx                # Entry point
├── package.json            # Dependencies
├── vite.config.ts          # Vite config
└── [Documentation files]   # Setup guides
```

---

## ❓ Common Questions

### Q: Do I need a backend server?
**A:** No! This runs entirely in the browser using localStorage. However, for production with real customers, you'll want a real database (see DEPLOYMENT.md).

### Q: Can I customize the design?
**A:** Yes! Edit components and use Tailwind CSS classes. All styles in `styles/globals.css`.

### Q: Is this mobile responsive?
**A:** The UI is optimized for desktop. Mobile support can be added with additional CSS.

### Q: How is data stored?
**A:** Currently in browser localStorage. This is fine for testing but not recommended for production.

### Q: Can multiple users access the same data?
**A:** Not with localStorage. For multi-user access, you need a backend database.

### Q: What if I get errors?
**A:** Check the troubleshooting section in SETUP.md or read error messages in the browser console (F12).

---

## 🆘 Getting Help

### If You're Stuck

1. **Check browser console**
   - Press F12 → Console tab
   - Look for red error messages

2. **Read error messages carefully**
   - They usually tell you what's wrong

3. **Common fixes:**
   - Delete `node_modules` and run `npm install` again
   - Check Node.js version: `node --version` (need v18+)
   - Make sure port 5173 isn't being used
   - Restart VS Code
   - Restart your computer

4. **Check documentation**
   - SETUP.md has detailed troubleshooting
   - EXTRACT_HELP.md for ZIP issues

---

## 📋 Pre-Flight Checklist

Before starting, make sure you have:

- [ ] ✅ Extracted all files successfully
- [ ] ✅ Node.js v18 or higher installed
- [ ] ✅ Visual Studio Code installed
- [ ] ✅ At least 1GB free disk space
- [ ] ✅ Internet connection (for npm install)
- [ ] ✅ Administrator access on your computer

---

## 🚀 Ready? Let's Go!

### Next Step:

1. **If you're comfortable with development:**
   → Open **QUICK_START.md** and follow 5 simple steps

2. **If you want detailed guidance:**
   → Open **SETUP.md** for step-by-step instructions

3. **If you have ZIP extraction issues:**
   → Open **EXTRACT_HELP.md** first

---

## 🎉 After Successful Setup

You'll see:
- Customer login page at http://localhost:5173
- Ability to register new customers
- Booking system working
- Admin panel accessible (Ctrl+Alt+P)

Then you can:
- Explore the features
- Customize the design
- Add your branding
- Deploy to production

---

## 📞 Quick Reference Card

| Need | Do This |
|------|---------|
| Install | `npm install` |
| Start app | `npm run dev` |
| Build | `npm run build` |
| Admin login | Ctrl+Alt+P on login page |
| View docs | Check README.md |
| Troubleshoot | Check SETUP.md |
| Deploy | Check DEPLOYMENT.md |

---

## 💡 Pro Tips

1. **Use the start scripts** - Just double-click `start.bat` (Windows) or run `./start.sh` (Mac/Linux)
2. **Save often** - Hot reload shows changes instantly
3. **Check console** - F12 shows helpful error messages
4. **Use VS Code extensions** - Install the recommended ones
5. **Read comments** - Code has helpful inline documentation

---

**Ready to dive in?** Pick your path above and let's get SmartWash running! 🚀

*For the fastest experience, try the Windows `start.bat` or Mac/Linux `start.sh` scripts!*
