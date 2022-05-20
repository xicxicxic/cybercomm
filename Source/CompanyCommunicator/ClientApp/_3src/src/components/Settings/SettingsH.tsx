import * as React from "react";
import { useState, useEffect } from "react";
import * as microsoftTeams from "@microsoft/teams-js";
import { initializeIcons } from "office-ui-fabric-react/lib/Icons";
import * as AdaptiveCards from "adaptivecards";
import { getSettings, updateSettings } from "../../apis/messageListApi";
import {
  Button,
  Loader,
  Dropdown,
  Text,
  Flex,
  Input,
  TextArea,
  RadioGroup,
  Checkbox,
} from "@fluentui/react-northstar";

import {
  getInitAdaptiveCard,
  setCardTitle,
  setCardImageLink,
  setCardSummary,
  setCardAuthor,
  setCardBtn,
} from "../AdaptiveCard/adaptiveCard";
import { formatDate } from "../../i18n";
//Interface para os props, provavelmente inutil
export interface ISettingsProps {
  AskAuth: boolean;
  GetCncsNews: boolean;
}
//Type para o objeto settings
type Settings = {
  partitionKey: string;
  rowKey: string;
  timestamp: string;
  value: string;
};

function SettingsH(props: ISettingsProps) {
  //Inicializa todos os states a serem usados
  const [askAuth, setAskAuth] = useState<boolean>(props.AskAuth);
  const [getCncsNews, setGetCncsNews] = useState<boolean>(props.GetCncsNews);
  const [loading, setLoading] = useState<boolean>(true);
  const [settingsList, setSettingsList] = useState<Settings[]>([]);

  //Faz o save e trata de fazer o PUT das novas settings
  function saveHandler(event: any) {
    settingsList.forEach((setting) => {
      updateSettings(setting);
    });

    microsoftTeams.tasks.submitTask();
  }

  //Carrega os settings do API e da update aos states
  async function loadSettings() {
    const response = await getSettings();
    const settingsResponse: Settings[] = response.data;
    let settingsPlaceholder: Settings[];
    settingsResponse.forEach((setting) => {
      setting.timestamp = formatDate(setting.timestamp);
      if (setting.rowKey == "AskAuth") {
        settingsPlaceholder.push(setting);
        if (setting.value == "true") {
          setAskAuth(true);
        } else if (setting.value == "false") {
          setAskAuth(false);
        }
      }
      if (setting.rowKey == "GetCNCSNews") {
        settingsPlaceholder.push(setting);
        if (setting.value == "true") {
          setGetCncsNews(true);
        } else if (setting.value == "false") {
          setGetCncsNews(false);
        }
      }
      setSettingsList(settingsPlaceholder);
    });
  }

  useEffect(() => {
    document.addEventListener("keydown", escFunction, false);
    microsoftTeams.initialize();
    loadSettings();
    setLoading(false);
  }, []);

  function escFunction(event: any) {
    if (event.keyCode === 27 || event.key === "Escape") {
      microsoftTeams.tasks.submitTask();
    }
  }
  if (loading) {
    return (
      <Flex>
        <h1>Loading...</h1>
      </Flex>
    );
  } else {
    return (
      <Flex className="container" column>
        <Flex className="boxContainer" column>
          <Checkbox
            label="Ask for authorization"
            checked={askAuth}
            toggle
            onChange={() => {
              if (askAuth) {
                setAskAuth(false);
              } else setAskAuth(true);
            }}
          ></Checkbox>
          <Checkbox
            label="Get the CNCS news"
            toggle
            checked={getCncsNews}
            onChange={() => {
              if (getCncsNews) {
                setAskAuth(false);
              } else setAskAuth(true);
            }}
          ></Checkbox>
        </Flex>
        <Button primary content="Save" onClick={saveHandler}></Button>
      </Flex>
    );
  }
}

export default SettingsH;
