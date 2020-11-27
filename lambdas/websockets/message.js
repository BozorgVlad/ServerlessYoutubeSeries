const Responses = require("../common/API_Responses");
const Dynamo = require("../common/Dynamo");

const tableName = process.env.tableName;

exports.handler = async (event) => {
    console.log("event", event);

    const { connectionId } = event.requestContext;

    const body = JSON.parse(event.body);

    try {
        const record = await Dynamo.get(connectionId, tableName)
        const { messages } = record;

        messages.push(body.message);

        const data = {
            ...record,
            messages
        };

        await Dynamo.write(data, tableName);
        return Responses._200({message: 'got a message'});
    } catch(error) {
        return Responses._400({message: 'message could not received'})
    }

    return Responses._200({message: 'got a message'});
};