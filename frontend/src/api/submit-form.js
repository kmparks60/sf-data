import jsforce from 'jsforce';

// Enable CORS for all origins in development
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export default async function handler(req, res) {
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).json({ message: 'OK' });
  }

  // Set CORS headers
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      moveInDate,
      roomCount,
      preferredFloor,
      comments
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !moveInDate || !roomCount || !preferredFloor) {
      return res.status(400).json({ 
        message: 'Missing required fields. Please fill in all required information.' 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        message: 'Please provide a valid email address.' 
      });
    }

    // Initialize Salesforce connection
    const conn = new jsforce.Connection({
      loginUrl: process.env.SALESFORCE_LOGIN_URL
      version: process.env.SALESFORCE_API_VERSION
    });

    // Login to Salesforce
    await conn.login(
      process.env.SALESFORCE_USERNAME,
      process.env.SALESFORCE_PASSWORD + process.env.SALESFORCE_SECURITY_TOKEN
    );

    // Prepare record data for Salesforce
    const recordData = {
      FirstName: firstName.trim(),
      LastName: lastName.trim(),
      Email: email.trim().toLowerCase(),
      Phone: phone ? phone.trim() : null,
      // Map custom fields - adjust these field names based on your Salesforce setup
      Move_In_Date__c: moveInDate,
      Room_Count__c: parseInt(roomCount),
      Preferred_Floor__c: parseInt(preferredFloor),
      Description: comments ? comments.trim() : null,
      LeadSource: 'Web Form',
      Status: 'New',
      Company: 'Self' // Required for Lead object
    };

    // Remove null values
    Object.keys(recordData).forEach(key => {
      if (recordData[key] === null || recordData[key] === '') {
        delete recordData[key];
      }
    });

    // Create record in Salesforce (using Lead object - change to Contact if needed)
    const result = await conn.sobject('Lead').create(recordData);

    if (result.success) {
      console.log('Salesforce record created successfully:', result.id);
      
      return res.status(200).json({
        message: 'Form submitted successfully!',
        recordId: result.id
      });
    } else {
      console.error('Salesforce record creation failed:', result);
      
      return res.status(500).json({
        message: 'Failed to create record in Salesforce',
        errors: result.errors
      });
    }

  } catch (error) {
    console.error('Error processing form submission:', error);
    
    // Handle different types of errors
    if (error.errorCode === 'INVALID_LOGIN') {
      return res.status(500).json({
        message: 'Salesforce authentication failed. Please check credentials.'
      });
    }
    
    if (error.errorCode === 'REQUIRED_FIELD_MISSING') {
      return res.status(400).json({
        message: 'Missing required Salesforce fields. Please contact support.'
      });
    }
    
    if (error.errorCode === 'DUPLICATE_VALUE') {
      return res.status(409).json({
        message: 'A record with this email already exists.'
      });
    }

    return res.status(500).json({
      message: 'An error occurred while processing your request. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}