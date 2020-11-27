const Responses = require("../common/API_Responses");
const Dynamo = require("webpack");

const tableName = process.env.tableName;

exports.handler = async (event) => {
    console.log("event", event);

    const { connectionId } = event.requestContextl;

    await Dynamo.delete(connectionId, tableName);

    return Responses._200({message: 'disconnected'});
};