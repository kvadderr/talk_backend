import { WebSocketGateway, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer } from '@nestjs/websockets';
import { Logger } from '@nestjs/common'
import { Server, Socket } from 'socket.io'
import { SocketService } from './gateway/gateway.service'
import { TrafficService } from './traffic/traffic.service'
import { CallService } from './call/call.service'
import { UserService } from './user/user.service'
import { OperatorService } from './operator/operator.service'

@WebSocketGateway({cors: true})
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

    constructor(
        private socketService: SocketService,
        private trafficService: TrafficService,
        private callService: CallService,
        private userService: UserService,
        private operatorService: OperatorService
    ){}
    
    @WebSocketServer() public server: Server;
    private logger: Logger = new Logger('AppGateway');

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }

    handleConnection(client: Socket, ...args: any[]) {
        this.logger.log(`Client connected: ${client.id}`);
    }  

    afterInit(server: Server) {
        this.socketService.socket = server;

        let onlineOperatorList = []
        let users = {}
        let timers = {}
        let startBalance = {}
        let startBonus = {}
        let callDuration = {}

        const trafficService = this.trafficService
        const callService = this.callService
        const userService = this.userService
        const operatorService = this.operatorService

        this.socketService.socket.on('connection', (socket) => {

            let startSession = new Date()
            let userID = null
            let balance = null
            let bonus = null
            let channelName = null
            let token = null
            let clientId = null
            let operatorId = null

            let percent = null
            let price = null

            socket.on('join', function (data) {
                socket.join(data.userId)
                users[socket.id] = data.userId
                userID = data.userId
            });

            socket.on('tips', async function(data) {
                await userService.populateBalance(data.operatorId, data.balance)
                await userService.populateBalance(data.clientId, data.balance * (-1))
            })

            socket.on('onlineStatus', async function (userId) {
                onlineOperatorList.push({userId: userId, status: 'Online'});
                this.server.emit('listOnlineUser', onlineOperatorList);
                await operatorService.updateStatus(userId, 'Online')
                console.log(onlineOperatorList);
            })
 
            socket.on('busyStatus', async function (userId) {
                onlineOperatorList.push({userId: userId, status: 'Busy'});
                this.server.emit('listOnlineUser', onlineOperatorList);
                await operatorService.updateStatus(userId, 'Busy')
                console.log(onlineOperatorList);
            })

            socket.on('offlineStatus', async function (userId) {
                let newList = onlineOperatorList.filter((n) => {console.log('n=', n); return n.userId != userId})
                onlineOperatorList = newList;
                this.server.emit('listOnlineUser', onlineOperatorList);
                await operatorService.updateStatus(userId, 'Offline')
                console.log(onlineOperatorList);
            })
          
            socket.on('callRequest', async function (data) {
                const client = await userService.getUserById(data.clientId)
                const operator = await operatorService.getOperatorById(data.operatorId)
                
                console.log('operator', operator)
                channelName = data.clientId + '_channel_' + data.operatorId;
                token = await callService.generateToken(channelName)
                balance = client.balance
                startBalance[data.clientId] = client.balance
                startBonus[data.clientId] = client.bonus
                callDuration[data.clientId] = 0
                bonus = client.bonus
                clientId = data.clientId
                operatorId = data.operatorId
                percent = operator.percent
                price = operator.price
                console.log('percent', percent)

                const callData = {
                    clientId: client.id,
                    clientAvatar: client.avatar,
                    clientFIO: client.nickname,
                    balance: balance,
                    bonus: bonus,
                    token: token,
                    channelName: channelName
                }
                socket.in(data.operatorId).emit('callRequest', callData);
            });

            socket.on('callConfirmation', async function (data) {
                const operator = await operatorService.getOperatorById(data.operatorId)
                percent = operator.percent
                price = operator.price
                clientId = data.clientId
                operatorId = data.operatorId
                channelName = data.channelName
                token = data.token
                balance = data.balance
                bonus = data.bonus
                
                let availableTime = 100

                socket.in(clientId).emit('callConfirmation', { token: token, channelName: channelName});
                
                clearInterval(timers[data.clientId])
                timers[data.clientId] = setInterval(() => {
                    this.server.in(clientId).in(operatorId).emit('timerUpdate', {
                        timer: callDuration[data.clientId],
                        currentBalance: balance,
                        currentBonus: bonus,
                        availableTime: availableTime
                    })
                    availableTime = Math.round((+balance + +bonus)/+price)
                    if (balance > 0 ) balance = balance - price / 60
                    if (balance <= 0 ) { console.log('minus bonus'); bonus = bonus - price / 60 }
                    callDuration[data.clientId]++
                }, 1000)

            });

            socket.on('dropCall', async function (data) {
                this.server.in(data.clientId).in(data.operatorId).emit('callEnding')
                this.server.in(data.operatorId).emit('dropCall')
                clearInterval(timers[clientId])
                const callData = {
                    operatorId: operatorId,
                    clientId: clientId,
                    duration: callDuration[data.clientId],
                    status: 'DROPPED',
                    cost: 0,
                    companyCost: 0,
                }
                const call = await callService.saveCall(callData)
                callDuration[data.clientId] = 0;
            })

            socket.on('callEnding', async function (data) {
                this.server.in(clientId).in(operatorId).emit('callEnding')
                clearInterval(timers[clientId])
                console.log(data)

                let currentBonus = 0;
                if (data.currentBalance <= 0 ) {

                    currentBonus = data.currentBonus
                    if (currentBonus < 0 ) currentBonus = 0
                    console.log('bonus', currentBonus)
                    const minusBonus = Math.floor((startBonus[data.clientId] - currentBonus)*100)/100;
                    await userService.populateBonus(clientId, minusBonus*(-1))
                    data.currentBalance = 0
                }

                const amount = Math.floor((startBalance[data.clientId] - data.currentBalance)*100)/100
                console.log('balance', startBalance[data.clientId])
                console.log('data.currentBalance', data.currentBalance)
                console.log('amount', amount)
                const companyCost = percent * amount / 100
                const cost = Math.floor((amount - companyCost)*100)/100
                

                let status = 'Success'
                if ( callDuration[data.clientId] < 30 ) status = 'Canceled'   

                const callData = {
                    operatorId: operatorId,
                    clientId: clientId,
                    duration: callDuration[data.clientId],
                    status: status,
                    cost: cost,
                    companyCost: companyCost
                }
                console.log(callData)
                callDuration[data.clientId] = 0;
                const call = await callService.saveCall(callData)
                if (cost === NaN) return;
                await userService.populateBalance(operatorId, cost)
                await userService.populateBalance(clientId, amount * (-1))
                
            })

            socket.on('disconnect', async function (data) {
                const atTheMoment = new Date()
                const duration = Math.floor(atTheMoment.valueOf() - startSession.valueOf())/1000
                const traffic = {userId: userID, duration: Math.floor(duration)}
                trafficService.save(traffic)
                const index = onlineOperatorList.indexOf(users[socket.id]);
                if (index > -1) {
                    onlineOperatorList.splice(index, 1);
                }
                await operatorService.updateStatus(userID, 'Offline')
                this.server.emit('listOnlineUser', onlineOperatorList);
            });

        });
    }

}
