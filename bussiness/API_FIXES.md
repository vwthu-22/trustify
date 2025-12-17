# 🔧 API Fixes - Business Login Flow

## ❌ **Problems Found**

Comparing backend API documentation with frontend code revealed **major endpoint mismatches**:

| What | Old (Wrong) | New (Correct) | Status |
|------|-------------|---------------|--------|
| Register Company | `/api/auth/register` | `/api/companies/register` | ✅ Fixed |
| Get Profile | `/api/company/profile` | `/api/companies/my-companies` | ✅ Fixed |
| Update Profile | `/api/company/profile` | `/api/companies/my-companies` | ✅ Fixed |
| Verify Company | ❌ Missing | `/api/companies/verify` | ✅ Added |
| Resend Code | ❌ Missing | `/api/companies/resend-code` | ✅ Added |
| Get All Companies | ❌ Missing | `/api/companies` | ✅ Added |
| Get By Industry | ❌ Missing | `/api/companies/industry/{name}` | ✅ Added |

---

## ✅ **Fixed API Structure**

### **authApi** (Magic Link & Session)
```typescript
authApi.sendMagicLink(email)        // Send magic link
authApi.verifyEmail(code)           // Verify magic link
authApi.login(email, password)      // Login with password
authApi.logout()                    // Logout
authApi.getSession()                // Get current session
```

### **companyApi** (Company Management)
```typescript
// Registration Flow
companyApi.register({               // Step 1: Register
  name, workEmail, industry, website
})

companyApi.verify(email, code)      // Step 2: Verify code

companyApi.resendCode(email)        // Resend if needed

// Profile Management
companyApi.getProfile()             // Get my company
companyApi.updateProfile(data)      // Update my company

// Browse Companies
companyApi.getAll(page, size)       // All companies
companyApi.getByIndustry(name, page, size)  // By industry
```

### **planApi** (Subscription)
```typescript
planApi.getPlans()                  // All active plans
planApi.getPlanById(id)             // Specific plan
```

---

## 🔄 **Correct Registration Flow**

### **Old Flow** (WRONG ❌):
```
1. POST /api/auth/register → ❌ Wrong endpoint
2. No verification step
3. Direct login
```

### **New Flow** (CORRECT ✅):
```
1. POST /api/companies/register
   → Backend sends verification code to email
   
2. POST /api/companies/verify?email=...&code=...
   → Verify code from email
   → Company activated
   
3. Login via magic link or password
   → GET /api/companies/my-companies
   → Get company profile with plan & features
```

---

## 📝 **Response Format**

All company endpoints return:
```json
{
  "success": true,
  "data": { ... }
}
```

Or on error:
```json
{
  "success": false,
  "error": "Error message"
}
```

---

## 🎯 **Key Changes Made**

### 1. **Moved Registration to companyApi**
```typescript
// OLD ❌
authApi.register({ email, password, companyName, website })

// NEW ✅
companyApi.register({ name, workEmail, industry, website })
```

### 2. **Fixed Profile Endpoint**
```typescript
// OLD ❌
GET /api/company/profile

// NEW ✅
GET /api/companies/my-companies
```

### 3. **Added Verification**
```typescript
// NEW ✅
companyApi.verify(email, code)
companyApi.resendCode(email)
```

### 4. **Added Browse Features**
```typescript
// NEW ✅
companyApi.getAll(page, size)
companyApi.getByIndustry(industry, page, size)
```

---

## 🚀 **Next Steps**

1. ✅ Update registration page to use `companyApi.register()`
2. ✅ Create verification page for code input
3. ✅ Update profile fetch to use correct endpoint
4. ✅ Test complete flow:
   - Register → Receive email → Verify → Login → Get profile

---

## 📌 **Important Notes**

- **Authentication**: Uses JWT in HTTP cookies (not Authorization header)
- **Pagination**: 0-based page index
- **Error Handling**: Check `success` field, use `error` for message
- **Credentials**: Always include `credentials: 'include'` for cookies

---

## ✅ **Status**

All API endpoints now match backend documentation! 🎉
