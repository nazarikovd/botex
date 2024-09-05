import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AdaptivityProvider,
  ConfigProvider,
  AppRoot,
  View,
  Text,
  Button,
  Panel,
  PanelHeader,
  Div,
  SimpleCell,
  IconButton,
  Avatar,
  Placeholder } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import { Icon28Menu } from '@vkontakte/icons';


function App() {
  const [bots, setBots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cbot, setCBot] = useState({})
  const [activepanel, setActivePanel] = useState('home')

  const openConfig = (bot) => {
    setCBot(bot)
    setActivePanel("botconfig")
  }

  useEffect(() => {
    const fetchBots = async () => {
      try {
        const response = await fetch('/accounts.getAll');
        const data = await response.json();
        setBots(data.bots); // Assuming the structure returned from the API matches this
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBots();
  }, []);

  return (
    <AppRoot>
    <View activePanel={activepanel}>
      <Panel id="home">
        <PanelHeader>botex</PanelHeader>

              {bots.length > 0 ? (

                bots.map(bot => (
                  <SimpleCell
                    before={<Avatar size={40} src={bot._lastCotexData.photo_100} />}
                    after={
                      <IconButton onClick={() => openConfig(bot)}>
                        <Icon28Menu/>
                      </IconButton>
                    }
                    subtitle={`Points: ${bot.points}`}
                  >

                    {bot._lastCotexData.first_name} {bot._lastCotexData.last_name}

                  </SimpleCell>
                ))

              ) : (
                <Placeholder>No bots found.</Placeholder>
              )}

        
      </Panel>

      <Panel id="botconfig">
        <PanelHeader>botex</PanelHeader>

             <SimpleCell>
             {cbot.uuid}
             </SimpleCell>

        
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