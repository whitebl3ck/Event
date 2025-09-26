import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const VenueForm = ({ initialData, editMode }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(
    initialData ? {
      ...initialData,
      // Ensure nested objects are present for edit mode
      availability: initialData.availability || { openDays: [], openHours: { start: '', end: '' } },
      inHouseServices: initialData.inHouseServices || { catering: false, bar: false, decoration: false, cleaning: false, others: false, othersDescription: '' },
      technicalSupport: initialData.technicalSupport || { av: false, wifi: false, generator: false },
      images: initialData.images || [],
    }
    : {
      name: '',
      location: '',
      capacity: '',
      description: '', 
      availability: {
        openDays: [],
        openHours: {
          start: '',
          end: ''
        }
      },
      costAmount: '',
      costCurrency: 'USD',
      costType: 'per day',
      inHouseServices: {
        catering: false,
        bar: false,
        decoration: false,
        cleaning: false,
        others: false,
        othersDescription: ''
      },
      parkingAvailable: false,
      parkingSpaces: 0,
      technicalSupport: {
        av: false,
        wifi: false,
        generator: false
      },
      rules: '',
      images: []
    }
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [selectedImages, setSelectedImages] = useState([]); // For file objects
  const [imagePreviews, setImagePreviews] = useState([]); // For preview URLs

  // Navigate back to manage venues
  const handleBack = () => {
    navigate('/dashboard/venues');
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const nameParts = name.split('.');
      if (nameParts.length === 2) {
        const [parent, child] = nameParts;
        setFormData(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: type === 'checkbox' ? checked : value
          }
        }));
      } else if (nameParts.length === 3) {
        const [parent, child, grandchild] = nameParts;
        setFormData(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: {
              ...prev[parent][child],
              [grandchild]: type === 'checkbox' ? checked : value
            }
          }
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleDayChange = (day) => {
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        openDays: prev.availability.openDays.includes(day)
          ? prev.availability.openDays.filter(d => d !== day)
          : [...prev.availability.openDays, day]
      }
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate file types
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
      return isValidType && isValidSize;
    });

    if (validFiles.length !== files.length) {
      setSubmitMessage('Some files were skipped. Please select only image files under 5MB.');
    }

    // Create preview URLs
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    
    // Update state
    setSelectedImages(prev => [...prev, ...validFiles]);
    setImagePreviews(prev => [...prev, ...newPreviews]);
    
    // For backend compatibility, we'll handle file upload during form submission
    // For now, we'll store file names in the formData
    const fileNames = validFiles.map(file => file.name);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...fileNames]
    }));
  };

  const removeImage = (index) => {
    // Revoke the preview URL to free memory
    URL.revokeObjectURL(imagePreviews[index]);
    
    // Remove from all arrays
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  setSubmitMessage('');

  try {
    const formDataToSend = new FormData();

    // Append text fields (nested ones need to be stringified)
    formDataToSend.append('name', formData.name);
    formDataToSend.append('location', formData.location);
    formDataToSend.append('capacity', formData.capacity);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('availability', JSON.stringify(formData.availability));
    formDataToSend.append('costAmount', formData.costAmount);
    formDataToSend.append('costCurrency', formData.costCurrency);
    formDataToSend.append('costType', formData.costType);
    formDataToSend.append('inHouseServices', JSON.stringify(formData.inHouseServices));
    formDataToSend.append('parkingAvailable', formData.parkingAvailable);
    formDataToSend.append('parkingSpaces', formData.parkingSpaces);
    formDataToSend.append('technicalSupport', JSON.stringify(formData.technicalSupport));
    formDataToSend.append('rules', formData.rules);

    // Append images
    selectedImages.forEach((image) => {
      formDataToSend.append('images', image);
    });

    const token = localStorage.getItem('token');
    let response;
    if (editMode && initialData && initialData._id) {
      // Edit mode: update existing venue
      response = await fetch(`http://localhost:5000/api/venues/${initialData._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: formDataToSend,
      });
    } else {
      // Create mode: add new venue
      response = await fetch('http://localhost:5000/api/venues', {
        method: 'POST',
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: formDataToSend,
      });
    }

    if (response.ok) {
      const venue = await response.json();
      try {
        sessionStorage.setItem('justCreatedVenue', JSON.stringify(venue));
      } catch {}
      setSubmitMessage(editMode ? 'Venue updated successfully!' : 'Venue added successfully!');
      navigate('/dashboard/venues');
    } else {
      setSubmitMessage(editMode ? 'Error updating venue. Please try again.' : 'Error adding venue. Please try again.');
    }
  } catch (error) {
    console.error(editMode ? 'Error updating venue:' : 'Error creating venue:', error);
    setSubmitMessage(editMode ? 'Error updating venue. Please try again.' : 'Error adding venue. Please try again.');
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <div className=" mx-auto p-8 bg-white">
      {/* Header with Back Button */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gold-600 hover:text-gold-700 transition-colors duration-200 mr-4"
          >
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Manage Venues
          </button>
        </div>
  <h1 className="text-3xl font-bold text-gray-900 mb-2">{editMode ? 'Edit Your Venue' : 'Add New Venue'}</h1>
  <p className="text-gray-600">{editMode ? 'Update the details below to edit your venue.' : 'Fill in the details below to add a new venue to the system'}</p>
      </div>

      <div className="space-y-8">
        {/* Basic Information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Venue Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500"
                placeholder="Enter venue name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500"
                placeholder="Enter venue location"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Capacity *
              </label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleInputChange}
                required
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500"
                placeholder="Maximum capacity"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Availability *
              </label>
              
              {/* Open Days */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Open Days
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                    <label key={day} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.availability.openDays.includes(day)}
                        onChange={() => handleDayChange(day)}
                        className="form-checkbox h-4 w-4 text-gold-500 focus:ring-gold-500 border-gray-300 rounded"
                      />
                      <span className="text-xs text-gray-700">{day.slice(0, 3)}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Open Hours */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Open Hours
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {/* Start Time */}
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">From</label>
                    <input
                      type="time"
                      name="availability.openHours.start"
                      value={formData.availability.openHours.start}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                  </div>
                  

                  {/* End Time */}
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">To</label>
                    <input
                      type="time"
                      name="availability.openHours.end"
                      value={formData.availability.openHours.end}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                  </div>
                  
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cost Amount *
              </label>
              <input
                type="number"
                name="costAmount"
                value={formData.costAmount}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Currency *
              </label>
              <select
                name="costCurrency"
                value={formData.costCurrency}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="NGN">NGN</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cost Type *
              </label>
              <select
                name="costType"
                value={formData.costType}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500"
              >
                <option value="per day">Per Day</option>
                <option value="per hour">Per Hour</option>
              </select>
            </div>
          </div>
        </div>

        {/* In-House Services */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">In-House Services</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                name="inHouseServices.catering"
                checked={formData.inHouseServices.catering}
                onChange={handleInputChange}
                className="form-checkbox h-4 w-4 text-gold-500 focus:ring-gold-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">Catering</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                name="inHouseServices.bar"
                checked={formData.inHouseServices.bar}
                onChange={handleInputChange}
                className="form-checkbox h-4 w-4 text-gold-500 focus:ring-gold-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">Bar</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                name="inHouseServices.decoration"
                checked={formData.inHouseServices.decoration}
                onChange={handleInputChange}
                className="form-checkbox h-4 w-4 text-gold-500 focus:ring-gold-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">Decoration</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                name="inHouseServices.cleaning"
                checked={formData.inHouseServices.cleaning}
                onChange={handleInputChange}
                className="form-checkbox h-4 w-4 text-gold-500 focus:ring-gold-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">Cleaning</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                name="inHouseServices.others"
                checked={formData.inHouseServices.others}
                onChange={handleInputChange}
                className="form-checkbox h-4 w-4 text-gold-500 focus:ring-gold-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">Others</span>
            </label>
          </div>
          
          {/* Others Description Field - Only shows when Others is checked */}
          {formData.inHouseServices.others && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Please specify other services
              </label>
              <textarea
                name="inHouseServices.othersDescription"
                value={formData.inHouseServices.othersDescription}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500"
                placeholder="Describe the other in-house services available..."
              />
            </div>
          )}
        </div>

        {/* Parking */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Parking</h2>
          <div className="space-y-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                name="parkingAvailable"
                checked={formData.parkingAvailable}
                onChange={handleInputChange}
                className="form-checkbox h-4 w-4 text-gold-500 focus:ring-gold-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">Parking Available</span>
            </label>
            {formData.parkingAvailable && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Parking Spaces
                </label>
                <input
                  type="number"
                  name="parkingSpaces"
                  value={formData.parkingSpaces}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full md:w-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500"
                  placeholder="0"
                />
              </div>
            )}
          </div>
        </div>

        <div className='bg-gray-50 p-6 rounded-lg'>
          <input
          type="text"
          placeholder="Venue Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="border rounded-xl px-4 py-2 w-full"
/>
        </div>

        {/* Technical Support */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Technical Support</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                name="technicalSupport.av"
                checked={formData.technicalSupport.av}
                onChange={handleInputChange}
                className="form-checkbox h-4 w-4 text-gold-500 focus:ring-gold-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">Audio/Visual</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                name="technicalSupport.wifi"
                checked={formData.technicalSupport.wifi}
                onChange={handleInputChange}
                className="form-checkbox h-4 w-4 text-gold-500 focus:ring-gold-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">WiFi</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                name="technicalSupport.generator"
                checked={formData.technicalSupport.generator}
                onChange={handleInputChange}
                className="form-checkbox h-4 w-4 text-gold-500 focus:ring-gold-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">Generator</span>
            </label>
          </div>
        </div>

        {/* Images */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Venue Images</h2>
          <div className="space-y-4">
            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Images
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-gold-500 file:text-white file:cursor-pointer hover:file:bg-gold-600"
              />
              <p className="text-sm text-gray-500 mt-1">
                Select multiple images (JPG, PNG, GIF). Max 5MB per image.
              </p>
            </div>

            {/* Image Previews: show both existing and newly selected images in edit mode */}
            {(editMode && formData.images && formData.images.length > 0) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Existing Images ({formData.images.length})
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {formData.images.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={typeof img === 'string' ? `http://localhost:5000${img}` : URL.createObjectURL(img)}
                        alt={`Existing ${index + 1}`}
                        className="w-full h-32 object-cover rounded-md border border-gray-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            {imagePreviews.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selected Images ({imagePreviews.length})
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-md border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                      >
                        ×
                      </button>
                      <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                        {selectedImages[index]?.name.length > 15 
                          ? selectedImages[index]?.name.substring(0, 15) + '...'
                          : selectedImages[index]?.name
                        }
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Additional Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rules & Regulations
              </label>
              <textarea
                name="rules"
                value={formData.rules}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500"
                placeholder="Enter any rules, restrictions, or regulations for the venue..."
              />
            </div>
            
          </div>
        </div>

        {/* Submit Message */}
        {submitMessage && (
          <div className={`p-4 rounded-md ${submitMessage.includes('Error') 
            ? 'bg-red-100 text-red-700 border border-red-300' 
            : 'bg-green-100 text-green-700 border border-green-300'
          }`}>
            {submitMessage}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={handleBack}
            className="px-8 py-3 rounded-md font-medium transition duration-200 bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`px-8 py-3 rounded-md font-medium transition duration-200 ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gold-500 hover:bg-gold-600 focus:ring-4 focus:ring-gold-200'
            } text-white`}
          >
            {isSubmitting
              ? (editMode ? 'Saving...' : 'Adding Venue...')
              : (editMode ? 'Save' : 'Add Venue')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VenueForm;