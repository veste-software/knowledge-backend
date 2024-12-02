// src/plugins/cron-manager/admin/src/pages/CronManager.js
import React, { useState, useEffect } from 'react';
import { Button, Text, Flex } from '@strapi/design-system';

const CronManager = () => {
  const [cronJobs, setCronJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCronJobs = async () => {
      const response = await fetch('/admin/plugins/cron-manager/cron-jobs');
      const data = await response.json();
      setCronJobs(data);
      setIsLoading(false);
    };

    fetchCronJobs();
  }, []);

  const handleAction = async (action, cronJobKey) => {
    const response = await fetch(`/admin/plugins/cron-manager/${action}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cronJobKey }),
    });
    const result = await response.json();
    alert(result.message);
    const updatedCronJobs = await fetch('/admin/plugins/cron-manager/cron-jobs').then(res => res.json());
    setCronJobs(updatedCronJobs);
  };

  return (
    <div>
      <Text variant="alpha">Manage Cron Jobs</Text>
      {isLoading ? (
        <Text>Loading cron jobs...</Text>
      ) : (
        <ul>
          {cronJobs.map((job) => (
            <li key={job.key}>
              {job.key} - {job.status}
              <Flex justifyContent="space-between" style={{ width: '200px' }}>
                <Button onClick={() => handleAction('enableCron', job.key)}>Enable</Button>
                <Button onClick={() => handleAction('disableCron', job.key)}>Disable</Button>
              </Flex>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CronManager;
