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
} from '@vkontakte/vkui';

import appconfig from './config';

const ShopScreen = ({onBack}) => {

  const [shopdata, setShopData] = useState([])

  const getShopData = async () => {

        try {
          const response = await fetch(appconfig.baseURL+'/cotex.getShop');
          const data = await response.json();
          setShopData(data.result.data);
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {

        }
  }

  useEffect(() => {
    getShopData();
  }, []);

  return (
    <>

      <PanelHeader
        before={<PanelHeaderBack onClick={onBack} />}
      >
        botex
      </PanelHeader>

        {shopdata.length > 0 ? (

          shopdata.map(item => (

            <Group>

              <RichCell
                before={<Avatar size={70} src={item.image_url} />}
                text={`${item.price} балов`}
                actions={
                  <ButtonGroup mode="horizontal" gap="s" stretched>
                    <Button mode="primary" size="s">
                      Купить
                    </Button>
                    <Button mode="secondary" size="s">
                      Автопокупка
                    </Button>
                  </ButtonGroup>
                }
                multiline
                >

                  {item.name}

              </RichCell>

            </Group>
            
          ))

        ) : (
          <Placeholder>No shop found.</Placeholder>
        )}
    </>
  );
}

export default ShopScreen;