# 🔧 Troubleshooting Guide

Quick solutions to common issues when setting up and running SmartWash.

---

## 🚨 Critical Issues

### ❌ "Cannot extract files" / "Archive is corrupted"

**Problem:** ZIP file won't extract or shows errors

**Solutions:**
1. **Re-download the file** - May have been corrupted during download
2. **Use different extraction tool:**
   - Windows: 7-Zip (https://www.7-zip.org/)
   - Mac: The Unarchiver (App Store)
   - Linux: `unzip` command
3. **Disable antivirus temporarily** during extraction
4. **Check disk space** - Need at least 1GB free

**Detailed help:** → EXTRACT_HELP.md

---

### ❌ "node: command not found" or "npm: command not found"

**Problem:** Node.js not installed or not in PATH

**Solutions:**
1. **Install Node.js:**
   - Go to https://nodejs.org/
   - Download LTS version (v20 recommended)
   - Install and restart terminal

2. **Verify installation:**
   ```bash
   node --version    # Should show v18.x.x or higher
   npm --version     # Should show 9.x.x or higher
   ```

3. **If installed but not found:**
   - Windows: Add to PATH via Environment Variables
   - Mac/Linux: Check `~/.bashrc` or `~/.zshrc`

4. **Restart computer** after installation

---

### ❌ "npm install" fails with errors

**Problem:** Dependencies won't install

**Solution 1: Clear and reinstall**
```bash
# Delete node_modules and lock file
rm -rf node_modules package-lock.json

# Clear npm cache
npm cache clean --force

# Try again
npm install
```

**Solution 2: Check Node version**
```bash
node --version
# Need v18 or higher
```

**Solution 3: Try different package manager**
```bash
# Using yarn
npm install -g yarn
yarn install

# Or using pnpm
npm install -g pnpm
pnpm install
```

**Solution 4: Check internet connection**
- Ensure stable internet
- Try different network
- Disable VPN if active

**Solution 5: Administrator rights**
- Windows: Run terminal as Administrator
- Mac/Linux: Use `sudo` (not recommended, but may work)

---

### ❌ "npm run dev" fails or port already in use

**Problem 1: Port 5173 is already in use**

**Solution:**
```bash
# Find and kill process using the port
# Windows:
netstat -ano | findstr :5173
taskkill /PID [PID_NUMBER] /F

# Mac/Linux:
lsof -ti:5173 | xargs kill -9
```

**Or change port in `vite.config.ts`:**
```typescript
export default defineConfig({
  server: {
    port: 3000, // Change to any free port
  },
  plugins: [react()],
})
```

**Problem 2: Other errors**

Check for:
- Missing dependencies: `npm install`
- TypeScript errors: `npm run type-check`
- File permissions: Run as admin

---

### ❌ White screen / Blank page in browser

**Problem:** Application loads but shows nothing

**Solutions:**

1. **Check browser console:**
   - Press F12
   - Click "Console" tab
   - Look for error messages
   - Red text indicates errors

2. **Common causes:**
   - JavaScript disabled: Enable in browser settings
   - Extensions blocking: Disable ad blockers
   - Cache issues: Hard refresh (Ctrl+Shift+R)

3. **Verify dev server is running:**
   ```bash
   npm run dev
   # Should show "Local: http://localhost:5173/"
   ```

4. **Check if files compiled:**
   - Terminal should show no errors
   - Look for compilation messages

5. **Try different browser:**
   - Chrome, Firefox, or Edge

---

## ⚠️ Common Issues

### Issue: "Module not found" errors

**Cause:** Missing dependencies or wrong import paths

**Solutions:**

1. **Reinstall dependencies:**
   ```bash
   npm install
   ```

2. **Check import paths:**
   - Verify file exists
   - Check capitalization (case-sensitive)
   - Use correct relative paths

3. **Restart dev server:**
   - Stop (Ctrl+C)
   - Start again: `npm run dev`

---

### Issue: TypeScript errors in VS Code

**Problem:** Red underlines everywhere

**Solutions:**

1. **Restart TypeScript Server:**
   - Press Ctrl+Shift+P (Cmd+Shift+P on Mac)
   - Type "TypeScript: Restart TS Server"
   - Press Enter

2. **Install type definitions:**
   ```bash
   npm install -D @types/node @types/react @types/react-dom
   ```

3. **Check tsconfig.json exists:**
   - Should be in root folder
   - Contains TypeScript configuration

4. **Reload VS Code:**
   - Close and reopen VS Code

---

### Issue: Tailwind CSS classes not working

**Problem:** Styles not applying or no autocomplete

**Solutions:**

1. **Install Tailwind CSS IntelliSense extension:**
   - Open Extensions (Ctrl+Shift+X)
   - Search "Tailwind CSS IntelliSense"
   - Install by Tailwind Labs

2. **Check imports in main.tsx:**
   ```typescript
   import './styles/globals.css'
   ```

3. **Verify globals.css has Tailwind directives:**
   ```css
   @import "tailwindcss";
   ```

4. **Restart dev server:**
   ```bash
   # Stop current server (Ctrl+C)
   npm run dev
   ```

---

### Issue: Changes not reflecting in browser

**Problem:** Edit files but browser doesn't update

**Solutions:**

1. **Check Hot Module Replacement (HMR):**
   - Should update automatically
   - Look for update messages in terminal

2. **Hard refresh browser:**
   - Windows/Linux: Ctrl+Shift+R
   - Mac: Cmd+Shift+R

3. **Clear browser cache:**
   - F12 → Network tab → Right-click → Clear browser cache

4. **Check for syntax errors:**
   - Look at terminal for compilation errors
   - Fix errors and save again

5. **Restart dev server:**
   ```bash
   # Ctrl+C to stop
   npm run dev
   ```

---

### Issue: Can't access admin panel

**Problem:** Ctrl+Alt+P doesn't work

**Solutions:**

1. **Must be on customer login page:**
   - Make sure you're on the login screen
   - Not already logged in

2. **Try different key combination:**
   - Mac: Cmd+Alt+P
   - Some keyboards: Try Ctrl+Alt+Shift+P

3. **Check if feature is implemented:**
   - Look for keyboard event listener in CustomerLogin.tsx

4. **Alternative: Directly modify localStorage:**
   - F12 → Console
   ```javascript
   localStorage.setItem('adminLoggedIn', 'true');
   location.reload();
   ```

---

### Issue: Phone number validation fails

**Problem:** Can't submit registration with phone number

**Cause:** Requires exactly 11 digits

**Solution:**
- Format: 09171234567 (11 digits, no spaces or dashes)
- No country code (+63)
- Just the numbers

---

### Issue: Bookings not saving

**Problem:** Create booking but it disappears

**Cause:** localStorage not working or being cleared

**Solutions:**

1. **Check browser storage:**
   - F12 → Application tab → Local Storage
   - Should see entries for SmartWash

2. **Ensure localStorage enabled:**
   - Check browser settings
   - Not in incognito/private mode

3. **Clear localStorage and try again:**
   ```javascript
   // In browser console (F12)
   localStorage.clear();
   location.reload();
   ```

4. **Check browser compatibility:**
   - Use modern browser (Chrome, Firefox, Edge, Safari)

---

## 🖥️ Platform-Specific Issues

### Windows Issues

**Issue: npm commands not recognized**
- Add Node.js to PATH: System Properties → Environment Variables
- Restart terminal/PowerShell

**Issue: Permission denied**
- Run Command Prompt or PowerShell as Administrator
- Right-click → "Run as administrator"

**Issue: Long path errors**
- Extract closer to root: C:\SmartWash\
- Enable long paths in Windows 10/11

---

### Mac Issues

**Issue: Permission errors during npm install**
```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
```

**Issue: Command not found after Node install**
```bash
# Add to PATH
echo 'export PATH="/usr/local/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

---

### Linux Issues

**Issue: EACCES permission errors**
```bash
# Fix npm permissions (don't use sudo)
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

**Issue: Port 5173 requires sudo**
```bash
# Change to port above 1024
# Edit vite.config.ts to use port 3000
```

---

## 🔍 Debugging Techniques

### 1. Check Browser Console (F12)

**What to look for:**
- ❌ Red error messages (critical)
- ⚠️ Yellow warnings (less critical)
- Network tab: Failed requests (404, 500)

**Common error messages:**
- "Cannot read property of undefined" → Variable not initialized
- "Module not found" → Missing file or wrong path
- "Unexpected token" → Syntax error in code

### 2. Check Terminal/Console

**Look for:**
- Compilation errors
- Missing modules
- Port conflicts
- Build failures

### 3. Check VS Code Problems Panel

- View → Problems (Ctrl+Shift+M)
- Shows TypeScript errors
- Shows ESLint warnings

### 4. Network Tab (F12)

- See what's loading/failing
- Check if assets are 404ing
- Verify API calls (if any)

---

## 🚑 Emergency Fixes

### Nuclear Option: Complete Reset

If nothing else works:

```bash
# 1. Stop all running processes
# Ctrl+C in all terminals

# 2. Delete everything except source code
rm -rf node_modules
rm package-lock.json
rm -rf dist
rm -rf .vite

# 3. Clear all caches
npm cache clean --force

# 4. Reinstall
npm install

# 5. Restart dev server
npm run dev
```

### Last Resort: Fresh Start

1. Extract files to new location
2. Delete old project completely
3. Start setup from scratch
4. Follow QUICK_START.md step by step

---

## 📋 Diagnostic Checklist

Run these to diagnose issues:

```bash
# Check Node/npm versions
node --version    # Need v18+
npm --version     # Need 9+

# Check if dependencies installed
ls node_modules   # Should have many folders

# Check for TypeScript errors
npm run type-check

# Check for ESLint errors
npm run lint

# Try building
npm run build     # Should complete without errors
```

---

## 💡 Prevention Tips

**To avoid issues:**

1. ✅ Use stable Node.js LTS version
2. ✅ Keep VS Code and extensions updated
3. ✅ Don't modify node_modules manually
4. ✅ Use recommended browsers
5. ✅ Keep project path short and simple
6. ✅ Commit to Git frequently
7. ✅ Don't run multiple dev servers on same port
8. ✅ Close unused terminals

---

## 🆘 Still Stuck?

**Before asking for help, provide:**

1. **Your environment:**
   - Operating system (Windows 10/11, macOS, Linux)
   - Node version: `node --version`
   - npm version: `npm --version`

2. **Error messages:**
   - Full error text from terminal
   - Browser console errors (F12)
   - Screenshot if possible

3. **What you tried:**
   - List steps you've already taken
   - What worked, what didn't

4. **When it happens:**
   - During installation? Running? Building?
   - Consistently or randomly?

---

## 📚 Additional Resources

**Official Documentation:**
- React: https://react.dev/
- Vite: https://vitejs.dev/guide/troubleshooting
- Node.js: https://nodejs.org/docs/
- TypeScript: https://www.typescriptlang.org/

**Community Help:**
- Stack Overflow: Search error messages
- GitHub Issues: Check Vite/React issues
- Reddit: r/reactjs, r/node

---

## ✅ Quick Fix Checklist

Try these in order:

- [ ] Restart dev server (Ctrl+C, then `npm run dev`)
- [ ] Hard refresh browser (Ctrl+Shift+R)
- [ ] Restart VS Code
- [ ] Clear node_modules and reinstall
- [ ] Restart computer
- [ ] Extract files to new location and try again

**One of these usually fixes 90% of issues!**

---

**Remember:** Most issues are simple fixes. Don't panic! 🚀

Check the error message carefully - it usually tells you what's wrong.
