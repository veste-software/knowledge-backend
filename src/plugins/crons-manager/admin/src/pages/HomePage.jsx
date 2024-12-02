// src/plugins/cron-manager/admin/src/components/CronManager.js
import { useEffect, useState } from 'react';
import { Button } from '@strapi/design-system';

const CronManager = () => {
  const [cronJobs, setCronJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCronJobs = async () => {
      const response = await fetch('/admin/plugins/crons-manager/cron-jobs');
      const data = await response.json();
      setCronJobs(data);
      setIsLoading(false);
    };

    fetchCronJobs();
  }, []);

  return (
    <div>
      <span variant="alpha">Manage Cron Jobs</span>
      {isLoading ? (
        <span>Loading...</span>
      ) : (
        <ul>
          {cronJobs.map((job) => (
            <li key={job.key}>
              {job.key} - {job.status}
              <Button>Enable</Button>
              <Button>Disable</Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CronManager;
