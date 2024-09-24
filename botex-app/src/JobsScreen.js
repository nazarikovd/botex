import React, {useEffect, useState} from 'react';
import {
  PanelHeader,
  PanelHeaderBack,
  Group,
  Placeholder,
  Avatar,
  RichCell,
  Button,
  ButtonGroup,
  SimpleCell
} from '@vkontakte/vkui';

const JobsScreen = ({onBack}) => {

  const [jobsdata, setJobsData] = useState([])

  const getJobsData = async () => {

        try {
          const response = await fetch('/cotex.getJobs');
          const data = await response.json();
          setJobsData(data.result.jobs);
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {

        }
  }

  useEffect(() => {
    getJobsData();
  }, []);

  const JobCell = ({ job }) => {
  return (
    <RichCell
        subhead={`Выполнять: ${job.every}`}
        text={`Тип: ${job.type}`}
        bottom={<BotCell job={job} />}
      >
      </RichCell>
  );
  };

  const BotCell = ({ job }) => {
    if(job.all){
      return "all"
    }
  return (
    <SimpleCell
      before={<Avatar size={40} src={job._lastCotexData.photo_100} />}
      subtitle={`Points: ${job._lastCotexData.points}`}
    >
      {job._lastCotexData.first_name} {job._lastCotexData.last_name}
    </SimpleCell>
  );
};
  return (
    <>

      <PanelHeader
        before={<PanelHeaderBack onClick={onBack} />}
      >
        Текущие задачи
      </PanelHeader>

        {jobsdata.length > 0 ? (

          jobsdata.map(item => (
            <JobCell job = {item} />
          ))

        ) : (
          <Placeholder>No jobs found.</Placeholder>
        )}
    </>
  );
}

export default JobsScreen;