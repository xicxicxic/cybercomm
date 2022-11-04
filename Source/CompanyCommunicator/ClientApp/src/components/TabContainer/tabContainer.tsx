// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as React from 'react';
import { withTranslation, WithTranslation } from "react-i18next";
import Messages from '../Messages/messages';
import DraftMessages from '../DraftMessages/draftMessages';
import './tabContainer.scss';
import * as microsoftTeams from "@microsoft/teams-js";
import { getBaseUrl } from '../../configVariables';
import { Accordion, Button, Flex, FlexItem, Tooltip, Image, Text } from '@fluentui/react-northstar';
import { getDraftMessagesList } from '../../actions';
import { connect } from 'react-redux';
import { TFunction } from "i18next";
import ImageLogo from './color.png';

interface ITaskInfo {
    title?: string;
    height?: number;
    width?: number;
    url?: string;
    card?: string;
    fallbackUrl?: string;
    completionBotId?: string;
}

export interface ITaskInfoProps extends WithTranslation {
    getDraftMessagesList?: any;
}

export interface ITabContainerState {
    url: string;
    settings: string;
    searchTerms: string,
}


class TabContainer extends React.Component<ITaskInfoProps, ITabContainerState> {
    readonly localize: TFunction;
    constructor(props: ITaskInfoProps) {
        super(props);
        this.localize = this.props.t;
        this.state = {
            url: getBaseUrl() + "/newmessage?locale={locale}",
            settings: getBaseUrl() + "/settings?locale={locale}",
            searchTerms: "",
        }
        this.escFunction = this.escFunction.bind(this);
    }

    public componentDidMount() {
        microsoftTeams.initialize();
        //- Handle the Esc key
        document.addEventListener("keydown", this.escFunction, false);
    }

    public componentWillUnmount() {
        document.removeEventListener("keydown", this.escFunction, false);
    }

    public escFunction(event: any) {
        if (event.keyCode === 27 || (event.key === "Escape")) {
            microsoftTeams.tasks.submitTask();
        }
    }

    public handleSearchChange(event: any) {
        this.setState({ searchTerms: event.target.value });
        debugger;
    }

    public render(): JSX.Element {
        const panels = [
            {
                title: this.localize('DraftMessagesSectionTitle'),
                content: {
                    key: 'sent',
                    content: (
                        <DraftMessages></DraftMessages>
                    ),
                },
            },
            {
                title: this.localize('SentMessagesSectionTitle'),
                content: {
                    key: 'draft',
                    content: (
                        <Messages></Messages>
                    ),
                },
            }
        ]
        const buttonId = 'callout-button';
        const customHeaderImagePath = process.env.REACT_APP_HEADERIMAGE;
        const customHeaderText = process.env.REACT_APP_HEADERTEXT == null ?
            this.localize("CompanyCommunicator")
            : this.localize(process.env.REACT_APP_HEADERTEXT);


        return (
            <Flex className="tabContainer" column fill gap="gap.small">
                <Flex>
                    <Image className='imgLogo' src={ImageLogo}></Image>
                    <Text weight="bold" className='textLogo' content="CyberComm by Devscope"></Text>
                </Flex>
                <Flex hAlign='end' vAlign='end'><Button className="newPostBtn" content={this.localize("NewMessage")} onClick={this.onNewMessage} primary />
                    <Button className="newPostBtn" content={this.localize("Settings")} onClick={this.onSettings} primary />
                </Flex>
                <Flex className="messageContainer">
                    <Flex.Item grow={1} >
                        <Accordion defaultActiveIndex={[0, 1]} panels={panels} />
                    </Flex.Item>
                </Flex>
            </Flex>
        );
    }

    public onNewMessage = () => {
        let taskInfo: ITaskInfo = {
            url: this.state.url,
            title: this.localize("NewMessage"),
            height: 530,
            width: 1000,
            fallbackUrl: this.state.url,
        }

        let submitHandler = (err: any, result: any) => {
            this.props.getDraftMessagesList();
        };

        microsoftTeams.tasks.startTask(taskInfo, submitHandler);
    }


    public onSettings = () => {
        let taskInfo: ITaskInfo = {
            url: this.state.settings,
            title: this.localize("Settings"),
            height: 530,
            width: 600,
            fallbackUrl: this.state.settings,
        }

        let submitHandler = (err: any, result: any) => {
            this.props.getDraftMessagesList();
        };

        microsoftTeams.tasks.startTask(taskInfo, submitHandler);
    }
}

const mapStateToProps = (state: any) => {
    return { messages: state.draftMessagesList };
}

const tabContainerWithTranslation = withTranslation()(TabContainer);
export default connect(mapStateToProps, { getDraftMessagesList })(tabContainerWithTranslation);