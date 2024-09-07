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

  };
  const symptoms = async () => {

  };
  const markDays = async () => {

  };
  const notifications = async () => {

  };

  useEffect(() => {
    setBCount(bots.length)
  }, []);

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