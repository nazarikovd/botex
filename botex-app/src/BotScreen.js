import React, {useEffect, useState} from 'react';
import {
  PanelHeader,
  PanelHeaderBack,
  SimpleCell,
  Group,
  CellButton,
  Placeholder,
  Header,
  Avatar,
} from '@vkontakte/vkui';
import {
  Icon28HashtagOutline,
  Icon28BrainOutline,
  Icon28MagicWandOutline,
  Icon28Notifications
} from '@vkontakte/icons';

const BotScreen = ({ bots, cbot, onBack }) => {
  
  const [bCount, setBCount] = useState(0)

  const tryToGetAll = async () => {
    if(cbot){
      let res = await getAPI('cotex.tryToGetAllPoints', {"uuid": cbot.uuid})
      console.log(res)
    }else{
      let res = await getAPI('cotex.tryToGetAllPoints')
      console.log(res)
    }
  };
  const symptoms = async () => {
    if(cbot){
      let res = await getAPI('cotex.addSymptoms', {"uuid": cbot.uuid})
      console.log(res)
    }else{
      let res = await getAPI('cotex.addSymptoms')
      console.log(res)
    }

  };
  const markDays = async () => {
    if(cbot){
      let res = await getAPI('cotex.markDays', {"uuid": cbot.uuid})
      console.log(res)
    }else{
      let res = await getAPI('cotex.markDays')
      console.log(res)
    }

  };
  const notifications = async () => {
    if(cbot){
      let res = await getAPI('cotex.notification', {"uuid": cbot.uuid})
      console.log(res)
    }else{
      let res = await getAPI('cotex.notification')
      console.log(res)
    }

  };

  useEffect(() => {
    setBCount(bots.length)
  }, []);

  const getAPI = async (method, params=null) => {
      try {
        const response = await fetch('/'+method+'?'+new URLSearchParams(params).toString());
        const data = await response.json();
        return data
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {

      }
  };

  return (
    <>
      <PanelHeader
        before={<PanelHeaderBack onClick={onBack} />}
      >
        botex
      </PanelHeader>

        <Group>

          {cbot ? (

            <Group mode="plain">
              <SimpleCell
                before={<Avatar size={40} src={cbot._lastCotexData.photo_100} />}
                subtitle={`Points: ${cbot.points}`}
              >
                {cbot._lastCotexData.first_name} {cbot._lastCotexData.last_name}
              </SimpleCell>

              <SimpleCell indicator={cbot.uuid}>
                UUID
              </SimpleCell>

              <SimpleCell indicator={cbot.uid}>
                ID
              </SimpleCell>
            </Group>

          ) : (

            <Placeholder>Выбрано {bCount} ботов</Placeholder>

          )}

          <Group mode="plain">
            <CellButton before={<Icon28HashtagOutline />} onClick={tryToGetAll}>
              Забрать все баллы
            </CellButton>
          </Group>
          <Group header={<Header>Отметки</Header>}>
            <CellButton before={<Icon28BrainOutline />} onClick={symptoms}>
              Симптомы
            </CellButton>
            <CellButton before={<Icon28MagicWandOutline />} onClick={markDays}>
              ПМС
            </CellButton>
          </Group>
          <Group header={<Header>Уведы</Header>}>
            <CellButton before={<Icon28Notifications />} onClick={notifications}>
              Забрать баллы за уведы
            </CellButton>
          </Group>
        </Group>
    </>
  );
};

export default BotScreen;