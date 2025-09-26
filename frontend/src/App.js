import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/landingPage/landingPage';
import Login from './components/auth/login';
import Signup from './components/auth/signup';

import DashboardLayout from './components/dashboard/DashboardLayout';
import EditVenue from './components/dashboard/EditVenue';
import Search from './components/dashboard/search';
import ManageVenues from './components/dashboard/ManageVenues';
import ManageEvents from './components/dashboard/ManageEvents';
import AddEvent from './components/dashboard/AddEvent';
import EditEvent from './components/dashboard/EditEvent';
import AddVenue from './components/dashboard/AddVenue';
import VenueDetails from './components/dashboard/VenueDetails';
import EventDetails from './components/events/EventDetails';
import RegisterEvent from './components/events/RegisterEvent';





function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Search />} />
            <Route path="venues" element={<ManageVenues />} />
            <Route path="events" element={<ManageEvents />} />
            <Route path="events/add" element={<AddEvent />} />
            <Route path="venues/add" element={<AddVenue />} />
            <Route path="venues/edit/:id" element={<EditVenue />} />
            <Route path="/dashboard/venues/:id" element={<VenueDetails />} />
            <Route path="events/edit/:id" element={<EditEvent />} />
          </Route>
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/events/:id/register" element={<RegisterEvent />} />
          {/* Add more routes here as you build more pages */}
          {/* <Route path="/events" element={<EventsPage />} /> */}
          {/* <Route path="/profile" element={<ProfilePage />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;