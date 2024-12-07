import React, { useState, useEffect } from 'react';

import { DisplayCampaigns } from '../components';
import { useStateContext } from '../context';

const Profile = () => {
  return <DisplayCampaigns title="All Campaigns" />;
};

export default Profile;
