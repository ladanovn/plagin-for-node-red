const request = require('axios');
var filePlugin = require("./localfilesystem");
var filePluginInstance = filePlugin(config);

module.exports = async function (RED) {
  function DeviceNode(config) {
    RED.nodes.createNode(this, config);

    const node = this;
    const express = {
      host: 'localhost',
      port: 9000
    };
    const brokerConnection = RED.nodes.getNode(config.broker);
    const nodeContext = node.context();
    const topic = `/${config.devicename}/gpio/${config.pin}`;

    if (brokerConnection) {      
      brokerConnection.register(this);
      nodeContext.get('device')

      if (!nodeContext.get('device')) {
        // not in the database
        request.post(`http://${express.host}:${express.port}/api/v1/devices/`,{
          type: config.device_type
        }).then(data => {
          // save copy in database
          nodeContext.set('device', data.data);
          node.status({
            fill: 'green',
            shape: 'ring',
            text: `turn: ${data.payload.turn}`
          });
        }).catch(err => {
          node.status({
            fill: 'red',
            shape: 'ring',
            text: 'err'
          });
        });
      }

      node.on('input', function (msg) {
        msg.payload = JSON.parse(msg.payload);
        console.log(msg.payload.deviceId)
        console.log(nodeContext.get('device')._id)
        if (msg.payload.deviceId == nodeContext.get('device')._id) {
          msg.payload = msg.payload.turn == 'on' ? '1' : '0';
          node.status({
            fill: 'green',
            shape: 'ring',
            text: `turn: ${msg.payload === '1' ? 'on': 'off'}`
          });
          brokerConnection.client.publish(topic, msg.payload);
          node.send(msg);
        }
      });

      node.on('close', done => {
        brokerConnection.deregister(node, done);
      });

    } else {
      node.status({
        fill: 'red',
        shape: 'dot',
        text: 'Could not connect to mqtt'
      });
    }
  }
  RED.nodes.registerType("device", DeviceNode);
}