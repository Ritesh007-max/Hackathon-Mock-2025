# Expense Management System

A comprehensive expense management system built with Next.js, React, and Tailwind CSS. This application provides role-based access control with different dashboards for Admins, Managers, and Employees.

## 🌟 Features

### 🔐 Authentication & Authorization
- **Login/Signup** with role-based access
- **Three User Roles**: Admin, Manager, Employee
- **Auto-company creation** on signup with default country currency
- **Protected routes** based on user roles

### 👨‍💼 Admin Dashboard
- **View all expenses** across the organization
- **User management**: Add employees, assign managers, change roles
- **Approval rules configuration**:
  - Multi-level approval workflow (Manager → Finance → Director)
  - Conditional rules (percentage approval, specific approver auto-approve)
  - Visual rule builder with JSON preview
- **Comprehensive statistics** and expense overview

### 👨‍💼 Manager Dashboard
- **Review pending expenses** awaiting approval
- **Approve/Reject** expenses with optional comments
- **Multi-level approval flow** with step-by-step progression
- **Urgent expense alerts** for items pending > 3 days
- **Expense statistics** and analytics

### 👨‍💼 Employee Dashboard
- **Submit expense forms** with detailed information
- **Receipt upload** with OCR (Tesseract.js) for auto-filling
- **Currency conversion** using real-time exchange rates
- **View expense history** with status tracking
- **Category-based expense organization**

### 🧾 Expense Management
- **Receipt OCR**: Automatically extract amount, date, and vendor from receipt images
- **Multi-currency support** with automatic conversion to company currency
- **Expense categories**: Travel, Meals, Office Supplies, etc.
- **Status tracking**: Pending, Approved, Rejected
- **Approval workflow** with comments and history

### 🎨 Modern UI/UX
- **Responsive design** for desktop and mobile
- **shadcn/ui components** for consistent design
- **Tailwind CSS** for modern styling
- **Loading states** and empty state handling
- **Interactive components** with smooth animations

## 🛠️ Technology Stack

- **Frontend**: Next.js 15 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **State Management**: React Query (TanStack Query)
- **OCR**: Tesseract.js for receipt text extraction
- **Icons**: Lucide React
- **External APIs**: 
  - RestCountries API for currency data
  - ExchangeRate API for currency conversion

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd expense-management-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   │   ├── login/         # Login page
│   │   └── signup/        # Signup page
│   ├── dashboard/         # Main dashboard
│   ├── expenses/          # Expense-related pages
│   │   └── submit/        # Expense submission
│   ├── approvals/         # Approval management
│   ├── users/             # User management (Admin only)
│   ├── settings/          # User settings
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   ├── layout/           # Layout components
│   │   ├── navbar.tsx    # Navigation bar
│   │   └── main-layout.tsx
│   ├── dashboard/        # Dashboard components
│   │   ├── admin-dashboard.tsx
│   │   ├── manager-dashboard.tsx
│   │   └── employee-dashboard.tsx
│   ├── expense-card.tsx  # Expense display component
│   ├── approval-modal.tsx # Approval/rejection modal
│   └── rule-builder.tsx  # Approval rules builder
└── lib/                  # Utilities and configurations
    ├── types.ts          # TypeScript type definitions
    ├── utils.ts          # Utility functions
    ├── api.ts            # API client functions
    ├── providers.tsx     # React Query provider
    └── auth-context.tsx  # Authentication context
```

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### API Endpoints
The application uses placeholder API endpoints that should be replaced with actual backend URLs:

- **Authentication**: `/api/auth/login`, `/api/auth/signup`
- **Users**: `/api/users`
- **Expenses**: `/api/expenses`
- **Approval Rules**: `/api/approval-rules`

## 🎯 Key Features Explained

### OCR Receipt Processing
- Upload receipt images (JPG, PNG)
- Tesseract.js extracts text from images
- Auto-fills amount, date, and vendor information
- Fallback to manual entry if OCR fails

### Multi-Currency Support
- Automatic currency detection from countries API
- Real-time exchange rate conversion
- Company currency standardization
- Support for major world currencies

### Approval Workflow
- Configurable multi-level approval process
- Role-based approver assignment
- Conditional approval rules
- Approval history tracking
- Comment system for feedback

### Role-Based Access Control
- **Admin**: Full system access, user management, rule configuration
- **Manager**: Expense approval, team oversight
- **Employee**: Expense submission, personal dashboard

## 🚧 Backend Integration

The frontend is designed to work with a REST API backend. Key endpoints needed:

### Authentication
```typescript
POST /api/auth/login
POST /api/auth/signup
```

### Users
```typescript
GET /api/users
POST /api/users
PUT /api/users/:id
```

### Expenses
```typescript
GET /api/expenses
GET /api/expenses/user/:userId
GET /api/expenses/pending
POST /api/expenses
POST /api/expenses/:id/approve
POST /api/expenses/:id/reject
```

### Approval Rules
```typescript
GET /api/approval-rules
POST /api/approval-rules
```

## 🎨 Customization

### Styling
- Modify `tailwind.config.ts` for theme customization
- Update color schemes in `src/lib/utils.ts`
- Customize component styles in individual component files

### Adding New Features
- Create new pages in `src/app/`
- Add new components in `src/components/`
- Extend types in `src/lib/types.ts`
- Add API functions in `src/lib/api.ts`

## 📱 Responsive Design

The application is fully responsive and works on:
- **Desktop**: Full-featured dashboard experience
- **Tablet**: Optimized layout with collapsible navigation
- **Mobile**: Touch-friendly interface with mobile navigation

## 🔒 Security Considerations

- Client-side authentication state management
- Role-based route protection
- Input validation and sanitization
- Secure API communication (HTTPS recommended)

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Deploy automatically

### Other Platforms
- **Netlify**: Static site deployment
- **Railway**: Full-stack deployment
- **Docker**: Containerized deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code comments

---

**Built with ❤️ using Next.js, React, and Tailwind CSS**