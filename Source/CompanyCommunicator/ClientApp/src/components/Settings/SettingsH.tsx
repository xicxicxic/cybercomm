import * as React from "react";
import { useState, useEffect } from "react";
import * as microsoftTeams from "@microsoft/teams-js";
import "./Settings.scss";
import { initializeIcons } from "office-ui-fabric-react/lib/Icons";
import * as AdaptiveCards from "adaptivecards";
import {
  getFeeds,
  createFeed,
  updateFeed,
  deleteFeed,
  getImageFeed,
  createImageFeed,
} from "../../apis/messageListApi";
import { TFunction } from "i18next";
import { getBaseUrl } from "../../configVariables";
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
  EditIcon,
} from "@fluentui/react-northstar";

export interface ISettingsProps {
  AskAuth: boolean;
  GetCncsNews: boolean;
}


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
  name: string;
};

function SettingsH(props: ISettingsProps) {
  //Inicializa todos os states a serem usados
  const [askAuth, setAskAuth] = useState<boolean>(props.AskAuth);
  const [getCncsNews, setGetCncsNews] = useState<boolean>(props.GetCncsNews);
  const [loading, setLoading] = useState<boolean>(true);
  const [askAuthObj, setAskAuthObj] = useState<FeedItem>();
  const [getCncsNewsObj, setGetCncsNewsObj] = useState<FeedItem>();
  const [feedsList, setFeedsList] = useState<FeedItem[]>();
  const [feedsToDeleteList, setfeedsToDeleteList] = useState<FeedItem[]>();
  const [imageDataToDeleteList, setImageDataToDeleteList] = useState<ImageItem[]>();
  const [imageDataList, setImageDataList] = useState<ImageItem[]>();

  //Faz o save e trata de fazer o PUT das novas settings
  function saveHandler(event: any) {    
    feedsList &&
      feedsList.forEach((feed) => {
        if (feed.rowKey == "") {
          createFeed(feed);
        } else {
          updateFeed(feed);
        }
      });
    feedsToDeleteList &&
      feedsToDeleteList
        .filter((feed) => feed.rowKey != "")
        .forEach((feed) => deleteFeed(feed.rowKey));
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
      feedsList.push({
        partitionKey: "Feed",
        value: "",
        rowKey: "",
        askAuth: true,
        dailyNotifications: true,
        title: "",
      });
      setFeedsList([...feedsList]);
    }
  }

  function addImageHandler() {
    if (imageDataList) {
      imageDataList.push({
        partitionKey: "Image",
        name: "",
        selectedImage: false,
        url: "",
      });
      setImageDataList([...imageDataList]);
    }
  }

  function deleteHandler(index: number) {
    if (feedsList && feedsToDeleteList) {
      feedsToDeleteList.push(feedsList[index]);
      setFeedsList([...feedsList.filter((feed) => feed != feedsList[index])]);
      setfeedsToDeleteList([...feedsToDeleteList]);
    }
  }

  function deleteImageHandler(index:number){
    if(imageDataList && imageDataToDeleteList){
        imageDataToDeleteList.push(imageDataList[index]);
        setImageDataList([...imageDataList.filter((imageData)=> imageData != imageDataList[index])])
        setImageDataToDeleteList([...imageDataList]);
    }
  }

  function handleSelectedImage(value: boolean, index: number) {
    if (imageDataList != null) {
      imageDataList[index].selectedImage = value;
    }
  }

  function handleImageNameChange(value: string, index: number) {
    if (imageDataList != null) {
      imageDataList[index].name = value;
    }
  }

  function handleImageUrlChange(value: string, index: number) {
    if (imageDataList != null) {
      imageDataList[index].url = value;
    }
  }

  //Carrega os settings do API e da update aos states
  async function loadSettings() {
    // const response = await getFeeds();
    // const settingsResponse: FeedItem[] = response.data;
    setfeedsToDeleteList([]);
    setImageDataToDeleteList([]);
    // settingsResponse.forEach((setting) => {
    //   if (setting.rowKey == "AskAuth") {
    //     setAskAuthObj({
    //       ...setting,
    //     });
    //     if (setting.value == "true") {
    //       setAskAuth(true);
    //     } else if (setting.value == "false") {
    //       setAskAuth(false);
    //     }
    //   }
    //   if (setting.rowKey == "GetCNCSNews") {
    //     setGetCncsNewsObj({
    //       ...setting,
    //     });
    //     if (setting.value == "true") {
    //       setGetCncsNews(true);
    //     } else if (setting.value == "false") {
    //       setGetCncsNews(false);
    //     }
    //   }
    // });
  }

  useEffect(() => {
    document.addEventListener("keydown", escFunction, false);
    microsoftTeams.initialize();
    loadSettings();
    getFeeds().then((res) => {
      setFeedsList(res.data);
    });
    getImageFeed().then((res) => {
      setImageDataList(res.data);
    });
    setLoading(false);
  }, []);

  function escFunction(event: any) {
    if (event.keyCode === 27 || event.key === "Escape") {
      microsoftTeams.tasks.submitTask();
    }
  }

  return (
    <Flex className="container" column>
      <Flex className="boxContainer" column>
        <Flex gap="gap.small">
          <Text
            weight="bold"
            className="title"
            content="Feed Configuration"
          ></Text>
        </Flex>

        <Text
          className="textDescription"
          content="List of RSS feeds to be sent daily by CyberComm."
        ></Text>
        <Text
          className="textDescription"
          content="The toggle Moderate switches between sending the message to the drafts or directly to the user without admin approval."
        ></Text>
        <Text
          className="textDescription"
          content="The toggle On checkes whether the news are to be retrieved or not."
        ></Text>

        <Flex gap="gap.small">
          <Flex.Item push>
            <Button
              className="addBtn"
              content="New feed"
              primary
              onClick={() => addHandler()}
            ></Button>
          </Flex.Item>
        </Flex>

        <Flex>
          <Text weight="bold" className="feedTitle" content="Title"></Text>
          <Text className="titleLink" weight="bold" content="Feed URL"></Text>
          <Text className="titleToggle" weight="bold" content="Moderate"></Text>
          <Text className="onToggle" weight="bold" content="On"></Text>
        </Flex>

        {feedsList &&
          feedsList.map((feed: FeedItem, index: number) => (
            <Flex className="itemsContainer">
              <Input
                fluid
                className="feedTitleInput"
                type="text"
                value={feed.title}
                onChange={(e: any) => handleTitleChange(e, index)}
              >
                {" "}
              </Input>
              <Input
                fluid
                className="inputFeed"
                type="text"
                value={feed.value}
                onChange={(e: any) => handleValueChange(e, index)}
              >
                {" "}
              </Input>
              <Checkbox
                checked={feed.askAuth}
                toggle
                onChange={() => handleAskAuthChange(!feed.askAuth, index)}
              ></Checkbox>
              <Checkbox
                checked={feed.dailyNotifications}
                toggle
                onChange={(e: any) =>
                  handleDailyNotificationsChange(
                    !feed.dailyNotifications,
                    index
                  )
                }
              ></Checkbox>
              <Button
                iconOnly
                className="deleteBtn"
                icon={<TrashCanIcon />}
                primary
                onClick={() => {
                  deleteHandler(index);
                }}
              ></Button>
            </Flex>
          ))}

        <Flex style={{ marginTop: "20px" }} gap="gap.small">
          <Flex.Item push>
            <Button
              className="addBtn"
              content="New image"
              primary
              onClick={() => addHandler()}
            />
          </Flex.Item>
        </Flex>

        <Flex>
          <Text className="feedTitleImage" weight="bold" content="Title"></Text>
          <Text
            className="titleLinkImage"
            weight="bold"
            content="Image URL"
          ></Text>
          <Text className="onToggleImage" weight="bold" content="On"></Text>
        </Flex>

        {imageDataList &&
          imageDataList.map((image: ImageItem, index: number) => (
            <Flex className="itemsContainer" style={{ position: "relative" }}>
              <Input
                fluid
                className="imageTitleInput"
                type="text"
                value={image.name}
                onChange={(e: any) => handleImageNameChange(e, index)}
              >
                {" "}
              </Input>
              <Input
                fluid
                className="imageUrlInput"
                type="text"
                value={image.url}
                onChange={(e: any) => handleImageUrlChange(e, index)}
              >
                {" "}
              </Input>
              <Checkbox
                checked={image.selectedImage}
                toggle
                onChange={(e: any) =>
                  handleSelectedImage(!image.selectedImage, index)
                }
              ></Checkbox>
              <Button
                iconOnly
                style={{ position: "absolute", right: "0px" }}
                className="deleteBtn"
                icon={<TrashCanIcon />}
                primary
                onClick={()=> {deleteImageHandler(index)}}
              ></Button>
            </Flex>
          ))}
      </Flex>

      <Flex hAlign="center">
        <Button
          className="saveBtn"
          primary
          content="Save Settings"
          onClick={saveHandler}
        ></Button>
      </Flex>
    </Flex>
  );
  //}
}

export default SettingsH;
