# ===========================================
# Railway Setup Guide
# ===========================================

## المتغيرات اللي لازم تتضاف في Railway Variables tab:

```env
# توكن البوت الأساسي (Discord Developer Portal → Bot → Reset Token)
TOKEN=YOUR_BOT_TOKEN_HERE

# رابط MongoDB (MongoDB Atlas → Connect → Drivers)
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority

# إعدادات OAuth2 (Discord Developer Portal → OAuth2 → General)
CLIENT_ID=1518997762669150459
CLIENT_SECRET=YOUR_CLIENT_SECRET_HERE

# رابط الـ Redirect (Railway app domain)
REDIRECT_URI=https://fixx-production.up.railway.app/oauth/callback

# رابط الـ Redirect للشراء (اختياري - لو مختلف)
REDIRECT_URI_BUY=https://fixx-production.up.railway.app/members/add

# Port (اختياري - Railway بيحدده تلقائي)
PORT=10850
```

## Discord OAuth2 Redirects:

ضيف الروابط دي في Discord Developer Portal → OAuth2 → Redirects:
```
https://fixx-production.up.railway.app/oauth/callback
https://fixx-production.up.railway.app/members/add
```

## خطوات Deploy:

1. ارفع الملفات على Railway (عبر GitHub أو CLI)
2. أضف الـ env vars في Variables tab
3. اعمل Redeploy
4. راقب اللوج — لازم تشوف:
   ```
   === [MAIN BOT] ENV DEBUG START ===
   TOKEN: SET (length: 87)
   ...
   Connected to MongoDB
   All bots started X
   ```