import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import { withTranslation, WithTranslation } from "react-i18next";
import { initializeIcons } from "office-ui-fabric-react/lib/Icons";
import * as AdaptiveCards from "adaptivecards";
import {
  Button,
  Loader,
  Dropdown,
  Text,
  Flex,
  Input,
  TextArea,
  RadioGroup,
} from "@fluentui/react-northstar";
import * as microsoftTeams from "@microsoft/teams-js";

import "./newMessage.scss";
import "./teamTheme.scss";
import {
  getDraftNotification,
  getTeams,
  createDraftNotification,
  updateDraftNotification,
  searchGroups,
  getGroups,
  verifyGroupAccess,
} from "../../apis/messageListApi";
import {
  getInitAdaptiveCard,
  setCardTitle,
  setCardImageLink,
  setCardSummary,
  setCardAuthor,
  setCardBtn,
} from "../AdaptiveCard/adaptiveCard";
import { getBaseUrl } from "../../configVariables";
import { ImageUtil } from "../../utility/imageutility";
import { TFunction } from "i18next";



export interface formState {
  askAuth: boolean;
  getCncsNews: boolean;
}

export interface IAppConfigProps extends RouteComponentProps, WithTranslation {
  getDraftMessagesList?: any;
  askAuth: boolean;
  getCncsNews: boolean;
}

class NewMessage extends React.Component<IAppConfigProps, formState> {
  readonly localize: TFunction;
  private card: any;

  constructor(props: IAppConfigProps) {
    super(props);
    initializeIcons();
    this.localize = this.props.t;
    this.card = getInitAdaptiveCard(this.localize);
    this.setDefaultCard(this.card);

    this.state = {
      askAuth: props.askAuth,
      getCncsNews: props.getCncsNews,
    };
  }

  public async componentDidMount() {
    microsoftTeams.initialize();
    //- Handle the Esc key
    document.addEventListener("keydown", this.escFunction, false);
    let params = this.props.match.params;
  }

  public componentWillUnmount() {
    document.removeEventListener("keydown", this.escFunction, false);
  }

  public render(): JSX.Element {
    if (this.state.loader) {
      return (
        <div className="Loader">
          <Loader />
        </div>
      );
    } else {
        return (
          <div className="taskModule">
            <Flex
              column
              className="formContainer"
              vAlign="stretch"
              gap="gap.small"
            >
              <Flex className="scrollableContent">
                <Flex.Item size="size.half">
                  <Flex column className="formContentContainer">
                    <Input
                      className="inputField"
                      value={this.state.title}
                      label={this.localize("TitleText")}
                      placeholder={this.localize("PlaceHolderTitle")}
                      onChange={this.onTitleChanged}
                      autoComplete="off"
                      fluid
                    />

                    <Input
                      fluid
                      className="inputField"
                      value={this.state.imageLink}
                      label={this.localize("ImageURL")}
                      placeholder={this.localize("ImageURL")}
                      onChange={this.onImageLinkChanged}
                      error={!(this.state.errorImageUrlMessage === "")}
                      autoComplete="off"
                    />
                    <Text
                      className={
                        this.state.errorImageUrlMessage === "" ? "hide" : "show"
                      }
                      error
                      size="small"
                      content={this.state.errorImageUrlMessage}
                    />

                    <div className="textArea">
                      <Text content={this.localize("Summary")} />
                      <TextArea
                        autoFocus
                        placeholder={this.localize("Summary")}
                        value={this.state.summary}
                        onChange={this.onSummaryChanged}
                        fluid
                      />
                    </div>
                    <Input
                      className="bla"
                      value={this.state.author}
                      label={this.localize("Author")}
                      placeholder={this.localize("Teste!")}
                      onChange={this.onAuthorChanged}
                      autoComplete="off"
                      fluid
                    ></Input>
                    <Input
                      className="inputField"
                      value={this.state.author}
                      label={this.localize("Author")}
                      placeholder={this.localize("Author")}
                      onChange={this.onAuthorChanged}
                      autoComplete="off"
                      fluid
                    />
                    <Input
                      className="inputField"
                      fluid
                      value={this.state.btnTitle}
                      label={this.localize("ButtonTitle")}
                      placeholder={this.localize("ButtonTitle")}
                      onChange={this.onBtnTitleChanged}
                      autoComplete="off"
                    />
                    <Input
                      className="inputField"
                      fluid
                      value={this.state.btnLink}
                      label={this.localize("ButtonURL")}
                      placeholder={this.localize("ButtonURL")}
                      onChange={this.onBtnLinkChanged}
                      error={!(this.state.errorButtonUrlMessage === "")}
                      autoComplete="off"
                    />
                    <Text
                      className={
                        this.state.errorButtonUrlMessage === ""
                          ? "hide"
                          : "show"
                      }
                      error
                      size="small"
                      content={this.state.errorButtonUrlMessage}
                    />
                  </Flex>
                </Flex.Item>
                <Flex.Item size="size.half">
                  <div className="adaptiveCardContainer"></div>
                </Flex.Item>
              </Flex>

              <Flex className="footerContainer" vAlign="end" hAlign="end">
                <Flex className="buttonContainer">
                  <Button
                    content={this.localize("Next")}
                    disabled={this.isNextBtnDisabled()}
                    id="saveBtn"
                    onClick={this.onNext}
                    primary
                  />
                </Flex>
              </Flex>
            </Flex>
          </div>
        );
      
    }
  }

  private editDraftMessage = async (draftMessage: IDraftMessage) => {
    try {
      await updateDraftNotification(draftMessage);
    } catch (error) {
      return error;
    }
  };

  private postDraftMessage = async (draftMessage: IDraftMessage) => {
    try {
      await createDraftNotification(draftMessage);
    } catch (error) {
      throw error;
    }
  };

  public escFunction(event: any) {
    if (event.keyCode === 27 || event.key === "Escape") {
      microsoftTeams.tasks.submitTask();
    }
  }

  private onNext = (event: any) => {
    this.setState(
      {
        page: "AudienceSelection",
      },
      () => {
        this.updateCard();
      }
    );
  };
}

const newMessageWithTranslation = withTranslation()(NewMessage);
export default newMessageWithTranslation;
