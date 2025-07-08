import React, { useState } from 'react'

function App() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    moveInDate: '',
    roomCount: '',
    preferredFloor: '',
    comments: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.moveInDate) {
      newErrors.moveInDate = 'Move-in date is required'
    }

    if (!formData.roomCount) {
      newErrors.roomCount = 'Room count selection is required'
    }

    if (!formData.preferredFloor) {
      newErrors.preferredFloor = 'Preferred floor selection is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setSubmitMessage('')

    try {
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok) {
        setSubmitMessage('Thank you! Your information has been submitted successfully.')
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          moveInDate: '',
          roomCount: '',
          preferredFloor: '',
          comments: ''
        })
      } else {
        setSubmitMessage(`Error: ${result.message || 'Something went wrong. Please try again.'}`)
      }
    } catch (error) {
      setSubmitMessage('Network error. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1 className="title">Sample Data Form</h1>
          <p className="subtitle">All information will be used in future applications.<br></br>Thank you!</p>
        </header>

        <form className="form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName" className="label">First Name *</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className={`input ${errors.firstName ? 'input-error' : ''}`}
                placeholder="Enter your first name"
              />
              {errors.firstName && <span className="error-message">{errors.firstName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="lastName" className="label">Last Name *</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className={`input ${errors.lastName ? 'input-error' : ''}`}
                placeholder="Enter your last name"
              />
              {errors.lastName && <span className="error-message">{errors.lastName}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email" className="label">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`input ${errors.email ? 'input-error' : ''}`}
                placeholder="Enter your email address"
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="phone" className="label">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="input"
                placeholder="(555) 123-4567"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="moveInDate" className="label">Move-in Date *</label>
              <input
                type="date"
                id="moveInDate"
                name="moveInDate"
                value={formData.moveInDate}
                onChange={handleInputChange}
                className={`input ${errors.moveInDate ? 'input-error' : ''}`}
              />
              {errors.moveInDate && <span className="error-message">{errors.moveInDate}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="roomCount" className="label">Room Count *</label>
              <select
                id="roomCount"
                name="roomCount"
                value={formData.roomCount}
                onChange={handleInputChange}
                className={`select ${errors.roomCount ? 'input-error' : ''}`}
              >
                <option value="">Select room count</option>
                <option value="1">1 Room</option>
                <option value="2">2 Rooms</option>
                <option value="3">3 Rooms</option>
              </select>
              {errors.roomCount && <span className="error-message">{errors.roomCount}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="preferredFloor" className="label">Preferred Floor *</label>
            <select
              id="preferredFloor"
              name="preferredFloor"
              value={formData.preferredFloor}
              onChange={handleInputChange}
              className={`select ${errors.preferredFloor ? 'input-error' : ''}`}
            >
              <option value="">Select preferred floor</option>
              <option value="1">1st Floor</option>
              <option value="2">2nd Floor</option>
              <option value="3">3rd Floor</option>
            </select>
            {errors.preferredFloor && <span className="error-message">{errors.preferredFloor}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="comments" className="label">Comments or Special Requests</label>
            <textarea
              id="comments"
              name="comments"
              value={formData.comments}
              onChange={handleInputChange}
              className="textarea"
              placeholder="Tell us about any special requests or preferences..."
              rows="4"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="submit-button"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </button>

          {submitMessage && (
            <div className={`message ${submitMessage.includes('Error') ? 'message-error' : 'message-success'}`}>
              {submitMessage}
            </div>
          )}
        </form>

        <footer className="footer">
          <p className="footer-text">Secure form powered by Salesforce integration</p>
        </footer>
      </div>
    </div>
  )
}

export default App