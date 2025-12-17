# 🔧 Backend Issues - Magic Link Flow

## 🚨 **Problems Found**

### **1. Mixed Content Error** ❌
```
Current: http://trustify.io.vn/login
Should be: https://trustify.io.vn/login
```

**Issue**: Backend redirects to HTTP instead of HTTPS
**Impact**: Browser blocks the redirect (Mixed Content Policy)

**Fix Required**:
```java
// ❌ WRONG
String redirectUrl = "http://trustify.io.vn/login";

// ✅ CORRECT
String redirectUrl = "https://trustify.io.vn/login";
```

---

### **2. Incorrect Redirect Route** ⚠️
```
Current: /magic-link?code=magic_link:49dee5
Better: /verify/magic_link:49dee5
```

**Issue**: Using query parameter instead of path parameter
**Impact**: Works but not RESTful

**Current Flow**:
```
Email link → https://trustify.io.vn/api/auth/magic-link/magic_link:49dee5
          ↓
Backend redirects → http://trustify.io.vn/magic-link?code=magic_link:49dee5
          ↓
Frontend redirects → /verify/magic_link:49dee5
```

**Recommended Flow**:
```
Email link → https://trustify.io.vn/api/auth/magic-link/magic_link:49dee5
          ↓
Backend redirects → https://trustify.io.vn/verify/magic_link:49dee5
          ↓
Frontend verifies → Success!
```

---

## ✅ **Frontend Workaround (Done)**

Created `/magic-link` page to handle current backend behavior:

```typescript
// app/magic-link/page.tsx
export default function MagicLinkPage() {
    const code = searchParams.get('code');
    
    useEffect(() => {
        if (code) {
            router.replace(`/verify/${code}`);
        }
    }, [code]);
}
```

**This works but adds unnecessary redirect!**

---

## 🎯 **Recommended Backend Changes**

### **Change 1: Use HTTPS**
```java
@GetMapping("/magic-link/{code}")
public ResponseEntity<?> verifyMagicLink(@PathVariable String code) {
    // Verify code...
    
    // ✅ Use HTTPS
    String redirectUrl = "https://trustify.io.vn/verify/" + code;
    
    return ResponseEntity
        .status(HttpStatus.FOUND)
        .location(URI.create(redirectUrl))
        .build();
}
```

### **Change 2: Environment-based URL**
```java
@Value("${frontend.url}")
private String frontendUrl; // https://trustify.io.vn

@GetMapping("/magic-link/{code}")
public ResponseEntity<?> verifyMagicLink(@PathVariable String code) {
    String redirectUrl = frontendUrl + "/verify/" + code;
    
    return ResponseEntity
        .status(HttpStatus.FOUND)
        .location(URI.create(redirectUrl))
        .build();
}
```

### **Change 3: Handle Success/Error**
```java
@GetMapping("/magic-link/{code}")
public ResponseEntity<?> verifyMagicLink(@PathVariable String code) {
    try {
        // Verify code
        boolean valid = magicLinkService.verify(code);
        
        if (valid) {
            // Set JWT cookie
            Cookie cookie = new Cookie("access_token", jwtToken);
            cookie.setHttpOnly(true);
            cookie.setSecure(true); // ✅ HTTPS only
            cookie.setPath("/");
            response.addCookie(cookie);
            
            // Redirect to dashboard
            return ResponseEntity
                .status(HttpStatus.FOUND)
                .location(URI.create(frontendUrl + "/"))
                .build();
        } else {
            // Redirect to error page
            return ResponseEntity
                .status(HttpStatus.FOUND)
                .location(URI.create(frontendUrl + "/verify-error"))
                .build();
        }
    } catch (Exception e) {
        return ResponseEntity
            .status(HttpStatus.FOUND)
            .location(URI.create(frontendUrl + "/verify-error"))
            .build();
    }
}
```

---

## 📋 **application.properties**

```properties
# Frontend URL (environment-specific)
frontend.url=https://trustify.io.vn

# Cookie settings
server.servlet.session.cookie.secure=true
server.servlet.session.cookie.http-only=true
server.servlet.session.cookie.same-site=lax
```

---

## 🔐 **Security Checklist**

- ✅ Use HTTPS for all redirects
- ✅ Set `Secure` flag on cookies
- ✅ Set `HttpOnly` flag on cookies
- ✅ Set `SameSite=Lax` on cookies
- ✅ Validate magic link code before redirect
- ✅ Expire magic links after use
- ✅ Rate limit magic link requests

---

## 🧪 **Testing**

### **Test 1: Magic Link Flow**
```bash
# 1. Request magic link
POST https://trustify.io.vn/api/auth/send-magic-link
Body: { "email": "test@example.com" }

# 2. Check email
# Should receive: https://trustify.io.vn/verify/magic_link:xxxxx

# 3. Click link
GET https://trustify.io.vn/verify/magic_link:xxxxx

# 4. Should redirect to dashboard with JWT cookie
```

### **Test 2: Invalid Code**
```bash
GET https://trustify.io.vn/verify/invalid_code

# Should show error message
# Should NOT set cookie
```

---

## 📊 **Current vs Recommended**

| Aspect | Current | Recommended |
|--------|---------|-------------|
| Protocol | HTTP ❌ | HTTPS ✅ |
| Route | `/magic-link?code=...` | `/verify/{code}` |
| Redirects | 2 (Backend → /magic-link → /verify) | 1 (Backend → /verify) |
| Cookie Secure | Unknown | `true` ✅ |
| Error Handling | Unknown | Redirect to error page |

---

## ✅ **Summary**

**Frontend**: ✅ Working (with workaround)
**Backend**: ⚠️ Needs fixes:
1. Change HTTP → HTTPS
2. (Optional) Change redirect route
3. (Optional) Set JWT cookie on success

**Priority**: **HIGH** (Mixed Content blocks users)
