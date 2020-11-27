const Responses = require('../common/API_Responses');
const Dynamo = require('../common/Dynamo');
const WebSocket = require('../common/websocketMessage');

const tableName = process.env.tableName;

exports.handler = async event => {
    console.log('event', event);

    const { connectionId: connectionID } = event.requestContext;

    const body = JSON.parse(event.body);

    try {
        const record = await Dynamo.get(connectionID, tableName);
        const { errors, domainName, stage } = record;

        errors.push(body.error);

        const data = {
            ...record,
            errors,
        };

        await Dynamo.write(data, tableName);

        await WebSocket.send({
            domainName,
            stage,
            connectionID,
            message: "error",
        });
        console.log('sent message');

        return Responses._200({ message: 'error' });
    } catch (error) {
        return Responses._400({ message: 'message could not be received' });
    }

    return Responses._200({ message: 'got a message' });
};