# 📱 Android Login Debug Guide

## 🚨 **Common Android Login Issues & Solutions**

### **Issue 1: Development Server Not Accessible**

**Problem:** Android can't reach `localhost:3000`
**Solution:** Make sure you're using your computer's IP address

1. **Find your computer's IP address:**

   - Windows: `ipconfig` (look for IPv4 Address)
   - Example: `192.168.1.100`

2. **Start server with correct binding:**

   ```cmd
   npm run dev -- -H 0.0.0.0
   ```

3. **Access from Android using:**
   ```
   http://192.168.1.100:3000/de/auth/login
   ```

### **Issue 2: Login Succeeds but Page Doesn't Open**

**Problem:** Authentication works but redirect fails
**Symptoms:**

- ✅ Login successful
- ❌ Stays on login page or shows blank screen
- ❌ Dashboard doesn't open

**Debug Steps:**

1. **Check browser console on Android:**

   - Open Chrome DevTools
   - Connect Android device
   - Check for JavaScript errors

2. **Test redirect manually:**
   ```
   http://192.168.1.100:3000/de/dashboard
   ```

### **Issue 3: Mobile Browser Compatibility**

**Problem:** Mobile browser doesn't handle auth properly
**Solutions:**

1. **Try different Android browsers:**

   - Chrome (recommended)
   - Firefox
   - Samsung Internet

2. **Clear browser cache/data**

3. **Disable browser security features temporarily**

### **Issue 4: Network/Firewall Blocking**

**Problem:** Network blocks development server
**Solutions:**

1. **Check Windows Firewall:**

   - Allow Node.js through firewall
   - Allow port 3000

2. **Same WiFi network:**
   - Ensure Android and computer on same network
   - Check router settings

## 🔧 **Quick Debug Commands**

### **Test Server Accessibility:**

```cmd
# On Android browser, test these URLs:
http://192.168.1.100:3000/
http://192.168.1.100:3000/de/
http://192.168.1.100:3000/de/auth/login
http://192.168.1.100:3000/de/dashboard
```

### **Check Login Flow:**

1. **Open Android Chrome**
2. **Go to login page**
3. **Open DevTools (if possible)**
4. **Try login**
5. **Check for errors**

## 🎯 **Most Likely Solutions**

1. **Wrong IP address** → Use computer's actual IP
2. **Server binding** → Use `-H 0.0.0.0`
3. **Browser cache** → Clear Android browser data
4. **Network issues** → Check WiFi connection

---

**Next Steps:**

1. Find your computer's IP address
2. Start server with `-H 0.0.0.0`
3. Test basic page access first
4. Then test login
