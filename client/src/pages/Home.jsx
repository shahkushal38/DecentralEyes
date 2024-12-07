import React, { useState, useEffect } from 'react';

import { DisplayCampaigns } from '../components';

const Home = () => {
  return <DisplayCampaigns title="All Tools" isLoading={isLoading} />;
};

export default Home;
