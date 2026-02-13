# SmartWash - Quick Start

Fast setup guide for SmartWash Laundry Management System.

## 📦 1. Extract Files

Having trouble with ZIP files?

- **Windows:** Right-click → Extract All (or use [7-Zip](https://www.7-zip.org/))
- **Mac:** Double-click ZIP file
- **Linux:** `unzip filename.zip`

## 🟢 2. Install Node.js

Download from: **https://nodejs.org/** (v18 or higher)

Check installation:
```bash
node --version
```

## 💻 3. Open in VS Code

1. Download **VS Code**: https://code.visualstudio.com/
2. **File** → **Open Folder** → Select SmartWash folder
3. Install recommended extensions (VS Code will prompt you)

## 📦 4. Install Dependencies

Open terminal in VS Code (`` Ctrl+` ``):

```bash
npm install
```

Wait 5-10 minutes for installation to complete.

## 🚀 5. Start the App

```bash
npm run dev
```

Open browser: **http://localhost:5173**

## 🎯 Test Login

### Customer Login
- Click "Register" and create a new account
- Required: First name, last name, email, password, 11-digit phone

### Admin Access
1. On login page, press: **Ctrl+Alt+P** (Windows/Linux) or **Cmd+Alt+P** (Mac)
2. Username: `admin`
3. Password: `admin123`

## 🛠️ Common Commands

| Command | Action |
|---------|--------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

## 📁 Project Structure

```
smartwash/
├── components/          # React components
│   ├── ui/             # Buttons, inputs, etc.
│   ├── AdminDashboard.tsx
│   ├── BookingModal.tsx
│   └── ...
├── styles/
│   └── globals.css     # Global styles
├── App.tsx             # Main component
└── main.tsx            # Entry point
```

## 🚨 Troubleshooting

### Can't unzip?
→ Try 7-Zip or re-download the file

### Port 5173 in use?
→ Close other dev servers or change port in `vite.config.ts`

### Module errors?
→ Delete `node_modules` and run `npm install` again

### TypeScript errors?
→ Press `Ctrl+Shift+P` → "TypeScript: Restart TS Server"

## 📱 Key Features

✅ Customer registration and login  
✅ Service booking with pricing  
✅ Delivery with distance-based fees  
✅ Payment options (Cash, GCash, PayMaya, Card)  
✅ Digital receipts  
✅ Admin dashboard  
✅ Booking status tracking  
✅ Business statistics  

## 💵 Currency & Format

- All prices in Philippine Pesos (**₱**)
- Phone numbers: **11 digits** (e.g., 09171234567)

## 🔐 Status Workflow

1. **pending** - New booking
2. **confirmed** - Admin approved
3. **in-progress** - Being processed
4. **in-transit** - Out for delivery
5. **completed** - Delivered
6. **received** - Customer confirmed (customer-only)
7. **cancelled** - Cancelled

## 📚 Full Documentation

- **SETUP.md** - Detailed setup instructions
- **DEPLOYMENT.md** - How to deploy online
- **README.md** - Complete feature overview

## 🆘 Need Help?

1. Check browser console (F12) for errors
2. Ensure Node.js v18+ is installed
3. Make sure port 5173 is available
4. Read full **SETUP.md** for detailed troubleshooting

---

**That's it!** Run `npm run dev` and you're ready to go! 🎉
