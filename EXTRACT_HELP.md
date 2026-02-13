# File Extraction Help

Having trouble extracting the SmartWash ZIP file? Here are solutions for common issues.

## Problem: "Cannot Extract" or "Archive is Corrupted"

### Solution 1: Use Different Extraction Software

#### Windows Users

**Option A: Built-in Windows Extractor**
1. Right-click the ZIP file
2. Select "Extract All..."
3. Choose destination folder
4. Click "Extract"

**Option B: 7-Zip (Recommended if Windows fails)**
1. Download 7-Zip: https://www.7-zip.org/download.html
2. Install 7-Zip
3. Right-click ZIP file → 7-Zip → Extract Here

**Option C: WinRAR**
1. Download WinRAR: https://www.win-rar.com/download.html
2. Install WinRAR (free trial)
3. Right-click ZIP file → Extract Here

#### Mac Users

**Option A: Built-in Archive Utility**
1. Double-click the ZIP file
2. It should extract automatically

**Option B: Using Terminal**
1. Open Terminal (Applications → Utilities → Terminal)
2. Navigate to ZIP file location:
   ```bash
   cd ~/Downloads
   ```
3. Extract:
   ```bash
   unzip smartwash.zip
   ```

**Option C: The Unarchiver (Free App)**
1. Download from Mac App Store: https://theunarchiver.com/
2. Open The Unarchiver
3. Drag ZIP file into it

#### Linux Users

**Option A: GUI File Manager**
1. Right-click ZIP file
2. Select "Extract Here"

**Option B: Terminal**
```bash
unzip smartwash.zip -d smartwash
```

**Option C: Install unzip if not available**
```bash
# Ubuntu/Debian
sudo apt-get install unzip

# Fedora
sudo dnf install unzip

# Arch
sudo pacman -S unzip
```

## Problem: "Not Enough Space"

### Check Available Space

**Windows:**
1. Open File Explorer
2. Right-click drive (usually C:)
3. Select "Properties"
4. Check free space (need ~1GB)

**Mac:**
1. Click Apple menu → About This Mac
2. Click "Storage"
3. Check available space

**Solution:**
1. Delete temporary files
2. Empty Recycle Bin / Trash
3. Move large files to external drive
4. Extract to different drive with more space

## Problem: "Access Denied" or "Permission Error"

### Windows Solutions

**Option 1: Run as Administrator**
1. Right-click the extraction program
2. Select "Run as administrator"
3. Try extracting again

**Option 2: Change Permissions**
1. Right-click ZIP file → Properties
2. Go to Security tab
3. Click Edit
4. Give your user Full Control

**Option 3: Extract to Different Location**
- Try extracting to Desktop or Documents instead of Program Files

### Mac Solutions

**Option 1: Check Permissions**
1. Right-click ZIP file → Get Info
2. Check "Sharing & Permissions" at bottom
3. Ensure you have "Read & Write"

**Option 2: Use Terminal with sudo**
```bash
sudo unzip smartwash.zip
```

## Problem: File Appears Corrupted

### Possible Causes

1. **Incomplete download** - File didn't download completely
2. **Download interrupted** - Connection lost during download
3. **Antivirus interference** - Security software blocked parts
4. **Transfer error** - File corrupted during transfer

### Solutions

**1. Re-download the file**
- Delete the existing ZIP
- Clear browser cache
- Download again

**2. Verify file size**
- Check if file size matches what it should be
- If smaller, download was incomplete

**3. Temporarily disable antivirus**
- Disable antivirus
- Extract file
- Re-enable antivirus
- (Only if you trust the source!)

**4. Try different browser**
- Chrome, Firefox, Edge, Safari
- Sometimes one browser works better

**5. Download in Safe Mode**

Windows:
1. Restart computer
2. Press F8 during boot
3. Select "Safe Mode with Networking"
4. Download and extract

## Problem: Some Files Won't Extract

### Solution: Extract in Parts

If only some files fail:

1. Open ZIP with 7-Zip or WinRAR
2. Browse inside without extracting
3. Extract files one folder at a time
4. Skip problematic files initially
5. Try problematic files separately

## Problem: "Path Too Long" Error

Windows has a 260-character path limit.

### Solutions

**Option 1: Extract Closer to Root**
```
❌ C:\Users\YourName\Documents\Projects\Work\2024\Q1\SmartWash\
✅ C:\SmartWash\
```

**Option 2: Enable Long Paths (Windows 10/11)**
1. Press Win+R
2. Type: `gpedit.msc`
3. Navigate to: Computer Configuration → Administrative Templates → System → Filesystem
4. Enable "Enable Win32 long paths"
5. Restart computer

## Problem: Slow Extraction

### Why It's Slow
- Large number of files (node_modules will be added later)
- Antivirus scanning each file
- Slow hard drive

### Solutions

**1. Temporarily Disable Antivirus**
- Speed up extraction significantly
- Re-enable after

**2. Extract to SSD (if available)**
- Much faster than HDD

**3. Be Patient**
- Initial extraction of source code is quick
- node_modules (added when you run `npm install`) takes longer

## Verifying Successful Extraction

After extraction, you should have:

```
smartwash/
├── components/
├── styles/
├── App.tsx
├── main.tsx
├── index.html
├── package.json
├── README.md
├── SETUP.md
└── ... (other files)
```

**Key files to check:**
- ✅ `package.json` exists
- ✅ `App.tsx` exists
- ✅ `components/` folder exists
- ✅ `README.md` exists

## Still Having Issues?

### Alternative: Download Individual Files

If ZIP extraction continues to fail:

1. Ask for files in a different format:
   - `.tar.gz` format
   - `.rar` format
   - Individual files via cloud storage

2. Or access via Git (if available):
   ```bash
   git clone [repository-url]
   ```

## Next Steps After Extraction

Once files are extracted successfully:

1. ✅ Open folder in Visual Studio Code
2. ✅ Open terminal in VS Code
3. ✅ Run: `npm install`
4. ✅ Run: `npm run dev`
5. ✅ Open: http://localhost:5173

## Quick Test Scripts

To make starting easier, we've included scripts:

**Windows Users:**
- Double-click `start.bat`

**Mac/Linux Users:**
1. Open Terminal in the folder
2. Make script executable:
   ```bash
   chmod +x start.sh
   ```
3. Run:
   ```bash
   ./start.sh
   ```

These scripts will:
- Check if Node.js is installed
- Install dependencies automatically
- Start the development server

---

## Common Error Messages & Fixes

| Error | Fix |
|-------|-----|
| "Not a valid archive" | Re-download file |
| "CRC failed" | File corrupted, re-download |
| "Access denied" | Run as administrator |
| "Path too long" | Extract closer to root (e.g., C:\SmartWash) |
| "Unsupported format" | Use 7-Zip or WinRAR |
| "Disk full" | Free up space |

---

**If all else fails**, you can always set up the project manually:
1. Create a new folder
2. Copy files one by one
3. Create `package.json` first
4. Run `npm install` to regenerate node_modules

Need more help? Check SETUP.md for detailed instructions!
