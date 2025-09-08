# Frontend Payment System

This document describes the frontend implementation of the payment and credit system for the HR ATS platform.

## 🏗️ **Components Overview**

### 1. **PaymentPlans.jsx** - Company Admin Payment Plans
- **Purpose**: Display available payment plans and handle purchases
- **Features**: 
  - Plan selection with pricing and credit information
  - Razorpay integration for payment processing
  - Payment confirmation modal
  - Credit usage information

### 2. **CompanyCredits.jsx** - Company Credit Management
- **Purpose**: View credit balance and transaction history
- **Features**:
  - Credit overview cards (total, available, used)
  - Progress bar showing credit usage
  - Transaction history with filtering
  - Quick actions for purchasing more credits

### 3. **PaymentPlanManager.jsx** - Super Admin Plan Management
- **Purpose**: Create, edit, and delete payment plans
- **Features**:
  - CRUD operations for payment plans
  - Form validation and error handling
  - Plan status management (active/inactive)
  - Responsive table layout

### 4. **CreditChecker.jsx** - HR Credit Verification
- **Purpose**: Check credit availability before viewing resumes
- **Features**:
  - Real-time credit status checking
  - Visual indicators for access granted/denied
  - Credit balance information
  - Integration with resume viewing flow

## 📁 **File Structure**

```
src/
├── components/
│   ├── PaymentPlans.jsx          # Company admin payment plans
│   ├── CompanyCredits.jsx        # Company credit management
│   ├── PaymentPlanManager.jsx    # Super admin plan management
│   └── CreditChecker.jsx         # HR credit verification
├── app/
│   ├── (dash)/
│   │   ├── company-admin/
│   │   │   ├── payment-plans/    # Payment plans page
│   │   │   └── credits/          # Company credits page
│   │   └── super-admin/
│   │       └── payment-plans/    # Plan management page
│   └── api/
│       └── payments/             # Payment API routes
│           ├── available-plans/   # Get available plans
│           ├── create-order/      # Create Razorpay order
│           ├── company/           # Company credit APIs
│           ├── check-credits/     # Credit verification
│           └── plans/             # Plan management APIs
```

## 🚀 **Getting Started**

### 1. **Installation**
The payment system components are already included in the project. No additional installation is required.

### 2. **Environment Variables**
Add your Razorpay configuration to `.env.local`:
```bash
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### 3. **Usage Examples**

#### Company Admin - View Payment Plans
```jsx
import PaymentPlans from '../components/PaymentPlans';

function CompanyAdminDashboard() {
  return (
    <div>
      <h1>Company Dashboard</h1>
      <PaymentPlans />
    </div>
  );
}
```

#### Company Admin - View Credits
```jsx
import CompanyCredits from '../components/CompanyCredits';

function CompanyCreditsPage() {
  return (
    <div>
      <CompanyCredits />
    </div>
  );
}
```

#### Super Admin - Manage Plans
```jsx
import PaymentPlanManager from '../components/PaymentPlanManager';

function SuperAdminDashboard() {
  return (
    <div>
      <h1>Super Admin Dashboard</h1>
      <PaymentPlanManager />
    </div>
  );
}
```

#### HR - Check Credits Before Viewing Resume
```jsx
import CreditChecker from '../components/CreditChecker';

function ResumeViewPage({ resumeId }) {
  const handleCreditCheck = (creditInfo) => {
    if (creditInfo.can_view) {
      // Proceed to show resume
      showResumeDetails();
    } else {
      // Show insufficient credits message
      showInsufficientCredits();
    }
  };

  return (
    <div>
      <CreditChecker 
        resumeId={resumeId} 
        onCreditCheck={handleCreditCheck}
      >
        {/* Resume content will be shown here */}
        <div>Resume content...</div>
      </CreditChecker>
    </div>
  );
}
```

## 🔧 **API Integration**

### Backend API Endpoints
The frontend components are designed to work with the Django backend payment APIs:

- `GET /api/payments/available-plans` - Fetch available payment plans
- `POST /api/payments/create-order` - Create Razorpay order
- `GET /api/payments/company/{code}/credits` - Get company credit balance
- `GET /api/payments/company/{code}/transactions` - Get transaction history
- `GET /api/payments/check-credits/{resume_id}/{hr_email}` - Check credit access
- `GET/POST/PUT/DELETE /api/payments/plans` - Manage payment plans (super admin)

### Mock Data
Currently, the API routes return mock data for development purposes. Replace the mock data with actual backend API calls when integrating with your Django backend.

## 💳 **Razorpay Integration**

### Payment Flow
1. **Plan Selection**: Company admin selects a payment plan
2. **Order Creation**: Frontend calls backend to create Razorpay order
3. **Payment Processing**: Razorpay checkout opens with order details
4. **Payment Success**: Credits are automatically added via webhook
5. **Redirect**: User is redirected to credits page

### Configuration
```javascript
const options = {
  key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  amount: orderData.amount * 100, // Convert to paise
  currency: 'INR',
  name: 'HR Resume Analysis',
  description: `Purchase ${selectedPlan.credits} credits`,
  order_id: orderData.order_id,
  handler: (response) => {
    handlePaymentSuccess(response, orderData);
  },
  prefill: {
    name: user.name || 'Company Admin',
    email: user.email
  },
  theme: {
    color: '#3399cc'
  }
};
```

## 🎨 **Styling & UI**

### Design System
- **Colors**: Blue primary (#3399cc), with semantic colors for success/error states
- **Components**: Consistent card layouts, buttons, and form elements
- **Responsive**: Mobile-first design with responsive grids and tables
- **Icons**: Emoji icons for visual appeal and quick recognition

### Key UI Patterns
- **Card Layouts**: Payment plans and credit information
- **Modal Dialogs**: Payment confirmation and plan editing
- **Tab Navigation**: Credit overview vs. transaction history
- **Progress Indicators**: Credit usage visualization
- **Status Badges**: Plan status and transaction types

## 🔐 **Security & Permissions**

### Role-Based Access
- **Company Admin**: Can view plans, purchase credits, view company credits
- **Super Admin**: Can manage all payment plans (CRUD operations)
- **HR Users**: Can check credit availability before viewing resumes

### Protected Routes
All payment-related pages use the `Protected` component to ensure proper authentication and role-based access control.

## 📱 **Responsive Design**

### Breakpoints
- **Mobile**: < 768px - Single column layout
- **Tablet**: 768px - 1024px - Two column layout
- **Desktop**: > 1024px - Full layout with sidebars

### Mobile Optimizations
- Touch-friendly buttons and form elements
- Simplified navigation for small screens
- Optimized table layouts for mobile viewing

## 🧪 **Testing & Development**

### Development Mode
- Mock API responses for development
- Console logging for debugging
- Error boundaries for graceful error handling

### Testing Considerations
- Test credit checking functionality
- Verify payment flow integration
- Test responsive design across devices
- Validate form inputs and error handling

## 🚀 **Deployment**

### Production Considerations
1. **Environment Variables**: Set proper Razorpay keys
2. **API Endpoints**: Update to point to production backend
3. **Error Handling**: Implement proper error logging
4. **Performance**: Optimize bundle size and loading

### Build Process
```bash
# Development
npm run dev

# Production build
npm run build
npm start
```

## 🔄 **Future Enhancements**

### Planned Features
- **Real-time Updates**: WebSocket integration for credit balance updates
- **Advanced Analytics**: Credit usage patterns and insights
- **Bulk Operations**: Batch credit management for super admins
- **Notifications**: Email/SMS alerts for low credit balances
- **Credit Expiry**: Time-based credit validity management

### Integration Opportunities
- **Analytics Dashboard**: Credit usage analytics
- **Reporting**: Financial and usage reports
- **Audit Trail**: Enhanced transaction logging
- **Multi-currency**: Support for different currencies

## 📚 **Additional Resources**

### Documentation
- [Razorpay API Documentation](https://razorpay.com/docs/)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### Support
For technical support or questions about the payment system:
- Check the component documentation
- Review API integration examples
- Test with mock data first
- Verify environment variable configuration

---

**Note**: This frontend implementation is designed to work seamlessly with the Django backend payment system. Ensure proper API endpoint configuration and Razorpay integration for production use.
