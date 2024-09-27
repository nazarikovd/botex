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
  Textarea,
  Header,
  Div,
  Paragraph,
  Switch,
  SimpleCell,
  CustomScrollView,
  Select,
  FormItem
} from '@vkontakte/vkui';

import appconfig from './config';

const JobManager = ({allJobs, onBack}) => {

  const [bots, setBots] = useState([]);

  const [typev, setType] = useState('all')
  const [everyv, setEvery] = useState('daily')
  const [uuidv, setUUID] = useState('all')




  const fetchBots = async () => {
      try {
        const response = await fetch(appconfig.baseURL+'/accounts.getAll');
        const data = await response.json();
        setBots(data.bots); // Assuming the structure returned from the API matches this
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
      }
  };

  const addJob = async (type, every, uuid=null) => {
      try {
        let url = `${appconfig.baseURL}/cotex.addJob?type=${type}&every=${every}`
        if(uuid !== "all"){
          url += `&uuid=${uuid}`
        }
        const response = await fetch(url);
        const data = await response.json();
        if(data.result.success){
          return `Успех [id${data.result}]`
        }else{
          return `Error :`+data.result.error
        }
      } catch (error) {
        console.log("Add job error "+error)
      } finally {
        allJobs()
      }
  };

  const work = async () => {
    await addJob(typev, everyv, uuidv)
  }

  useEffect(() => {
    fetchBots();
  }, []);


  return (
    <>

      <PanelHeader
        before={<PanelHeaderBack onClick={onBack} />}
      >
        Добавить задачу
      </PanelHeader>
      <Div>
      <FormItem top="Тип задачи">
        <Select
          value={typev}
          onChange={(e) => setType(e.target.value)}
          options={[
            { label: 'Симптомы', value: 'symptoms' },
            { label: 'Отметки', value: 'markdays' },
            { label: 'Все', value: 'all' },
            { label: 'Авторизация', value: 'auth' }
          ]}
        />
      </FormItem>
      <FormItem top="Частота выполнения">
        <Select
          value={everyv}
          onChange={(e) => setEvery(e.target.value)}
          options={[
            { label: 'Ежечасно', value: 'hourly' },
            { label: 'Ежедневно', value: 'daily' },
          ]}
        />
      </FormItem>
      <FormItem top="Аккаунт">
        <Select
          value={uuidv}
          onChange={(e) => setUUID(e.target.value)}
          options={[
            { label: 'Все аккаунты', value: "all" },
            ...bots.map((bot) => ({
              label: bot._lastCotexData.first_name + " " + bot._lastCotexData.last_name,
              value: bot.uuid,
              avatar: bot._lastCotexData.photo_100,
            }))
          ]}
        />
      </FormItem>
      <FormItem>
      <Button
                align="center"
                appearance="accent"
                stretched
                onClick={work}
              >
              работаем братья
      </Button>
      </FormItem>
      
      </Div>
    </>
  );
}

export default JobManager;