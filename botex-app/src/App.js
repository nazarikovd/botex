import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AdaptivityProvider,
  ConfigProvider,
  AppRoot,
  View,
  Panel,
  PanelHeader,
  SimpleCell,
  Avatar,
  Placeholder,
  Header,
  Group,
  Spacing
   } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import {
Icon28Notifications,
Icon28ClockOutline,
Icon28HashtagOutline,
Icon28ShoppingCartOutline,
Icon28AddOutline } from '@vkontakte/icons';

import BotScreen from './BotScreen'
import ShopScreen from './ShopScreen'
import AccountManager from './AccountManager'
import JobsScreen from './JobsScreen'

function App() {
  const [bots, setBots] = useState([]);
  const [cbot, setCBot] = useState(null)
  const [activepanel, setActivePanel] = useState('home')

  const openBotScreen = (cbot) => {

    setCBot(cbot)
    setActivePanel("botscreen")

  }


  const BotCell = ({ bot }) => {
  return (
    <SimpleCell
      before={<Avatar size={40} src={bot._lastCotexData.photo_100} />}
      subtitle={`Points: ${bot.points}`}
      onClick={() => openBotScreen(bot)}
    >
      {bot._lastCotexData.first_name} {bot._lastCotexData.last_name}
    </SimpleCell>
  );
};
  const fetchBots = async () => {
      try {
        const response = await fetch('/accounts.getAll');
        const data = await response.json();
        setBots(data.bots); // Assuming the structure returned from the API matches this
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
      }
  };

  useEffect(() => {
    fetchBots();
  }, []);

  return (
    <AppRoot layout="plain">
    <View activePanel={activepanel}>
      <Panel id="home">
        <PanelHeader>botex</PanelHeader>

        <Group>

          <SimpleCell
            before={<Icon28ClockOutline/>}
            onClick={() => { setActivePanel("jobsscreen") }}
          >

            Задачи

          </SimpleCell>

          <SimpleCell
            before={<Icon28ShoppingCartOutline/>}
            onClick={() => { setActivePanel("shopscreen") }}
          >

            Магазин

          </SimpleCell>

          <SimpleCell
            before={<Icon28Notifications/>}
            onClick={() => {}}
          >

            Уведомления

          </SimpleCell>
        </Group>

        <Group header={<Header>Аккаунты</Header>}> 
          <SimpleCell
            before={<Icon28AddOutline/>}
            onClick={() => { setActivePanel("accounts") }}
          >

            Добавить аккаунт

          </SimpleCell>
        </Group>
        <Group header={<Header>Боты</Header>}> 
          <SimpleCell
            before={<Icon28HashtagOutline/>}
            onClick={() => openBotScreen()}
          >

            Выбрать всех сразу

          </SimpleCell>

          <Spacing />
              {bots.length > 0 ? (

                bots.map(bot => (
                  <BotCell key={bot.uuid} bot={bot} />
                ))

              ) : (
                <Placeholder>No bots found.</Placeholder>
              )}

        </Group>

      </Panel>

      <Panel id="botscreen">
        <BotScreen bots={bots} cbot={cbot} onBack={() => { setActivePanel('home') }} />
      </Panel>
      <Panel id="shopscreen">
        <ShopScreen onBack={() => { setActivePanel('home') }} />
      </Panel>
      <Panel id="accounts">

        <AccountManager
          onBack={
            () => { 
              fetchBots()
              setActivePanel('home')
            }
          }
        />

      </Panel>
      <Panel id="jobsscreen">
        <JobsScreen onBack={() => { setActivePanel('home') }} />
      </Panel>
    </View>
    </AppRoot>
  );
}

const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(
  <ConfigProvider>
    <AdaptivityProvider>
      <App />
    </AdaptivityProvider>
  </ConfigProvider>,
);

export default App;



