import * as React from "react";
import { useState, useEffect } from "react";
import * as microsoftTeams from "@microsoft/teams-js";
import './Settings.scss';
import { initializeIcons } from "office-ui-fabric-react/lib/Icons";
import * as AdaptiveCards from "adaptivecards";
import { getFeeds, getSettings, updateSettings, createFeed, updateFeed, deleteFeed } from "../../apis/messageListApi";
import { TFunction } from "i18next";
import { getBaseUrl } from '../../configVariables';
import {
    Button,
    List,
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
    TableDeleteIcon,
    TrashCanIcon,
    EditIcon
} from "@fluentui/react-northstar";

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
    askAuth: boolean;
    dailyNotifications: boolean;
    title: string;
};

type ImageItem = {
    partitionKey?: string;
    rowKey?: string;
    timestamp?: any;
    url: string;
    selectedImage: boolean;
    
}

function SettingsH(props: ISettingsProps) {
    //Inicializa todos os states a serem usados
    const [askAuth, setAskAuth] = useState<boolean>(props.AskAuth);
    const [getCncsNews, setGetCncsNews] = useState<boolean>(props.GetCncsNews);
    const [loading, setLoading] = useState<boolean>(true);
    const [askAuthObj, setAskAuthObj] = useState<Settings>();
    const [getCncsNewsObj, setGetCncsNewsObj] = useState<Settings>();
    const [feedsList, setFeedsList] = useState<FeedItem[]>();
    const [feedsToDeleteList, setfeedsToDeleteList] = useState<FeedItem[]>();
    const [imageDataList, setImageDataList] = useState<ImageItem[]>();
    //var list:any;

    const placeholder = [
        "francisco",
        "mariana",
        "diana",
        "pedro"
    ]

    //Faz o save e trata de fazer o PUT das novas settings
    function saveHandler(event: any) {
        askAuthObj.value = askAuth.toString();
        getCncsNewsObj.value = getCncsNews.toString();
        updateSettings(askAuthObj);
        updateSettings(getCncsNewsObj);
        feedsList && feedsList.forEach(feed => {
            if (feed.rowKey == "") {
                createFeed(feed);
            }
            else {
                updateFeed(feed);
            }
        });
        feedsToDeleteList && feedsToDeleteList.filter(feed => feed.rowKey != "").forEach(feed => deleteFeed(feed.rowKey));
        microsoftTeams.tasks.submitTask();
    }

    function handleValueChange(event: any, index: number) {
        if (feedsList) {
            feedsList[index].value = event.target.value;
            setFeedsList([...feedsList]);
        }
    }

    function handleTitleChange(event: any, index: number) {
        if (feedsList) {
            feedsList[index].title = event.target.value;
            setFeedsList([...feedsList]);
        }
    }

    function handleAskAuthChange(value: boolean, index: number) {
        if (feedsList) {
            feedsList[index].askAuth = value;
            setFeedsList([...feedsList]);
        }
    }

    function handleDailyNotificationsChange(value: boolean, index: number) {
        if (feedsList) {
            feedsList[index].dailyNotifications = value;
            setFeedsList([...feedsList]);
        }
    }


    function addHandler() {
        if (feedsList) {
            feedsList.push({ partitionKey: "Feed", value: "", rowKey: "", askAuth: true, dailyNotifications: true, title: "" });
            setFeedsList([...feedsList]);
        }
    }


    function deleteHandler(index: number) {
        if (feedsList && feedsToDeleteList) {
            feedsToDeleteList.push(feedsList[index]);
            setFeedsList([...feedsList.filter(feed => feed != feedsList[index])]);
            setfeedsToDeleteList([...feedsToDeleteList]);
        }
    }



    //Carrega os settings do API e da update aos states
    async function loadSettings() {
        const response = await getSettings();
        const settingsResponse: Settings[] = response.data;
        setfeedsToDeleteList([]);
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
        getFeeds().then(res => { setFeedsList(res.data); });
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
    } else {
  
      <Checkbox
              label="Ask for authorization"
              checked={askAuth}
              toggle
              onChange={() => {
                setAskAuth(!askAuth);
              }}
            ></Checkbox>
            <Text style={{marginBottom:"5px"}} content = "If checked creates a draft message otherwise sends the message directly to CyberComm Team General."></Text>
            <Checkbox
              label="Get notifications from feeds"
              toggle
              checked={getCncsNews}
              onChange={() => {
                setGetCncsNews(!getCncsNews);
              }}
            ></Checkbox>
            <Text style={{marginBottom:"5px"}} content = "Runs daily, and gets notifications from the previous day."></Text>
      
      */
    return (
        <Flex className="container" column>
            <Flex className="boxContainer" column>
                <Flex gap="gap.small"><Text weight="bold" className="title" content="Feed Configuration"></Text></Flex>

                <Text className="textDescription" content="List of RSS feeds to be sent daily by CyberComm."></Text>
                <Text className="textDescription" content="The toggle AskAuth switches between sending the message to the drafts or directly to the user without admin approval."></Text>
                <Text className="textDescription" content="The toggle On checkes whether the news are to be retrieved or not."></Text>

                <Flex gap="gap.small"><Flex.Item push><Button className="addBtn" content="New feed" primary onClick={() => addHandler()}></Button></Flex.Item></Flex>

                <Flex>
                    <Text weight="bold" className="feedTitle" content="Title"></Text><Text className="titleLink" weight="bold" content="Feed URL"></Text>
                    <Text className="titleToggle" weight="bold" content="AskAuth"></Text><Text className="onToggle" weight="bold" content="On"></Text>
                </Flex>

                {feedsList && feedsList.map((feed: FeedItem, index: number) =>
                    <Flex className="itemsContainer">
                        <Input fluid className="feedTitleInput" type="text" value={feed.title} onChange={(e: any) => handleTitleChange(e, index)}> </Input>
                        <Input fluid className="inputFeed" type="text" value={feed.value} onChange={(e: any) => handleValueChange(e, index)}> </Input>
                        <Checkbox
                            checked={feed.askAuth}
                            toggle
                            onChange={
                                () => handleAskAuthChange(!feed.askAuth, index)
                            }
                        ></Checkbox>
                        <Checkbox
                            checked={feed.dailyNotifications}
                            toggle
                            onChange={
                                (e: any) => handleDailyNotificationsChange(!feed.dailyNotifications, index)
                            }
                        ></Checkbox>
                        <Button iconOnly className="deleteBtn" icon={<TrashCanIcon />} primary onClick={() => { deleteHandler(index) }}></Button>
                    </Flex>)}


                <Flex>
                    <Text className="titleLink" weight="bold" content="Image URL"></Text>
                    <Text className="onToggle" weight="bold" content="On"></Text>
                </Flex>

                {imageDataList && imageDataList.map((image: ImageItem, index: number) =>

                    <Flex className="itemsContainer">
                        <Input fluid className="inputFeed" type="text" value={image.url} onChange={(e: any) => handleValueChange(e, index)}> </Input>
                        <Checkbox
                            checked={image.selectedImage}
                            toggle
                            onChange={
                                (e: any) => handleDailyNotificationsChange(!image.selectedImage, index)
                            }
                        ></Checkbox>
                    </Flex>)}

            </Flex>

            <Flex hAlign="center"><Button className="saveBtn" primary content="Save Settings" onClick={saveHandler}></Button></Flex>
        </Flex>
    );
    //}


}

export default SettingsH;
