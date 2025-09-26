import React, { useState } from 'react';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    // You can add API call or email service integration here
  };

  return (
         <div id="contact-section" className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-800 py-20 font-raleway">
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         {/* Header Section */}
         <div className="text-center mb-20">
           <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 font-raleway">
             Contact Us
           </h1>
           <p className="text-xl text-blue-100 max-w-3xl mx-auto font-raleway">
             Ready to start planning your next event? Get in touch with us and let's make your vision a reality.
           </p>
         </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <div className="space-y-8">
                         <div>
               <h2 className="text-3xl font-bold text-white mb-6 font-raleway">
                 Let's Start Planning Together
               </h2>
               <p className="text-lg text-blue-100 leading-relaxed font-raleway">
                 Whether you're planning a corporate conference, wedding celebration, or community event, 
                 our team is here to help you every step of the way.
               </p>
             </div>

            {/* Contact Details */}
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gold-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                                 <div>
                   <h3 className="text-lg font-semibold text-white font-raleway">Phone</h3>
                   <p className="text-blue-100 font-raleway">+1 (555) 123-4567</p>
                 </div>
               </div>

               <div className="flex items-center space-x-4">
                 <div className="w-12 h-12 bg-gold-500 rounded-full flex items-center justify-center">
                   <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                   </svg>
                 </div>
                 <div>
                   <h3 className="text-lg font-semibold text-white font-raleway">Email</h3>
                   <p className="text-blue-100 font-raleway">hello@eventmanager.com</p>
                 </div>
               </div>

               <div className="flex items-center space-x-4">
                 <div className="w-12 h-12 bg-gold-500 rounded-full flex items-center justify-center">
                   <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                   </svg>
                 </div>
                 <div>
                   <h3 className="text-lg font-semibold text-white font-raleway">Office</h3>
                   <p className="text-blue-100 font-raleway">123 Event Street, Suite 100<br />City, State 12345</p>
                 </div>
               </div>
                         </div>

                           {/* Social Media Card */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4 font-raleway">Follow Our Journey</h3>
                <p className="text-gray-600 text-sm mb-4 font-raleway">
                  Stay connected with us on social media for event inspiration, tips, and behind-the-scenes content.
                </p>
                               <div className="flex space-x-4">
                  <a href="#" className="w-10 h-10 bg-blue-400 hover:bg-blue-500 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </a>
                  <a href="#" className="w-10 h-10 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                    </svg>
                  </a>
                  <a href="#" className="w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                    </svg>
                  </a>
                  <a href="#" className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                </div>
             </div>
           </div>

                     {/* Contact Form */}
           <div className="bg-white rounded-3xl p-8 shadow-xl">
             <h3 className="text-2xl font-bold text-gray-900 mb-6 font-raleway">Send us a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                                     <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2 font-raleway">
                     Full Name *
                   </label>
                                            <input
                           type="text"
                           id="name"
                           name="name"
                           value={formData.name}
                           onChange={handleChange}
                           required
                           className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 placeholder-gray-500 rounded-3xl focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-colors font-raleway"
                           placeholder="Enter your full name"
                         />
                 </div>
                 <div>
                   <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 font-raleway">
                     Email Address *
                   </label>
                                            <input
                           type="email"
                           id="email"
                           name="email"
                           value={formData.email}
                           onChange={handleChange}
                           required
                           className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 placeholder-gray-500 rounded-3xl focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-colors font-raleway"
                           placeholder="Enter your email"
                         />
                 </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                   <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2 font-raleway">
                     Phone Number
                   </label>
                                            <input
                           type="tel"
                           id="phone"
                           name="phone"
                           value={formData.phone}
                           onChange={handleChange}
                           className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 placeholder-gray-500 rounded-3xl focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-colors font-raleway"
                           placeholder="Enter your phone number"
                         />
                 </div>
                 <div>
                   <label htmlFor="eventType" className="block text-sm font-medium text-gray-700 mb-2 font-raleway">
                     Event Type
                   </label>
                                            <select
                           id="eventType"
                           name="eventType"
                           value={formData.eventType}
                           onChange={handleChange}
                           className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 placeholder-gray-500 rounded-3xl focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-colors font-raleway"
                         >
                     <option value="">Select event type</option>
                     <option value="corporate">Corporate Event</option>
                     <option value="wedding">Wedding</option>
                     <option value="conference">Conference</option>
                     <option value="birthday">Birthday Party</option>
                     <option value="anniversary">Anniversary</option>
                     <option value="other">Other</option>
                   </select>
                 </div>
               </div>

               <div>
                 <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2 font-raleway">
                   Message *
                 </label>
                                        <textarea
                         id="message"
                         name="message"
                         value={formData.message}
                         onChange={handleChange}
                         required
                         rows={5}
                         className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 placeholder-gray-500 rounded-3xl focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-colors resize-none font-raleway"
                         placeholder="Tell us about your event and how we can help..."
                       />
               </div>

                                                  <button
                       type="submit"
                       className="w-full bg-gold-500 hover:bg-gold-600 text-white py-4 rounded-3xl font-semibold text-lg transition-all duration-300 hover:scale-105 font-raleway"
                     >
                       Send Message
                     </button>
            </form>
          </div>
        </div>

                 
      </div>
    </div>
  );
}

export default Contact;
