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
  Checkbox
} from '@vkontakte/vkui';

import appconfig from './config';

const AccountManager = ({onBack}) => {
  const [regState, setRegState] = useState(true)
  const [avalue, setAValue] = useState(null)
  const [bots, setBots] = useState([]);
  const [bloading, setBLoading] = useState(false);
  const [log, setLog] = useState([])

  const onChange = (e) => {
    setAValue(e.target.value);
  };


  const appendLog = (data) => {
    setLog(log => [...log, data]);
  }
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

  const addAccount = async (token) => {
      try {
        const response = await fetch(appconfig.baseURL+'/accounts.add?token='+token+'&reg='+regState);
        const data = await response.json();
        if(data.result.success){
          return `Успех [id${data.result.user.id}]`
        }else{
          return `Error :`+data.result.error
        }
      } catch (error) {
        console.log("Add account error "+error)
      } finally {
      }
  };

  const work = async () => {
    setBLoading(true)
    let accountsArray = avalue.split(/\r?\n/);
    for(let token of accountsArray){
      let res = await addAccount(token)
      appendLog(res)
    }
      setBLoading(false)
  }
  useEffect(() => {
    fetchBots();
  }, []);

  const handleReg = (e) => {
    setRegState(e.target.checked)
  }

  return (
    <>

      <PanelHeader
        before={<PanelHeaderBack onClick={onBack} />}
      >
        botex
      </PanelHeader>
      <Div>
      <Group header={<Header>Добавить</Header>}>
      <Textarea 
        value={avalue}
        onChange={onChange}
        placeholder="access_token(ы) разделенные новой строкой"
        maxHeight={128}
      />
      <Button
                align="center"
                appearance="accent"
                loading={bloading}
                onClick={work}
                stretched
              >
              proc
              </Button>
      </Group>
      <SimpleCell before={<Checkbox onChange={e => handleReg(e)} defaultChecked/>}>
          пройти регистрацию
      </SimpleCell>
      {log.map(l => 
        (
          <SimpleCell> {l} </SimpleCell>
        )
      )}
      </Div>
    </>
  );
}

export default AccountManager;