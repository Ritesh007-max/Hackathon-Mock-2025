# Expense Management System

A modern, full-featured expense management system built with Next.js, React, and Tailwind CSS. This system provides role-based access control, multi-level approval workflows, OCR receipt processing, and comprehensive expense tracking.

## Features

### 🌐 General Features
- **Modern UI**: Built with Next.js 15, React, and Tailwind CSS
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Role-Based Access**: Admin, Manager, and Employee roles with different permissions
- **Real-time Updates**: Powered by React Query for efficient data fetching and caching

### 🧍 Authentication
- **Secure Login/Signup**: JWT-based authentication system
- **Auto Company Creation**: New users automatically create a company with default currency
- **Role Assignment**: Automatic role assignment based on user type

### 💼 Admin Dashboard
- **Complete Expense Overview**: View all expenses across the organization
- **User Management**: Add, edit, and manage users and their roles
- **Approval Rules Configuration**: 
  - Sequential approval workflows (Manager → Finance → Director)
  - Conditional rules based on amount thresholds
  - Visual rule builder with JSON preview
- **Company Settings**: Manage organization details and currency

### 🧾 Employee Dashboard
- **Expense Submission**: Comprehensive expense form with validation
- **OCR Receipt Processing**: Automatic extraction of amount, date, and vendor from receipt images using Tesseract.js
- **Currency Conversion**: Automatic conversion to company currency using ExchangeRate API
- **Expense Tracking**: View submitted expenses with real-time status updates

### 👨‍💼 Manager Dashboard
- **Approval Workflow**: Review and approve/reject expenses
- **Multi-level Approval**: Expenses move through approval levels sequentially
- **Comments System**: Add comments when approving or rejecting expenses
- **Team Overview**: Monitor team expense patterns and statistics

### ⚙️ Common Components
- **ExpenseCard**: Reusable component for displaying expense information
- **ApprovalModal**: Modal for reviewing and acting on expenses
- **RuleBuilder**: Visual tool for creating approval workflows
- **Responsive Layout**: Mobile-first design with consistent spacing and typography

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **State Management**: React Query (TanStack Query)
- **OCR Processing**: Tesseract.js
- **Currency Conversion**: ExchangeRate API
- **Country Data**: REST Countries API

## Getting Started

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

### Demo Credentials

For testing purposes, you can use these demo credentials:

- **Admin**: `admin@company.com`
- **Manager**: `manager@company.com`  
- **Employee**: `employee@company.com`

Password can be anything for demo purposes.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── dashboard/          # Dashboard pages
│   ├── login/             # Authentication pages
│   ├── signup/
│   ├── submit-expense/    # Expense submission
│   ├── approvals/         # Approval management
│   ├── users/             # User management (Admin only)
│   └── settings/          # Settings pages
├── components/
│   ├── ui/                # Reusable UI components
│   ├── common/            # Shared components
│   └── dashboard/         # Dashboard-specific components
├── context/               # React Context providers
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
└── types/                 # TypeScript type definitions
```

## Key Features Implementation

### OCR Receipt Processing
The system uses Tesseract.js to extract text from receipt images and automatically populate expense forms:

```typescript
const worker = await createWorker();
await worker.loadLanguage('eng');
await worker.initialize('eng');
const { data: { text } } = await worker.recognize(file);
```

### Multi-level Approval Workflow
Expenses flow through configurable approval levels:

1. **Employee** submits expense
2. **Manager** reviews and approves/rejects
3. **Finance** reviews high-value expenses
4. **Director** reviews executive-level expenses

### Currency Conversion
Automatic conversion to company currency using ExchangeRate API:

```typescript
const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`);
const rates = await response.json();
const convertedAmount = amount * rates.rates[targetCurrency];
```

## API Endpoints

The system includes placeholder API endpoints ready for backend integration:

- `POST /api/auth/login` - User authentication
- `POST /api/auth/signup` - User registration
- `GET /api/expenses` - Fetch expenses
- `POST /api/expenses` - Create new expense
- `PUT /api/expenses/:id` - Update expense
- `GET /api/users` - Fetch users (Admin only)
- `POST /api/users` - Create user (Admin only)

## Customization

### Adding New Expense Categories
Edit the categories array in `src/app/submit-expense/page.tsx`:

```typescript
const categories = [
  'meals',
  'transportation',
  'accommodation',
  'office supplies',
  'travel',
  'entertainment',
  'other',
];
```

### Modifying Approval Rules
Update the approval logic in the respective dashboard components or create new rule types in the RuleBuilder component.

### Styling Customization
The system uses Tailwind CSS with a custom color scheme. Modify the colors in `tailwind.config.js` or update the component classes directly.

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with zero configuration

### Other Platforms
The application can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please open an issue in the GitHub repository or contact the development team.

---

Built with ❤️ using Next.js, React, and Tailwind CSS