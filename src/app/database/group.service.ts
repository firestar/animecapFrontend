/**
 * Created by Nathaniel on 4/8/2017.
 */
export class GroupService{
    private ws = null;
    public groupid = null;
    public groups = {};
    public messages = null;
    public leader = "";
    public messageKeys = null;
    public playing=false;
    public currentEpisode = null;
    public users={};
    public groupListFunction = function(x){};
    public joinFunction = function(x){};
    public commandFunction = function(x){};
    public episodeCommand = function(x){};
    public playFunction = function(){};
    public pauseFunction = function(){};
    public seekFunction = function(x){};
    public updateFunction = function(){};
    public notificationBar = function(message){};
    public listenersSet = false;
    setWS(ws){
        this.ws = ws;
        this.ws.client().debug = null
    }
    sendChatMessage(session, message){
        this.ws.client().send('/call/group/chat', {}, JSON.stringify({ message: message, session: session, group: this.groupid }));
    }
    join(session, name){
        this.ws.client().send('/call/group/register', {}, JSON.stringify({ session: session, group: name }));
    }
    load(session, episode){
        this.ws.client().send('/call/group/load', {}, JSON.stringify({ session: session, group: this.groupid, episode: episode }));
    }
    renew(session){
        this.ws.client().send('/call/group/renew', {}, JSON.stringify({ session: session, group: this.groupid }));
    }
    listing(session){
        this.ws.client().send('/call/group/listing', {}, JSON.stringify({ session: session, group: "" }));
    }
    update(session, position){
        this.ws.client().send('/call/group/update', {}, JSON.stringify({ session: session, group: this.groupid, position: position }));
    }
    play(session){
        this.ws.client().send('/call/group/play', {}, JSON.stringify({ session: session, group: this.groupid }));
    }
    pause(session){
        this.ws.client().send('/call/group/pause', {}, JSON.stringify({ session: session, group: this.groupid }));
    }
    listen(session){
        let self = this;
        if(!self.listenersSet && session!=null){
            self.listenersSet=true;
            self.ws.subscribe('/listen/group/listing', "", function(data){
                self.groups = JSON.parse(data.body);
                self.groupListFunction(self.groups);
            });
            self.ws.subscribe('/listen/group/joined/', session, function(data){
                var data = JSON.parse(data.body);
                self.groupid = data.group;
                self.messages = data.messages;
                self.currentEpisode = data.episode;
                self.messageKeys = Object.keys(self.messages);
                for(var i=0;i<data.users.length;i++) {
                    self.users[data.users[i][1]] = [data.users[i][0], data.users[i][2]];
                }
                self.leader = data.leader[1];
                self.joinFunction(data);
                self.notificationBar("Welcome to AnimeCap Groups!");
            });
            self.ws.subscribe('/listen/group/update/', session, function(data) {
                self.updateFunction();
            });
            self.ws.subscribe('/listen/group/command/', session, function(data){
                var data = JSON.parse(data.body);
                if(data[0]=="message"){
                    if(!self.messages[data[1]]){
                        self.messages[data[1]] = new Array();
                    }
                    self.messages[data[1]].push([data[2], data[3]]);
                    self.messageKeys = Object.keys(self.messages);
                }else if(data[0]=="joined"){
                    self.users[data[2]] = [data[1], data[3]];
                    self.notificationBar(data[2]+" has joined!");
                }else if(data[0]=="left"){
                    delete self.users[data[2]];
                    self.notificationBar(data[2]+" has left!");
                }else if(data[0]=="leader"){
                    self.leader = data[2];
                    self.notificationBar(self.leader+" is the new leader!");
                }else if(data[0]=="load"){
                    self.currentEpisode = data[1];
                    self.episodeCommand(data[1]);
                    self.notificationBar("New video has been loaded!");
                }else if(data[0]=="play"){
                    self.playFunction();
                }else if(data[0]=="pause"){
                    self.pauseFunction();
                }else if(data[0]=="seek"){
                    if(data[1]==self.groupid) {
                        self.seekFunction(data[2]);
                    }
                    self.notificationBar("You are behind the leader, moving you up!");
                }
                self.commandFunction(data);
            });
            self.ws.subscribe('/listen/group/left/', session, function(data){
                self.notificationBar("you have left the group!");
                self.groupid = null;
            });
            self.ws.subscribe('/listen/group/renew/', session, function(data) {
                if (data.body == self.groupid) {
                    self.renew(session);
                }
            });
        }
    }
}