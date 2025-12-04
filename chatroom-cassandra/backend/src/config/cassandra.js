const cassandra = require('cassandra-driver');
require('dotenv').config();

const client = new cassandra.Client({
  contactPoints: ['host.docker.internal', 'localhost'],
  localDataCenter: 'datacenter1',
  keyspace: 'chatroom_ks',
  // Configuração de reconexão automática
  policies: {
    reconnection: new cassandra.policies.reconnection.ConstantReconnectionPolicy(2000)
  },
  socketOptions: {
    connectTimeout: 30000,
    readTimeout: 40000
  }
});

// Tentativa de conexão com retry automático
async function connectWithRetry(retries = 10) {
  for (let i = 0; i < retries; i++) {
    try {
      await client.connect();
      console.log('Cassandra conectado com sucesso!');
      return;
    } catch (err) {
      console.log(`Tentativa ${i + 1}/${retries} - Cassandra ainda não está pronto...`);
      if (i === retries - 1) {
        console.error('Falha ao conectar no Cassandra após várias tentativas');
        process.exit(1);
      }
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
}

connectWithRetry();

module.exports = client;
