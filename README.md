# Salesforce Sample Data Form

A professional, responsive data gathering form with seamless Salesforce integration designed for modern startups. This application captures user information and automatically creates records in your Salesforce organization.

## Features

- **Real-time Salesforce Integration**: Automatically creates records upon form submission
- **Form Validation**: Client-side validation for better user experience
- **Serverless Architecture**: Deployed on Vercel with serverless functions
- **Secure**: Environment variables protect sensitive Salesforce credentials

## Form Fields

The form captures the following information:
- First Name (required)
- Last Name (required)
- Email (required)
- Phone Number (optional)
- Move-in Date (required)
- Room Count (1, 2, or 3 rooms)
- Preferred Floor (1, 2, or 3)
- Comments/Requests (optional text area)

## How It Works

### Frontend
- Built with React and Vite for fast development and optimal performance
- Single CSS file with custom styling using the brand color scheme
- Form validation ensures data quality before submission
- Loading states and success/error messages provide user feedback

### Backend Integration
- Serverless API function handles form submissions
- Uses JSforce library for Salesforce API communication
- Authenticates with Salesforce using username/password/security token
- Creates new records in your specified Salesforce object (typically Lead or Contact)

### Data Flow
1. User fills out and submits the form
2. Frontend validates data and sends POST request to `/api/submit-form`
3. Serverless function authenticates with Salesforce
4. Form data is mapped to Salesforce fields and record is created
5. Success/error response is returned to frontend
6. User sees confirmation or error message

- **Frontend**: Vite/React
- **Backend**: Node.js serverless functions
- **Salesforce Integration**: JSforce
- **Deployment**: Vercel
- **Styling**: CSS3 with Flexbox/Grid

## Security Considerations

- All Salesforce credentials are stored in environment variables
- API endpoints are validated
- CORS is configured for secure cross-origin requests
- No sensitive data is exposed to the frontend

## License

MIT License - feel free to modify and use for your projects.