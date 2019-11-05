'use strict';
const assert = require('assert');
const {BotMock, SlackApiMock} = require('botkit-mock');
const {SlackAdapter, SlackMessageTypeMiddleware, SlackEventMiddleware} = require('botbuilder-adapter-slack');
const fileBeingTested = require('../features/slack_features');

async function setTimeoutAsync(timeout = 100) {
    return new Promise((r) => setTimeout(r, timeout));
}

describe('slash commands for slack', () => {
    const initController = () => {
        const adapter = new SlackAdapter({
            clientSigningSecret: "some secret",
            botToken: "some token",
            debug: true,
        });
        adapter.use(new SlackEventMiddleware());
        adapter.use(new SlackMessageTypeMiddleware());
        
        this.controller = new BotMock({
            adapter: adapter,
        });

        SlackApiMock.bindMockApi(this.controller);
        

        fileBeingTested(this.controller);
    };

    beforeEach(() => {
        this.userInfo = {
            slackId: 'user123',
            channel: 'channel123',
        };
        
        // this.response_url = 'https://hooks.slack.com/commands/foo/bar';

        // this.sequence = [
        //     {
        //         type: 'slash_command',
        //         user: this.userInfo.slackId, //user required for each direct message
        //         channel: this.userInfo.channel, // user channel required for direct message
        //         messages: [
        //             {
        //                 text: 'text',
        //                 isAssertion: true,
        //                 command: '',
        //                 response_url: this.response_url
        //             }
        //         ]
        //     }
        // ];

        // const adapter = new SlackAdapter({
        //     clientSigningSecret: "some secret",
        //     botToken: "some token",
        //     debug: true
        // });

        // adapter.use(new SlackEventMiddleware());
        // adapter.use(new SlackMessageTypeMiddleware());

        // this.controller = new BotMock({
        //     adapter: adapter,
        //     disable_webserver: true
        // });

        // SlackApiMock.bindMockApi(this.controller);

        // fileBeingTested(this.controller);

    });
    

    describe('slash_command', () => {
        beforeEach(() => {
            initController();

            this.userInfo = {
                slackId: 'user123',
                channel: 'channel123',
            };
            
            this.response_url = 'https://hooks.slack.com/commands/foo/bar';
    
            this.sequence = [
                {
                    type: 'slash_command',
                    user: this.userInfo.slackId, //user required for each direct message
                    channel: this.userInfo.channel, // user channel required for direct message
                    messages: [
                        {
                            text: 'This is my anonymous question',
                            isAssertion: true,
                            command: '',
                            response_url: this.response_url
                        }
                    ]
                }
            ];
    
            const adapter = new SlackAdapter({
                clientSigningSecret: "some secret",
                botToken: "some token",
                debug: true
            });
    
            adapter.use(new SlackEventMiddleware());
            adapter.use(new SlackMessageTypeMiddleware());
    
            this.controller = new BotMock({
                adapter: adapter,
                disable_webserver: true
            });
    
            SlackApiMock.bindMockApi(this.controller);
    
            fileBeingTested(this.controller);
        });

        it(`should reply "This is a plain reply" on plain`, async () => {
            const text = 'plain';
            const reply = await this.controller.usersInput([
                {
                    type: 'slash_command',
                    user: this.userInfo.slackId, //user required for each direct message
                    channel: this.userInfo.channel, // user channel required for direct message
                    messages: [
                        {
                            text: text,
                            isAssertion: true,
                        }
                    ]
                }
            ]);

            assert.strictEqual(reply.text, `This is a plain reply`);
        });

        it(`should reply "This is a public reply" on public`, async () => {
            const text = 'public';
            const response_url = 'response_url/public';
            await this.controller.usersInput([
                {
                    type: 'slash_command',
                    user: this.userInfo.slackId, //user required for each direct message
                    channel: this.userInfo.channel, // user channel required for direct message
                    messages: [
                        {
                            text: text,
                            isAssertion: true,
                            response_url
                        }
                    ]
                }
            ]);
            const reply = this.controller.apiLogByKey[response_url][0];
            assert.strictEqual(reply.text, `This is a public reply`);
        });

        it(`should reply "This is a private reply" on private`, async () => {
            const text = 'private';
            const response_url = 'response_url/public';
            await this.controller.usersInput([
                {
                    type: 'slash_command',
                    user: this.userInfo.slackId, //user required for each direct message
                    channel: this.userInfo.channel, // user channel required for direct message
                    messages: [
                        {
                            text: text,
                            isAssertion: true,
                            response_url
                        }
                    ]
                }
            ]);

            const reply = this.controller.apiLogByKey[response_url][0];
            assert.strictEqual(reply.text, `This is a private reply`);
        });

        it(`should add httpBody for default response`, async () => {
            await this.controller.usersInput([
                {
                    type: 'slash_command',
                    user: this.userInfo.slackId, //user required for each direct message
                    channel: this.userInfo.channel, // user channel required for direct message
                    messages: [
                        {
                            text: 'default',
                            isAssertion: true,
                        }
                    ]
                }
            ]);

            assert.deepStrictEqual(this.controller.httpBodyLog[0], {text: 'You can send an immediate response using bot.httpBody()'});
        });
    });

    describe('replyPublic()', () => {
        it('should store reply message in bot.api.logByKey[\'replyPublic\']', async () => {
            this.sequence[0].messages[0].command = '/ask';
            await this.controller.usersInput(this.sequence);
            const reply = this.controller.apiLogByKey[this.response_url][0];
            assert.strictEqual(reply.text, 'This is my anonymous question');
            assert.strictEqual(reply.channelData.response_type, 'in_channel', 'should be public message');
        });
    });
});

