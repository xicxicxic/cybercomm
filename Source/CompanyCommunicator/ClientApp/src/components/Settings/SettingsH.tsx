import * as React from "react";
import { useState, useEffect } from "react";
import * as microsoftTeams from "@microsoft/teams-js";
import { initializeIcons } from "office-ui-fabric-react/lib/Icons";
import * as AdaptiveCards from "adaptivecards";
import { getFeeds, getSettings, updateSettings, createFeed } from "../../apis/messageListApi";
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
  Table,
  SettingsIcon,
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
  timestamp: any;
  value: string;
};

type FeedItem = {
  partitionKey?: string;
  rowKey?: string;
  timestamp?: any;
  value: string;
};

function SettingsH(props: ISettingsProps) {
  //Inicializa todos os states a serem usados
  const [askAuth, setAskAuth] = useState<boolean>(props.AskAuth);
  const [getCncsNews, setGetCncsNews] = useState<boolean>(props.GetCncsNews);
  const [loading, setLoading] = useState<boolean>(true);
  const [askAuthObj, setAskAuthObj] = useState<Settings>();
  const [getCncsNewsObj, setGetCncsNewsObj] = useState<Settings>();
  const [feedsList, setFeedsList] = useState<FeedItem[]>();
  //var list:any;

  //Faz o save e trata de fazer o PUT das novas settings
  function saveHandler (event: any) {
    askAuthObj.value = askAuth.toString();
    getCncsNewsObj.value = getCncsNews.toString();
    updateSettings(askAuthObj);
    updateSettings(getCncsNewsObj);
    feedsList && feedsList.forEach(feed => createFeed(feed));
    microsoftTeams.tasks.submitTask();
  }

  function handleChange(event: any, index: number) { 
    if(feedsList){
      feedsList[index].value = event.target.value;
      setFeedsList(feedsList);
    }
      }


  function addHandler() { 
    if(feedsList){
      feedsList.push({partitionKey: "Feed", rowKey:"x", value: ""});
      setFeedsList([...feedsList]);
    }
  }



  //Carrega os settings do API e da update aos states
  async function loadSettings() {
    const response = await getSettings();
    const settingsResponse: Settings[] = response.data;
    settingsResponse.forEach((setting) => {
      if (setting.rowKey == "AskAuth") {
        setAskAuthObj({
          ...setting,
        });
        if (setting.value == "true") {
          setAskAuth(true);
        } else if (setting.value == "false") {
          setAskAuth(false);
        }
      }
      if (setting.rowKey == "GetCNCSNews") {
        setGetCncsNewsObj({
          ...setting,
        });
        if (setting.value == "true") {
          setGetCncsNews(true);
        } else if (setting.value == "false") {
          setGetCncsNews(false);
        }
      }
    });
  }

  useEffect(() => {
    document.addEventListener("keydown", escFunction, false);
    microsoftTeams.initialize();
    loadSettings();
    getFeeds().then(res => {setFeedsList(res.data);});
    setLoading(false);
  }, []);
  

  function escFunction(event: any) {
    if (event.keyCode === 27 || event.key === "Escape") {
      microsoftTeams.tasks.submitTask();
    }
  }

console.log(feedsList)



  /*if (loading) {
    return (
      <Flex>
        <h1>Loading...</h1>
      </Flex>
    );
  } else {*/
    return (
      <Flex className="container" column>
        <Flex className="boxContainer" column>
          <Checkbox
            label="Ask for authorization"
            checked={askAuth}
            toggle
            onChange={() => {
              setAskAuth(!askAuth);
            }}
          ></Checkbox>
          <Checkbox
            label="Get the CNCS news"
            toggle
            checked={getCncsNews}
            onChange={() => {
              setGetCncsNews(!getCncsNews);
            }}
          ></Checkbox>
          {feedsList && feedsList.map((feed : FeedItem, index: number)=> <Input type="text" defaultValue={feed.value} onChange = {(e:any)=>  handleChange(e, index) }> </Input> )}
          <Button primary content="Add" onClick={()=>  addHandler()}></Button>
        </Flex>
        
        <Button primary content="Save" onClick={saveHandler}></Button>
      </Flex>
    );
  //}
}

export default SettingsH;
