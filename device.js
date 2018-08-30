const request = require('axios');

module.exports = async function (RED) {
  function DeviceNode(config) {
    RED.nodes.createNode(this, config);

    const node = this;
    const express = {
      host: 'localhost',
      port: 9000
    };
    const brokerConnection = RED.nodes.getNode(config.broker);
    let topic = `/${config.devicename}/gpio/${config.pin}`;

    if (brokerConnection) {
      try {
        brokerConnection.register(this)

        if (config.db_id) {

          request.get(`http://${express.host}:${express.port}/` + 
          `api/v1/devices/${config.db_id}`)
          .then(data => {

            // devices exist
            config.db_type = data.type;
            config.db_payload = data.payload;
            config.db_where = data.payload;
            config.db_img = data.image.originUrl;

            node.status({
              fill: 'green',
              shape: 'ring',
              text: `turn: ${data.payload.turn}`
            });

          }).catch(err => {

            var postData = JSON.stringify({
              'type' : config.db_type,
              'where': config.db_where,
              'image': {
                'originUrl': config.db_img
              }
            });
            
            // create new devices
            request.post(`http://${express.host}:${express.port}/` + 
            `api/v1/devices/`,{
              type: config.db_type,
              where: config.db_where,
              image: {
                origUrl: config.db_img
              },
              payload: {
                turn: 'off'
              }
            }).then(data => {
              
              // created device
              config.db_id = data._id;
              config.db_type = data.type;
              config.db_payload = data.payload;
              config.db_where = data.payload;
              config.db_img = data.image.originUrl;
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
          })
        }
      } catch (err) {
        console.log(err);
        node.status({
          fill: 'red',
          shape: 'ring',
          text: 'err'
        });
      }

      node.on('input', function (msg) {
        msg.payload = JSON.parse(msg.payload);

        if (msg.payload.deviceId == config.db_id) {
          msg.payload = msg.payload.turn == 'on' ? '1' : '0';
          this.status({
            fill: 'green',
            shape: 'ring',
            text: `turn: ${msg.payload === '1' ? 'on': 'off'}`
          });
          node.send(msg);
          brokerConnection.client.publish(topic, msg.payload);
        }
      });

      // Remove Connections
      this.on('close', done => {
        // brokerConnection.unsubscribe(topicTeleLWT, this.id);
        brokerConnection.deregister(this, done);
      });

    } else {
      this.status({
        fill: 'red',
        shape: 'dot',
        text: 'Could not connect to mqtt'
      });
    }
  }
  RED.nodes.registerType("device", DeviceNode);
}